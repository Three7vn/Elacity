#!/bin/bash

# Elacity Auto-Startup Test Script
# This simulates a system restart and tests all functionality

echo "🧪 Elacity Auto-Startup Test Suite"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing $description... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" -eq "$expected_status" ]; then
        print_result 0 "$description (HTTP $response)"
    else
        print_result 1 "$description (Expected HTTP $expected_status, got $response)"
    fi
}

echo ""
echo "🔄 Step 1: Simulating system restart..."
echo "----------------------------------------"

# Stop the current service
echo "Stopping current service..."
./manage_server.sh stop > /dev/null 2>&1
sleep 3

# Force kill any remaining processes
pkill -f "python3 ai/server.py" > /dev/null 2>&1
sleep 2

# Verify it's stopped
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    print_result 1 "Service should be stopped but is still running"
else
    print_result 0 "Service successfully stopped"
fi

echo ""
echo "🚀 Step 2: Simulating auto-startup..."
echo "-------------------------------------"

# Start the service (simulating system startup)
echo "Starting service (simulating boot)..."
./manage_server.sh start > /dev/null 2>&1
sleep 5

# Check if service is loaded in launchctl
if launchctl list | grep -q "com.elacity.server"; then
    print_result 0 "Launch Agent loaded in launchctl"
else
    print_result 1 "Launch Agent not loaded in launchctl"
fi

echo ""
echo "🔍 Step 3: Testing server endpoints..."
echo "--------------------------------------"

# Test health endpoint
test_endpoint "http://localhost:8000/api/health" 200 "Health check endpoint"

# Test CORS preflight
echo -n "Testing CORS preflight... "
cors_response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS -H "Origin: chrome-extension://test" http://localhost:8000/api/analyze)
if [ "$cors_response" -eq 200 ]; then
    print_result 0 "CORS preflight (HTTP $cors_response)"
else
    print_result 1 "CORS preflight (Expected HTTP 200, got $cors_response)"
fi

# Test mock analysis endpoint (POST method)
echo -n "Testing mock analysis endpoint... "
mock_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8000/api/test)
if [ "$mock_response" -eq 200 ]; then
    print_result 0 "Mock analysis endpoint (HTTP $mock_response)"
else
    print_result 1 "Mock analysis endpoint (Expected HTTP 200, got $mock_response)"
fi

echo ""
echo "📊 Step 4: Testing real analysis (if possible)..."
echo "-------------------------------------------------"

# Test real analysis with a sample arXiv paper
echo -n "Testing real paper analysis... "
analysis_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"url": "https://arxiv.org/abs/1706.03762", "type": "quick"}' \
    http://localhost:8000/api/analyze \
    -w "%{http_code}" -o /tmp/analysis_response.json)

if [ "${analysis_response: -3}" -eq 200 ]; then
    # Check if response contains expected fields (quick analysis has different structure)
    if grep -q '"title"' /tmp/analysis_response.json && (grep -q '"scores"' /tmp/analysis_response.json || grep -q '"quick_summary"' /tmp/analysis_response.json); then
        print_result 0 "Real paper analysis (valid JSON response)"
    else
        print_result 1 "Real paper analysis (invalid response format)"
        echo "Response content: $(cat /tmp/analysis_response.json | head -c 200)"
    fi
else
    print_result 1 "Real paper analysis (HTTP ${analysis_response: -3})"
fi

echo ""
echo "🔧 Step 5: Testing management script..."
echo "--------------------------------------"

# Test status command
echo -n "Testing status command... "
if ./manage_server.sh status | grep -q "Server is responding"; then
    print_result 0 "Status command shows server responding"
else
    print_result 1 "Status command doesn't show server responding"
fi

# Test logs exist
echo -n "Testing log files... "
if [ -f "logs/server.log" ]; then
    print_result 0 "Server log file exists"
else
    print_result 1 "Server log file missing"
fi

echo ""
echo "🧬 Step 6: Testing persistence simulation..."
echo "-------------------------------------------"

# Simulate a crash and recovery
echo "Simulating server crash..."
pkill -f "python3 ai/server.py" > /dev/null 2>&1
sleep 3

# Check if it auto-restarts (LaunchAgent should restart it)
echo -n "Checking auto-restart after crash... "
sleep 7  # Give it time to restart
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    print_result 0 "Server auto-restarted after crash"
else
    print_result 1 "Server did not auto-restart after crash"
fi

echo ""
echo "📱 Step 7: Testing browser extension compatibility..."
echo "----------------------------------------------------"

# Test with browser extension headers
echo -n "Testing with extension headers... "
ext_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Origin: chrome-extension://test" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    -d '{"url": "https://arxiv.org/abs/1706.03762", "type": "quick"}' \
    http://localhost:8000/api/analyze \
    -w "%{http_code}" -o /dev/null)

if [ "$ext_response" -eq 200 ]; then
    print_result 0 "Browser extension compatibility (HTTP $ext_response)"
else
    print_result 1 "Browser extension compatibility (HTTP $ext_response)"
fi

echo ""
echo "🎯 Step 8: Performance test..."
echo "------------------------------"

# Test response time
echo -n "Testing response time... "
start_time=$(date +%s.%N)
curl -s http://localhost:8000/api/health > /dev/null
end_time=$(date +%s.%N)
response_time=$(echo "$end_time - $start_time" | bc)
response_time_ms=$(echo "$response_time * 1000" | bc)

if (( $(echo "$response_time < 1.0" | bc -l) )); then
    print_result 0 "Response time under 1 second (${response_time_ms%.*}ms)"
else
    print_result 1 "Response time over 1 second (${response_time_ms%.*}ms)"
fi

echo ""
echo "📋 Test Summary"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}ALL TESTS PASSED!${NC}"
    echo "✅ Auto-startup is working correctly"
    echo "✅ Server is fully functional"
    echo "✅ Browser extension compatibility confirmed"
    echo "✅ Auto-restart after crash works"
    exit 0
else
    echo -e "\n⚠️  ${YELLOW}Some tests failed${NC}"
    echo "Check the output above for details"
    exit 1
fi 
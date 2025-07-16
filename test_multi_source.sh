#!/bin/bash

# Multi-Source Paper Analysis Test
echo "🧪 Testing Multi-Source Paper Analysis"
echo "======================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Function to test paper analysis
test_paper_analysis() {
    local url=$1
    local source_name=$2
    local expected_content=$3
    
    echo -e "\n${BLUE}Testing $source_name...${NC}"
    echo "URL: $url"
    
    # Test the analysis
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"url\": \"$url\", \"type\": \"quick\"}" \
        http://localhost:8000/api/analyze)
    
    # Check if we got a valid response
    if echo "$response" | grep -q '"title"'; then
        print_result 0 "$source_name analysis returned valid JSON"
        
        # Extract and show title
        title=$(echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('title', 'No title'))")
        echo "  Title: $title"
        
        # Check if expected content is present (if provided)
        if [ -n "$expected_content" ]; then
            if echo "$response" | grep -qi "$expected_content"; then
                print_result 0 "$source_name contains expected content"
            else
                print_result 1 "$source_name missing expected content: $expected_content"
            fi
        fi
        
    else
        print_result 1 "$source_name analysis failed"
        echo "  Response: $response"
    fi
}

# Check server status first
echo -e "${BLUE}Checking server status...${NC}"
if curl -s http://localhost:8000/api/health | grep -q "healthy"; then
    print_result 0 "Server is healthy and running"
else
    print_result 1 "Server is not responding"
    echo "Please start the server with: ./manage_server.sh start"
    exit 1
fi

# Test 1: arXiv paper (existing functionality)
test_paper_analysis "https://arxiv.org/abs/1706.03762" "arXiv Paper" "attention"

# Test 2: PhilPapers (example URL - you may need to adjust)
test_paper_analysis "https://philpapers.org/archive/EXAMPLE" "PhilPapers" ""

# Test 3: Harvard Math (example URL - you may need to adjust)
test_paper_analysis "https://people.math.harvard.edu/~example" "Harvard Math" ""

# Test 4: Personal Essays (your site)
test_paper_analysis "https://www.abrahamdada.com/essays/example" "Personal Essays" ""

# Test 5: Generic web page fallback
test_paper_analysis "https://example.com/paper" "Generic Web Page" ""

echo -e "\n${BLUE}Testing Paper ID Extraction...${NC}"

# Test paper ID extraction function directly
python3 -c "
import sys
sys.path.append('ai')
from prompt import extract_paper_id

test_urls = [
    'https://arxiv.org/abs/1706.03762',
    'https://philpapers.org/archive/EXAMPLE123',
    'https://people.math.harvard.edu/~johndoe/paper.pdf',
    'https://www.abrahamdada.com/essays/my-essay',
    'https://unknown-site.com/paper'
]

for url in test_urls:
    paper_id = extract_paper_id(url)
    print(f'URL: {url}')
    print(f'Paper ID: {paper_id or \"None\"}')
    print()
"

echo -e "\n${BLUE}📋 Test Summary${NC}"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}ALL TESTS PASSED!${NC}"
    echo "✅ Multi-source paper analysis is working"
    echo "✅ All paper sources are supported"
else
    echo -e "\n⚠️  ${YELLOW}Some tests failed${NC}"
    echo "Note: Some failures may be expected for test URLs that don't exist"
fi

echo -e "\n${BLUE}📚 Supported Sources:${NC}"
echo "• arXiv.org (PDF extraction)"
echo "• PhilPapers.org (HTML parsing)"
echo "• Harvard Math Department (HTML + PDF fallback)"
echo "• abrahamdada.com/essays (Personal blog)"
echo "• Generic web pages (Fallback HTML parsing)"

echo -e "\n${BLUE}🔧 Usage Examples:${NC}"
echo "curl -X POST http://localhost:8000/api/analyze \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"url\": \"https://arxiv.org/abs/1706.03762\", \"type\": \"full\"}'"
echo ""
echo "curl -X POST http://localhost:8000/api/analyze \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"url\": \"https://philpapers.org/archive/EXAMPLE\", \"type\": \"quick\"}'" 
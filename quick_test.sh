#!/bin/bash

# Quick Elacity Server Test
echo "🚀 Quick Elacity Server Test"
echo "============================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test health endpoint
echo -n "Testing health endpoint... "
if curl -s http://localhost:8000/api/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test mock endpoint
echo -n "Testing mock analysis... "
if curl -s -X POST http://localhost:8000/api/test | grep -q "Test Paper Analysis"; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test real analysis with quick mode
echo -n "Testing real analysis (quick)... "
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"url": "https://arxiv.org/abs/1706.03762", "type": "quick"}' \
    http://localhost:8000/api/analyze)

if echo "$response" | grep -q '"title"'; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "Sample response:"
    echo "$response" | python3 -m json.tool | head -10
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Response: $response"
fi

echo ""
echo "Server status:"
./manage_server.sh status 
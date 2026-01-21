#!/bin/bash

echo "Testing chat endpoint..."
echo ""
echo "1. Checking ingestion status..."
curl -s http://localhost:3000/api/ingest | jq '.' || echo "Not JSON response"

echo ""
echo ""
echo "2. Sending a test chat message..."
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"id": "1", "role": "user", "content": "What are Simons skills?", "createdAt": "2024-01-01T00:00:00.000Z"}
    ]
  }'

echo ""
echo ""
echo "Test complete!"

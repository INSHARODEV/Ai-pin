#!/bin/bash
# Manual test for upselling detection
# This tests the endpoint structure

echo "🧪 Testing Main Upload-Audio Endpoint"
echo "======================================"

# Step 1: Initialize session
echo "1️⃣ Creating recording session..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/upload-audio?pageId=test123")
echo "Response: $RESPONSE"

# Extract recordId (you'll need to manually get this from the response)
echo ""
echo "📝 Copy the recordId from above response"
echo "Then visit your recording interface at:"
echo "http://localhost:3000/recoder/test123"
echo ""
echo "🎤 Record these test phrases (5-minute chunks, 24-hour max):"
echo "✅ 'Hello, I need a phone case. Would you like a screen protector? Yes please!'"
echo "⚠️ 'I want a drink. Would you like chips? No thanks.'"  
echo "❌ 'I need a charger. Here you go. Thank you.'"
echo ""
echo "ℹ️  New Settings: 5-minute chunks, 24-hour automatic stop"
echo "👀 Watch the console logs for upselling detection results!" 
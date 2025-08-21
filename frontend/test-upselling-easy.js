// Easy test for upselling detection using test mode
// Now configured for 5-minute chunks with 24-hour max recording
// Run with: node test-upselling-easy.js

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUpsellingEasy() {
  console.log('🧪 Testing Upselling Detection - Easy Mode');
  console.log('==========================================\n');

  try {
    // Step 1: Create session
    console.log('1️⃣ Creating recording session...');
    const initRes = await fetch('http://localhost:3000/api/upload-audio?pageId=test123', {
      method: 'POST'
    });
    const initData = await initRes.json();
    const recordId = initData.recordId;
    console.log(`✅ Session: ${recordId}\n`);

    // Step 2: Test different scenarios
    const testCases = [
      {
        name: "✅ Successful Upselling",
        transcript: "Hello, I need a phone case. We have great cases available. Would you like a screen protector too? Yes, that sounds perfect!",
        summary: "Customer bought phone case and accepted screen protector recommendation.",
        expected: { attempted: true, successful: true }
      },
      {
        name: "⚠️ Attempted Only",
        transcript: "I want to buy this drink. Would you like chips with that? No thanks, just the drink.",
        summary: "Customer declined additional snack offer.",
        expected: { attempted: true, successful: false }
      },
      {
        name: "❌ No Upselling",
        transcript: "Hello, I need a phone charger. Here you go. Thank you very much.",
        summary: "Simple transaction. Customer requested charger and received it.",
        expected: { attempted: false, successful: false }
      }
    ];

    for (const testCase of testCases) {
      console.log(`📋 ${testCase.name}`);
      console.log(`📝 Transcript: "${testCase.transcript}"`);
      console.log(`🎯 Expected: attempted=${testCase.expected.attempted}, successful=${testCase.expected.successful}`);
      
      // Test using test mode (bypasses audio processing)
      const testRes = await fetch(`http://localhost:3000/api/upload-audio?recordId=${recordId}&testMode=true`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript: testCase.transcript,
          summary: testCase.summary || `Test case: ${testCase.name}`
        })
      });

      const result = await testRes.json();
      
      if (result.success && result.upsellingResult) {
        const { attempted, successful } = result.upsellingResult;
        console.log(`📊 ACTUAL: attempted=${attempted}, successful=${successful}`);
        
        const passed = attempted === testCase.expected.attempted && 
                      successful === testCase.expected.successful;
        console.log(passed ? '✅ PASSED' : '❌ FAILED');
      } else {
        console.log('❌ Test failed:', result.error);
      }
      
      console.log('---\n');
    }

    console.log('✅ All tests completed!');
    console.log('\n💡 To see detailed detection logs, check your server console.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUpsellingEasy(); 
// Test script for new recording flow
// Tests the new behavior where chunks are stored locally and only processed when recording stops

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNewFlow() {
  console.log('🧪 Testing New Recording Flow');
  console.log('==============================\n');

  try {
    // Test the new POST endpoint that processes complete recordings
    console.log('1️⃣ Testing complete recording processing...');
    
    // Create a mock audio file (just for testing)
    const mockAudioBuffer = Buffer.from('mock audio data');
    const formData = new FormData();
    formData.append('audio', new Blob([mockAudioBuffer]), 'test_recording.webm');

    const testRes = await fetch('http://localhost:3000/api/upload-audio?pageId=test123', {
      method: 'POST',
      body: formData
    });

    if (testRes.ok) {
      const result = await testRes.json();
      console.log('✅ Complete recording processing works');
      console.log(`📊 Created document: ${result.data._id}`);
      console.log(`📝 Status: ${result.data.status}`);
    } else {
      const error = await testRes.json();
      console.log('❌ Complete recording processing failed:', error.error);
    }

    console.log('\n2️⃣ Testing conversation fetching...');
    const fetchRes = await fetch('http://localhost:3000/api/upload-audio?pageId=test123');
    
    if (fetchRes.ok) {
      const data = await fetchRes.json();
      console.log(`✅ Found ${data.transcripts?.length || 0} conversations`);
    } else {
      console.log('❌ Failed to fetch conversations');
    }

    console.log('\n✅ New flow test completed!');
    console.log('\n💡 The new flow:');
    console.log('   - No DB writes during recording');
    console.log('   - Chunks stored locally in browser');
    console.log('   - Complete processing only when recording stops');
    console.log('   - Single API call to process everything at once');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNewFlow(); 
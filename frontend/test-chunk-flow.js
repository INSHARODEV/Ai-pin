// Test script for new chunk-based recording flow
// Tests the new behavior where each 5-minute chunk creates a new document

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testChunkFlow() {
  console.log('🧪 Testing Chunk-Based Recording Flow');
  console.log('=====================================\n');

  try {
    // Test creating multiple chunks (simulating 5-minute intervals)
    const pageId = 'test123';
    
    for (let chunkNum = 1; chunkNum <= 3; chunkNum++) {
      console.log(`📦 Testing chunk ${chunkNum}...`);
      
      // Create a mock audio file for this chunk
      const mockAudioBuffer = Buffer.from(`mock audio data for chunk ${chunkNum}`);
      const formData = new FormData();
      formData.append('audio', new Blob([mockAudioBuffer]), `chunk_${chunkNum}.webm`);

      const testRes = await fetch(`http://localhost:3000/api/upload-audio?pageId=${pageId}`, {
        method: 'POST',
        body: formData
      });

      if (testRes.ok) {
        const result = await testRes.json();
        console.log(`✅ Chunk ${chunkNum} processed successfully`);
        console.log(`📊 Created document: ${result.data._id}`);
        console.log(`📝 Status: ${result.data.status}`);
        console.log(`🎵 Audio URL: ${result.data.audio_url}`);
        console.log('---');
      } else {
        const error = await testRes.json();
        console.log(`❌ Chunk ${chunkNum} failed:`, error.error);
      }
      
      // Wait a bit between chunks
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n📋 Testing conversation fetching...');
    const fetchRes = await fetch(`http://localhost:3000/api/upload-audio?pageId=${pageId}`);
    
    if (fetchRes.ok) {
      const data = await fetchRes.json();
      console.log(`✅ Found ${data.transcripts?.length || 0} conversations`);
      
      if (data.transcripts && data.transcripts.length > 0) {
        console.log('\n📊 Conversation details:');
        data.transcripts.forEach((conv, index) => {
          console.log(`  ${index + 1}. ID: ${conv._id}`);
          console.log(`     Created: ${new Date(conv.createdAt).toLocaleString()}`);
          console.log(`     Status: ${conv.status}`);
          console.log(`     Turns: ${conv.turns?.length || 0}`);
        });
      }
    } else {
      console.log('❌ Failed to fetch conversations');
    }

    console.log('\n✅ Chunk-based flow test completed!');
    console.log('\n💡 The new flow:');
    console.log('   - Each 5-minute chunk creates a NEW document');
    console.log('   - No local storage - everything goes to DB immediately');
    console.log('   - Each chunk is processed independently');
    console.log('   - Multiple conversations per recording session');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testChunkFlow(); 
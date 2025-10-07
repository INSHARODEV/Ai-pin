from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from faster_whisper import WhisperModel
import numpy as np
import uvicorn
import base64
import os
import logging
from collections import deque
import time
import asyncio

logging.basicConfig(level=logging.INFO)
os.environ["HF_HUB_DISABLE_SYMLINKS"] = "1"

app = FastAPI()

# Use base or small model for real-time (much faster than large)
# Change to "base" for better speed/accuracy balance
model = WhisperModel("small", device="cpu", compute_type="int8"  )

def calculate_rms(audio_chunk):
    """Calculate Root Mean Square (volume level)"""
    return np.sqrt(np.mean(audio_chunk**2))

def has_speech(audio_chunk, threshold=0.01):
    """Simple Voice Activity Detection"""
    rms = calculate_rms(audio_chunk)
    return rms > threshold

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("✅ Client connected")
    
    # Use a deque for efficient buffer management
    audio_buffer = deque(maxlen=48000 * 10)  # Max 10 seconds buffer
    chunk_counter = 0
    last_transcription_time = time.time()
    
    # Accumulate 3 seconds before transcribing (better context)
    MIN_AUDIO_LENGTH = 16000 * 3  # 3 seconds at 16kHz
    TRANSCRIPTION_INTERVAL = 2.0  # Minimum 2 seconds between transcriptions
    
    try:
        while True:
            try:
                # Add timeout to prevent hanging
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
            except asyncio.TimeoutError:
                print("⏱️ Timeout waiting for data, closing connection")
                break
            
            try:
                audio_bytes = base64.b64decode(data)
            except Exception as e:
                print(f"❌ Base64 decode error: {e}")
                continue
            
            # Convert back to float32 PCM
            try:
                chunk = np.frombuffer(audio_bytes, dtype=np.float32)
            except Exception as e:
                print(f"❌ Audio buffer conversion error: {e}")
                continue
            
            if len(chunk) == 0:
                continue
            
            chunk_counter += 1
            
            # Add to buffer
            audio_buffer.extend(chunk)
            
            # Only transcribe if:
            # 1. We have enough audio
            # 2. Enough time has passed since last transcription
            # 3. Audio contains speech
            current_time = time.time()
            time_since_last = current_time - last_transcription_time
            
            if len(audio_buffer) >= MIN_AUDIO_LENGTH and time_since_last >= TRANSCRIPTION_INTERVAL:
                # Convert buffer to numpy array
                audio_array = np.array(list(audio_buffer), dtype=np.float32)
                
                # Check for speech activity
                if has_speech(audio_array):
                    print(f"🎤 Transcribing {len(audio_array)} samples ({len(audio_array)/16000:.1f}s)")
                    
                    try:
                        # Transcribe with optimized parameters
                        segments, info = model.transcribe(
                            audio_array,
                            beam_size=3,  # Reduced for speed
                            language="ar",  # Specify language for speed boost
                            condition_on_previous_text=True,  # Better context
                            vad_filter=True,  # Built-in VAD
                            vad_parameters=dict(
                                threshold=0.5,
                                min_speech_duration_ms=250,
                                min_silence_duration_ms=500
                            )
                        )
                        
                        # Collect all segments
                        text_parts = []
                        for seg in segments:
                            text_parts.append(seg.text)
                        
                        full_text = " ".join(text_parts).strip()
                        
                        if full_text:
                            print(f"📝 Transcribed: {full_text}")
                            try:
                                await websocket.send_text(full_text)
                            except Exception as send_error:
                                print(f"❌ Failed to send text: {send_error}")
                                break
                        
                        last_transcription_time = current_time
                        
                        # Keep last 1 second for context continuity
                        keep_samples = 16000 * 1
                        if len(audio_buffer) > keep_samples:
                            # Remove old audio, keep recent for context
                            for _ in range(len(audio_buffer) - keep_samples):
                                audio_buffer.popleft()
                    
                    except Exception as e:
                        print(f"❌ Transcription error: {e}")
                        # Don't break, continue receiving audio
                else:
                    print("🔇 No speech detected, skipping transcription")
                    # Clear buffer of silence
                    audio_buffer.clear()
            
            # Log progress every 50 chunks
            if chunk_counter % 50 == 0:
                print(f"📊 Buffer: {len(audio_buffer)/16000:.1f}s | Chunks received: {chunk_counter}")
    
    except WebSocketDisconnect:
        print("🔌 Client disconnected normally")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        # Try to close gracefully, but catch if already closed
        try:
            if websocket.client_state.name == "CONNECTED":
                await websocket.close()
                print("✅ WebSocket closed gracefully")
        except Exception as close_error:
            print(f"⚠️ WebSocket already closed: {close_error}")

@app.get("/")
async def root():
    return {
        "status": "running",
        "model": "small",
        "device": "cpu",
        "message": "WebSocket endpoint available at /ws"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": True}

if __name__ == "__main__":
    print("🚀 Starting Whisper Transcription Server")
    print("📍 WebSocket endpoint: ws://localhost:9000/ws")
    print("⚡ Using 'small' model for optimal speed/accuracy")
    print("🏥 Health check: http://localhost:9000/health")
    uvicorn.run(app, host="0.0.0.0", port=9000, log_level="info")
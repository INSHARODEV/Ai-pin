// 'use client'
// import { useState, useRef, useEffect } from 'react';
// import { Mic, MicOff, Radio, Circle } from 'lucide-react';
// import { io, Socket } from 'socket.io-client';

// interface TranscriptItem {
//   text: string;
//   confidence?: number;
//   timestamp: number;
// }

// export default function RealtimeTranscription() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [partialText, setPartialText] = useState('');
//   const [finalTranscripts, setFinalTranscripts] = useState<TranscriptItem[]>([]);
//   const [stats, setStats] = useState({
//     audioChunks: 0,
//     partialCount: 0,
//     finalCount: 0
//   });

//   const socketRef = useRef<Socket | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const processorRef = useRef<ScriptProcessorNode | null>(null);
//   const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const isReadyRef = useRef<boolean>(false);

//   const connect = () => {
//     const socket = io('http://localhost:8000', {
//       transports: ['websocket'],
//       timeout: 10000
//     });

//     socket.on('connect', () => {
//       console.log('✅ Connected to server');
//       setIsConnected(true);
//     });

//     socket.on('disconnect', () => {
//       console.log('❌ Disconnected from server');
//       setIsConnected(false);
//       setIsReady(false);
//       isReadyRef.current = false;
//     });

//     socket.on('transcription-ready', (data: any) => {
//       console.log('🎉 transcription-ready event received!');
//       console.log('  Session ID:', data.sessionId);
//       setIsReady(true);
//       isReadyRef.current = true;
//     });

//     socket.on('partial-transcript', (data: any) => {
//       console.log('📝 Partial transcript:', data);
//       setPartialText(data.text || data);
//       setStats(prev => ({ ...prev, partialCount: prev.partialCount + 1 }));
//     });

//     socket.on('final-transcript', (data: any) => {
//       console.log('✅ Final transcript:', data);
//       const text = data.text || data;
//       setFinalTranscripts(prev => [...prev, { text, confidence: data.confidence, timestamp: Date.now() }]);
//       setPartialText('');
//       setStats(prev => ({ ...prev, finalCount: prev.finalCount + 1 }));
//     });

//     socket.on('error', (error: any) => {
//       console.error('❌ Socket error:', error);
//     });

//     socket.on('session-ended', () => {
//       console.log('Session ended');
//       setIsReady(false);
//       isReadyRef.current = false;
//     });

//     socketRef.current = socket;
//   };

//   const startRecording = async () => {
//     try {
//       console.log('🎤 Step 1: Requesting microphone access...');
      
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           sampleRate: 16000,
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         }
//       });

//       console.log('✅ Step 2: Microphone access granted');
//       streamRef.current = stream;

//       console.log('📡 Step 3: Starting transcription on server...');
//       if (socketRef.current) {
//         socketRef.current.emit('start-transcription');
//       }

//       console.log('🔧 Step 4: Creating AudioContext...');
//       const audioContext = new AudioContext({ sampleRate: 16000 });
//       audioContextRef.current = audioContext;
//       console.log('  AudioContext state:', audioContext.state);

//       const source = audioContext.createMediaStreamSource(stream);
//       sourceRef.current = source;

//       const processor = audioContext.createScriptProcessor(4096, 1, 1);
//       processorRef.current = processor;

//       console.log('🔧 Step 5: Setting up audio callback...');
//       let chunkCount = 0;
      
//       processor.onaudioprocess = (event) => {
//         chunkCount++;
        
//         if (chunkCount <= 5) {
//           console.log(`🎵 Callback #${chunkCount} fired - isReady:`, isReadyRef.current);
//         }
        
//         if (!isReadyRef.current || !socketRef.current) {
//           return;
//         }

//         const inputBuffer = event.inputBuffer.getChannelData(0);
//         const int16Buffer = new Int16Array(inputBuffer.length);
        
//         let sum = 0;
//         for (let i = 0; i < inputBuffer.length; i++) {
//           const clamped = Math.max(-1, Math.min(1, inputBuffer[i]));
//           int16Buffer[i] = Math.round(clamped * 32767);
//           sum += Math.abs(clamped);
//         }

//         const avgLevel = sum / inputBuffer.length;
        
//         if (chunkCount <= 5 || chunkCount % 100 === 0) {
//           console.log(`📤 Chunk #${chunkCount} - Avg level: ${avgLevel.toFixed(4)} - Sending to server`);
//         }

//         socketRef.current.emit('audio-data', int16Buffer.buffer);
//         setStats(prev => ({ ...prev, audioChunks: prev.audioChunks + 1 }));
//       };

//       console.log('🔧 Step 6: Connecting audio nodes...');
//       source.connect(processor);
//       processor.connect(audioContext.destination);
//       console.log('✅ Audio chain connected!');

//       setIsRecording(true);
//       console.log('🔴 Recording started - waiting for isReady...');
//     } catch (error) {
//       console.error('❌ Failed to start recording:', error);
//       alert('Microphone access denied or error occurred');
//     }
//   };

//   const stopRecording = () => {
//     console.log('⏹️ Stopping recording...');
    
//     if (socketRef.current) {
//       socketRef.current.emit('stop-transcription');
//     }

//     if (processorRef.current) {
//       processorRef.current.disconnect();
//       processorRef.current = null;
//     }

//     if (sourceRef.current) {
//       sourceRef.current.disconnect();
//       sourceRef.current = null;
//     }

//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }

//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
//       streamRef.current = null;
//     }

//     setIsRecording(false);
//     setIsReady(false);
//     isReadyRef.current = false;
//     console.log('✅ Recording stopped');
//   };

//   useEffect(() => {
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//       stopRecording();
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             Real-Time Transcription
//           </h1>
//           <p className="text-gray-600">Powered by AssemblyAI</p>
//         </div>

//         <div className="flex justify-center mb-6">
//           {!isConnected ? (
//             <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
//               <Circle className="w-3 h-3 fill-gray-400" />
//               Disconnected
//             </span>
//           ) : isRecording && isReady ? (
//             <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
//               <Radio className="w-3 h-3 fill-red-500 animate-pulse" />
//               Recording & Transcribing
//             </span>
//           ) : (
//             <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
//               <Circle className="w-3 h-3 fill-green-500" />
//               Connected
//             </span>
//           )}
//         </div>

//         <div className="flex justify-center gap-4 mb-8">
//           {!isConnected ? (
//             <button
//               onClick={connect}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//             >
//               Connect to Server
//             </button>
//           ) : !isRecording ? (
//             <button
//               onClick={startRecording}
//               className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
//             >
//               <Mic className="w-5 h-5" />
//               Start Recording
//             </button>
//           ) : (
//             <button
//               onClick={stopRecording}
//               className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
//             >
//               <MicOff className="w-5 h-5" />
//               Stop Recording
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-3 gap-4 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-4 text-center">
//             <div className="text-3xl font-bold text-blue-600">{stats.audioChunks}</div>
//             <div className="text-sm text-gray-600 mt-1">Audio Chunks</div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-4 text-center">
//             <div className="text-3xl font-bold text-purple-600">{stats.partialCount}</div>
//             <div className="text-sm text-gray-600 mt-1">Partial Results</div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-4 text-center">
//             <div className="text-3xl font-bold text-green-600">{stats.finalCount}</div>
//             <div className="text-sm text-gray-600 mt-1">Final Results</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Transcription</h3>
          
//           {partialText && (
//             <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
//               <p className="text-gray-600 italic">{partialText}</p>
//             </div>
//           )}

//           <div className="space-y-3">
//             {finalTranscripts.length === 0 && !partialText ? (
//               <p className="text-gray-400 text-center py-8">
//                 {isRecording 
//                   ? 'Speak into your microphone...' 
//                   : 'Start recording to see transcription results'}
//               </p>
//             ) : (
//               finalTranscripts.map((item, index) => (
//                 <div
//                   key={index}
//                   className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
//                 >
//                   <p className="text-gray-800 font-medium">{item.text}</p>
//                   {item.confidence && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       Confidence: {(item.confidence * 100).toFixed(1)}%
//                     </p>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-500">
//           <p>Using AssemblyAI Streaming API for real-time transcription</p>
//           <p className="mt-1">Make sure your WebSocket server is running on localhost:8000</p>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'
import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Wifi, WifiOff, Trash2 } from "lucide-react";
import { io, Socket } from 'socket.io-client';

export default function RealTimeTranscriber() {
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [status, setStatus] = useState("Disconnected");
  
  const socketRef = useRef<Socket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, partialTranscript]);

  const connectSocket = () => {
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io("http://localhost:8000"); // Change port to match your NestJS server
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
      setStatus("Connected");
    });

    socket.on("status", (data: { type: string; message?: string }) => {
      console.log("Status:", data);
      if (data.type === 'connected') {
        setStatus(data.message || 'Ready to transcribe');
      } else if (data.type === 'recognition_started') {
        setStatus('Recognition started - speak now');
      } else if (data.type === 'transcript_complete') {
        setStatus('Transcription complete');
      } else if (data.type === 'disconnected') {
        setStatus('Speechmatics disconnected');
      }
    });

    socket.on("partial_transcription", (text: string) => {
      setPartialTranscript(text);
    });

    socket.on("transcription", (data: { text: string; metadata?: any }) => {
      const newText = data.text.trim();
      if (newText) {
        setTranscript(prev => prev ? `${prev} ${newText}` : newText);
        setPartialTranscript(""); // Clear partial when we get final
      }
    });

    socket.on("warning", (data: { type: string; reason: string }) => {
      console.warn("Warning:", data);
      setStatus(`⚠️ Warning: ${data.reason}`);
    });

    socket.on("error", (data: { type?: string; reason?: string; message?: string }) => {
      console.error("Error:", data);
      setStatus(`❌ Error: ${data.reason || data.message || 'Unknown error'}`);
    });

    socket.on("disconnect", (reason: string) => {
      console.log(`❌ Disconnected from server: ${reason}`);
      setIsConnected(false);
      setIsRecording(false);
      setStatus("Disconnected");
      
      if (isRecording) {
        stopRecording();
      }
    });
  };

  const startRecording = async () => {
    try {
      setStatus("Requesting microphone access...");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Create analyzer for visual feedback
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      // Visual feedback loop
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(Math.min(average * 1.5, 100));
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      // Audio processor
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      source.connect(processor);
      processor.connect(audioCtx.destination);

      let chunksSent = 0;

      processor.onaudioprocess = (e) => {
        if (socketRef.current && socketRef.current.connected) {
          const inputData = e.inputBuffer.getChannelData(0);
          
          // Convert Float32Array to base64
          const buffer = new Float32Array(inputData);
          const bytes = new Uint8Array(buffer.buffer);
          
          // Efficient base64 encoding
          let binary = '';
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64Data = btoa(binary);
          
          socketRef.current.emit('audio_chunk', { chunk: base64Data });
          chunksSent++;
          
          if (chunksSent % 50 === 0) {
            console.log(`Sent ${chunksSent} audio chunks`);
          }
        }
      };

      setIsRecording(true);
      setStatus("Recording - Speak now");
      console.log("🎤 Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      setStatus("Microphone access denied");
      alert("Microphone access denied or not available");
    }
  };

  const stopRecording = () => {
    console.log("⏹️ Stopping recording...");
    setStatus("Stopping...");

    // Stop animation first
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Disconnect audio processing
    if (processorRef.current) {
      processorRef.current.onaudioprocess = null;
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Send end of stream message
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('end_stream');
      console.log("📤 EndOfStream sent");
    }

    setIsRecording(false);
    setAudioLevel(0);
    setPartialTranscript("");
    setStatus("Connected - Ready to record");
    console.log("✅ Recording stopped");
  };

  const clearTranscript = () => {
    setTranscript("");
    setPartialTranscript("");
  };

  const downloadTranscript = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🎤 Real-Time Transcription
          </h1>
          <p className="text-gray-600">Powered by Speechmatics</p>
        </div>

        {/* Connection Status */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <Wifi className="w-4 h-4" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                <WifiOff className="w-4 h-4" />
                Disconnected
              </span>
            )}
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Recording
            </div>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">{status}</p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {!isConnected && (
            <button
              onClick={connectSocket}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Wifi className="w-5 h-5" />
              Reconnect
            </button>
          )}
          
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={!isConnected}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <MicOff className="w-5 h-5" />
              Stop Recording
            </button>
          )}
          
          <button
            onClick={clearTranscript}
            disabled={!transcript}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>

          <button
            onClick={downloadTranscript}
            disabled={!transcript}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Download
          </button>
        </div>

        {/* Audio Level Indicator */}
        {isRecording && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-3 transition-all duration-100 rounded-full"
                style={{ width: `${Math.min(audioLevel, 100)}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Audio Level: {Math.round(audioLevel)}%
            </p>
          </div>
        )}

        {/* Transcription Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 min-h-[350px] max-h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 sticky top-0 bg-white pb-2 border-b border-gray-200">
            Live Transcription
            {transcript && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({transcript.split(' ').filter(w => w.length > 0).length} words)
              </span>
            )}
          </h3>
          
          <div className="prose max-w-none">
            {(transcript || partialTranscript) ? (
              <>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                  {partialTranscript && (
                    <span className="text-gray-400 italic ml-1">{partialTranscript}</span>
                  )}
                </p>
                <div ref={transcriptEndRef} />
              </>
            ) : (
              <p className="text-gray-400 text-center py-12">
                {isRecording 
                  ? "🎙️ Listening... Speak into your microphone" 
                  : "Click 'Start Recording' to begin transcription"}
              </p>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Better Accuracy:</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Speak clearly at a moderate pace</li>
            <li>Minimize background noise for best results</li>
            <li>Keep microphone 6-12 inches from your mouth</li>
            <li>Partial transcripts appear in italics while processing</li>
            <li>Final transcripts replace partials automatically</li>
          </ul>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Using Speechmatics Real-time API via NestJS Gateway</p>
        </div>
      </div>
    </div>
  );
}
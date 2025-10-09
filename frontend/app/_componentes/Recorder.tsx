// // import { useRef, useState } from 'react';
// // import { MakeApiCall, Methods } from '../actions';
// // import { MdSquare } from 'react-icons/md';
// // export interface Params {
// //   setRecording: any;
// // }
// // export const Recorder = ({ setRecording }: Params) => {
// //   const mediaStream = useRef<MediaStream | null>(null);
// //   const mediaRecorder = useRef<MediaRecorder | null>(null);
// //   const chunks = useRef<Blob[]>([]);
// //   const [error, setError] = useState<string | null>(null);
// //   const [onShfit, setOnShfit] = useState(false);
// //   const intervalRef = useRef<NodeJS.Timeout | null>(null);

// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const sendAudioToServer = async () => {
// //     if (chunks.current.length === 0) {
// //       console.log('No audio chunks to send');
// //       return;
// //     }

// //     const shiftId = localStorage.getItem('shiftId');
// //     if (!shiftId) {
// //       console.log('No shiftId found');
// //       return;
// //     }

// //     // Create blob from chunks
// //     const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
// //     console.log('Audio blob size:', audioBlob.size);

// //     // Create FormData to send the audio file
// //     const formData = new FormData();
// //     formData.append('audio-file', audioBlob, `audio_${Date.now()}.webm`);

// //     try {
// //       const res = await MakeApiCall({
// //         url: `/trasncriptions/${shiftId}`,
// //         method: Methods.POST,
// //         body: formData,
// //       });

// //       console.log('Audio sent successfully:', res);

// //       // Clear chunks after successful send
// //       chunks.current = [];
// //     } catch (error) {
// //       console.error('Failed to send audio:', error);
// //     }
// //   };
// //   const startShfit = async () => {
// //     // Prevent double clicks
// //     if (isProcessing) {
// //       console.log('Already processing, ignoring click');
// //       return;
// //     }

// //     console.log('Start/Stop shift clicked, current state:', onShfit);
// //     setIsProcessing(true);

// //     try {
// //       if (!onShfit) {
// //         // Starting shift
// //         setError(null);

// //         // Create shift
// //         console.log('Creating shift...');
// //         const res = await MakeApiCall({
// //           url: '/trasncriptions/shift',
// //           method: Methods.POST,
// //         });

// //         localStorage.setItem('shiftId', res._id);
// //         console.log('Shift created:', res);

// //         // Get microphone permission and stream
// //         const stream = await requestMicrophonePermission();
// //         mediaStream.current = stream;

// //         // Start recording
// //         startRecording(stream);

// //         // Set up interval to send audio every 5 minutes (300000 ms)
// //         intervalRef.current = setInterval(async () => {
// //           console.log('5-minute interval triggered');
// //           if (
// //             mediaRecorder.current &&
// //             mediaRecorder.current.state === 'recording'
// //           ) {
// //             console.log('Stopping current recording for interval send');
// //             mediaRecorder.current.stop();

// //             // Wait a bit for the stop event to process
// //             setTimeout(() => {
// //               // Restart recording if still in shift
// //               if (onShfit && mediaStream.current) {
// //                 console.log('Restarting recording after interval');
// //                 startRecording(mediaStream.current);
// //               }
// //             }, 500);
// //           }
// //         }, 300000);

// //         setOnShfit(true);
// //       } else {
// //         // Ending shift
// //         console.log('Ending shift...');

// //         if (intervalRef.current) {
// //           clearInterval(intervalRef.current);
// //           intervalRef.current = null;
// //           console.log('Interval cleared');
// //         }

// //         if (
// //           mediaRecorder.current &&
// //           mediaRecorder.current.state === 'recording'
// //         ) {
// //           console.log('Stopping final recording');
// //           mediaRecorder.current.stop();
// //         }

// //         if (mediaStream.current) {
// //           mediaStream.current.getTracks().forEach(track => {
// //             track.stop();
// //             console.log('Track stopped:', track.kind);
// //           });
// //           mediaStream.current = null;
// //         }

// //         mediaRecorder.current = null;
// //         setRecording(false);
// //         setOnShfit(false);
// //         setError(null);
// //         console.log('Shift ended');
// //       }
// //     } catch (error: any) {
// //       console.error('Error starting shift:', error);
// //       setError(`Failed to start shift: ${error.message}`);
// //       setOnShfit(false); // Reset state on error
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const requestMicrophonePermission = async () => {
// //     try {
// //       // Check if we're in a secure context (HTTPS or localhost)
   

// //       console.log('Requesting microphone permission...');
// //       const stream = await navigator.mediaDevices.getUserMedia({
// //         audio: {
// //           echoCancellation: true,
// //           noiseSuppression: true,
// //           sampleRate: 44100,
// //         },
// //       });

// //       console.log('Microphone permission granted, stream obtained:', stream);
// //       return stream;
// //     } catch (err: any) {
// //       console.error('Microphone permission error:', err);

// //       if (err.name === 'NotAllowedError') {
// //         setError(
// //           'Microphone permission denied. Please allow microphone access and try again.'
// //         );
// //       } else if (err.name === 'NotFoundError') {
// //         setError(
// //           'No microphone found. Please connect a microphone and try again.'
// //         );
// //       } else if (err.name === 'NotSupportedError') {
// //         setError('Your browser does not support audio recording.');
// //       } else {
// //         setError(`Microphone error: ${err.message}`);
// //       }
// //       throw err;
// //     }
// //   };

// //   const startRecording = (stream: MediaStream) => {
// //     try {
// //       // Check if MediaRecorder is supported
// //       if (!window.MediaRecorder) {
// //         throw new Error('MediaRecorder is not supported in this browser');
// //       }

// //       const recorder = new MediaRecorder(stream, {
// //         mimeType: 'audio/webm;codecs=opus',
// //       });

// //       mediaRecorder.current = recorder;

// //       recorder.ondataavailable = (event: BlobEvent) => {
// //         console.log('Audio data available, size:', event.data.size);
// //         if (event.data && event.data.size > 0) {
// //           chunks.current.push(event.data);
// //         }
// //       };

// //       recorder.onstop = async () => {
// //         console.log('Recording stopped, sending final audio...');
// //         await sendAudioToServer();
// //       };

// //       recorder.onerror = (event: any) => {
// //         console.error('MediaRecorder error:', event.error);
// //         setError(`Recording error: ${event.error}`);
// //       };

// //       recorder.onstart = () => {
// //         console.log('Recording started successfully');
// //         setRecording(true);
// //         setError(null);
// //       };

// //       recorder.start(1000);
// //       console.log('MediaRecorder start called');
// //     } catch (err: any) {
// //       console.error('Error starting recording:', err);
// //       setError(`Failed to start recording: ${err.message}`);
// //     }
// //   };

// //   return (
// //     <>
// //       <button
// //         onClick={startShfit}
// //         disabled={isProcessing}
// //         className={`flex rounded-xl px-1 py-2 justify-center items-center align-baseline gap-2 w-full ${
// //           isProcessing
// //             ? 'bg-gray-400 cursor-not-allowed'
// //             : onShfit
// //               ? 'bg-[#EF4444]'
// //               : 'bg-[#0D70C8]'
// //         }`}
// //       >
// //         {isProcessing ? 'Processing...' : onShfit ? 'End Shift' : 'Start Shift'}
// //         {onShfit ? <MdSquare /> : ''}
// //       </button>
// //       {error && (
// //         <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm'>
// //           {error}
// //         </div>
// //       )}
// //     </>
// //   );
// // };
// import { useRef, useState, useEffect } from 'react';
// import { MakeApiCall, Methods } from '../actions';
// import { MdSquare } from 'react-icons/md';
// import { io, Socket } from 'socket.io-client';

// interface RecorderProps {
//   setRecording: (recording: boolean) => void;
// }

// export const Recorder = ({ setRecording }: RecorderProps) => {
//   const [error, setError] = useState<string | null>(null);
//   const [onShift, setOnShift] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [socketStatus, setSocketStatus] = useState<string>('Disconnected');
//   const [audioChunksSent, setAudioChunksSent] = useState(0);
  
//   const socketRef = useRef<Socket | null>(null);
//   const mediaStream = useRef<MediaStream | null>(null);
//   const audioContext = useRef<AudioContext | null>(null);
//   const processor = useRef<ScriptProcessorNode | null>(null);
//   const source = useRef<MediaStreamAudioSourceNode | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const animationRef = useRef<number | null>(null);
//    const chunks = useRef<Blob[]>([]);
//   const shiftIdRef = useRef<string | null>(null);
//   const empIdRef = useRef<string | null>(null);

//   // Initialize employee ID from localStorage
//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     if (user) {
//       const userData = JSON.parse(user);
//       empIdRef.current = userData._id;
//       console.log('👤 Employee ID loaded:', empIdRef.current);
//     }
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       console.log('🧹 Component unmounting, cleaning up...');
//       cleanupResources();
//     };
//   }, []);

//   const cleanupResources = () => {
//     console.log('🧹 Cleaning up resources...');
    
//     if (animationRef.current !== null) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
    
//     if (processor.current) {
//       processor.current.onaudioprocess = null;
//       processor.current.disconnect();
//       processor.current = null;
//       console.log('✅ Processor disconnected');
//     }
    
//     if (source.current) {
//       source.current.disconnect();
//       source.current = null;
//       console.log('✅ Source disconnected');
//     }
    
//     if (analyserRef.current) {
//       analyserRef.current.disconnect();
//       analyserRef.current = null;
//     }
    
//     if (audioContext.current && audioContext.current.state !== 'closed') {
//       audioContext.current.close();
//       audioContext.current = null;
//       console.log('✅ AudioContext closed');
//     }
    
//     if (mediaStream.current) {
//       mediaStream.current.getTracks().forEach(track => {
//         track.stop();
//         console.log(`✅ Track stopped: ${track.kind}`);
//       });
//       mediaStream.current = null;
//     }
    
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       console.log('✅ Socket disconnected');
//     }
    
//     setAudioChunksSent(0);
//   };

//   const initializeWebSocket = () => {
//     console.log('🔌 Initializing WebSocket connection...');
    
//     const socket = io('http://localhost:8000', {
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socket.on('connect', () => {
//       console.log('✅ WebSocket connected:', socket.id);
//       setSocketStatus('Connected');
      
//       // Start transcription session
//       console.log('📡 Emitting start-transcription...');
//       socket.emit('start-transcription');
//     });

//     socket.on('transcription-ready', (data) => {
//       console.log('🎙️ Transcription ready:', data);
//       setSocketStatus('Ready to transcribe');
//     });

//     socket.on('partial-transcript', (text: string) => {
//       console.log('📝 Partial transcript:', text);
//     });

//     socket.on('final-transcript', async (data: { text: string; confidence: number }) => {
//       console.log('✅ Final transcript:', data);
//       setSocketStatus('Processing transcript...');
      
//       // Send to ChatGPT for analysis
//       if (shiftIdRef.current && empIdRef.current) {
//             const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
//     console.log('Audio blob size:', audioBlob.size);

//     // Create FormData to send the audio file
//     const formData = new FormData();
//     formData.append('audio-file', audioBlob, `audio_${Date.now()}.webm`);
//     formData.append('shiftId',shiftIdRef.current);
//     formData.append('empId',  empIdRef.current);
//     formData.append('transcript', data.text);
  
//         try {
//           console.log('📊 Sending transcript for analysis...',shiftIdRef.current);
//           const response = await MakeApiCall({
//             url: '/transcriptions/analyze',
//             method: Methods.POST,

//             body: formData,
 
//           });
//           console.log('✅ Analysis complete:', response);
//           setSocketStatus('Transcript analyzed');
//         } catch (err) {
//           console.error('❌ Failed to analyze transcript:', err);
//           setSocketStatus('Analysis failed');
//         }
//       }
//     });

//     socket.on('error', (err) => {
//       console.error('❌ WebSocket error:', err);
//       setSocketStatus('Error occurred');
//       setError('Connection error occurred');
//     });

//     socket.on('session-ended', () => {
//       console.log('🔒 Session ended');
//       setSocketStatus('Session ended');
//     });

//     socket.on('disconnect', (reason) => {
//       console.log(`❌ WebSocket disconnected: ${reason}`);
//       setSocketStatus('Disconnected');
//     });

//     socketRef.current = socket;
//   };

//   const startAudioCapture = async () => {
//     try {
//       console.log('🎤 Requesting microphone access...');
//       setSocketStatus('Requesting microphone...');
      
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 16000,
//           channelCount: 1,
//           autoGainControl: true,
//         },
//       });

//       console.log('✅ Microphone access granted');
//       mediaStream.current = stream;
      
//       // Create audio context
//       const audioCtx = new AudioContext({ sampleRate: 16000 });
//       audioContext.current = audioCtx;
//       console.log(`🎵 AudioContext created with sample rate: ${audioCtx.sampleRate}`);
      
//       // Create source
//       const audioSource = audioCtx.createMediaStreamSource(stream);
//       source.current = audioSource;
      
//       // Create analyser for audio level visualization
//       const analyser = audioCtx.createAnalyser();
//       analyser.fftSize = 512;
//       analyser.smoothingTimeConstant = 0.8;
//       audioSource.connect(analyser);
//       analyserRef.current = analyser;
      
//       // Start audio level monitoring
//       const dataArray = new Uint8Array(analyser.frequencyBinCount);
//       const updateLevel = () => {
//         analyser.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
//         // You can use this for visual feedback if needed
//         animationRef.current = requestAnimationFrame(updateLevel);
//       };
//       updateLevel();
      
//       // Create processor for capturing audio chunks
//       const audioProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
//       processor.current = audioProcessor;
//       audioSource.connect(audioProcessor);
//       audioProcessor.connect(audioCtx.destination);
      
//       let chunksProcessed = 0;

//       audioProcessor.onaudioprocess = (e) => {
//         if (!socketRef.current || !socketRef.current.connected) {
//           if (chunksProcessed % 100 === 0) {
//             console.warn('⚠️ Socket not connected, skipping audio chunk');
//           }
//           return;
//         }

//         const inputData = e.inputBuffer.getChannelData(0);
        
//         // Convert Float32Array to base64 (like the working reference code)
//         const buffer = new Float32Array(inputData);
//         const bytes = new Uint8Array(buffer.buffer);
        
//         // Efficient base64 encoding
//         let binary = '';
//         const len = bytes.byteLength;
//         for (let i = 0; i < len; i++) {
//           binary += String.fromCharCode(bytes[i]);
//         }
//         const base64Data = btoa(binary);

//         // Send audio data to backend
//         socketRef.current.emit('audio_chunk', { chunk: base64Data });
        
//         chunksProcessed++;
//         setAudioChunksSent(chunksProcessed);
        
//         // Log every 50 chunks
//         if (chunksProcessed % 50 === 0) {
//           console.log(`🎵 Sent ${chunksProcessed} audio chunks (base64 encoded)`);
//         }
//       };

//       console.log('✅ Audio capture started');
//       setSocketStatus('Recording - Speak now');
//     } catch (err: any) {
//       console.error('❌ Audio capture error:', err);
//       if (err.name === 'NotAllowedError') {
//         setError('Microphone permission denied');
//         setSocketStatus('Microphone denied');
//       } else if (err.name === 'NotFoundError') {
//         setError('No microphone found');
//         setSocketStatus('No microphone');
//       } else {
//         setError(`Microphone error: ${err.message}`);
//         setSocketStatus('Microphone error');
//       }
//       throw err;
//     }
//   };

//   const startShift = async () => {
//     if (isProcessing) {
//       console.log('⚠️ Already processing, ignoring click');
//       return;
//     }

//     console.log(`🔘 Button clicked. Current state: ${onShift ? 'ON' : 'OFF'}`);
//     setIsProcessing(true);

//     try {
//       if (!onShift) {
//         // START SHIFT
//         console.log('🚀 Starting shift...');
//         setError(null);
//         setSocketStatus('Creating shift...');
        
//         // 1. Create shift
     
//         const res = await MakeApiCall({
//           url: '/transcriptions/shift',
//           method: Methods.POST,
//         });
//         console.log('📋 Calling POST /transcriptions/shift',res);
//         shiftIdRef.current = res._id;
//         localStorage.setItem('shiftId', res._id);
//         console.log('✅ Shift created with ID:',   shiftIdRef.current);

//         // 2. Initialize WebSocket
//         setSocketStatus('Connecting to server...');
//         initializeWebSocket();

//         // 3. Wait for WebSocket to connect
//         console.log('⏳ Waiting for WebSocket connection...');
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         if (!socketRef.current || !socketRef.current.connected) {
//           throw new Error('Failed to connect to WebSocket');
//         }

//         // 4. Start audio capture
//         console.log('🎤 Starting audio capture...');
//         await startAudioCapture();

//         setOnShift(true);
//         setRecording(true);
//         console.log('✅ Shift started successfully');
//       } else {
//         // END SHIFT
//         console.log('🛑 Ending shift...');
//         setSocketStatus('Ending shift...');

//         // Stop transcription session
//         if (socketRef.current && socketRef.current.connected) {
//           console.log('📡 Emitting stop-transcription...');
//           socketRef.current.emit('stop-transcription');
//         }

//         // Cleanup resources
//         cleanupResources();

//         // Clear shift ID
//         localStorage.removeItem('shiftId');
//         shiftIdRef.current = null;

//         setOnShift(false);
//         setRecording(false);
//         setError(null);
//         setSocketStatus('Shift ended');
//         console.log('✅ Shift ended successfully');
//       }
//     } catch (error: any) {
//       console.error('❌ Error managing shift:', error);
//       setError(`Failed to ${onShift ? 'end' : 'start'} shift: ${error.message}`);
//       setSocketStatus('Error');
//       setOnShift(false);
//       cleanupResources();
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={startShift}
//         disabled={isProcessing}
//         className={`flex rounded-xl px-1 py-2 justify-center items-center align-baseline gap-2 w-full ${
//           isProcessing
//             ? 'bg-gray-400 cursor-not-allowed'
//             : onShift
//               ? 'bg-[#EF4444]'
//               : 'bg-[#0D70C8]'
//         }`}
//       >
//         {isProcessing ? 'Processing...' : onShift ? 'End Shift' : 'Start Shift'}
//         {onShift ? <MdSquare /> : ''}
//       </button>
      
//       {/* Debug Info */}
//       {onShift && (
//         <div className='mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600'>
//           <div>Status: {socketStatus}</div>
//           <div>Chunks sent: {audioChunksSent}</div>
//           <div>Socket: {socketRef.current?.connected ? '✅' : '❌'}</div>
//         </div>
//       )}
      
//       {error && (
//         <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm mt-2'>
//           {error}
//         </div>
//       )}
//     </>
//   );
// };

import { useRef, useState, useEffect } from 'react';
import { MakeApiCall, Methods } from '../actions';
import { MdSquare } from 'react-icons/md';
import { io, Socket } from 'socket.io-client';

interface RecorderProps {
  setRecording: (recording: boolean) => void;
}

export const Recorder = ({ setRecording }: RecorderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [onShift, setOnShift] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [socketStatus, setSocketStatus] = useState<string>('Disconnected');
  const [audioChunksSent, setAudioChunksSent] = useState(0);
  
  const socketRef = useRef<Socket | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const source = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // MediaRecorder for saving audio files
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  
  const shiftIdRef = useRef<string | null>(null);
  const empIdRef = useRef<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      empIdRef.current = userData._id;
      console.log('👤 Employee ID loaded:', empIdRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting, cleaning up...');
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    console.log('🧹 Cleaning up resources...');
    
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (processor.current) {
      processor.current.onaudioprocess = null;
      processor.current.disconnect();
      processor.current = null;
      console.log('✅ Processor disconnected');
    }
    
    if (source.current) {
      source.current.disconnect();
      source.current = null;
      console.log('✅ Source disconnected');
    }
    
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    
    if (audioContext.current && audioContext.current.state !== 'closed') {
      audioContext.current.close();
      audioContext.current = null;
      console.log('✅ AudioContext closed');
    }
    
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => {
        track.stop();
        console.log(`✅ Track stopped: ${track.kind}`);
      });
      mediaStream.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log('✅ Socket disconnected');
    }
    
    audioChunksRef.current = [];
    setAudioChunksSent(0);
  };

  // Upload audio to server
  const uploadAudioChunk = async (audioBlob: Blob, transcript: string) => {
    if (!shiftIdRef.current || !empIdRef.current) {
      console.error('❌ Missing shift or employee ID');
      return;
    }

    try {
      const formData = new FormData();
      const fileName = `audio_${shiftIdRef.current}_${Date.now()}.webm`;
      formData.append('audio-file', audioBlob, fileName);
      formData.append('shiftId', shiftIdRef.current);
      formData.append('empId', empIdRef.current);
      formData.append('transcript', transcript);
      formData.append('recordingDuration', ((Date.now() - recordingStartTimeRef.current) / 1000).toFixed(2));

      console.log(`📤 Uploading audio (${(audioBlob.size / 1024).toFixed(2)} KB)`);

      const response = await MakeApiCall({
        url: '/transcriptions/analyze',
        method: Methods.POST,
        body: formData,
       
      });

      console.log('✅ Audio uploaded and analyzed:', response);
      
      // Clear chunks after successful upload
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();
      
    } catch (error) {
      console.error('❌ Failed to upload audio:', error);
    }
  };

  // Start MediaRecorder for audio file recording
  const startMediaRecorder = (stream: MediaStream) => {
    try {
      // Use higher quality settings for storage
      const options = { 
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000 // 128 kbps
      };
      
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      recordingStartTimeRef.current = Date.now();

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          console.log(`🎵 Audio data available: ${(event.data.size / 1024).toFixed(2)} KB`);
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event: any) => {
        console.error('❌ MediaRecorder error:', event.error);
      };

      // Start recording and collect data every second
      recorder.start(1000);
      console.log('🎵 MediaRecorder started (audio will be saved)');

    } catch (error: any) {
      console.error('❌ Failed to start MediaRecorder:', error);
      setError(`Failed to start audio recording: ${error.message}`);
    }
  };

  const initializeWebSocket = () => {
    console.log('🔌 Initializing WebSocket connection...');
    
    const socket = io('http://localhost:8000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setSocketStatus('Connected');
      console.log('📡 Emitting start-transcription...');
      socket.emit('start-transcription');
    });

    socket.on('transcription-ready', (data) => {
      console.log('🎙️ Transcription ready:', data);
      setSocketStatus('Ready to transcribe');
    });

    socket.on('partial-transcript', (text: string) => {
      console.log('📝 Partial transcript:', text);
    });

    socket.on('final-transcript', async (data: { text: string; confidence: number }) => {
      console.log('✅ Final transcript received:', {
        textLength: data.text.length,
        confidence: data.confidence,
        preview: data.text.substring(0, 100)
      });
      setSocketStatus('Processing transcript...');
      
      // Create audio blob from collected chunks
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log(`🎵 Audio blob created: ${(audioBlob.size / 1024).toFixed(2)} KB`);
        
        // Upload audio with transcript
        await uploadAudioChunk(audioBlob, data.text);
        setSocketStatus('Transcript analyzed & audio saved');
      } else {
        console.warn('⚠️ No audio chunks available to upload');
        setSocketStatus('Transcript analyzed (no audio)');
      }
    });

    socket.on('error', (err) => {
      console.error('❌ WebSocket error:', err);
      setSocketStatus('Error occurred');
      setError('Connection error occurred');
    });

    socket.on('session-ended', () => {
      console.log('🔒 Session ended');
      setSocketStatus('Session ended');
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ WebSocket disconnected: ${reason}`);
      setSocketStatus('Disconnected');
    });

    socketRef.current = socket;
  };

  const startAudioCapture = async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      setSocketStatus('Requesting microphone...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1,
          autoGainControl: true,
        },
      });

      console.log('✅ Microphone access granted');
      mediaStream.current = stream;
      
      // START MEDIARECORDER FOR AUDIO STORAGE
      startMediaRecorder(stream);
      
      // Create audio context for real-time streaming
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContext.current = audioCtx;
      console.log(`🎵 AudioContext created with sample rate: ${audioCtx.sampleRate}`);
      
      const audioSource = audioCtx.createMediaStreamSource(stream);
      source.current = audioSource;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      audioSource.connect(analyser);
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
      
      // Create processor for real-time transcription
      const audioProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
      processor.current = audioProcessor;
      audioSource.connect(audioProcessor);
      audioProcessor.connect(audioCtx.destination);
      
      let chunksProcessed = 0;

      audioProcessor.onaudioprocess = (e) => {
        if (!socketRef.current || !socketRef.current.connected) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const buffer = new Float32Array(inputData);
        const bytes = new Uint8Array(buffer.buffer);
        
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);

        socketRef.current.emit('audio_chunk', { chunk: base64Data });
        
        chunksProcessed++;
        setAudioChunksSent(chunksProcessed);
        
        if (chunksProcessed % 50 === 0) {
          console.log(`🎵 Sent ${chunksProcessed} audio chunks to transcription`);
        }
      };

      console.log('✅ Audio capture started (recording + streaming)');
      setSocketStatus('Recording - Speak now');
    } catch (err: any) {
      console.error('❌ Audio capture error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied');
        setSocketStatus('Microphone denied');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found');
        setSocketStatus('No microphone');
      } else {
        setError(`Microphone error: ${err.message}`);
        setSocketStatus('Microphone error');
      }
      throw err;
    }
  };

  const startShift = async () => {
    if (isProcessing) {
      console.log('⚠️ Already processing, ignoring click');
      return;
    }

    console.log(`🔘 Button clicked. Current state: ${onShift ? 'ON' : 'OFF'}`);
    setIsProcessing(true);

    try {
      if (!onShift) {
        console.log('🚀 Starting shift...');
        setError(null);
        setSocketStatus('Creating shift...');
        
        const res = await MakeApiCall({
          url: '/transcriptions/shift',
          method: Methods.POST,
        });
        
        shiftIdRef.current = res._id;
        localStorage.setItem('shiftId', res._id);
        console.log('✅ Shift created with ID:', shiftIdRef.current);

        setSocketStatus('Connecting to server...');
        initializeWebSocket();

        console.log('⏳ Waiting for WebSocket connection...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!socketRef.current || !socketRef.current.connected) {
          throw new Error('Failed to connect to WebSocket');
        }

        console.log('🎤 Starting audio capture...');
        await startAudioCapture();

        setOnShift(true);
        setRecording(true);
        console.log('✅ Shift started successfully');
      } else {
        console.log('🛑 Ending shift...');
        setSocketStatus('Ending shift...');

        // Stop MediaRecorder and upload final audio if any
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          
          // Wait a bit for final data
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Upload final audio chunk if exists
          if (audioChunksRef.current.length > 0) {
            const finalBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            console.log('📤 Uploading final audio chunk...');
            await uploadAudioChunk(finalBlob, 'Final recording segment');
          }
        }

        if (socketRef.current && socketRef.current.connected) {
          console.log('📡 Emitting stop-transcription...');
          socketRef.current.emit('stop-transcription');
        }

        cleanupResources();

        localStorage.removeItem('shiftId');
        shiftIdRef.current = null;

        setOnShift(false);
        setRecording(false);
        setError(null);
        setSocketStatus('Shift ended');
        console.log('✅ Shift ended successfully');
      }
    } catch (error: any) {
      console.error('❌ Error managing shift:', error);
      setError(`Failed to ${onShift ? 'end' : 'start'} shift: ${error.message}`);
      setSocketStatus('Error');
      setOnShift(false);
      cleanupResources();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        onClick={startShift}
        disabled={isProcessing}
        className={`flex rounded-xl px-1 py-2 justify-center items-center align-baseline gap-2 w-full ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : onShift
              ? 'bg-[#EF4444]'
              : 'bg-[#0D70C8]'
        }`}
      >
        {isProcessing ? 'Processing...' : onShift ? 'End Shift' : 'Start Shift'}
        {onShift ? <MdSquare /> : ''}
      </button>
      
      {onShift && (
        <div className='mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600'>
          <div>Status: {socketStatus}</div>
          <div>Chunks sent: {audioChunksSent}</div>
          <div>Socket: {socketRef.current?.connected ? '✅' : '❌'}</div>
          <div>Recording: {mediaRecorderRef.current?.state || 'inactive'} 
            ({audioChunksRef.current.length} audio chunks stored)
          </div>
        </div>
      )}
      
      {error && (
        <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm mt-2'>
          {error}
        </div>
      )}
    </>
  );
};
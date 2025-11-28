
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

    // Do NOT clear chunks here, as onstop needs them. 
    // They will be cleared after successful upload or at start of new session.
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

      recorder.onstop = async () => {
        console.log('🛑 MediaRecorder stopped');

        // Upload final audio if exists
        if (audioChunksRef.current.length > 0) {
          const finalBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log(`📤 Uploading final audio (${(finalBlob.size / 1024).toFixed(2)} KB)...`);

          // We use the last known transcript or a placeholder since this is the final flush
          await uploadAudioChunk(finalBlob, 'Final recording segment');

          // Clear chunks after upload
          audioChunksRef.current = [];
        } else {
          console.log('⚠️ No audio chunks to upload on stop');
        }
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

    const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
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

      // Clear previous chunks before starting new recording
      audioChunksRef.current = [];

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
          body: JSON.stringify({
            startTime: new Date(Date.now()),
          }),
          headers: 'json'
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

        // 1. Stop MediaRecorder - this triggers onstop which handles the upload
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          // We do NOT await the upload here. It happens in the background via onstop.
        }

        // 2. Stop Socket immediately
        if (socketRef.current && socketRef.current.connected) {
          console.log('📡 Emitting stop-transcription...');
          socketRef.current.emit('stop-transcription');
        }

        // 3. Cleanup other resources (mic, context, etc) immediately
        cleanupResources();

        // We do NOT clear shiftIdRef here because the onstop handler (triggered above)
        // needs it to upload the final audio chunk. It will be overwritten on next start.

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
        className={`flex rounded-xl px-1 py-2 justify-center items-center align-baseline gap-2 w-full ${isProcessing
          ? 'bg-gray-400 cursor-not-allowed'
          : onShift
            ? 'bg-[#EF4444]'
            : 'bg-[#0D70C8]'
          }`}
      >
        {isProcessing ? 'Processing...' : onShift ? 'End Shift' : 'Start Shift'}
        {onShift ? <MdSquare /> : ''}
      </button>



      {error && (
        <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm mt-2'>
          {error}
        </div>
      )}
    </>
  );
};
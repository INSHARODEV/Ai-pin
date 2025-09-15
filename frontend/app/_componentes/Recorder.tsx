import { useRef, useState } from 'react';
import { MakeApiCall, Methods } from '../actions';
import { MdSquare } from 'react-icons/md';
export interface Params {
  setRecording: any;
}
export const Recorder = ({ setRecording }: Params) => {
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [onShfit, setOnShfit] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const sendAudioToServer = async () => {
    if (chunks.current.length === 0) {
      console.log('No audio chunks to send');
      return;
    }

    const shiftId = localStorage.getItem('shiftId');
    if (!shiftId) {
      console.log('No shiftId found');
      return;
    }

    // Create blob from chunks
    const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
    console.log('Audio blob size:', audioBlob.size);

    // Create FormData to send the audio file
    const formData = new FormData();
    formData.append('audio-file', audioBlob, `audio_${Date.now()}.webm`);

    try {
      const res = await MakeApiCall({
        url: `/transcriptions/${shiftId}`,
        method: Methods.POST,
        body: formData,
      });

      console.log('Audio sent successfully:', res);

      // Clear chunks after successful send
      chunks.current = [];
    } catch (error) {
      console.error('Failed to send audio:', error);
    }
  };
  const startShfit = async () => {
    // Prevent double clicks
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }

    console.log('Start/Stop shift clicked, current state:', onShfit);
    setIsProcessing(true);

    try {
      if (!onShfit) {
        // Starting shift
        setError(null);

        // Create shift
        console.log('Creating shift...');
        const res = await MakeApiCall({
          url: '/transcriptions/shift',
          method: Methods.POST,
        });

        localStorage.setItem('shiftId', res._id);
        console.log('Shift created:', res);

        // Get microphone permission and stream
        const stream = await requestMicrophonePermission();
        mediaStream.current = stream;

        // Start recording
        startRecording(stream);

        // Set up interval to send audio every 5 minutes (300000 ms)
        intervalRef.current = setInterval(async () => {
          console.log('5-minute interval triggered');
          if (
            mediaRecorder.current &&
            mediaRecorder.current.state === 'recording'
          ) {
            console.log('Stopping current recording for interval send');
            mediaRecorder.current.stop();

            // Wait a bit for the stop event to process
            setTimeout(() => {
              // Restart recording if still in shift
              if (onShfit && mediaStream.current) {
                console.log('Restarting recording after interval');
                startRecording(mediaStream.current);
              }
            }, 500);
          }
        }, 300000);

        setOnShfit(true);
      } else {
        // Ending shift
        console.log('Ending shift...');

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log('Interval cleared');
        }

        if (
          mediaRecorder.current &&
          mediaRecorder.current.state === 'recording'
        ) {
          console.log('Stopping final recording');
          mediaRecorder.current.stop();
        }

        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach(track => {
            track.stop();
            console.log('Track stopped:', track.kind);
          });
          mediaStream.current = null;
        }

        mediaRecorder.current = null;
        setRecording(false);
        setOnShfit(false);
        setError(null);
        console.log('Shift ended');
      }
    } catch (error: any) {
      console.error('Error starting shift:', error);
      setError(`Failed to start shift: ${error.message}`);
      setOnShfit(false); // Reset state on error
    } finally {
      setIsProcessing(false);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          'getUserMedia is not supported in this browser or context'
        );
      }

      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      console.log('Microphone permission granted, stream obtained:', stream);
      return stream;
    } catch (err: any) {
      console.error('Microphone permission error:', err);

      if (err.name === 'NotAllowedError') {
        setError(
          'Microphone permission denied. Please allow microphone access and try again.'
        );
      } else if (err.name === 'NotFoundError') {
        setError(
          'No microphone found. Please connect a microphone and try again.'
        );
      } else if (err.name === 'NotSupportedError') {
        setError('Your browser does not support audio recording.');
      } else {
        setError(`Microphone error: ${err.message}`);
      }
      throw err;
    }
  };

  const startRecording = (stream: MediaStream) => {
    try {
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder is not supported in this browser');
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        console.log('Audio data available, size:', event.data.size);
        if (event.data && event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        console.log('Recording stopped, sending final audio...');
        await sendAudioToServer();
      };

      recorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event.error);
        setError(`Recording error: ${event.error}`);
      };

      recorder.onstart = () => {
        console.log('Recording started successfully');
        setRecording(true);
        setError(null);
      };

      recorder.start(1000);
      console.log('MediaRecorder start called');
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError(`Failed to start recording: ${err.message}`);
    }
  };

  return (
    <>
      <button
        onClick={startShfit}
        disabled={isProcessing}
        className={`flex rounded-xl px-1 py-2 justify-center items-center align-baseline gap-2 w-full ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : onShfit
              ? 'bg-[#EF4444]'
              : 'bg-[#0D70C8]'
        }`}
      >
        {isProcessing ? 'Processing...' : onShfit ? 'End Shift' : 'Start Shift'}
        {onShfit ? <MdSquare /> : ''}
      </button>
      {error && (
        <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm'>
          {error}
        </div>
      )}
    </>
  );
};

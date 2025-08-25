'use client'
import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Mic, MicOff, Square } from 'lucide-react';

const AudioTranscription: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [partialText, setPartialText] = useState('');
  const [finalTexts, setFinalTexts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io('http://localhost:8000', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setIsReady(false);
      setIsRecording(false);
    });

    socket.on('connected', (data) => {
      console.log('Server confirmation:', data.message);
    });

    socket.on('transcription-ready', (data) => {
      console.log('Transcription ready:', data.sessionId);
      console.log(`📤 Sending ${JSON.stringify(data) }`);

      setIsReady(true);
    });

    socket.on('partial-transcript', (data) => {
      console.log('Partial:', data.text);
      setPartialText(data.text);
    });

    socket.on('final-transcript', (data) => {
      console.log('Final:', data.text);
      setFinalTexts(prev => [...prev, data.text]);
      setPartialText('');
    });

    socket.on('transcription-error', (data) => {
      console.error('Transcription error:', data.error);
      setError(data.error);
      setIsRecording(false);
      setIsReady(false);
    });

    socket.on('transcription-stopped', (data) => {
      console.log('Transcription stopped:', data?.reason || 'Unknown reason');
      setIsRecording(false);
      setIsReady(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      
      if (!socketRef.current?.connected) {
        throw new Error('Not connected to server');
      }

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        }
      });

      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current?.connected) {
          // Convert blob to buffer
          event.data.arrayBuffer().then(buffer => {
            const uint8Array = new Uint8Array(buffer);
            const numberArray = Array.from(uint8Array);
            
            // Only send if we have a reasonable amount of data
            if (numberArray.length > 1000) { // At least 1KB
              socketRef.current?.emit('audio-data', { buffer: numberArray });
            }
          });
        }
      };

      mediaRecorder.start(250); // Send data every 250ms (larger chunks)
      mediaRecorderRef.current = mediaRecorder;

      // Start transcription on server
      socketRef.current.emit('start-transcription');
      
      setIsRecording(true);
      console.log('Recording started');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (socketRef.current?.connected) {
        socketRef.current.emit('stop-transcription');
      }

      setIsRecording(false);
      setIsReady(false);
      console.log('Recording stopped');

    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const clearTranscripts = () => {
    setFinalTexts([]);
    setPartialText('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Simple Audio Transcription
      </h1>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Connection: {isConnected ? 'Connected' : 'Disconnected'}</span>
          
          {isReady && (
            <>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Transcription Ready</span>
            </>
          )}
          
          {isRecording && (
            <>
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span>Recording</span>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={!isConnected}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <MicOff className="w-4 h-4" />
            Stop Recording
          </button>
        )}

        <button
          onClick={clearTranscripts}
          className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <Square className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Live Transcript */}
      {partialText && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="text-sm text-gray-600 mb-1">Live:</div>
          <p className="text-gray-800 italic">{partialText}</p>
        </div>
      )}

      {/* Final Transcripts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Transcripts ({finalTexts.length})
        </h2>

        {finalTexts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No transcripts yet. Start recording to see results.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {finalTexts.map((text, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400"
              >
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Transcript {index + 1}
                </div>
                <p className="text-gray-800">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioTranscription;
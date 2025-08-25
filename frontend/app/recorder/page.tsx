'use client';

import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CiCalendar } from 'react-icons/ci';
import Loader from '../loader';
// import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Result } from '../types/result';
import { Turn } from '../types/turns';
import witAuth from '../_componentes/witAuth';

import { Role } from '../../../backend/src/shared/ROLES';
function App() {
  console.log('qweqwe', process.env.NEXT_PUBLIC_BASE_URL);

  const [results, setResults] = useState<Result[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ); // 7 days ago
  const [endDate, setEndDate] = useState<Date | null>(new Date()); // Today
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState<string>('');

  // Use refs for recording control to persist across re-renders
  const isRecordingRef = useRef<boolean>(false);
  const currentRecordIdRef = useRef<string | null>(null);

  // Sync ref with state for UI updates
  const setIsRecordingState = (value: boolean) => {
    console.log(`🎙️ setIsRecording(${value}) - persisting across re-renders`);
    isRecordingRef.current = value;
    setIsRecording(value);
  };

  const setCurrentRecordIdState = (value: string | null) => {
    console.log(
      `🆔 setCurrentRecordId(${value}) - persisting across re-renders`
    );
    currentRecordIdRef.current = value;
  };

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);
  const chunkInterval = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordingStartTime = useRef<number>(0);
  const mediaStream = useRef<MediaStream | null>(null);

  // Audio playlist state
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isPlayingPlaylist, setIsPlayingPlaylist] = useState(false);
  const [playlistProgress, setPlaylistProgress] = useState<string>('');

  const fetchResults = async () => {
    setLoading(true);
    setRecordingProgress('Loading conversations...');
    try {
      // Build URL with URLSearchParams
      const params = new URLSearchParams();

      // Use date range instead of single date
      if (startDate) {
        params.set('startDate', startDate.toISOString().split('T')[0]);
      }

      if (endDate) {
        params.set('endDate', endDate.toISOString().split('T')[0]);
      }

      const url = `/api/upload-audio${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Fetched data:', data);

      // Handle new grouped response format
      let normalizedData = [];
      if (data.transcripts && Array.isArray(data.transcripts)) {
        normalizedData = data.transcripts;
      } else if (Array.isArray(data)) {
        normalizedData = data;
      }

      setResults(normalizedData);
      setSelectedIndex(normalizedData.length > 0 ? 0 : -1);
      setRecordingProgress(''); // Clear loading message
    } catch (error) {
      console.error('Fetch error:', error);
      setResults([]);
      setRecordingProgress('Failed to load conversations');
      // Clear error message after 3 seconds
      setTimeout(() => {
        setRecordingProgress('');
      }, 3000);
      // Optional: Add error state handling
      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize recording session - NO DB CREATION
  const initializeRecordingSession = async () => {
    try {
      // Generate a temporary record ID for this session
      const tempRecordId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setCurrentRecordIdState(tempRecordId);

      // Create a temporary result object for UI
      const tempResult: Result = {
        _id: tempRecordId,

        turns: [],
        raw_transcript: '',
        summary: '',
        status: 'recording',
        chunk_count: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to results for UI display
      setResults(prev => [tempResult, ...prev]);
      setSelectedIndex(0);

      return tempRecordId;
    } catch (error) {
      console.error('Failed to initialize recording session:', error);
      throw error;
    }
  };

  // Send audio chunk to backend - CREATE NEW DOCUMENT FOR EACH CHUNK
  const sendAudioChunk = async (
    recordId: string,
    audioBlob: Blob,
    isLastChunk = false
  ) => {
    console.log(
      `sendAudioChunk called: recordId=${recordId}, blobSize=${audioBlob.size}, isLastChunk=${isLastChunk}`
    );

    // Show loading for transcription processing
    setLoading(true);
    setRecordingProgress(`Processing 5min chunk...`);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      console.log('Sending chunk to backend to create new document...');
      const res = await fetch(process.env.PUBLIC_NEXT_BASE_URL as string, {
        method: 'POST',
        body: formData,
      });

      console.log('Response received, status:', res.status);
      const result = await res.json();
      console.log('Response data:', result);

      if (result.success && result.data) {
        console.log('New document created successfully');
        // Add the new document to results
        setResults(prev => [result.data, ...prev]);

        setRecordingProgress(` `);

        if (isLastChunk) {
          console.log('This was the last chunk, recording completed');
          setRecordingProgress('Recording completed successfully');
        } else {
          console.log('Setting progress for next chunk');
          setTimeout(() => {
            if (isRecording) {
              setRecordingProgress(`Recording next 5min chunk...`);
            }
          }, 2000);
        }

        return result;
      } else {
        console.error('Backend returned error:', result);
        throw new Error(result.error || 'Failed to process audio chunk');
      }
    } catch (error) {
      console.error('Failed to send audio chunk:', error);
      setRecordingProgress('Error processing chunk - continuing recording');

      // Don't show alerts for non-last chunks to avoid interrupting recording
      if (isLastChunk && error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage.includes('quota exceeded')) {
          alert(
            `Error: OpenAI quota exceeded\n\nPlease check your OpenAI billing and usage limits.`
          );
        } else if (errorMessage.includes('rate limit')) {
          alert(
            `Error: Rate limit exceeded\n\nPlease wait a moment and try again.`
          );
        } else {
          alert(`Upload failed: ${errorMessage}`);
        }
      }

      // Don't throw error for non-last chunks to continue recording
      if (isLastChunk) {
        throw error;
      }
    } finally {
      // Always hide loader after processing
      setLoading(false);
    }
  };

  // Clear recording session data
  const clearRecordingSession = () => {
    setCurrentRecordIdState(null);
    setTimeout(() => {
      setRecordingProgress('');
    }, 3000); // Clear progress after 3 seconds
  };

  // Handle chunk processing
  const processAudioChunk = async (recordId: string, isLastChunk = false) => {
    console.log(`Processing audio chunk, isLastChunk: ${isLastChunk}`);

    if (audioChunks.current.length === 0) {
      console.log('No audio chunks available, skipping');
      return;
    }

    const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
    console.log(`Created blob with size: ${blob.size} bytes`);
    audioChunks.current = []; // Clear chunks after creating blob

    try {
      console.log('Sending audio chunk to backend...');
      await sendAudioChunk(recordId, blob, isLastChunk);
      console.log('Audio chunk sent successfully');
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      // Continue recording even if one chunk fails
    }
  };

  // Start new chunk recording
  const startChunkRecording = async (
    recordId: string,
    isFirstChunk = false
  ) => {
    try {
      // Only get new stream for first chunk, reuse for subsequent chunks
      if (isFirstChunk || !mediaStream.current) {
        console.log('Getting new media stream...');
        mediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      if (!mediaStream.current) {
        throw new Error('No media stream available');
      }

      console.log(
        `Starting chunk recording, isFirstChunk: ${isFirstChunk}, recordId: ${recordId}`
      );

      mediaRecorder.current = new MediaRecorder(mediaStream.current);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
        console.log('Audio data available, size:', e.data.size);
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        console.log(
          'MediaRecorder stopped. isRecording:',
          isRecordingRef.current,
          'currentRecordId:',
          currentRecordIdRef.current,
          'recordId:',
          recordId
        );

        if (!isRecordingRef.current) {
          // Recording was stopped manually or by timeout
          console.log('Recording stopped, processing final chunk');
          await processAudioChunk(recordId, true);
          setCurrentRecordIdState(null);
          return;
        }

        // Process chunk and start next chunk
        console.log('Processing chunk and continuing recording');
        try {
          await processAudioChunk(recordId, false);
          console.log(
            'Chunk processed successfully, checking if we should continue...'
          );

          // Check state again after processing (in case it changed during processing)
          console.log(
            'After processing - isRecording:',
            isRecordingRef.current,
            'currentRecordId:',
            currentRecordIdRef.current,
            'recordId:',
            recordId
          );

          // Start next chunk if still recording
          if (
            isRecordingRef.current &&
            recordId === currentRecordIdRef.current
          ) {
            console.log('Starting next chunk in 1000ms');
            setTimeout(() => {
              console.log(
                'About to start next chunk, final check - isRecording:',
                isRecordingRef.current
              );
              if (
                isRecordingRef.current &&
                recordId === currentRecordIdRef.current
              ) {
                console.log('✅ Starting next chunk now');
                startChunkRecording(recordId, false);
              } else {
                console.log('❌ State changed, not starting next chunk');
              }
            }, 1000); // Increased delay to ensure processing completes
          } else {
            console.log('Not starting next chunk:', {
              isRecording: isRecordingRef.current,
              recordId,
              currentRecordId: currentRecordIdRef.current,
            });
          }
        } catch (error) {
          console.error('Error processing chunk:', error);
          // Continue recording even if chunk processing fails
          if (
            isRecordingRef.current &&
            recordId === currentRecordIdRef.current
          ) {
            console.log('Chunk processing failed, but continuing recording');
            setTimeout(() => {
              if (
                isRecordingRef.current &&
                recordId === currentRecordIdRef.current
              ) {
                startChunkRecording(recordId, false);
              }
            }, 1000);
          }
        }
      };

      mediaRecorder.current.onerror = event => {
        console.error('MediaRecorder error:', event);
      };

      console.log('Starting MediaRecorder...');
      mediaRecorder.current.start();

      // Stop after 5 minutes to create chunk
      setTimeout(() => {
        console.log('⏰ 5 minutes elapsed, stopping current chunk');
        console.log('🔍 State check before stopping:', {
          isRecording: isRecordingRef.current,
          currentRecordId: currentRecordIdRef.current,
          recordId,
          mediaRecorderState: mediaRecorder.current?.state,
        });
        if (
          mediaRecorder.current &&
          mediaRecorder.current.state === 'recording'
        ) {
          console.log('🛑 Stopping MediaRecorder...');
          mediaRecorder.current.stop();
        } else {
          console.log(
            '⚠️ MediaRecorder not in recording state:',
            mediaRecorder.current?.state
          );
        }
      }, 30000);
    } catch (err: any) {
      console.error('Error in chunk recording:', err);
      if (isFirstChunk) {
        alert(`Error accessing microphone: ${err.message}`);
        setIsRecordingState(false);
      }
    }
  };

  // Audio playlist functions
  const playAudioPlaylist = async (audioUrls: string[]) => {
    if (!audioUrls || audioUrls.length === 0) {
      alert('No audio chunks available to play');
      return;
    }

    console.log(`Starting playlist with ${audioUrls.length} chunks`);
    setIsPlayingPlaylist(true);
    setCurrentChunkIndex(0);
    setPlaylistProgress(`Playing chunk 1 of ${audioUrls.length}`);

    // Start playing the first chunk
    if (audioRef.current) {
      audioRef.current.src = audioUrls[0];
      audioRef.current.play();
    }
  };

  const playNextChunk = (audioUrls: string[]) => {
    const nextIndex = currentChunkIndex + 1;

    if (nextIndex < audioUrls.length) {
      console.log(`Playing chunk ${nextIndex + 1} of ${audioUrls.length}`);
      setCurrentChunkIndex(nextIndex);
      setPlaylistProgress(
        `Playing chunk ${nextIndex + 1} of ${audioUrls.length}`
      );

      if (audioRef.current) {
        audioRef.current.src = audioUrls[nextIndex];
        audioRef.current.play();
      }
    } else {
      // Playlist finished
      console.log('Playlist completed');
      setIsPlayingPlaylist(false);
      setCurrentChunkIndex(0);
      setPlaylistProgress('Playback completed');
      setTimeout(() => setPlaylistProgress(''), 3000);
    }
  };

  const stopAudioPlaylist = () => {
    console.log('Stopping playlist');
    setIsPlayingPlaylist(false);
    setCurrentChunkIndex(0);
    setPlaylistProgress('');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Handle audio events
  const handleAudioEnded = () => {
    if (isPlayingPlaylist && selected.audio_urls) {
      playNextChunk(selected.audio_urls);
    }
  };

  const handleAudioError = (e: any) => {
    console.error('Audio playback error:', e);
    setPlaylistProgress('Error playing audio chunk');
    setTimeout(() => {
      if (isPlayingPlaylist && selected.audio_urls) {
        playNextChunk(selected.audio_urls);
      }
    }, 1000);
  };

  // Main recording controls
  const startRecording = async () => {
    // Prevent starting if already recording
    if (isRecording || currentRecordIdRef.current) {
      console.log('Recording already in progress');
      return;
    }

    try {
      setLoading(true);
      setRecordingProgress('Initializing recording session...');

      // Initialize recording session
      const recordId = await initializeRecordingSession();

      setRecordingProgress('Starting microphone...');

      // Set recording state BEFORE starting chunks
      setIsRecordingState(true);
      recordingStartTime.current = Date.now();

      console.log('✅ Recording state set to TRUE, starting first chunk');
      setRecordingProgress(
        'Recording started... (each 5min chunk creates new conversation)'
      );

      // Start first chunk
      await startChunkRecording(recordId, true);

      // Set 24-hour timeout
      recordingTimeout.current = setTimeout(
        () => {
          console.log('⏰ 24-hour timeout reached');
          setRecordingProgress(
            '24-hour recording limit reached, stopping recording...'
          );
          stopRecording();
        },
        1000 * 60 * 60 * 24
      );
    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecordingProgress('Failed to start recording');
      setCurrentRecordIdState(null);
      setIsRecordingState(false);
      alert('Failed to start recording. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = () => {
    console.log('🛑 stopRecording() called - Stack trace:');
    console.trace();
    setIsRecordingState(false);
    setRecordingProgress('Stopping recording...');

    // Clear timeout
    if (recordingTimeout.current) {
      clearTimeout(recordingTimeout.current);
      recordingTimeout.current = null;
    }

    // Stop current recording
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }

    // Stop the stream
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      mediaStream.current = null;
    }

    // Clear recording session data
    clearRecordingSession();
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Close picker when both dates are selected
    if (start && end) {
      setIsDatePickerOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return 'Select Date Range';
    if (!startDate) return `Until ${endDate?.toLocaleDateString()}`;
    if (!endDate) return `From ${startDate.toLocaleDateString()}`;

    const start = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const end = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${start} - ${end}`;
  };

  // Helper function to format date headers
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Compare dates (ignoring time)
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    // Format as "31 Dec 2024"
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Group conversations by date
  const groupConversationsByDate = (conversations: Result[]) => {
    const groups: { [key: string]: Result[] } = {};

    conversations.forEach(conversation => {
      const date = new Date(conversation.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(conversation);
    });

    return groups;
  };

  const selected = results[selectedIndex] || {};
  const groupedConversations = groupConversationsByDate(results);

  const scoreValue =
    selected.turns && selected.turns.length
      ? Math.round(
          selected.turns.reduce(
            (sum: number, t: Turn) =>
              sum +
              (typeof t.sales_script_adherence === 'number'
                ? t.sales_script_adherence
                : 0),
            0
          ) / selected.turns.length
        )
      : 0;

  const getScoreVisual = (score: number) => {
    if (score > 50) {
      return { icon: '✅', bg: '#e6f4ea', color: '#34a853' };
    } else if (score === 50) {
      return { icon: '⚠️', bg: '#fff7e6', color: '#fbbc05' };
    } else {
      return { icon: '❌', bg: '#fde8e8', color: '#ea4335' };
    }
  };

  const scoreStyle = getScoreVisual(scoreValue);

  // Prepare messages for transcript display
  const messages =
    selected.turns && Array.isArray(selected.turns)
      ? selected.turns.map((turn: Turn, idx: number) => ({
          id: idx,
          text: turn.transcription,
          isCustomer: turn.speaker_label?.toLowerCase().includes('customer'),
          speaker: turn.speaker_label,
        }))
      : [];

  // Speaker avatar and color helpers
  const getSpeakerProps = (speaker: string) => {
    if (speaker?.toLowerCase().includes('customer')) {
      return { label: 'C', bg: '#e0c8f7', color: '#7b2ff2' };
    }
    return { label: 'S', bg: '#c8e6fa', color: '#1976d2' };
  };

  // Engagement metrics (from first turn for demo)
  const engagement =
    selected.turns && selected.turns.length > 0
      ? selected.turns[0].engagement_metrics
      : null;

  return (
    <div
      style={{
        fontFamily: 'Inter, Arial, sans-serif',
        height: '100vh',
        display: 'flex',
        background: '#f7f8fa',
      }}
    >
      {/* Loader overlay */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Loader />
          {recordingProgress && (
            <div
              style={{
                marginTop: 20,
                fontSize: 16,
                fontWeight: 500,
                color: '#1976d2',
                textAlign: 'center',
              }}
            >
              {recordingProgress}
            </div>
          )}
        </div>
      )}

      {/* Sidebar */}
      <div
        style={{
          width: 280,
          background: '#fff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 0 0 0',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, padding: '0 32px 24px' }}>
          CONVERSATIONS
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {results.length === 0 && (
            <p style={{ padding: '0 32px', color: '#666' }}>
              No conversations found.
            </p>
          )}

          {/* Grouped conversations by date */}
          {Object.keys(groupedConversations)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort by date, newest first
            .map(dateString => (
              <div key={dateString}>
                {/* Date Header */}
                <div
                  style={{
                    padding: '16px 32px 8px',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f0f0f0',
                    background: '#fafafa',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {formatDateHeader(dateString)}
                </div>

                {/* Conversations for this date */}
                {groupedConversations[dateString].map((conversation, index) => {
                  const globalIndex = results.findIndex(
                    r => r._id === conversation._id
                  );
                  const conversationTime = new Date(
                    conversation.createdAt
                  ).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });

                  return (
                    <div
                      key={conversation._id || `${dateString}-${index}`}
                      onClick={() => {
                        setSelectedIndex(globalIndex);
                        stopAudioPlaylist();
                      }}
                      style={{
                        padding: '12px 32px',
                        marginBottom: 2,
                        cursor: 'pointer',
                        background:
                          globalIndex === selectedIndex
                            ? '#e7e8ff'
                            : 'transparent',
                        fontWeight: globalIndex === selectedIndex ? 600 : 400,
                        color:
                          globalIndex === selectedIndex ? '#1976d2' : '#333',
                        transition: 'background 0.2s',
                        borderLeft:
                          globalIndex === selectedIndex
                            ? '3px solid #1976d2'
                            : '3px solid transparent',
                      }}
                      tabIndex={0}
                      role='button'
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ')
                          setSelectedIndex(globalIndex);
                      }}
                    >
                      <div style={{ fontSize: 14, marginBottom: 4 }}>
                        Conversation {index + 1}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color:
                            globalIndex === selectedIndex ? '#1976d2' : '#999',
                          fontWeight: 400,
                        }}
                      >
                        {conversationTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div
          style={{
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            padding: '24px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 22, marginRight: 16 }}>
              {formatDateRange()}
            </span>
            <div
              onClick={() => setIsDatePickerOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1976d2',
                borderRadius: '50%',
                width: 32,
                height: 32,
                cursor: 'pointer',
                marginLeft: 8,
                marginRight: 16,
              }}
              aria-label='Open Date Range Picker'
            >
              <CiCalendar />
            </div>
            <div
              style={{
                background: '#f0f9ff',
                color: '#1976d2',
                padding: '4px 12px',
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {results.length} conversations
            </div>
            {isDatePickerOpen && (
              <div
                onClick={() => setIsDatePickerOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000,
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: '#fff',
                    padding: 20,
                    borderRadius: 8,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateRangeChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    monthsShown={2}
                    maxDate={new Date()}
                    showDisabledMonthNavigation
                  />
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                background: isRecording ? '#f44336' : '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 28px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
                minWidth: 150,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
              }}
            >
              {isRecording ? 'Stop analysis' : 'start analysis'}
            </button>

            {/* Recording Progress Indicator */}
            {(isRecording || recordingProgress || loading) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  background: loading ? '#fff3cd' : '#f0f9ff',
                  border: loading ? '1px solid #ffc107' : '1px solid #0ea5e9',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: loading ? '#856404' : '#0c4a6e',
                }}
              >
                {isRecording && !loading && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: '#f44336',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                )}
                {loading && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: '#ffc107',
                      borderRadius: '50%',
                      animation: 'pulse 1s ease-in-out infinite',
                    }}
                  />
                )}
                <span>
                  {recordingProgress ||
                    (loading ? 'Processing...' : 'Ready to record')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* --- ENHANCED AUDIO PLAYER --- */}
        <div style={{ padding: '16px 40px 0 40px' }}>
          {((selected.audio_urls?.length ?? 0) > 0 || selected.audio_url) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Play/Stop Button */}
                <button
                  style={{
                    background: isPlayingPlaylist ? '#f44336' : '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    minWidth: 120,
                  }}
                  onClick={() => {
                    if (isPlayingPlaylist) {
                      stopAudioPlaylist();
                    } else {
                      // Use audio_urls if available (chunks), otherwise fallback to single audio_url
                      const audioUrls =
                        (selected.audio_urls?.length ?? 0) > 0
                          ? selected.audio_urls!
                          : selected.audio_url
                            ? [selected.audio_url]
                            : [];
                      playAudioPlaylist(audioUrls);
                    }
                  }}
                >
                  {isPlayingPlaylist ? '⏹ Stop' : '▶ Play All'}
                </button>

                {/* Audio Info */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 12,
                    color: '#666',
                  }}
                >
                  <span>
                    {(selected.audio_urls?.length ?? 0) > 0
                      ? `${selected.audio_urls?.length ?? 0} chunks`
                      : '1 recording'}
                  </span>
                  {selected.chunk_count && (
                    <span>{selected.chunk_count} recorded chunks</span>
                  )}
                </div>
              </div>

              {/* Playlist Progress */}
              {playlistProgress && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    background: isPlayingPlaylist ? '#e3f2fd' : '#f0f9ff',
                    border: '1px solid #2196f3',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#1565c0',
                  }}
                >
                  {isPlayingPlaylist && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        background: '#2196f3',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    />
                  )}
                  <span>{playlistProgress}</span>
                </div>
              )}

              {/* Hidden Audio Element with Event Handlers */}
              <audio
                ref={audioRef}
                style={{ display: 'none' }}
                onEnded={handleAudioEnded}
                onError={handleAudioError}
                preload='metadata'
              />
            </div>
          )}
        </div>
        {/* --- END ENHANCED AUDIO PLAYER --- */}

        {/* Insights & Transcript */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            background: '#f7f8fa',
            minHeight: 0,
          }}
        >
          {/* Insights */}
          <div
            style={{
              width: 400,
              padding: '32px 32px 0 32px',
              borderRight: '1px solid #e5e7eb',
              background: '#f7f8fa',
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.06)',
                padding: 28,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    background: scoreStyle.bg,
                    color: scoreStyle.color,
                    borderRadius: '50%',
                    width: 54,
                    height: 54,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    marginRight: 18,
                    fontWeight: 700,
                    boxShadow: '0 1px 4px rgba(52,168,83,0.08)',
                  }}
                >
                  {scoreStyle.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, color: '#888' }}>
                    Script adherence and tone:
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#222' }}>
                    {scoreValue}%
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  background: '#e6f4ea',
                  color: '#34a853',
                  borderRadius: 8,
                  padding: '2px 12px',
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 18,
                }}
              >
                {selected.turns && selected.turns[0]?.tone_sentiment
                  ? selected.turns[0].tone_sentiment.charAt(0).toUpperCase() +
                    selected.turns[0].tone_sentiment.slice(1)
                  : 'Friendly'}
              </div>
              <div
                style={{ margin: '18px 0 8px', fontWeight: 600, fontSize: 17 }}
              >
                Conversation Summary
              </div>
              <div
                style={{
                  color: '#333',
                  fontSize: 15,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                }}
              >
                {selected.summary || 'No summary available.'}
              </div>
              {/* Compliance & Engagement Metrics */}
              {engagement && (
                <div style={{ marginTop: 28 }}>
                  <div
                    style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}
                  >
                    Engagement Metrics:
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>Talk Ratio:</span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 4,
                      }}
                    >
                      <div
                        style={{
                          background: '#1976d2',
                          color: '#fff',
                          borderRadius: 6,
                          padding: '2px 10px',
                          fontWeight: 600,
                          fontSize: 13,
                          marginRight: 8,
                        }}
                      >
                        Sales {engagement.talk_ratio_rep_pct}%
                      </div>
                      <div
                        style={{
                          background: '#e0c8f7',
                          color: '#7b2ff2',
                          borderRadius: 6,
                          padding: '2px 10px',
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        Customer {engagement.talk_ratio_cust_pct}%
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>Empathy words:</span>
                    <span
                      style={{
                        background: '#e6f4ea',
                        color: '#34a853',
                        borderRadius: 6,
                        padding: '2px 10px',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {engagement.empathy_word_count} words
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>
                      Average response time:
                    </span>
                    <span
                      style={{
                        background: '#fff7e6',
                        color: '#fbbc05',
                        borderRadius: 6,
                        padding: '2px 10px',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {engagement.avg_response_time_sec} seconds
                    </span>
                    <br />
                    <span
                      style={{
                        borderRadius: 6,
                      }}
                    >
                      upselling attempted:{' '}
                      <span
                        style={{
                          color: engagement.upselling_attempted
                            ? '#34a853'
                            : '#f44336',
                        }}
                      >
                        {engagement.upselling_attempted ? 'Yes' : 'No'}
                      </span>{' '}
                    </span>
                    <br />
                    <span
                      style={{
                        borderRadius: 6,
                      }}
                    >
                      upselling successful:{' '}
                      <span
                        style={{
                          color: engagement.upselling_successful
                            ? '#34a853'
                            : '#f44336',
                        }}
                      >
                        {engagement.upselling_successful ? 'Yes' : 'No'}{' '}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transcript */}
          <div
            style={{
              flex: 1,
              padding: '32px 0 0 0',
              background: '#f7f8fa',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                opacity: 0.5,
                marginLeft: 40,
                marginBottom: 18,
              }}
            >
              TRANSCRIPT
            </div>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              {messages.length === 0 && (
                <p style={{ color: '#888', marginLeft: 40 }}>
                  No transcript available.
                </p>
              )}
              {messages.map(({ id, text, speaker }) => {
                const { label, bg, color } = getSpeakerProps(speaker || '');
                return (
                  <div
                    key={id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: 22,
                      marginLeft: 40,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: bg,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 22,
                        marginRight: 18,
                        flexShrink: 0,
                        border: '2px solid #fff',
                        boxShadow: '0 1px 4px rgba(25, 118, 210, 0.08)',
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: '14px 20px',
                        fontSize: 16,
                        color: '#222',
                        boxShadow: '0 1px 4px rgba(25, 118, 210, 0.06)',
                        minWidth: 120,
                      }}
                    >
                      <span style={{ fontWeight: 700, color }}>
                        {speaker || (label === 'C' ? 'Customer' : 'Sales Rep')}:
                      </span>{' '}
                      {text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default witAuth(App, { permissons: [], role: Role.ADMIN });

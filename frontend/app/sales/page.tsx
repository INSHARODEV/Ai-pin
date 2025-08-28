'use client';
// note fro alll refactor page into its onwn componenet
import { Shift } from '../types';
import { StatCard } from '../_componentes/ui/StatCard';
import { Card } from '../_componentes/ui/Card';
import { Button } from '../_componentes/ui/Button';
import { ShiftsTable } from '../_componentes/ShiftsTable';
import { useRef, useState,useEffect } from 'react';
import { MakeApiCall, Methods } from '../actions';
import { PaginatedData } from '../../../backend/dist/common/types/paginateData.type';
import { getChunckedDatat } from '../utils/checuked';
 
export default function Page() {
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [onShfit, setOnShfit] = useState(false);
  const [Recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [Shifts,setShifts]=useState<Shift[]>([])
  const [currentPage,setCurrentPage]=useState(1)
  const [numberOfPages,setNumberOfPages]=useState(1)
  const [rating,setRating]=useState<number>(0)
  const [firstGroup,setFirstGroup]=useState<Shift[]>()
  const [secondGroup,setSeconedGroup]=useState<Shift[]>()
  useEffect(()=>{
    async function getShfits(){
      const  {numberOfPages,page, data }= await MakeApiCall({url:'/trasncriptions',method:Methods.GET,queryString:'limit=14' },) as PaginatedData
      console.log(data)
      setShifts(data as Shift[])
      setNumberOfPages(numberOfPages)
      setCurrentPage(page)
      setRating( Shifts.length>=7?(Shifts.slice(0,6).map(shift=>shift.performance).reduce((a,b)=>a+b))/7:Shifts.slice(0,Shifts.length).map(shift=>shift.performance).reduce((a,b)=>a+b)/Shifts.length)
      const [firstGroup, secondGroup] = getChunckedDatat(Shifts, 7) as  Shift[][]
      setFirstGroup(firstGroup)
      setSeconedGroup(secondGroup)
    }
  
    getShfits()
  },[])

  // Function to send audio data to the server
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
        url: `/trasncriptions/${shiftId}`,
        method: Methods.POST,
        body: formData
      });
      
      console.log('Audio sent successfully:', res);
      
      // Clear chunks after successful send
      chunks.current = [];
      
    } catch (error) {
      console.error('Failed to send audio:', error);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser or context');
      }

      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      console.log('Microphone permission granted, stream obtained:', stream);
      return stream;
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow microphone access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
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
        mimeType: 'audio/webm;codecs=opus'
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
          url: '/trasncriptions/shift',
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
          if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
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
        
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
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
  
   

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='px-6 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Welcome Name!
          </h1>
          <p className='text-gray-600'>12th Aug 2025, 12:45 PM</p>
        </div>
        <section className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
          <StatCard
            title='Rating'
            value= {rating}
            trendDirection={rating>2.5?'up':'down'}
            description='For the last 7 shifts'
          color={rating>2.5?'green':'red'}
          />
          
          
          <StatCard
            title='Skill Improvement'
            value={firstGroup&&firstGroup.map(shift=>shift.performance).reduce((a,b)=>a+b)||0 - (secondGroup&&secondGroup.map(shift=>shift.performance).reduce((a,b)=>a+b)||0)}
            trendDirection='down'
            description='Change in performance'
            color='red'
          />
          <Card className='p-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Shift Management
              </h3>
              <p className='text-gray-600'>Ready to begin ?</p>
              
              {/* Error display */}
              {error && (
                <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm'>
                  {error}
                </div>
              )}
              
              {/* Recording indicator */}
              {Recording && (
                <div className='flex items-center space-x-2 text-green-600'>
                  <div className='w-2 h-2 bg-green-600 rounded-full animate-pulse'></div>
                  <span className='text-sm'>Recording...</span>
                </div>
              )}
              
              <Button 
                onClick={startShfit}
                disabled={isProcessing}
                variant='ghost'
                className={`w-full ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : onShfit 
                      ? 'bg-[#EF4444]' 
                      : 'bg-[#0D70C8]'
                }`}
              >
                {isProcessing 
                  ? 'Processing...' 
                  : onShfit 
                    ? 'End Shift' 
                    : 'Start Shift'
                }
              </Button>
            </div>
          </Card>
        </section>

        <ShiftsTable shifts={Shifts} />
      </main>
    </div>
  );
}
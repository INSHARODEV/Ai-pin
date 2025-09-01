// components/ShiftManagementCard.tsx

'use client';

import { useState, useEffect } from 'react';
import { MdSquare } from 'react-icons/md';

export function ShiftManagementCard() {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isShiftActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isShiftActive, startTime]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''}, ${minutes} min${minutes !== 1 ? 's' : ''} and ${seconds} sec${seconds !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      return `${minutes} min${minutes !== 1 ? 's' : ''} and ${seconds} sec${seconds !== 1 ? 's' : ''}`;
    }
    return `${seconds} sec${seconds !== 1 ? 's' : ''}`;
  };
  const handleShiftToggle = () => {
    if (!isShiftActive) {
      // Starting shift
      setStartTime(new Date());
      setElapsedTime(0);
      setIsShiftActive(true);
    } else {
      // Ending shift
      setIsShiftActive(false);
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  return (
    <div className='flex flex-col justify-between gap-7 p-6 bg-white rounded-2xl shadow-md flex-1'>
      <h3 className='text-lg font-medium text-gray-900'>Shift Management</h3>
      <div className='flex justify-between gap-4'>
        <p className='text-gray-400 text-sm flex items-center'>
          {isShiftActive ? `${formatTime(elapsedTime)} ` : 'Ready to begin?'}
        </p>
        <button
          className={`flex  justify-center items-center  gap-1 w-[50%] text-white py-2 rounded-xl ${isShiftActive ? 'bg-red-500' : 'bg-[#0D70C8]'}`}
          onClick={handleShiftToggle}
        >
          {isShiftActive ? 'End Shift' : 'Start Shift'}
          {isShiftActive ? <MdSquare /> : ''}
        </button>
      </div>
    </div>
  );
}

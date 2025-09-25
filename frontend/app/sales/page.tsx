'use client';

import * as React from 'react';
// note fro alll refactor page into its onwn componenet
import { ShiftsTable } from '../_componentes/ShiftsTable';
import { useState, useEffect, useMemo } from 'react';
import { useShifts } from '../hooks/useShifts';
import { Recorder } from '../_componentes/Recorder';
import { StatCard } from '../_componentes/reusable/StatCard';

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [Recording, setRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const query = useMemo(
    () => (user ? { branchId: user.branchId } : {}),
    [user?.branchId]
  );
   
  const { rating, shifts, performanceDelta } = useShifts(query);

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
  };

  useEffect(() => {
    if (!Recording) {
      setElapsedTime(0);
      return;
    }
    const id = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [Recording]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

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
            value={rating}
            description='For the last 7 shifts'
            variant={rating > 2.5 ? 'green' : 'red'}
          />

          <StatCard
            title='Skill Improvement'
            value={performanceDelta}
            icon=''
            description='Change in performance'
            variant={
              performanceDelta > 0
                ? 'green'
                : performanceDelta === 0
                  ? 'orange'
                  : 'red'
            }
          />
          <div className='bg-amber-[#FEFEFE] p-6 rounded-2xl shadow-md text-white flex flex-col justify-between'>
            <h3 className='text-lg font-medium text-gray-900'>
              Shift Management
            </h3>
            <div className='flex items-center justify-center mt-4'>
              {Recording ? (
                <div className='flex items-center text-[#AEAEAE] min-w-40 gap-2'>
                  <div className='w-2 h-2 rounded-full animate-pulse'></div>
                  <span className='text-sm tabular-nums'>
                    {formatTime(elapsedTime)}
                  </span>
                </div>
              ) : (
                <p className='text-gray-600 min-w-40'>Ready to begin ?</p>
              )}
              <Recorder setRecording={setRecording} />
            </div>
          </div>
        </section>

        <ShiftsTable shifts={shifts} />
      </main>
    </div>
  );
}

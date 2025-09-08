'use client';

import * as React from 'react';
import { ShiftManagementCard } from '../_componentes/ShiftManagementCard';
// note fro alll refactor page into its onwn componenet
import { Shift } from '../types';
import { ShiftsTable } from '../_componentes/ShiftsTable';
import { useRef, useState, useEffect, useMemo } from 'react';
import { MakeApiCall, Methods } from '../actions';
// import { PaginatedData } from '../../../backend/dist/common/types/paginateData.type';
import { getChunckedDatat } from '../utils/checuked';
import { StatCard } from '../_componentes/reusable/StatCard';
import { useShifts } from '../hooks/useShifts';
import { Empoylee, User } from '../../../backend/src/modules/users/schmas/users.schema';
import { Recorder } from '../_componentes/Recorder';

export default function Page() {


  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const query = useMemo(
    () => (user ? { branchId: user.branchId } : {}),
    [user?.branchId]
  );

  const{currentPageNumber,numberOfPages,rating,shifts, performanceDelta}=useShifts(query)

  

  const [Recording, setRecording] = useState(false);


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
            // trendDirection={rating > 2.5 ? 'up' : 'down'}
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
                ? "green" 
                : performanceDelta === 0 
                  ? "orange" 
                  : "red"
            }
          />
          <div className='p-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Shift Management
              </h3>
              <p className='text-gray-600'>Ready to begin ?</p>

              {error && (
                <div className='p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm'>
                  {error}
                </div>
              )}

              {Recording && (
                <div className='flex items-center space-x-2 text-green-600'>
                  <div className='w-2 h-2 bg-green-600 rounded-full animate-pulse'></div>
                  <span className='text-sm'>Recording...</span>
                </div>
              )}

       <Recorder setRecording={setRecording}/>
            </div>
          </div>
        </section>

        <ShiftsTable shifts={shifts} />
      </main>
    </div>
  );
}

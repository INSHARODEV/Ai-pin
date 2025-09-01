import * as React from 'react';
import { Shift } from '../../types';
import { ShiftsTable } from '../../_componentes/ShiftsTable';
import { ShiftManagementCard } from '../../_componentes/ShiftManagementCard';
import { StatCard } from '@/app/_componentes/reusable/StatCard';

export default function Page() {
  const shifts: Shift[] = [
    {
      date: '12th Aug, 2025',
      startTime: '9:01 AM',
      endTime: '5:12 PM',
      duration: '8 hrs, 45 mins',
      performance: 'Friendly',
    },
    {
      date: '12th Aug, 2025',
      startTime: '9:01 AM',
      endTime: '5:12 PM',
      duration: '8 hrs, 45 mins',
      performance: 'Confused',
    },
    {
      date: '12th Aug, 2025',
      startTime: '9:01 AM',
      endTime: '5:12 PM',
      duration: '8 hrs, 45 mins',
      performance: 'Neutral',
    },
    {
      date: '12th Aug, 2025',
      startTime: '9:01 AM',
      endTime: '5:12 PM',
      duration: '8 hrs, 45 mins',
      performance: 'Frustrated',
    },
    {
      date: '12th Aug, 2025',
      startTime: '9:01 AM',
      endTime: '5:12 PM',
      duration: '8 hrs, 45 mins',
      performance: 'Aggressive',
    },
    {
      date: '12th Aug, 2025',
      startTime: '9:01 AM',
      endTime: '5:12 PM',
      duration: '8 hrs, 45 mins',
      performance: 'Friendly',
    },
    {
      date: '12th Aug, 2025',
      startTime: '9:01 AM',
      endTime: '5:12 PM',
      duration: '8 hrs, 45 mins',
      performance: 'Aggressive',
    },
  ];

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
            value='4.2'
            description='For the last 7 shifts'
            variant='green'
          />
          <StatCard
            title='Skill Improvement'
            value='-6%'
            description='Change in performance'
            variant='red'
          />
          <StatCard
            title='Skill Improvement'
            value='-6%'
            description='Change in performance'
            variant='blue'
            icon={undefined}
          />
        </section>

        <ShiftsTable shifts={shifts} />
      </main>
    </div>
  );
}

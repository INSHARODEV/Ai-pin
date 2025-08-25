'use client';

import * as React from 'react';
import { Shift } from '../types';
import { StatCard } from '../_componentes/ui/StatCard';
import { Card } from '../_componentes/ui/Card';
import { Button } from '../_componentes/ui/Button';
import { ShiftsTable } from '../_componentes/ShiftsTable';

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
            trendDirection='up'
            description='For the last 7 shifts'
            color='green'
          />
          <StatCard
            title='Skill Improvement'
            value='-6%'
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
              <Button className='w-full'>Start Shift</Button>
            </div>
          </Card>
        </section>

        <ShiftsTable shifts={shifts} />
      </main>
    </div>
  );
}

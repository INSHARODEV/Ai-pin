// app/branch/page.tsx
'use client';

import { StatCard } from '@/app/_componentes/reusable/StatCard';
import BranchTable from '../_componentes/BranchTable';
import { useShiftsContext } from './layout';
import EmptyState from '../_componentes/EmptyState';

export default function Page() {
  const {
    shifts,
    rating,
    performanceDelta,
    emps,
    isLoading,
    error,
    userLoaded,
  } = useShiftsContext();

  const isUserLoading = !userLoaded;
  const isDataLoading = isLoading || isUserLoading;

  if (isDataLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <main className='px-6 py-8'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 w-64 rounded bg-gray-200' />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='h-24 rounded bg-gray-200' />
              <div className='h-24 rounded bg-gray-200' />
              <div className='h-24 rounded bg-gray-200' />
            </div>
            <div className='h-64 rounded bg-gray-200' />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <main className='px-6 py-8'>
          <div className='rounded-xl border border-red-200 bg-red-50 p-6 text-red-700'>
            <p className='font-semibold'>Failed to load data</p>
            <p className='text-sm'>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const hasData = Array.isArray(shifts) && shifts.length > 0;

  // Decide the message:
  const emptyMessage =
    emps === 0 ? (
      <EmptyState
        image='/file-not-found.svg' // put your uploaded PNG in /public/images/
        title='Nothing Found!'
        message='No employees added yet! Add your employees and start tracking.'
        ctaLabel='Add employee'
        // ctaHref='/employees/new'
        ctaHref='#'
      />
    ) : (
      <EmptyState
        image='/file-not-found.svg'
        title='Nothing Found!'
        message='Let your employees start working to see the analysis here!'
      />
    );
  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='px-6 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>Welcome!</h1>
          <p className='text-gray-600'>Analytics overview</p>
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
            variant={
              performanceDelta > 0
                ? 'green'
                : performanceDelta === 0
                  ? 'orange'
                  : 'red'
            }
            description='Change in performance'
          />
          <StatCard
            title='Employees'
            value={emps}
            description='Unique employees with shifts'
            variant='blue'
          />
        </section>

        {/* Always render table headers; show rows or inline empty state */}
        <BranchTable
          shifts={hasData ? shifts : []}
          emptyMessage={emptyMessage}
        />
      </main>
    </div>
  );
}

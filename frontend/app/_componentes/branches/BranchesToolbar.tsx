'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

type PerfLabel = 'High' | 'Average' | 'Critical';
const PERF_OPTIONS: PerfLabel[] = ['High', 'Average', 'Critical'];

export default function BranchesToolbar({
  onChange,
}: {
  onChange?: (state: {
    sortDir: 'newest' | 'oldest';
    performance: PerfLabel | 'All';
  }) => void;
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [perfOpen, setPerfOpen] = useState(false);

  const [sortDir, setSortDir] = useState<'newest' | 'oldest'>('newest');
  const [performance, setPerformance] = useState<PerfLabel | 'All'>('All');

  const emit = () => onChange?.({ sortDir, performance });

  const toggle = (which: 'sort' | 'perf') => {
    setSortOpen(which === 'sort' ? v => !v : false);
    setPerfOpen(which === 'perf' ? v => !v : false);
  };

  return (
    <div className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
      <div className='flex items-stretch divide-x divide-gray-200'>
        {/* Sort by: Last Active */}
        <div className='relative flex-1'>
          <button
            type='button'
            onClick={() => toggle('sort')}
            className='flex w-full items-center gap-3 px-4 py-3'
          >
            {sortOpen ? (
              <ChevronUp className='h-5 w-5 text-gray-500' />
            ) : (
              <ChevronDown className='h-5 w-5 text-gray-500' />
            )}
            <span className='text-gray-700'>
              Sort by:{' '}
              <span className='font-medium'>Last active (Newest first)</span>
            </span>
          </button>

          {sortOpen && (
            <div className='absolute z-20 ml-10 mt-1 w-80 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg'>
              <button
                className={`block w-full rounded-xl px-4 py-3 text-left ${
                  sortDir === 'newest'
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSortDir('newest');
                  setSortOpen(false);
                  emit();
                }}
              >
                Last active (Newest first)
              </button>
              <button
                className={`mt-1 block w-full rounded-xl px-4 py-3 text-left ${
                  sortDir === 'oldest'
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSortDir('oldest');
                  setSortOpen(false);
                  emit();
                }}
              >
                Last active (Oldest first)
              </button>
            </div>
          )}
        </div>

        {/* Filter by: Performance */}
        <div className='relative flex-1'>
          <button
            type='button'
            onClick={() => toggle('perf')}
            className='flex w-full items-center gap-3 px-4 py-3'
          >
            <Filter className='h-5 w-5 text-gray-500' />
            <span className='text-gray-700'>
              Filter by: <span className='font-medium'>Performance</span>
            </span>
            {perfOpen ? (
              <ChevronUp className='ml-auto h-5 w-5 text-gray-500' />
            ) : (
              <ChevronDown className='ml-auto h-5 w-5 text-gray-500' />
            )}
          </button>

          {perfOpen && (
            <div className='absolute z-20 ml-10 mt-1 w-72 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg'>
              <button
                className={`block w-full rounded-xl px-4 py-3 text-left ${
                  performance === 'All'
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setPerformance('All');
                  setPerfOpen(false);
                  emit();
                }}
              >
                All
              </button>
              {PERF_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`mt-1 block w-full rounded-xl px-4 py-3 text-left ${
                    performance === opt
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setPerformance(opt);
                    setPerfOpen(false);
                    emit();
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

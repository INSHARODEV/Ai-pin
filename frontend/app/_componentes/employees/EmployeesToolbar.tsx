'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Filter, Search, Plus } from 'lucide-react';
import { useShiftsContext } from '@/app/branch/layout';

type PerfLabel = 'High' | 'Average' | 'Critical';
const PERF_OPTIONS: PerfLabel[] = ['High', 'Average', 'Critical'];

export default function EmployeesToolbar({
  onChange,
  branchesProp,
}: {
  // optional callback to bubble up selections (if you need to drive a table)
  onChange?: (state: {
    sortDir: 'newest' | 'oldest';
    performance: PerfLabel | 'All';
    branch: string | 'All';
    query: string;
  }) => void;
  // optional branch list; if omitted, we’ll try building it from context.emps
  branchesProp?: string[];
}) {
  const { user, emps } = useShiftsContext();
  const role = user?.role as
    | 'MANAGER'
    | 'ADMIN'
    | 'SUPERVISOR'
    | 'SELLER'
    | undefined;

  // Build branch list (if not provided)
  const branches = useMemo(() => {
    if (branchesProp?.length) return branchesProp;
    const raw = Array.isArray(emps)
      ? emps
      : Array.isArray(emps?.data)
        ? emps.data
        : Array.isArray(emps?.items)
          ? emps.items
          : [];
    const set = new Set<string>();
    raw.forEach((e: any) => {
      const name = e?.branchName || e?.branch;
      if (name) set.add(String(name));
    });
    return Array.from(set);
  }, [branchesProp, emps]);

  // State
  const [sortOpen, setSortOpen] = useState(false);
  const [perfOpen, setPerfOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  const [sortDir, setSortDir] = useState<'newest' | 'oldest'>('newest');
  const [performance, setPerformance] = useState<PerfLabel | 'All'>('All');
  const [branch, setBranch] = useState<string | 'All'>('All');
  const [query, setQuery] = useState('');

  // bubble changes if needed
  const emit = () =>
    onChange?.({
      sortDir,
      performance,
      branch,
      query,
    });

  // Close other menus when one opens
  const toggle = (which: 'sort' | 'perf' | 'branch') => {
    setSortOpen(which === 'sort' ? v => !v : false);
    setPerfOpen(which === 'perf' ? v => !v : false);
    setBranchOpen(which === 'branch' ? v => !v : false);
  };

  const showBranchFilter = role === 'MANAGER' || role === 'ADMIN';

  return (
    <div className=''>
      {/* Title + Add button */}

      {/* Toolbar */}
      <div className='mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm'>
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
                Sort by: <span className='font-medium'>Last Active</span>
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

          {/* Filter by: Branch (Managers/Admins only) */}
          {showBranchFilter && (
            <div className='relative flex-1'>
              <button
                type='button'
                onClick={() => toggle('branch')}
                className='flex w-full items-center gap-3 px-4 py-3'
              >
                <Filter className='h-5 w-5 text-gray-500' />
                <span className='text-gray-700'>
                  Filter by: <span className='font-medium'>Branch</span>
                </span>
                {branchOpen ? (
                  <ChevronUp className='ml-auto h-5 w-5 text-gray-500' />
                ) : (
                  <ChevronDown className='ml-auto h-5 w-5 text-gray-500' />
                )}
              </button>

              {branchOpen && (
                <div className='absolute z-20 ml-10 mt-1 w-[28rem] max-w-[90vw] rounded-2xl border border-gray-200 bg-white p-2 shadow-lg'>
                  <button
                    className={`block w-full rounded-xl px-4 py-3 text-left ${
                      branch === 'All'
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setBranch('All');
                      setBranchOpen(false);
                      emit();
                    }}
                  >
                    All branches
                  </button>
                  {branches.map(b => (
                    <button
                      key={b}
                      className={`mt-1 block w-full rounded-xl px-4 py-3 text-left ${
                        branch === b
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setBranch(b);
                        setBranchOpen(false);
                        emit();
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search */}
          {/* <div className='flex items-center gap-2 px-4 py-3'>
            <div className='relative w-56 sm:w-64'>
              <input
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  emit();
                }}
                placeholder='Search'
                className='w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

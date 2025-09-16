// app/admin/page.tsx
'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import SortBy, {
  labelFor,
  SortDir,
  SortKey,
  SortValue,
} from '../_componentes/SortBy';
import { CompaniesTable } from '../_componentes/CompaniesTable';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 7;

export type Company = {
  id: string;
  name: string;
  dateJoined: Date;
  manager: string;
  branches: number;
  sales: number;
};

const MOCK: Company[] = Array.from({ length: 19 }).map((_, i) => ({
  id: String(i + 1),
  name: 'Company Name',
  dateJoined: new Date(2025, 7, 12),
  manager: 'Manager Name',
  branches: 5,
  sales: 25,
}));

export default function CompaniesPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();

  // NOTE: matches the dropdown defaults (Date Joined - Newest first)
  const [sort, setSort] = useState<SortValue>({
    key: 'dateJoined',
    dir: 'desc',
  });

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? MOCK.filter(c => c.name.toLowerCase().includes(q))
      : MOCK;

    const sorted = [...filtered].sort((a, b) => {
      if (sort.key === 'dateJoined') {
        const d = a.dateJoined.getTime() - b.dateJoined.getTime();
        return sort.dir === 'asc' ? d : -d;
      }
      if (sort.key === 'branches') {
        const d = a.branches - b.branches;
        return sort.dir === 'asc' ? d : -d;
      }
      return 0;
    });

    return sorted;
  }, [query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const current = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page]);

  // Keep page in range when filtering/sorting
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className='min-h-screen bg-gray-50 px-12 '>
      <header className='pt-10'>
        <h1 className='text-3xl font-bold text-gray-900'>Welcome Admin!</h1>
        <p className='text-gray-500'>12th Aug 2025, 12:45</p>
      </header>

      <main className='py-6 mx-auto flex flex-col gap-6'>
        <div className='flex items-center gap-3'>
          <h2 className='mb-3 text-lg font-semibold text-gray-900'>
            Companies
          </h2>
          {/* Add company */}
          <button
            type='button'
            className='ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D70C8] px-6 py-2 text-sm font-semibold text-white shadow-sm'
            onClick={() => router.push('/forms/company-form')}
          >
            Add company <span className='text-xl leading-none'>＋</span>
          </button>
        </div>
        {/* Controls */}
        <div className='w-full flex gap-3'>
          <SortBy
            value={sort}
            onChange={(key: SortKey, dir: SortDir) => {
              setSort({ key, dir });
              setPage(1);
            }}
          />

          {/* Search */}
          <div className='flex items-center gap-2 rounded-xl px-4 py-2 bg-[#FEFEFE] shadow-custom'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 text-gray-400'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M10 4a6 6 0 104.472 10.028l4.25 4.25 1.415-1.414-4.25-4.25A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z' />
            </svg>
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder='Search by company'
              className='w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none'
            />
            <button
              type='button'
              className='grid h-8 w-8 px-2 place-items-center rounded-full bg-[#0D70C8] text-white'
              aria-label='Search'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M10 4a6 6 0 104.472 10.028l4.25 4.25 1.415-1.414-4.25-4.25A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z' />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-hidden rounded-lg'>
          <CompaniesTable rows={current} />
        </div>

        {/* Pagination */}
        <div className='relative mt-6 border-t border-blue-200/60 pt-6'>
          <div className='flex items-center justify-center gap-3'>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const isActive = n === page;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`grid h-8 w-8 place-items-center rounded-full text-sm font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                      : 'text-gray-600 hover:text-blue-700'
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className='grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:text-blue-700'
              aria-label='Next page'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z' />
              </svg>
            </button>
          </div>

          <p className='mt-3 text-center text-xs text-gray-500'>
            Sorted by{' '}
            <span className='font-medium text-gray-700'>{labelFor(sort)}</span>
          </p>
        </div>
      </main>
    </div>
  );
}

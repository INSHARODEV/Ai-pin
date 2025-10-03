// app/admin/companies/[companyId]/branches/page.tsx
'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SortBy, {
  labelFor,
  SortOption,
  SortValue,
} from '@/app/_componentes/SortBy';
import {
  AdminBranchesTable,
  type BranchRow,
} from '@/app/_componentes/AdminBranchesTable';
import AddBranchModal, {
  AddBranchPayload,
} from '@/app/_componentes/branches/AddBranchModal';
import BranchAddedSuccessModal from '@/app/_componentes/branches/BranchAddedSuccessModal';
import { MakeApiCall, Methods } from '@/app/actions';
import { Role } from '../../../../../../../shard/src';
const PAGE_SIZE = 7;

const COMPANY_SORT: SortOption[] = [
  { key: 'dateJoined', dir: 'desc', label: 'Date Joined (Newest first)' },
  { key: 'dateJoined', dir: 'asc', label: 'Date Joined (Oldest first)' },
  { key: 'branches', dir: 'desc', label: 'Branch count (High to low)' },
  { key: 'branches', dir: 'asc', label: 'Branch count (Low to high)' },
];

export default function CompanyBranchesPage() {
  const { companyId } = useParams<{ companyId: string }>();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<BranchRow[]>([]);
  const fmt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    async function getBranch() {
      const res = await MakeApiCall({
        method: Methods.GET,
        url: `/branch/${companyId}`,
      });

      // branch list is inside res.data.data

      console.log('res', res);
      setRows(res?.data ?? []);
      setPage(res?.numberOfPages); // <-- use res.data.page
    }

    getBranch();
  }, []);

  const [sort, setSort] = useState<SortValue>({
    key: 'dateJoined',
    dir: 'desc',
  });

  // Seed data

  const [showAdd, setShowAdd] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? rows.filter(b => b.name.toLowerCase().includes(q))
      : rows;

    const sorted = [...filtered].sort((a, b) => {
      // Using SortBy component keys; map 'dateJoined' -> dateCreated
      // if (sort.key === 'dateJoined') {
      //   const d = a.dateCreated.getTime() - b.dateCreated.getTime();
      //   return sort.dir === 'asc' ? d : -d;
      // }
      // Their second key is 'branches'—we'll map it to sales count here
      if (sort.key === 'branches') {
        const d = a.sales - b.sales;
        return sort.dir === 'asc' ? d : -d;
      }
      return 0;
    });

    return sorted;
  }, [rows, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  // console.log('filteredSorted', filteredSorted);
  const current = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const handleSubmit = async (data: any) => {
    console.log('ddd', data);

    const submittedData = {
      name: data.name,
      Superviosr: {
        firstName: data.name,
        email: data.email?.toLowerCase(),
        role: 'Superviosr',
      },
    };
    console.log(submittedData);
    const res = await MakeApiCall({
      method: Methods.POST,
      url: `/branch/${companyId}`,
      body: JSON.stringify(submittedData),
      headers: 'json',
    });
    const { members } = data;
    let body = members.map((mem: any) => {
      return {
        firstName: mem.name,
        email: mem.email,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$vY0JEqNe0/leVDsj38qQmg$64uOvXZa8/JqhZOajVXkMvpDGXe11y0lPG20oor7D0I',
        role: Role.SELLER,
        branchId: res._id,
        jobTitle: 'Employee',
      };
    });
    console.log('body', body);
    await MakeApiCall({
      method: Methods.POST,
      url: `/auth`,
      body: JSON.stringify(body),
      headers: 'json',
    });

    // setStep(step + 1); // if you want to move wizard forward
    setShowSuccess(true);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='mx-auto flex flex-col gap-6'>
        <div className='flex items-center gap-3'>
          <h2 className='text-lg font-semibold text-gray-900'>Branches</h2>

          {/* Add branch (opens modal) */}
          <button
            type='button'
            className='ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D70C8] px-6 py-2 text-sm font-semibold text-white shadow-custom'
            onClick={() => setShowAdd(true)}
          >
            Add branch <span className='text-xl leading-none'>＋</span>
          </button>
        </div>

        {/* Controls */}
        <div className='flex w-full gap-3'>
          <SortBy
            value={sort}
            options={COMPANY_SORT}
            onChange={(key, dir) => setSort({ key, dir })}
          />

          {/* Search */}
          <div className='flex items-center gap-2 rounded-xl bg-[#FEFEFE] px-4 py-2 shadow-custom'>
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
              placeholder='Search by branch'
              className='w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none'
            />
            <button
              type='button'
              className='grid h-8 w-8 place-items-center rounded-full bg-[#0D70C8] px-2 text-white'
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
          <AdminBranchesTable rows={current} companyId={companyId} />
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

      {/* Modals */}
      <AddBranchModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={async payload => {
          await handleSubmit(payload);
          setShowAdd(false);
        }}
      />

      <BranchAddedSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        onAddAnother={() => setShowAdd(true)}
      />
    </div>
  );
}

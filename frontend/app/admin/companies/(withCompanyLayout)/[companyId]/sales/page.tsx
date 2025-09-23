'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SortBy, {
  labelFor,
  SortDir,
  SortKey,
  SortOption,
  SortValue,
} from '@/app/_componentes/SortBy';
import { SalesTable, type SalesRow } from '@/app/_componentes/SalesTable';
import BranchFilter from '@/app/_componentes/sales/BranchFilter';
import AddMemberModal from '@/app/_componentes/sales/AddMemberModal';
import MemberAddedSuccessModal from '@/app/_componentes/sales/MemberAddedSuccessModal';
import EditEmployeeModal from '@/app/_componentes/sales/EditEmployeeModal';
import {
  EmployeeDeleteConfirm,
  EmployeeDeleteSuccess,
} from '@/app/_componentes/sales/EmployeeDeleteModals';
import { MakeApiCall, Methods } from '@/app/actions';
import { Branch } from '../../../../../../../shard/src';
import { data } from '../../../../../utils/staticData';

const PAGE_SIZE = 7;

const SALES_SORT: SortOption[] = [
  { key: 'dateJoined', dir: 'desc', label: 'Date Joined (Newest first)' },
  { key: 'dateJoined', dir: 'asc', label: 'Date Joined (Oldest first)' },
];

export default function CompanySalesPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const router = useRouter();
  const [brach,setBranch]=useState<Branch[]>([])

  // seed rows
  const [rows, setRows] = useState<SalesRow[]>(
    Array.from({ length: 19 }).map((_, i) => ({
      id: String(i + 1),
      name: 'Sales Name',
      dateJoined: new Date(2025, 7, 12),
      branch: ['Branch A', 'Branch B', 'Branch C'][i % 3],
      email: 'sales@company.com',
    }))
  );
  const transformSalesData = (data: any[]): SalesRow[] => {
    const result: SalesRow[] = [];
  
    data.forEach(branch => {
      if (branch.salesData && branch.salesData.length > 0) {
        branch.salesData.forEach((sale: any) => {
          result.push({
            id: branch.id,              // branch id
            name: sale.name,            // employee name
            dateJoined: sale.dateJoined,
            branch: branch.name,        // branch name
            email: sale.email ?? ""
          });
        });
      }
    });
  
    return result;
  };
  useEffect(() => {
    async function getCompanies() {
     
      const branchs = await MakeApiCall({
        method: Methods.GET,
        url: `/branch/${companyId}`,
      });
    console.log(branchs.data)

        setRows( transformSalesData( branchs.data) )
    
    }

    getCompanies();
  }, [ ]);

  const allBranches = useMemo(
    () => Array.from(new Set(rows.map(r => r.branch))),
    [rows]
  );

  // controls
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('All Branches');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortValue>({
    key: 'dateJoined',
    dir: 'desc',
  });

  // modals state
  const [addOpen, setAddOpen] = useState(false);
  const [addSuccessOpen, setAddSuccessOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SalesRow | null>(null);
  const [delOpen, setDelOpen] = useState(false);
  const [delSuccessOpen, setDelSuccessOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<SalesRow | null>(null);

  // filtered + sorted
  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = rows;

    if (branchFilter !== 'All Branches') {
      filtered = filtered.filter(r => r.branch === branchFilter);
    }
    if (q) {
      filtered = filtered.filter(
        r =>
          r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      // if (sort.key === 'dateJoined') {
      //   const d = a.dateJoined.getTime() - b.dateJoined.getTime();
      //   return sort.dir === 'asc' ? d : -d;
      // }
      // keep a fallback — not used here
      return 0;
    });

    return sorted;
  }, [rows, branchFilter, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const current = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // handlers
  async function handleAdd(data: {
    branch: string;
    name: string;
    email: string;
  }) {
    setRows(prev => [
      {
        id: String(prev.length + 1),
        name: data.name,
        dateJoined: new Date(),
        branch: data.branch,
        email: data.email,
      },
      ...prev,
    ]);
    setAddSuccessOpen(true);
  }

  async function handleUpdate(data: {
    branch: string;
    name: string;
    email: string;
  }) {
    if (!editTarget) return;
    setRows(prev =>
      prev.map(r => (r.id === editTarget.id ? { ...r, ...data } : r))
    );
    setEditOpen(false);
    // You can reuse your global "UpdateSuccessModal" if you prefer
  }

  async function handleDelete() {
    if (!delTarget) return;
    setRows(prev => prev.filter(r => r.id !== delTarget.id));
    setDelOpen(false);
    setDelSuccessOpen(true);
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='mx-auto flex flex-col gap-6'>
        <div className='flex items-center gap-3'>
          <h2 className='mb-3 text-lg font-semibold text-gray-900'>Sales</h2>

          <button
            type='button'
            className='ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D70C8] px-6 py-2 text-sm font-semibold text-white shadow-custom'
            onClick={() => setAddOpen(true)}
          >
            Add member <span className='text-xl leading-none'>＋</span>
          </button>
        </div>

        {/* Controls */}
        <div className='flex gap-3'>
          <div className='w-1/3'>
            <SortBy
              value={sort}
              options={SALES_SORT}
              title='Sort by:'
              onChange={(key, dir) => setSort({ key, dir })}
            />
          </div>

          <div className='w-1/3'>
            <BranchFilter
              branches={allBranches}
              value={branchFilter}
              onChange={v => {
                setBranchFilter(v);
                setPage(1);
              }}
            />
          </div>

          {/* Search */}
          <div className='flex items-center gap-2 rounded-xl bg-[#FEFEFE] px-4 py-2 shadow-custom sm:ml-auto w-1/3'>
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
              placeholder='Search by name or email'
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
          <SalesTable
            rows={current}
            onEdit={row => {
              setEditTarget(row);
              setEditOpen(true);
            }}
            onDelete={row => {
              setDelTarget(row);
              setDelOpen(true);
            }}
          />
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
      <AddMemberModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        branches={allBranches.length ? allBranches : ['Branch A']}
        onSubmit={async data => {
          await handleAdd(data);
          setAddOpen(false);
        }}
      />
      <MemberAddedSuccessModal
        open={addSuccessOpen}
        onClose={() => setAddSuccessOpen(false)}
        onAddAnother={() => setAddOpen(true)}
      />

      <EditEmployeeModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        branches={allBranches.length ? allBranches : ['Branch A']}
        initial={
          editTarget
            ? {
                branch: editTarget.branch,
                name: editTarget.name,
                email: editTarget.email,
              }
            : null
        }
        onUpdate={handleUpdate}
      />

      <EmployeeDeleteConfirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        employeeName={delTarget?.name ?? 'this member'}
        onConfirm={handleDelete}
      />
      <EmployeeDeleteSuccess
        open={delSuccessOpen}
        onClose={() => setDelSuccessOpen(false)}
        onBack={() => router.push(`/admin/companies/${companyId}`)}
      />
    </div>
  );
}

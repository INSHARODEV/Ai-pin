// app/admin/companies/[companyId]/branches/[branchId]/page.tsx
'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import KebabMenu from '@/components/ui/KebabMenu';
import SortBy, {
  type SortOption,
  type SortValue,
} from '@/app/_componentes/SortBy';
import { SalesTable, type SalesRow } from '@/app/_componentes/SalesTable';

import Modal from '@/components/ui/Modal';
import { Mail, Pencil, Trash2 } from 'lucide-react';
import AddMemberModal from '@/app/_componentes/sales/AddMemberModal';
import MemberAddedSuccessModal from '@/app/_componentes/sales/MemberAddedSuccessModal';
import EditEmployeeModal from '@/app/_componentes/sales/EditEmployeeModal';
import {
  EmployeeDeleteConfirm,
  EmployeeDeleteSuccess,
} from '@/app/_componentes/sales/EmployeeDeleteModals';
import DeleteBranchConfirm from '@/app/_componentes/branches/DeleteBranchConfirm';
import EditBranchInfoModal from '@/app/_componentes/branches/EditBranchInfoModal';
import DeleteBranchSuccess from '@/app/_componentes/branches/DeleteBranchSuccess';

const SALES_SORT: SortOption[] = [
  { key: 'dateJoined', dir: 'desc', label: 'Date Joined (Newest first)' },
  { key: 'dateJoined', dir: 'asc', label: 'Date Joined (Oldest first)' },
];

export default function BranchPage() {
  const { companyId, branchId } = useParams<{
    companyId: string;
    branchId: string;
  }>();
  const router = useRouter();

  // Mock branch entity (replace with your fetch)
  const [branch, setBranch] = useState({
    id: branchId,
    name: 'Branch Name',
    created: new Date(2025, 7, 12),
    supervisor: 'Supervisor Name',
    email: 'sales@company.com',
  });

  // SALES (employees) for this branch
  const [rows, setRows] = useState<SalesRow[]>(
    []
  );

  // Controls
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortValue>({
    key: 'dateJoined',
    dir: 'desc',
  });
  const PAGE_SIZE = 7;
  const [page, setPage] = useState(1);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = rows;
    if (q) {
      filtered = filtered.filter(
        r =>
          r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    }
    const sorted = [...filtered].sort((a, b) => {
      const d = a.dateJoined.getTime() - b.dateJoined.getTime();
      return sort.dir === 'asc' ? d : -d;
    });
    return sorted;
  }, [rows, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const current = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [addSuccessOpen, setAddSuccessOpen] = useState(false);
  const [editEmpOpen, setEditEmpOpen] = useState(false);
  const [editEmpTarget, setEditEmpTarget] = useState<SalesRow | null>(null);
  const [delEmpOpen, setDelEmpOpen] = useState(false);
  const [delEmpSuccessOpen, setDelEmpSuccessOpen] = useState(false);
  const [delEmpTarget, setDelEmpTarget] = useState<SalesRow | null>(null);

  const [editBranchOpen, setEditBranchOpen] = useState(false);
  const [delBranchOpen, setDelBranchOpen] = useState(false);
  const [delBranchSuccessOpen, setDelBranchSuccessOpen] = useState(false);

  const fmt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Handlers
  async function handleAddMember(data: {
    branch: string;
    name: string;
    email: string;
  }) {
    setRows(prev => [
      {
        id: String(prev.length + 1),
        name: data.name,
        dateJoined: new Date(),
        branch: branch.name,
        email: data.email,
        
      },
      ...prev,
    ]);
    setAddSuccessOpen(true);
  }

  async function handleUpdateEmployee(data: {
    branch: string;
    name: string;
    email: string;
  }) {
    if (!editEmpTarget) return;
    setRows(prev =>
      prev.map(r => (r.id === editEmpTarget.id ? { ...r, ...data } : r))
    );
    setEditEmpOpen(false);
  }

  async function handleDeleteEmployee() {
    if (!delEmpTarget) return;
    setRows(prev => prev.filter(r => r.id !== delEmpTarget.id));
    setDelEmpOpen(false);
    setDelEmpSuccessOpen(true);
  }

  return (
    <div className='min-h-screen bg-[#F9FAFB] py-6'>
      {/* Header Card */}
      <section className='relative mb-4 rounded-2xl bg-white p-6 shadow-custom'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='font-poppins text-2xl font-bold text-gray-900'>
              {branch.name}
            </h1>
            <p className='font-poppins mt-1 text-gray-500 font-medium text-[12px] leading-[100%] tracking-[0em]'>
              Created {fmt.format(branch.created)}
            </p>
          </div>

          <KebabMenu
            items={[
              {
                label: 'Edit Info',
                icon: <Pencil className='h-4 w-4' />,
                onClick: () => setEditBranchOpen(true),
              },
              {
                label: 'Delete branch',
                icon: <Trash2 className='h-4 w-4' />,
                tone: 'danger',
                onClick: () => setDelBranchOpen(true),
              },
            ]}
          />
        </div>
      </section>

      {/* Supervisor Card */}
      <section className='mb-4 rounded-2xl bg-white p-6 shadow-custom'>
        <h2 className='mb-4 text-lg font-semibold text-gray-900'>
          Supervisor’s Information
        </h2>
        <div className='grid gap-6 sm:grid-cols-2'>
          <div>
            <div className='text-xs uppercase tracking-wide text-gray-400'>
              Supervisor Name
            </div>
            <div className='mt-1 text-gray-900'>{branch.supervisor}</div>
          </div>
          <div className='flex items-start justify-between gap-2'>
            <div>
              <div className='text-xs uppercase tracking-wide text-gray-400'>
                Supervisor Email
              </div>
              <div className='mt-1 text-gray-900'>{branch.email}</div>
            </div>
            <a
              href={`mailto:${branch.email}`}
              className='mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline'
            >
              <Mail className='h-4 w-4' />
              Send an email
            </a>
          </div>
        </div>
      </section>

      {/* Sales / Employees */}
      <section className='rounded-2xl bg-white p-6 shadow-custom'>
        <div className='mb-3 flex items-center gap-3'>
          <h2 className='text-lg font-semibold text-gray-900'>Sales</h2>
          <button
            type='button'
            className='ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D70C8] px-6 py-2 text-sm font-semibold text-white shadow-custom'
            onClick={() => setAddOpen(true)}
          >
            Add member <span className='text-xl leading-none'>＋</span>
          </button>
        </div>

        {/* Controls */}
        <div className='mb-4 flex w-full flex-col gap-3 sm:flex-row'>
          <SortBy
            value={sort}
            options={SALES_SORT}
            onChange={(key, dir) => setSort({ key, dir })}
          />

          <div className='flex items-center gap-2 rounded-xl bg-[#FEFEFE] px-4 py-2 shadow-custom sm:ml-auto sm:w-[360px]'>
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
              setEditEmpTarget(row);
              setEditEmpOpen(true);
            }}
            onDelete={row => {
              setDelEmpTarget(row);
              setDelEmpOpen(true);
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
        </div>
      </section>

      {/* Modals */}
      <AddMemberModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        branches={[branch.name]}
        onSubmit={async data => {
          await handleAddMember(data);
          setAddOpen(false);
        }}
      />
      <MemberAddedSuccessModal
        open={addSuccessOpen}
        onClose={() => setAddSuccessOpen(false)}
        onAddAnother={() => setAddOpen(true)}
      />

      <EditEmployeeModal
        open={editEmpOpen}
        onClose={() => setEditEmpOpen(false)}
        branches={[branch.name]}
        initial={
          editEmpTarget
            ? {
                branch: branch.name,
                name: editEmpTarget.name,
                email: editEmpTarget.email,
                id:editEmpTarget.id
              }
            : null
        }
        onUpdate={handleUpdateEmployee}
      />
      <EmployeeDeleteConfirm
        open={delEmpOpen}
        onClose={() => setDelEmpOpen(false)}
        employeeName={delEmpTarget?.name ?? 'this member'}
        onConfirm={handleDeleteEmployee}
      />
      <EmployeeDeleteSuccess
        open={delEmpSuccessOpen}
        onClose={() => setDelEmpSuccessOpen(false)}
        onBack={() => router.push(`/admin/companies/${companyId}/branches`)}
      />

      <EditBranchInfoModal
        open={editBranchOpen}
        onClose={() => setEditBranchOpen(false)}
        initial={{
          name: branch.name,
          supervisor: branch.supervisor,
          email: branch.email,
        }}
        onUpdate={d => setBranch(b => ({ ...b, ...d }))}
      />
      <DeleteBranchConfirm
        open={delBranchOpen}
        onClose={() => setDelBranchOpen(false)}
        branchName={branch.name}
        onConfirm={() => {
          setDelBranchOpen(false);
          setDelBranchSuccessOpen(true);
        }}
      />
      <DeleteBranchSuccess
        open={delBranchSuccessOpen}
        onClose={() => setDelBranchSuccessOpen(false)}
        onBack={() => router.push(`/admin/companies/${companyId}`)}
      />
    </div>
  );
}

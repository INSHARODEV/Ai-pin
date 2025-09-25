'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useShiftsContext } from '@/app/branch/layout';
import { StatCard } from '@/app/_componentes/reusable/StatCard';
import BranchesToolbar from '@/app/_componentes/branches/BranchesToolbar';
import EmployeeShiftsTable, {
  EmployeeShiftRow,
} from '@/app/_componentes/EmployeeShiftsTable';
import EditEmployeeModal from '@/app/_componentes/sales/EditEmployeeModal';
import {
  EmployeeDeleteConfirm,
  EmployeeDeleteSuccess,
} from '@/app/_componentes/sales/EmployeeDeleteModals';
import EmployeeUpdateSuccessModal from '@/app/_componentes/EmployeeUpdateSuccessModal';

export default function EmployeePage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const router = useRouter();
  const { shifts } = useShiftsContext();

  // kebab state
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const actionsBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  // modals state
  const [editOpen, setEditOpen] = React.useState(false);
  const [editSuccessOpen, setEditSuccessOpen] = React.useState(false);
  const [delOpen, setDelOpen] = React.useState(false);
  const [delSuccessOpen, setDelSuccessOpen] = React.useState(false);

  // Close kebab on ESC
  React.useEffect(() => {
    if (!actionsOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setActionsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actionsOpen]);

  // Close kebab when focus leaves
  React.useEffect(() => {
    if (!actionsOpen) return;
    const onFocus = (e: FocusEvent) => {
      const target = e.target as Node;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !actionsBtnRef.current?.contains(target)
      ) {
        setActionsOpen(false);
      }
    };
    window.addEventListener('focusin', onFocus);
    return () => window.removeEventListener('focusin', onFocus);
  }, [actionsOpen]);

  // ---- adapter for shifts -> table rows ----
  const rows: EmployeeShiftRow[] = useMemo(() => {
    const arr = Array.isArray(shifts) ? shifts : [];
    return arr
      .filter((s: any) => !employeeId || String(s.empId) === String(employeeId))
      .map((s: any) => ({
        id: String(s._id ?? s.id ?? Math.random()),
        date: s.date ?? '12th August 2025',
        time: s.startTime ?? '2:39 PM',
        duration: s.duration ?? '7 hrs, 59 mins',
        performance:
          typeof s.performance === 'number'
            ? s.performance
            : (s.performance ?? 'Average'),
        status: s.status ?? undefined,
      }));
  }, [shifts, employeeId]);

  // ---- demo header data (replace with real) ----
  const employee = {
    name: 'Sales Name',
    mood: 'Friendly',
    email: 'sales.email@gmail.com',
    branch: 'Branch Name',
    rating: 4.2,
    totalHours: 278,
    skillDelta: -12,
  };

  // handlers
  async function handleUpdate(data: {
    branch: string;
    name: string;
    email: string;
  }) {
    // TODO: call your API
    setEditOpen(false);
    setEditSuccessOpen(true);
  }

  async function handleDelete() {
    // TODO: call your API
    setDelOpen(false);
    setDelSuccessOpen(true);
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Breadcrumb */}
      <div className='text-sm text-gray-500'>
        <Link href='/branch/employees' className='hover:underline'>
          Employees Overview
        </Link>{' '}
        &nbsp;›&nbsp; <span className='text-gray-700'>Employee</span>
      </div>

      {/* Header Card */}
      <section className=''>
        <div className='rounded-2xl bg-white shadow-custom'>
          <div className='p-6 flex items-start justify-between'>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  {employee.name}
                </h1>
                <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
                  {employee.mood}
                </span>
              </div>

              <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                <div>
                  <div className='text-xs text-gray-500'>Email</div>
                  <div className='text-gray-800'>{employee.email}</div>
                </div>
                <div>
                  <div className='text-xs text-gray-500'>Branch</div>
                  <div className='text-gray-800'>{employee.branch}</div>
                </div>
              </div>
            </div>

            {/* Kebab actions */}
            <div className='relative'>
              <button
                type='button'
                aria-haspopup='menu'
                aria-expanded='false'
                aria-label='Employee actions'
                className='rounded-full p-2 hover:bg-gray-100 text-gray-500'
                onClick={() => setActionsOpen(v => !v)}
                ref={actionsBtnRef}
              >
                <MoreHorizontal className='h-5 w-5' />
              </button>

              {actionsOpen && (
                <>
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setActionsOpen(false)}
                  />
                  <div
                    ref={menuRef}
                    role='menu'
                    aria-label='Employee actions'
                    className='absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-custom'
                  >
                    <button
                      type='button'
                      role='menuitem'
                      onClick={() => {
                        setActionsOpen(false);
                        setEditOpen(true);
                      }}
                      className='flex w-full items-center gap-2 px-4 py-3 text-left text-gray-700 hover:bg-gray-50'
                    >
                      <Pencil className='h-4 w-4' />
                      Edit Info
                    </button>
                    <button
                      type='button'
                      role='menuitem'
                      onClick={() => {
                        setActionsOpen(false);
                        setDelOpen(true);
                      }}
                      className='flex w-full items-center gap-2 px-4 py-3 text-left text-rose-600 hover:bg-rose-50'
                    >
                      <Trash2 className='h-4 w-4' />
                      Delete Employee
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='py-4 grid gap-4 md:grid-cols-3'>
          <StatCard
            title='Total Working Hours'
            value={employee.totalHours}
            description='For the last 30 Days'
            variant='blue'
          />
          <StatCard
            title='Rating'
            value={employee.rating}
            description='For the last 7 shifts'
            variant='green'
          />
          <StatCard
            title='Skill Improvement'
            value={`${employee.skillDelta}%`}
            description='Change in performance'
            variant={
              employee.skillDelta > 0
                ? 'green'
                : employee.skillDelta < 0
                  ? 'red'
                  : 'orange'
            }
          />
        </div>
      </section>

      {/* Shifts Section */}
      <section className='space-y-4'>
        <div>
          <h2 className='text-base font-semibold text-gray-800'>
            Last 30 days Shifts
          </h2>
        </div>

        <BranchesToolbar onChange={() => {}} />

        <EmployeeShiftsTable shifts={rows} />
      </section>

      {/* Modals */}
      <EditEmployeeModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        branches={[employee.branch]}
        initial={{
          branch: employee.branch,
          name: employee.name,
          email: employee.email,
        }}
        onUpdate={handleUpdate}
      />
      <EmployeeUpdateSuccessModal
        open={editSuccessOpen}
        onClose={() => setEditSuccessOpen(false)}
        onUpdateAgain={() => {
          setEditSuccessOpen(false);
          setEditOpen(true);
        }}
      />
      <EmployeeDeleteConfirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        employeeName={employee.name}
        onConfirm={handleDelete}
      />
      <EmployeeDeleteSuccess
        open={delSuccessOpen}
        onClose={() => setDelSuccessOpen(false)}
        onBack={() => router.push('/branch/employees')}
      />
    </div>
  );
}

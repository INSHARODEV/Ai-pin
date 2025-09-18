// components/company/CompanyEditModal.tsx
'use client';

import * as React from 'react';
import Modal from '@/components/ui/Modal';
import { ChevronLeft, Trash2 } from 'lucide-react';

export interface CompanyEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    companyName: string;
    managerName: string;
    managerEmail: string;
    branches: Array<{ name: string; supervisor: string; email: string }>;
    members: Array<{ name: string; email: string }>;
  }) => Promise<void> | void;
  initial?: {
    companyName: string;
    managerName: string;
    managerEmail: string;
    branches: Array<{ name: string; supervisor: string; email: string }>;
    members?: Array<{ name: string; email: string }>;
  };
}

type Step = 1 | 2 | 3;

export default function CompanyEditModal({
  open,
  onClose,
  onSubmit,
  initial,
}: CompanyEditModalProps) {
  const [step, setStep] = React.useState<Step>(1);
  const [saving, setSaving] = React.useState(false);

  const [companyName, setCompanyName] = React.useState(
    initial?.companyName ?? ''
  );
  const [managerName, setManagerName] = React.useState(
    initial?.managerName ?? ''
  );
  const [managerEmail, setManagerEmail] = React.useState(
    initial?.managerEmail ?? ''
  );

  const [branches, setBranches] = React.useState<
    Array<{ name: string; supervisor: string; email: string }>
  >(
    initial?.branches?.length
      ? initial!.branches
      : [{ name: '', supervisor: '', email: '' }]
  );

  const [members, setMembers] = React.useState<
    Array<{ name: string; email: string }>
  >(initial?.members?.length ? initial!.members : [{ name: '', email: '' }]);

  React.useEffect(() => {
    if (!open) setStep(1);
  }, [open]);

  const addBranch = () =>
    setBranches(b => [...b, { name: '', supervisor: '', email: '' }]);
  const updateBranch = (
    i: number,
    key: 'name' | 'supervisor' | 'email',
    v: string
  ) =>
    setBranches(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: v };
      return copy;
    });

  const addMember = () => setMembers(m => [...m, { name: '', email: '' }]);
  const updateMember = (i: number, key: 'name' | 'email', v: string) =>
    setMembers(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: v };
      return copy;
    });
  const removeMember = (i: number) =>
    setMembers(prev =>
      prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev
    );

  async function handleSubmit() {
    setSaving(true);
    try {
      await onSubmit({
        companyName,
        managerName,
        managerEmail,
        branches,
        members,
      });
      onClose(); // parent will show success modal
    } finally {
      setSaving(false);
    }
  }

  const StepIndicator = () => (
    <div className='mb-6 flex items-center gap-3'>
      {[1, 2, 3].map(n => (
        <div
          key={n}
          className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
            n === step ? 'bg-[#0D70C8] text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {n}
        </div>
      ))}
      <div className='ml-2 text-sm text-gray-500'>Update the info</div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Edit company info'
      maxWidthClass='max-w-xl'
    >
      <StepIndicator />

      {/* STEP 1 - Company */}
      {step === 1 && (
        <div className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>
              Company name
            </label>
            <input
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Company name'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>
              Manager name
            </label>
            <input
              value={managerName}
              onChange={e => setManagerName(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Manager name'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>
              Manager email
            </label>
            <input
              type='email'
              value={managerEmail}
              onChange={e => setManagerEmail(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='name@company.com'
            />
          </div>
        </div>
      )}

      {/* STEP 2 - Branch */}
      {step === 2 && (
        <div className='space-y-4'>
          {branches.map((b, i) => (
            <div key={i} className='rounded-xl border border-gray-200 p-4'>
              <div className='mb-3 text-sm font-medium text-gray-700'>
                Branch {i + 1}
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <label className='mb-1 block text-sm text-gray-500'>
                    Branch name
                  </label>
                  <input
                    value={b.name}
                    onChange={e => updateBranch(i, 'name', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Name'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm text-gray-500'>
                    Supervisor name
                  </label>
                  <input
                    value={b.supervisor}
                    onChange={e =>
                      updateBranch(i, 'supervisor', e.target.value)
                    }
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Name'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm text-gray-500'>
                    Supervisor email
                  </label>
                  <input
                    type='email'
                    value={b.email}
                    onChange={e => updateBranch(i, 'email', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='name@company.com'
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type='button'
            onClick={addBranch}
            className='rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-[#0D70C8] hover:bg-blue-100'
          >
            Add Another Branch
          </button>
        </div>
      )}

      {/* STEP 3 - Employees (Members) */}
      {step === 3 && (
        <div className='space-y-4'>
          {members.map((m, i) => (
            <div key={i} className='rounded-xl border border-gray-200 p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='text-sm font-medium text-gray-700'>
                  Member {i + 1}
                </div>
                {members.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeMember(i)}
                    className='inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50'
                    title='Remove member'
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                    Remove
                  </button>
                )}
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div>
                  <label className='mb-1 block text-sm text-gray-500'>
                    Name
                  </label>
                  <input
                    value={m.name}
                    onChange={e => updateMember(i, 'name', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Full name'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm text-gray-500'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={m.email}
                    onChange={e => updateMember(i, 'email', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='name@company.com'
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type='button'
            onClick={addMember}
            className='rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-[#0D70C8] hover:bg-blue-100'
          >
            Add Another Member
          </button>
        </div>
      )}

      {/* FOOTER */}
      <div className='mt-6 flex items-center justify-between'>
        <button
          type='button'
          onClick={() =>
            step === 1 ? onClose() : setStep(s => (s - 1) as Step)
          }
          className='inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900'
        >
          <ChevronLeft className='h-4 w-4' />
          Back
        </button>

        <div className='flex items-center gap-2'>
          {step < 3 ? (
            <button
              type='button'
              onClick={() => setStep(s => (s + 1) as Step)}
              className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white hover:brightness-110'
            >
              Next
            </button>
          ) : (
            <button
              type='button'
              onClick={handleSubmit}
              disabled={saving}
              className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60'
            >
              {saving ? 'Updating…' : 'Update'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

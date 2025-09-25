'use client';

import React from 'react';
import { X, ChevronDown } from 'lucide-react';

type Role = 'MANAGER' | 'ADMIN' | 'SUPERVISOR' | 'SELLER' | undefined;

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  role,
  branches = [],
  defaultBranch,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (p: { branch: string; name: string; email: string }) => void;
  role: Role;
  branches?: string[];
  defaultBranch?: string;
}) {
  const [branchOpen, setBranchOpen] = React.useState(false);
  const [branch, setBranch] = React.useState<string>(
    defaultBranch || branches[0] || ''
  );
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!branch && (defaultBranch || branches[0])) {
      setBranch(defaultBranch || branches[0] || '');
    }
  }, [branches, defaultBranch, branch]);

  // Close on ESC
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canPickBranch = role === 'MANAGER' || role === 'ADMIN';
  const emailValid = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = !!name && !!branch && emailValid && !submitting;

  const submit = async () => {
    setError(null);
    if (!isValid) return;
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      if (email.toLowerCase().includes('used'))
        throw new Error('Email already used');
      onSuccess({ branch, name, email });
      setName('');
      setEmail('');
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Close when clicking the semi-transparent backdrop
  const handleBackdropMouseDown: React.MouseEventHandler<
    HTMLDivElement
  > = e => {
    // only close if the click began on the backdrop itself
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
      onMouseDown={handleBackdropMouseDown}
      aria-modal='true'
      role='dialog'
    >
      {/* stop propagation so clicks inside don’t bubble to the backdrop */}
      <div
        className='w-full max-w-xl rounded-2xl bg-white shadow-xl'
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 pt-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Add new employee
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Write his details and we will send him an email with his initial
              password
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-1 text-gray-400 hover:bg-gray-100'
            aria-label='Close modal'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 pb-6 pt-4 space-y-4'>
          {/* Branch select */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Branch Name
            </label>
            {canPickBranch ? (
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setBranchOpen(v => !v)}
                  className='flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
                >
                  <span className={branch ? '' : 'text-gray-400'}>
                    {branch || 'Choose branch'}
                  </span>
                  <ChevronDown className='h-4 w-4 text-gray-400' />
                </button>

                {branchOpen && (
                  <div className='absolute z-10 mt-1 w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-lg'>
                    {[...branches].map(b => (
                      <button
                        key={b}
                        onClick={() => {
                          setBranch(b);
                          setBranchOpen(false);
                        }}
                        className={`block w-full rounded-xl px-4 py-3 text-left hover:bg-gray-50 ${
                          branch === b ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <input
                value={branch}
                readOnly
                className='w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700'
                placeholder='Branch'
              />
            )}
          </div>

          {/* Employee name */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Employee Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Employee Name'
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
            />
          </div>

          {/* Email with error state */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='name@company.com'
              className={`w-full rounded-xl border px-4 py-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                error
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-gray-200 focus:ring-blue-200'
              }`}
            />
            {error && <p className='mt-1 text-sm text-rose-600'>{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 px-6 pb-6'>
          <button
            type='button'
            disabled={!isValid}
            onClick={submit}
            className={`rounded-xl px-4 py-2 font-medium text-white ${
              isValid ? 'bg-[#0D70C8] hover:bg-blue-700' : 'bg-gray-300'
            }`}
          >
            {submitting ? 'Adding…' : 'Add Another Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

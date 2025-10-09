'use client';

import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { MakeApiCall, Methods } from '@/app/actions';

type Role = 'MANAGER' | 'ADMIN' | 'SUPERVISOR' | 'SELLER' | undefined;

export default function AddEmployeeModalDirectly({
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

  const submit = async (e:any) => {
    console.log("Form submitted"); 
    e?.preventDefault(); 
    setError(null);
   
    setSubmitting(true);
    try {
        const submittedData = {
            firstName: name,
            email: email?.toLowerCase(),
            role: "SELLER",
            jobTitle: "Employee",
            password: "changeMe",
            branchId:JSON.parse(localStorage.getItem('user') as any).branchId,
          };
       
      
          console.log("Submitting:", submittedData);
      
        const res=  await MakeApiCall({
            method: Methods.POST,
            url: `/auth`,
            body: JSON.stringify(submittedData),
            headers: "json",
          });
          console.log(res)
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
   
      aria-modal='true'
      role='dialog'
    >
      {/* stop propagation so clicks inside don’t bubble to the backdrop */}
      <form 
        className='w-full max-w-xl rounded-2xl bg-white shadow-xl'
        onClick={e => e.stopPropagation()} // changed to onClick
        onSubmit={submit}
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
      type='submit'
     
      className='rounded-xl px-4 py-2 font-medium text-white bg-[#0D70C8] hover:bg-blue-700 disabled:opacity-60'
    >
      {submitting ? 'Adding…' : 'Add Another Member'}
    </button>
        </div>
      </form>
    </div>
  );
}

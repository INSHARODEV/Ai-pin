// components/branches/AddBranchModal.tsx
'use client';

import * as React from 'react';
import Modal from '@/components/ui/Modal';
import { ChevronLeft, Trash2 } from 'lucide-react';

type Step = 1 | 2;

export interface AddBranchPayload {
  name: string;
  supervisor: string;
  email: string;
  members: Array<{ name: string; email: string }>;
}

export default function AddBranchModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AddBranchPayload) => Promise<void> | void;
}) {
  const [step, setStep] = React.useState<Step>(1);
  const [saving, setSaving] = React.useState(false);

  // Step 1
  const [name, setName] = React.useState('');
  const [supervisor, setSupervisor] = React.useState('');
  const [email, setEmail] = React.useState('');

  // Step 2
  const [members, setMembers] = React.useState<
    Array<{ name: string; email: string }>
  >([{ name: '', email: '' }]);

  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setName('');
      setSupervisor('');
      setEmail('');
      setMembers([{ name: '', email: '' }]);
    }
  }, [open]);

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

  async function handleDone() {
    setSaving(true);
    try {
      await onSubmit({ name, supervisor, email, members });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const Stepper = () => (
    <div className='mb-4 flex items-center gap-3'>
      {[1, 2].map(n => (
        <div
          key={n}
          className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
            n === step ? 'bg-[#0D70C8] text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {n}
        </div>
      ))}
      <div className='ml-2 text-sm text-gray-500'>
        {step === 1 ? 'Branch Setup (required)' : 'Employees Setup'}
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Add new branch'
      maxWidthClass='max-w-xl'
    >
      <p className='mb-4 text-sm text-gray-600'>
        Write all the details and we will send them an email with their initial
        password.
      </p>
      <Stepper />

      {step === 1 && (
        <div className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>
              Branch Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Branch Name'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>
              Supervisor Name
            </label>
            <input
              value={supervisor}
              onChange={e => setSupervisor(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Supervisor Name'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>
              Supervisor Email
            </label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='supervisoremail@company.com'
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className='space-y-4'>
          {members.map((m, i) => (
            <div key={i} className='rounded-xl border border-gray-200 p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='text-sm font-medium text-gray-700'>
                  Employee {i + 1}
                </div>
                {members.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeMember(i)}
                    className='inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50'
                    title='Remove'
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
                    placeholder='Name'
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

        {step === 1 ? (
          <button
            type='button'
            onClick={() => setStep(2)}
            className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white'
          >
            Next
          </button>
        ) : (
          <button
            type='button'
            onClick={handleDone}
            disabled={saving}
            className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60'
          >
            {saving ? 'Saving…' : 'Done'}
          </button>
        )}
      </div>
    </Modal>
  );
}

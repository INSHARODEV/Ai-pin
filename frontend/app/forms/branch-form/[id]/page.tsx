'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import InputForm from '@/app/_componentes/reusable/Form';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MakeApiCall, Methods } from '@/app/actions';
import { routes } from '@/app/_componentes/Form-sidebar';
import { stepsContext } from '@/app/context/stesp.context';
import Loader from '@/app/loader';

export interface BranchFormData {
  name?: string;
  firstName?: string;
  email?: string;
}

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { step, setStep } = useContext(stepsContext) as any;

  const [branches, setBranches] = useState<BranchFormData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Ensure "BRANCH 1" exists and is opened on first render (matches mock)
  useEffect(() => {
    if (branches.length === 0) {
      setBranches([{}]);
      setActiveIndex(0);
    }
  }, [branches.length]);

  const isBranchComplete = (b: BranchFormData) =>
    Boolean(b.name && b.firstName && b.email);

  const canAddAnother = useMemo(
    () =>
      branches.length > 0 &&
      branches.every(isBranchComplete) &&
      activeIndex === null,
    [branches, activeIndex]
  );

  const AddBranch = () => {
    const newIndex = branches.length;
    setBranches(prev => [...prev, {}]);
    setActiveIndex(newIndex); // open newly added branch
  };

  const handleSubmit = async (data: BranchFormData, idx: number) => {
    setLoading(true);
    try {
      // save in local list
      setBranches(prev =>
        prev.map((b, i) => (i === idx ? { ...b, ...data } : b))
      );

      const submittedData = {
        name: data.name,
        Superviosr: {
          firstName: data.firstName,
          email: data.email?.toLowerCase(),
          role: 'Superviosr',
        },
      };

      await MakeApiCall({
        method: Methods.POST,
        url: `/branch/${id}`,
        body: JSON.stringify(submittedData),
        headers: 'json',
      });

      // collapse after save
      setActiveIndex(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigatio = (clickedStep: number) => {
    const index = step + clickedStep;
    setStep(index);
    router.push(`/${routes(id, index)}`);
  };

  if (!branches) return <Loader />;

  return (
    <div className='mx-auto max-w-[720px] px-8 pt-12 pb-24 bg-white'>
      {/* Title + subtitle */}
      <h2 className='text-[28px] font-semibold tracking-[-0.01em] mb-1'>
        Branches Setup
      </h2>
      <p className='text-[15px] text-gray-600 mb-8'>
        Add each branch with its supervisor information.
      </p>

      {/* Branch Accordions */}
      <div className='space-y-6'>
        {branches.map((branch, idx) => {
          const open = activeIndex === idx;
          return (
            <div key={idx} className='rounded-2xl'>
              {/* Section label + chevron (like the mock) */}
              <button
                type='button'
                onClick={() => setActiveIndex(open ? null : idx)}
                className='w-full flex items-center justify-between'
                aria-expanded={open}
              >
                <div className='text-[11px] font-semibold tracking-wider text-gray-500'>
                  {`BRANCH ${idx + 1}`}
                </div>
                <ChevronDown
                  size={18}
                  className={[
                    'text-gray-400 transition-transform',
                    open ? 'rotate-180' : 'rotate-0',
                  ].join(' ')}
                />
              </button>

              {/* Body */}
              {open && (
                <div className='mt-4'>
                  <InputForm
                    onSubmit={data => handleSubmit(data, idx)}
                    defaultValues={branch}
                  >
                    {/* We keep your InputForm exactly as-is; just arrange spacing to match mock */}
                    <div className='space-y-6'>
                      <InputForm.Input
                        name='name'
                        required
                        placeHolder='Branch name'
                      />
                      <InputForm.Input
                        name='firstName'
                        required
                        placeHolder='Supervisor name'
                      />
                      <InputForm.Input
                        name='email'
                        type='email'
                        required
                        placeHolder='Supervisor email'
                      />
                    </div>

                    {/* Save / Collapse actions - subtle */}
                    <div className='flex justify-end mt-6 gap-3'>
                      <Button
                        type='button'
                        variant='secondary'
                        className='rounded-xl'
                        onClick={() => setActiveIndex(null)}
                      >
                        Collapse
                      </Button>
                      <Button
                        type='submit'
                        className='rounded-xl'
                        disabled={loading}
                      >
                        {loading ? 'Saving…' : 'Save Branch'}
                      </Button>
                    </div>
                  </InputForm>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Another Branch (disabled/enabled like screenshots) */}
      <div className='flex justify-end mt-8'>
        <button
          type='button'
          onClick={AddBranch}
          disabled={!canAddAnother}
          className={[
            'px-6 h-10 rounded-xl font-semibold shadow-sm',
            canAddAnother
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-white cursor-not-allowed',
          ].join(' ')}
        >
          Add Another Branch
        </button>
      </div>

      {/* Bottom navigation arrows */}
      <div className='flex items-center justify-between mt-10'>
        {/* Left: light circle with blue arrow */}
        <button
          type='button'
          onClick={() => handleNavigatio(-1)}
          className='flex w-12 h-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm'
          aria-label='Previous'
        >
          <ArrowLeft size={22} />
        </button>

        {/* Right: solid blue circle */}
        <button
          type='button'
          onClick={() => handleNavigatio(1)}
          className='flex w-12 h-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md'
          aria-label='Next'
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}

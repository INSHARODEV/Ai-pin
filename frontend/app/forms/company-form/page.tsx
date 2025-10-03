'use client';
import React, { useContext } from 'react';
import InputForm, {
  useFormContextSafe,
} from '../../_componentes/reusable/Form';
import { ArrowRight } from 'lucide-react';
import { MakeApiCall, Methods } from '../../actions';
import { useRouter } from 'next/navigation';
import { routes } from '@/app/_componentes/Form-sidebar';
import { stepsContext } from '@/app/context/stesp.context';

export interface Params {
  step: number;
}

// Create a submit button component that can access form context
function SubmitArrowButton() {
  const { isValid } = useFormContextSafe<any>();

  return (
    <div className='flex justify-end mt-14'>
      <button
        type='submit'
        disabled={!isValid}
        className={`flex w-12 h-12 items-center justify-center rounded-full shadow transition-colors ${
          isValid
            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <ArrowRight size={20} />
      </button>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { step, setStep } = useContext(stepsContext) as any;

  const handleSubmit = async (data: any) => {
    const submittedData = {
      name: data.name,
      manager: {
        firstName: data.firstName,
        email: data.email?.toLowerCase(),
        role: 'MANAGER',
      },
    };
    console.log(submittedData);
    const res = await MakeApiCall({
      method: Methods.POST,
      url: '/company',
      body: JSON.stringify(submittedData),
      headers: 'json',
    });
    console.log(res);
    setStep(step + 1);
    router.push(`/${routes(res._id, 1)}`);
  };

  return (
    <div className='mx-auto mt-10 p-12 bg-white rounded-lg shadow h-[100%]'>
      <h3 className='text-xl font-semibold mb-1'>Company Setup</h3>
      <p className='text-gray-600 mb-6'>
        Enter the company details and create the main manager account.
      </p>
      <InputForm
        onSubmit={handleSubmit}
        defaultValues={{ name: '', firstName: '', email: '' }}
      >
        {/* Company Section */}
        <div className='space-y-2'>
          <label className='text-xs font-semibold text-gray-500 tracking-wide'>
            COMPANY
          </label>
          <div className='p-1.5'>
            <InputForm.Input
              name='name'
              label=''
              required
              placeHolder='Company name'
            />
          </div>
        </div>

        {/* Manager Section */}
        <div className='space-y-2'>
          <label className='text-xs font-semibold text-gray-500 tracking-wide'>
            MANAGER
          </label>
          <div className='p-1.5 mt-7'>
            <InputForm.Input
              name='firstName'
              label=''
              required
              placeHolder="Manager's name"
            />
            <div className='mt-7'>
              <InputForm.Input
                name='email'
                label=''
                type='email'
                required
                placeHolder="Manager's email"
              />
            </div>
          </div>
        </div>

        {/* Submit button → round with arrow */}
        <SubmitArrowButton />
      </InputForm>
    </div>
  );
}

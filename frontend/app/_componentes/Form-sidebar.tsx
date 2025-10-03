'use client';
import Step from './Step';
import Logo from './icons/Logo';

const companySetup = {
  'Company Setup (required)': 'Company Setup (required)',
  'Branches Setup': 'Branches Setup',
  'Sales Team Setup': 'Sales Team Setup',
};

export const routes = (id: string, index: number) => {
  const allRoutes = [
    'forms/company-form',
    `forms/branch-form/${id}`,
    `forms/sales-form/${id}`,
  ];

  return allRoutes[index];
};
export interface Params {
  step: number;
}

export default function FormSidebar({ step }: Params) {
  return (
    <div className='flex flex-col gap-4 p-10'>
      <Logo />

      <h1 className='text-4xl w-fit font-semibold'>
        Adding a new <br />
        Company
      </h1>

      {Object.entries(companySetup).map(([key, label], index) => (
        <Step key={key} step={index} currentStep={step} label={key} />
      ))}
    </div>
  );
}

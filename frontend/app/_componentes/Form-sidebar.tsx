'use client';
import Step from './Step';
import Logo from './icons/Logo';
import { usePathname } from 'next/navigation';
import React from 'react';

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

export default function FormSidebar() {
  // Detect current URL
  const pathname = usePathname();

  // Automatically determine active step based on current route
  const activeStep = (() => {
    if (pathname?.includes('/forms/company-form')) return 0;
    if (pathname?.includes('/forms/branch-form')) return 1;
    if (pathname?.includes('/forms/sales-form')) return 2;
    return 0; // default fallback
  })();

  return (
    <div className='flex flex-col gap-4 p-10'>
      <Logo />

      <h1 className='text-4xl w-fit font-semibold leading-tight'>
        Adding a new <br /> Company
      </h1>

      {Object.entries(companySetup).map(([key], index) => (
        <Step key={key} step={index} currentStep={activeStep} label={key} />
      ))}
    </div>
  );
}

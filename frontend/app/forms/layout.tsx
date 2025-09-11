'use client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import FormSidebar from '../_componentes/Form-sidebar';

interface LayoutProps {
  children: ReactNode;
}

interface StepsContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const stepsContext = createContext<StepsContextType | null>(null);

export default function Layout({ children }: LayoutProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 3) {
      setStep(0); 
    }
  }, [step]);

  return (
    <stepsContext.Provider value={{ step, setStep }}>
      <div className="flex h-[100vh]">
        {/* Sidebar */}
        <div className="w-1/5   bg-[rgba(249,250,251,1)]">
          <FormSidebar step={step} />
        </div>

        {/* Main content */}
        <main className="w-4/5">{children}</main>
      </div>
    </stepsContext.Provider>
  );
}

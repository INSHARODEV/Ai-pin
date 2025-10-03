'use client';

import React, { createContext } from 'react';

interface StepsContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const stepsContext = createContext<StepsContextType | null>(null);

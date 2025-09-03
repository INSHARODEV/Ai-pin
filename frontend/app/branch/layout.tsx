'use client';
import { ReactNode, createContext, useContext } from 'react';
import AIPinDashboard from '../_componentes/AIPinDashboard';
import BreanchHeader from '../_componentes/BreanchHeader';
import { useShifts } from '../hooks/useShifts';

const ShiftsContext = createContext<any>(null);

export const useShiftsContext = () => useContext(ShiftsContext);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const user: any = JSON.parse(localStorage.getItem('user') as string);
  const shiftsData = useShifts({ branchId: user.branchId });

  return (
    <ShiftsContext.Provider value={shiftsData}>
      <div className='flex'>
        <div className='w-1/5'>
          <AIPinDashboard />
        </div>
        <div className='w-4/5'>
          <BreanchHeader userName='Branch User' />
          <main>{children}</main>
        </div>
      </div>
    </ShiftsContext.Provider>
  );
}

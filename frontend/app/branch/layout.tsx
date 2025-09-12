// app/branch/layout.tsx
'use client';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AIPinDashboard from '../_componentes/AIPinDashboard';
import BreanchHeader from '../_componentes/BreanchHeader';
import { useShifts } from '../hooks/useShifts';

const ShiftsContext = createContext<any>(null);
export const useShiftsContext = () => useContext(ShiftsContext);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setUserLoaded(true);
  }, []);

  const query = useMemo(
    () => (user ? { branchId: user.branchId } : null),
    [user?.branchId]
  );

  const shiftsData = useShifts(query ?? {});

  return (
    <ShiftsContext.Provider value={{ ...shiftsData, userLoaded }}>
      <div className='flex bg-[#FEFEFE]'>
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

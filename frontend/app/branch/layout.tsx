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
import SupervisorDashboardLayout from '../_componentes/SupervisorDashboardLayout';
import ManagerDashboardLayout from '../_componentes/ManagerDashboardLayout';
import BreanchHeader from '../_componentes/BreanchHeader';
import { useShifts } from '../hooks/useShifts';
import { RoleGuard } from '../_guards/role-guard';
import { useUser } from '../hooks/useUser';

type Role = 'MANAGER' | 'SUPERVISOR' | 'ADMIN' | 'SELLER';

const ShiftsContext = createContext<any>(null);
export const useShiftsContext = () => useContext(ShiftsContext);

interface LayoutProps {
  children: ReactNode;
}

// Component to render the appropriate sidebar based on role
const RoleBasedSidebar = ({ role, user }: { role: Role; user: any }) => {
  switch (role) {
    case 'ADMIN':
      // Admin gets the full manager dashboard with all features
      return <ManagerDashboardLayout />;
    case 'MANAGER':
      return <ManagerDashboardLayout />;
    case 'SUPERVISOR':
      return <SupervisorDashboardLayout />;
    // case 'SELLER':
    //   // Seller gets limited supervisor dashboard or you can create a separate one
    //   return <SupervisorDashboardLayout />;
    default:
      // Default fallback to supervisor layout
      return <SupervisorDashboardLayout />;
  }
};

export default function Layout({ children }: LayoutProps) {
 

  const {user,userLoaded}=useUser()

 

  const shiftsData = useShifts(user);

  // Don't render anything until user data is loaded
  if (!userLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#FEFEFE]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D70C8]'></div>
      </div>
    );
  }

  // If no user is found, you might want to redirect to login
  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#FEFEFE]'>
        <div className='text-center'>
          <p className='text-gray-600 mb-4'>
            Please log in to access this page
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className='px-4 py-2 bg-[#0D70C8] text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ShiftsContext.Provider value={{ ...shiftsData, userLoaded, user }}>
      <div className='flex bg-[#FEFEFE] min-h-screen'>
        <div className='w-1/5'>
          <RoleBasedSidebar role={user.role} user={user} />
        </div>
        <div className='w-4/5'>
          <BreanchHeader
            userName={user.name || user.username || 'Branch User'}
          />
          <main className='flex-1'>
            <RoleGuard>{children}</RoleGuard>
          </main>
        </div>
      </div>
    </ShiftsContext.Provider>
  );
}

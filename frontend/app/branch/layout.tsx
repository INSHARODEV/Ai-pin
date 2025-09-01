import { ReactNode } from 'react';
import { Metadata } from 'next';
import SalesHeader from '../_componentes/SalesHeader';
import AIPinDashboard from '../_componentes/AIPinDashboard';
import BreanchHeader from '../_componentes/BreanchHeader';

export const metadata: Metadata = {
  title: 'branch Dashboard',
  description: 'branch management and analytics dashboard',
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='flex'>
      <div className='w-1/5'>
        <AIPinDashboard />
      </div>
      <div className='w-4/5'>
        <BreanchHeader userName='Branch User' />
        <main className=''>{children}</main>
      </div>
    </div>
  );
}

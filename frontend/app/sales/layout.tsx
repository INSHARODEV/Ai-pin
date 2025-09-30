import { ReactNode } from 'react';
import { Metadata } from 'next';
import SalesHeader from '../_componentes/SalesHeader';
import { RoleGuard } from '../_guards/role-guard';

export const metadata: Metadata = {
  title: 'Sales Dashboard',
  description: 'Sales management and analytics dashboard',
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='bg-[#F9FAFB]'>
      <SalesHeader />

      <main className='px-10'>
        <RoleGuard>{children}</RoleGuard>
      </main>
    </div>
  );
}

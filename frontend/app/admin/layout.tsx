import { ReactNode } from 'react';
import { Metadata } from 'next';
import AdminHeader from '../_componentes/AdminHeader';
import { RoleGuard } from '../_guards/role-guard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin management and analytics dashboard',
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <AdminHeader userName='Admin' />

      <main className=''>
        <RoleGuard>{children}</RoleGuard>
      </main>
    </div>
  );
}

// app/admin/companies/(withCompanyLayout)/[companyId]/layout.tsx
'use client';

import AdminHeader from '@/app/_componentes/AdminHeader';
import Breadcrumbs from '@/app/_componentes/Breadcrumbs';
import { RoleGuard } from '@/app/_guards/role-guard';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function CompanyLayout({ children }: LayoutProps) {
  return (
    <RoleGuard>
      <div className='min-h-screen bg-[#F9FAFB]'>
        <AdminHeader userName='Admin' />

        <main className='py-6 px-16'>
          <div className='mx-auto space-y-6'>
            <Breadcrumbs />

            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}

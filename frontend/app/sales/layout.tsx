import { ReactNode } from 'react';
import { Metadata } from 'next';
import SalesHeader from '../_componentes/SalesHeader';

export const metadata: Metadata = {
  title: 'Sales Dashboard',
  description: 'Sales management and analytics dashboard',
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <SalesHeader
        userName='Full Name'
        //  onLogout={() => console.log('logout')}
      />

      <main>{children}</main>
    </div>
  );
}

// app/admin/companies/(withCompanyLayout)/[companyId]/layout.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import KebabMenu from '@/components/ui/KebabMenu';
import { Pencil, Trash2 } from 'lucide-react';

// ✅ use the real edit modal

import UpdateSuccessModal from '@/app/_componentes/company/UpdateSuccessModal';
import {
  DeleteConfirmModal,
  DeleteSuccessModal,
} from '@/app/_componentes/company/DeleteModals';
import CompanyEditModal from '@/app/_componentes/company/CompanyEditModal';

type TabKey = 'overview' | 'branches' | 'sales';

function getActiveTab(pathname: string, base: string): TabKey {
  if (pathname.startsWith(`${base}/branches`)) return 'branches';
  if (pathname.startsWith(`${base}/sales`)) return 'sales';
  return 'overview';
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { companyId } = useParams<{ companyId: string }>();

  const [company, setCompany] = useState({
    id: companyId ?? '1',
    name: 'Company Name',
    joined: new Date(2025, 7, 12),
    managerName: 'Manager Name',
    managerEmail: 'name@company.com',
    branches: 5,
    employees: 25,
  });

  const base = `/admin/companies/${company.id}`;
  const active = getActiveTab(pathname, base);

  const fmt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Popup state
  const [showEdit, setShowEdit] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  return (
    <div className='flex flex-col gap-4 bg-[#F9FAFB]'>
      {/* Header Card */}
      <section className='relative rounded-2xl bg-white p-6 shadow-custom'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='font-poppins text-2xl font-bold text-gray-900'>
              {company.name}
            </h1>
            <p className='font-poppins mt-1 text-gray-500 font-medium text-[12px] leading-[100%] tracking-[0em]'>
              Joined {fmt.format(company.joined)}
            </p>
          </div>

          <KebabMenu
            items={[
              {
                label: 'Edit Info',
                icon: <Pencil className='h-4 w-4' />,
                onClick: () => setShowEdit(true), // ✅ open the edit modal
              },
              {
                label: 'Delete company',
                icon: <Trash2 className='h-4 w-4' />,
                tone: 'danger',
                onClick: () => setShowDeleteConfirm(true),
              },
            ]}
          />
        </div>
      </section>

      {/* Tabs (URL-driven) */}
      <div className='flex gap-6'>
        {(
          [
            { key: 'overview', href: '/admin/companies', label: 'Overview' },
            { key: 'branches', href: `${base}/branches`, label: 'Branches' },
            { key: 'sales', href: `${base}/sales`, label: 'Sales' },
          ] as Array<{ key: TabKey; href: string; label: string }>
        ).map(t => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => router.push(t.href)}
              className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
              <div
                className={`mt-2 h-[2px] rounded-full ${isActive ? 'bg-black' : 'bg-transparent'}`}
              />
            </button>
          );
        })}
      </div>

      <main>{children}</main>

      <CompanyEditModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        initial={{
          companyName: company.name,
          managerName: company.managerName,
          managerEmail: company.managerEmail,
          branches: [
            {
              name: 'Branch A',
              supervisor: 'Supervisor Name',
              email: 'name@company.com',
            },
          ], // seed or fetch
          members: [{ name: 'Member Name', email: 'member@company.com' }], // seed or fetch
        }}
        onSubmit={async payload => {
          // Update local state from payload (or call your API then refresh)
          setCompany(c => ({
            ...c,
            name: payload.companyName || c.name,
            managerName: payload.managerName || c.managerName,
            managerEmail: payload.managerEmail || c.managerEmail,
            branches: payload.branches?.length || c.branches,
            employees: payload.members?.length ?? c.employees,
          }));
          setShowEdit(false);
          setShowUpdateSuccess(true); // then show success
        }}
      />

      {/* Success + Delete popups */}
      <UpdateSuccessModal
        open={showUpdateSuccess}
        onClose={() => setShowUpdateSuccess(false)}
        onEditAgain={() => setShowEdit(true)}
      />

      <DeleteConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        companyName={company.name}
        onConfirm={async () => {
          // TODO: call delete API
          setShowDeleteConfirm(false);
          setShowDeleteSuccess(true);
        }}
      />

      <DeleteSuccessModal
        open={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        onBack={() => router.push('/admin/companies')}
      />
    </div>
  );
}

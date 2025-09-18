// app/admin/companies/[id]/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import KebabMenu from '@/components/ui/KebabMenu';
import { Mail, Pencil } from 'lucide-react';
import CompanyEditModal from '@/app/_componentes/company/CompanyEditModal';
import UpdateSuccessModal from '@/app/_componentes/company/UpdateSuccessModal';
import {
  DeleteConfirmModal,
  DeleteSuccessModal,
} from '@/app/_componentes/company/DeleteModals';

export default function CompanyDetailsPage() {
  const router = useRouter();

  // Mock entity (replace with real data)
  const [company, setCompany] = React.useState({
    companyId: '1',
    name: 'Company Name',
    joined: new Date(2025, 7, 12),
    managerName: 'Manager Name',
    managerEmail: 'name@company.com',
    branches: 5,
    employees: 25,
  });

  const [tab, setTab] = React.useState<'overview' | 'branches' | 'sales'>(
    'overview'
  );

  // Modals
  const [showEdit, setShowEdit] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = React.useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = React.useState(false);

  const fmt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  async function handleUpdate(payload: {
    companyName: string;
    managerName: string;
    managerEmail: string;
    branches: Array<{ name: string; supervisor: string; email: string }>;
    members: Array<{ name: string; email: string }>;
  }) {
    // TODO: API call
    setCompany(c => ({
      ...c,
      name: payload.companyName || c.name,
      managerName: payload.managerName || c.managerName,
      managerEmail: payload.managerEmail || c.managerEmail,
      branches: payload.branches?.length || c.branches,
      employees: payload.members?.length || c.employees,
    }));
    setShowEdit(false);
    setShowUpdateSuccess(true);
  }

  async function handleDelete() {
    // TODO: API call
    setShowConfirm(false);
    setShowDeleteSuccess(true);
  }

  return (
    <div className=''>
      <main className='mx-auto py-6'>
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className='space-y-4'>
            {/* Manager Card */}
            <section className='relative rounded-2xl bg-white p-6 shadow-custom'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Manager’s Information
                </h2>
                <KebabMenu
                  items={[
                    {
                      label: 'Edit Info',
                      icon: <Pencil className='h-4 w-4' />,
                      onClick: () => setShowEdit(true),
                    },
                  ]}
                />
              </div>

              <div className='grid gap-6 sm:grid-cols-2'>
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-400'>
                    Name
                  </div>
                  <div className='mt-1 text-gray-900'>
                    {company.managerName}
                  </div>
                </div>

                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <div className='text-xs uppercase tracking-wide text-gray-400'>
                      Email
                    </div>
                    <div className='mt-1 text-gray-900'>
                      {company.managerEmail}
                    </div>
                  </div>
                  <a
                    href={`mailto:${company.managerEmail}`}
                    className='mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline'
                  >
                    <Mail className='h-4 w-4' />
                    Send an email
                  </a>
                </div>
              </div>
            </section>

            {/* Additional info Card */}
            <section className='rounded-2xl bg-white p-6 shadow-custom'>
              <h2 className='mb-4 text-lg font-semibold text-gray-900'>
                Additional Information
              </h2>
              <div className='grid gap-6 sm:grid-cols-2'>
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-400'>
                    Branches
                  </div>
                  <div className='mt-1 text-gray-900'>
                    {company.branches} Branches
                  </div>
                </div>
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-400'>
                    Employees
                  </div>
                  <div className='mt-1 text-gray-900'>
                    {company.employees} Employees
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'branches' && (
          <section className='rounded-2xl bg-white p-6 text-gray-600 shadow-custom'>
            Branches content goes here…
          </section>
        )}
        {tab === 'sales' && (
          <section className='rounded-2xl bg-white p-6 text-gray-600 shadow-custom'>
            Sales content goes here…
          </section>
        )}
      </main>

      {/* Modals */}
      <CompanyEditModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
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
          ],
          members: [{ name: 'Member Name', email: 'member@company.com' }],
        }}
      />

      <UpdateSuccessModal
        open={showUpdateSuccess}
        onClose={() => setShowUpdateSuccess(false)}
        onEditAgain={() => setShowEdit(true)}
      />

      <DeleteConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        companyName={company.name}
        onConfirm={handleDelete}
      />

      <DeleteSuccessModal
        open={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        onBack={() => router.push('/admin/companies')}
      />
    </div>
  );
}

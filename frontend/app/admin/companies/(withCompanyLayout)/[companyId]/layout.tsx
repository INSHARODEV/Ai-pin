// app/admin/companies/(withCompanyLayout)/[companyId]/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import KebabMenu from '@/components/ui/KebabMenu';
import { Pencil, Trash2 } from 'lucide-react';

import UpdateSuccessModal from '@/app/_componentes/company/UpdateSuccessModal';
import {
  DeleteConfirmModal,
  DeleteSuccessModal,
} from '@/app/_componentes/company/DeleteModals';
import CompanyEditModal from '@/app/_componentes/company/CompanyEditModal';
import { MakeApiCall, Methods } from '@/app/actions';
import { Company } from '@/app/_componentes/CompaniesTable';
import { promise } from 'zod';

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

  const [company, setCompany] = useState<Company>({} as Company);

  useEffect(() => {
    async function getCompany() {
      const company = (await MakeApiCall({
        method: Methods.GET,
        url: `/company/company/${companyId}`,
      })) as any;

      console.log(company);
      let date = fmt.format(
        company?.dateJoined ? new Date(company.dateJoined) : new Date()
      );
      setCompany({ ...company, dateJoined: date });
    }
    getCompany();
  }, []);

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
              {company.companyName}
            </h1>
            <p className='font-poppins mt-1 text-gray-500 font-medium text-[12px] leading-[100%] tracking-[0em]'>
              Joined{' '}
              {company?.dateJoined
                ? fmt.format(new Date(company.dateJoined))
                : 'N/A'}
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
            { key: 'overview', href: `${base}`, label: 'Overview' },
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

      {company && (
        <CompanyEditModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          initial={{
            companyName: company ? company.companyName : '',
            managerName: company ? company.managerName : '',
            managerEmail: company ? company.managerEmail : '',
            branches: company ? company.branches : [],
            members: [{ name: 'Member Name', email: 'member@company.com' }], // seed or fetch
          }}
          onSubmit={async payload => {
            setCompany(c => ({
              ...c,
              name: payload.companyName || c.companyName,
              managerName: payload.managerName || c.managerName,
              managerEmail: payload.managerEmail || c.managerEmail,
              branches: payload.branches || c.branches,
              employees: payload.members?.length ?? c.sales,
            }));
            setShowEdit(false);
            setShowUpdateSuccess(true); // then show success
            //edit compnay

            let body = payload.branches.filter(b => {
              return {
                _id: (b as any).id,
                name: b.name,
                supervisor: {
                  _id: (b as any).supervisorId,
                  firstName: b.supervisor,
                  email: b.email,
                },
              };
            });
            let newBranchs = payload.branches
              .filter(b => (b as any).id === undefined)
              .map(b => {
                return {
                  name: b.name,
                  supervisor: {
                    firstName: b.supervisor,
                    email: b.email?.toLowerCase(),
                    role: 'Superviosr',
                  },
                };
              });

            console.log('newBranchs', newBranchs);

            await Promise.all([
              MakeApiCall({
                url: `/company/${companyId}`,
                method: Methods.PATCH,
                body: JSON.stringify({
                  name: payload.companyName,
                  manager: {
                    _id: (company as any).mangerid,
                    firstName: payload.managerName,
                    email: payload.managerEmail,
                  },
                }),
                headers: 'json',
              }),
              MakeApiCall({
                url: `/branch`,
                method: Methods.PATCH,

                body: JSON.stringify(body),

                headers: 'json',
              }),
              MakeApiCall({
                url: `/branch/${companyId}`,
                method: Methods.POST,

                body: JSON.stringify(newBranchs),

                headers: 'json',
              }),
            ]);
          }}
        />
      )}

      {/* Success + Delete popups */}
      <UpdateSuccessModal
        open={showUpdateSuccess}
        onClose={() => setShowUpdateSuccess(false)}
        onEditAgain={() => setShowEdit(true)}
      />

      <DeleteConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        companyName={company.companyName}
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

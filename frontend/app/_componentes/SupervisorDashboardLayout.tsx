'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import BarChartIcon from './icons/BarChartIcon';
import { useShiftsContext } from '../branch/layout';
import {
  Activity,
  UserRound,
  FileText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

type NamedItem = { _id: string; name: string };

const SupervisorDashboardLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const ctx = useShiftsContext?.();

  const employees: NamedItem[] = (ctx?.empsNames as NamedItem[]) ?? [
    { _id: 'e1', name: 'Employee Name' },
    { _id: 'e2', name: 'Employee Name' },
    { _id: 'e3', name: 'Employee Name' },
  ];

  const [openEmployees, setOpenEmployees] = useState(true);

  // ---- Route-aware flags
  const isOverviewActive = pathname === '/branch';
  const isTranscriptionActive = pathname.startsWith('/branch/transcription');

  // Extract current employee id from the URL: /branch/employees/[id]
  const segments = pathname.split('/').filter(Boolean); // e.g. ['branch','employees','123']
  const isEmployeesSection =
    segments[0] === 'branch' && segments[1] === 'employees';
  const currentEmployeeId = isEmployeesSection ? (segments[2] ?? null) : null;

  // Highlight parent "Employees" only when exactly on /branch/employees (no [id])
  const isEmployeesActive = pathname === '/branch/employees';

  const getNavClasses = (active: boolean) =>
    `py-2 px-4 transition-colors cursor-pointer rounded-r-lg ${
      active ? 'bg-blue-100' : 'hover:bg-blue-200'
    }`;

  const getTextClasses = (active: boolean) =>
    active ? 'text-[#0D70C8] font-semibold' : 'text-muted-foreground';

  const getEmployeeItemClasses = (active: boolean) =>
    `transition-colors ${
      active
        ? 'text-[#0D70C8] font-semibold'
        : 'text-gray-400 hover:text-[#0D70C8]'
    }`;

  return (
    <div className='py-10 bg-white text-gray-400 flex flex-col'>
      {/* Header */}
      <div className='px-4 flex items-center gap-3 pb-4'>
        <div className='w-12 h-12 rounded-xl flex items-center justify-center bg-[#0D70C8]'>
          <Activity className='w-6 h-6 stroke-2 text-white' />
        </div>
        <h1 className='text-2xl font-semibold text-foreground'>AI Pin</h1>
      </div>

      <div className='flex flex-col gap-2 pr-5'>
        {/* Overview */}
        <Link href='/branch'>
          <div className={getNavClasses(isOverviewActive)}>
            <div className='flex items-center gap-3'>
              <BarChartIcon isActive={isOverviewActive} />
              <span
                className={`text-lg font-medium ${getTextClasses(isOverviewActive)}`}
              >
                Overview
              </span>
            </div>
          </div>
        </Link>

        {/* Transcription */}
        <Link href='/branch/transcription'>
          <div className={`${getNavClasses(isTranscriptionActive)} mb-6`}>
            <div className='flex items-center gap-3'>
              <FileText
                className={`w-5 h-5 ${
                  isTranscriptionActive
                    ? 'text-[#0D70C8]'
                    : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-lg font-medium ${getTextClasses(isTranscriptionActive)}`}
              >
                Transcription
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Employees (left navigates, right chevron toggles) */}
      <div
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors rounded-r-lg ${
          isEmployeesActive ? 'bg-blue-100' : 'hover:bg-blue-50/40'
        }`}
      >
        {/* Left: navigate to /branch/employees */}
        <button
          type='button'
          onClick={() => router.push('/branch/employees')}
          className='flex items-center gap-3 flex-1 text-left'
        >
          <UserRound
            className={`w-5 h-5 ${isEmployeesActive ? 'text-[#0D70C8]' : 'text-gray-400'}`}
          />
          <span
            className={
              isEmployeesActive
                ? 'text-[#0D70C8] font-semibold'
                : 'text-gray-400'
            }
          >
            Employees
          </span>
        </button>

        {/* Right: chevron only toggles collapse */}
        <button
          type='button'
          onClick={() => setOpenEmployees(v => !v)}
          className='ml-2'
          aria-label={openEmployees ? 'Collapse employees' : 'Expand employees'}
        >
          {openEmployees ? (
            <ChevronUp
              className={`w-5 h-5 ${isEmployeesActive ? 'text-[#0D70C8]' : 'text-gray-400'}`}
            />
          ) : (
            <ChevronDown
              className={`w-5 h-5 ${isEmployeesActive ? 'text-[#0D70C8]' : 'text-gray-400'}`}
            />
          )}
        </button>
      </div>

      {/* Collapsible list */}
      {openEmployees && (
        <div className='flex flex-col gap-8 pl-12 pt-6'>
          {employees.map(item => {
            const isActiveItem = currentEmployeeId === item._id;
            return (
              <Link
                key={item._id}
                href={`/branch/employees/${item._id}`}
                className={getEmployeeItemClasses(isActiveItem)}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboardLayout;

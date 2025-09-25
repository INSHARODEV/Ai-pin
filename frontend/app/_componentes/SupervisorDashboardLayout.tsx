'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, ReactNode } from 'react';
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
  const pathname = usePathname();
  const ctx = useShiftsContext?.();
  const employees: NamedItem[] = (ctx?.empsNames as NamedItem[]) ?? [
    { _id: 'e1', name: 'Employee Name' },
    { _id: 'e2', name: 'Employee Name' },
    { _id: 'e3', name: 'Employee Name' },
  ];

  const [openEmployees, setOpenEmployees] = useState(true);

  // Active state helpers
  const isActive = (path: string) => {
    if (path === '/branch') return pathname === '/branch';
    return pathname.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const base =
      'py-2 px-4 hover:bg-blue-200 transition-colors cursor-pointer rounded-r-lg';
    const active = 'bg-blue-100';
    return isActive(path) ? `${base} ${active}` : base;
  };

  const getTextClasses = (path: string) =>
    isActive(path) ? 'text-[#0D70C8] font-semibold' : 'text-muted-foreground';

  const ListLinks = ({
    items,
    hrefFor,
  }: {
    items: NamedItem[];
    hrefFor: (item: NamedItem) => string;
  }) => (
    <div className='flex flex-col gap-8 pl-12 pt-6'>
      {items.map(item => (
        <Link
          key={item._id}
          href={hrefFor(item)}
          className='text-gray-400 hover:text-[#0D70C8] transition-colors'
        >
          {item.name}
        </Link>
      ))}
    </div>
  );

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
          <div className={getNavClasses('/branch')}>
            <div className='flex items-center gap-3'>
              <BarChartIcon isActive={isActive('/branch')} />
              <span
                className={`text-lg font-medium ${getTextClasses('/branch')}`}
              >
                Overview
              </span>
            </div>
          </div>
        </Link>

        {/* Transcription */}
        <Link href='/branch/transcription/1'>
          <div className={`${getNavClasses('/branch/transcription')} mb-6`}>
            <div className='flex items-center gap-3'>
              <FileText
                className={`w-5 h-5 ${
                  isActive('/branch/transcription')
                    ? 'text-[#0D70C8]'
                    : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-lg font-medium ${getTextClasses('/branch/transcription')}`}
              >
                Transcription
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Employees */}
      <button
        type='button'
        onClick={() => setOpenEmployees(v => !v)}
        className='w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-blue-50/40'
      >
        <div className='flex items-center gap-3'>
          <UserRound className='w-5 h-5 text-gray-400' />
          <span className='text-gray-400'>Employees</span>
        </div>
        {openEmployees ? (
          <ChevronUp className='w-5 h-5 text-gray-400' />
        ) : (
          <ChevronDown className='w-5 h-5 text-gray-400' />
        )}
      </button>
      {openEmployees && (
        <ListLinks
          items={employees}
          hrefFor={e => `/branch/transcription/${e._id}`}
        />
      )}
    </div>
  );
};

export default SupervisorDashboardLayout;

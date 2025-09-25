'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, ReactNode, useEffect } from 'react';
import BarChartIcon from './icons/BarChartIcon';
import { useShiftsContext } from '../branch/layout';
import {
  Activity,
  ShoppingCart,
  UserRound,
  FileText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { MakeApiCall, Methods } from '../actions';
import { useRouter } from 'next/router';

type NamedItem = { _id: string; name: string };

const ManagerDashboardLayout = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [branch, setBranch] = useState([]);
  const [branchEmps, setbranchEmps] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get user ID from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData._id) {
          setUserId(userData._id);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  // Fetch branches when userId is available
  useEffect(() => {
    async function getBranches() {
      if (!userId) return; // Null check for userId
      
      try {
        const res = await MakeApiCall({
          method: Methods.GET,
          url: `/company/${userId}/comapny`, // Using userId instead of hardcoded ID
        });

        setBranch(res.branchs);
        console.log('branches only', res.branchs);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    
    getBranches();
  }, [userId]); // Dependency on userId

  const ctx = useShiftsContext?.();
  const employees: NamedItem[] = branchEmps;

  // Function to get employees by branch ID
  async function selectEmp(branchId: string) {
    try {
      const res = await MakeApiCall({
        method: Methods.GET,
        url: `/users/branch/${branchId}`,
      });
      console.log('Branch employees:', res);
      setbranchEmps(res.data);
    } catch (error) {
      console.error('Error fetching branch employees:', error);
    }
  }

  const branches: NamedItem[] = branch;

  const [openBranches, setOpenBranches] = useState(true);
  const [openEmployees, setOpenEmployees] = useState(true);

  // --- Active helpers ---
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

  // explicit flags for clarity
  const isOverviewActive = pathname === '/branch';
  const isTranscriptionActive = pathname.startsWith('/branch/transcription');
  const isEmployeesActive = pathname.startsWith('/branch/employees');
  const isBranchesActive = pathname.startsWith('/branch/branches');

  // --- Small UI helper (collapsible header) ---
  const CollapsibleHeader = ({
    open,
    onToggle,
    icon,
    title,
    activeWhenOpenClasses,
    inactiveClasses,
  }: {
    open: boolean;
    onToggle: () => void;
    icon: ReactNode;
    title: string;
    activeWhenOpenClasses: string;
    inactiveClasses: string;
  }) => (
    <button
      type='button'
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
        open ? 'bg-blue-100' : 'hover:bg-blue-50'
      }`}
    >
      <div className='flex items-center gap-3'>
        <span className={open ? 'text-[#0D70C8]' : 'text-gray-400'}>
          {icon}
        </span>
        <span className={`${open ? activeWhenOpenClasses : inactiveClasses}`}>
          {title}
        </span>
      </div>
      {open ? (
        <ChevronUp
          className={`w-5 h-5 ${open ? 'text-[#0D70C8]' : 'text-gray-400'}`}
        />
      ) : (
        <ChevronDown className='w-5 h-5 text-gray-400' />
      )}
    </button>
  );

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
          {(item as any).firstName}
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
              <BarChartIcon isActive={isOverviewActive} />
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
                  isTranscriptionActive
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

      {/* Branches (left navigates, right chevron toggles) */}
      <div
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors rounded-r-lg ${
          isBranchesActive ? 'bg-blue-100' : 'hover:bg-blue-50'
        }`}
      >
        {/* Left: navigate to /branch/branches */}
        <button
          type='button'
          onClick={() => router.push('/branch/branches')}
          className='flex items-center gap-3 flex-1 text-left'
        >
          <span
            className={isBranchesActive ? 'text-[#0D70C8]' : 'text-gray-400'}
          >
            <ShoppingCart className='w-5 h-5' />
          </span>
          <span
            className={
              isBranchesActive
                ? 'text-[#0D70C8] font-semibold'
                : 'text-gray-400'
            }
          >
            Branches
          </span>
        </button>

        {/* Right: chevron only toggles collapse */}
        <button
          type='button'
          onClick={() => setOpenBranches(v => !v)}
          className='ml-2'
          aria-label={openBranches ? 'Collapse branches' : 'Expand branches'}
        >
          {openBranches ? (
            <ChevronUp
              className={`w-5 h-5 ${
                isBranchesActive ? 'text-[#0D70C8]' : 'text-gray-400'
              }`}
            />
          ) : (
            <ChevronDown
              className={`w-5 h-5 ${
                isBranchesActive ? 'text-[#0D70C8]' : 'text-gray-400'
              }`}
            />
          )}
        </button>
      </div>

      {openBranches && (
        <div className='flex flex-col gap-8 pl-12 pt-6 pb-4'>
          {branches.map(b => (
            <button
              key={b._id}
              onClick={() => selectEmp(b._id)} // Call selectEmp with branch ID when clicked
              className='text-left text-gray-400 hover:text-[#0D70C8] transition-colors'
            >
              {(b as any).name}
            </button>
          ))}
        </div>
      )}

      {/* Employees */}
      <div
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors rounded-r-lg ${
          isEmployeesActive ? 'bg-blue-100' : 'hover:bg-blue-50/40'
        }`}
      >
        {/* Left side: icon + text, clicking here navigates */}
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

        {/* Right side: chevron, clicking here just toggles collapse */}
        <button
          type='button'
          onClick={() => setOpenEmployees(v => !v)}
          className='ml-2'
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
        <ListLinks
          items={employees}
          hrefFor={e => `/branch/transcription/${e._id}`}
        />
      )}
    </div>
  );
};

export default ManagerDashboardLayout;
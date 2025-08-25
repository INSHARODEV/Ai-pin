'use client';

import * as React from 'react';
import { Activity, LogOut } from 'lucide-react';

export interface SalesHeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export default function SalesHeader({
  userName = 'Full Name',
  onLogout,
}: SalesHeaderProps) {
  const [showLogout, setShowLogout] = React.useState(false);

  const handleIconClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowLogout(false);
  };

  return (
    <header className='border-b border-gray-200 bg-white px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600'>
            <Activity className='h-5 w-5 text-white' />
          </div>
          <span className='text-xl font-semibold text-gray-900'>AI Pin</span>
        </div>

        <div className='relative flex flex-col items-end space-y-2'>
          {/* User Info Section with Toggle */}
          <div className='flex items-center justify-center'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <span className='flex items-center justify-center rounded-full bg-teal-500 p-2 text-sm font-medium text-white'>
                  {userName.charAt(0)}
                </span>
                <span className='font-semibold text-gray-900'>{userName}</span>
              </div>
              <button
                onClick={handleIconClick}
                className={`text-gray-600 transition-transform duration-300 ${showLogout ? 'rotate-180' : ''}`}
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Conditionally render the Logout button with smooth animation */}
          <div
            className={`${
              showLogout ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            } w-full overflow-hidden transition-all duration-500 ease-in-out`}
          >
            <button
              onClick={handleLogout}
              className='w-full rounded-md border border-red-600 px-4 py-2 font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50'
            >
              <LogOut className='mr-2 inline h-4 w-4' />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

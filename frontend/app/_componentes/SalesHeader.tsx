'use client';

import * as React from 'react';
import { Activity, LogOut } from 'lucide-react';
import Logo from './icons/Logo';

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
    <header className='bg-white shadow-sm px-16 py-4 z-0 relative'>
      <div className='flex items-center justify-between'>
        {/* Left side */}
        <div className='flex items-center space-x-3'>
          <Logo/>
          <span className='text-xl font-semibold text-gray-900'>AI Pin</span>
        </div>

        {/* Right side */}
        <div className='relative flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-white'>
              {userName.charAt(0)}
            </span>

            <span className='font-semibold text-gray-900'>{userName}</span>
          </div>
          <button
            onClick={handleIconClick}
            className={`text-gray-600 transition-transform duration-300 ${
              showLogout ? 'rotate-180' : ''
            }`}
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

          {/* Floating logout dropdown */}
          {showLogout && (
            <div className='absolute right-0 top-12 z-50 w-40 rounded-md border border-gray-200 bg-white shadow-lg animate-fade-in'>
              <button
                onClick={handleLogout}
                className='w-full px-4 py-2 text-left font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2'
              >
                <LogOut className='h-4 w-4' />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import * as React from 'react';
import { LogOut } from 'lucide-react';
import Logo from './icons/Logo';
import { logout } from '../utils/logout';

export interface SalesHeaderProps {
  userName?: string; // optional override
}

export default function SalesHeader({ userName }: SalesHeaderProps) {
  const [showLogout, setShowLogout] = React.useState(false);
  const [displayName, setDisplayName] = React.useState<string>('');

  React.useEffect(() => {
    if (userName) {
      setDisplayName(userName);
      return;
    }
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        const name =
          u?.firstName?.trim() ||
          (u?.email ? String(u.email).split('@')[0] : '') ||
          '';
        setDisplayName(name);
      }
    } catch {
      // ignore parse errors; keep fallback
    }
  }, [userName]);

  const handleIconClick = () => setShowLogout(v => !v);
  const handleLogout = () => {
    logout();
    setShowLogout(false);
  };

  const initial = (displayName || 'F').trim().charAt(0).toUpperCase();

  return (
    <header className='relative z-0 bg-white px-16 py-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        {/* Left side */}
        <div className='flex items-center space-x-3'>
          <Logo />
          <span className='text-xl font-semibold text-gray-900'>AI Pin</span>
        </div>

        {/* Right side */}
        <div className='relative flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-white'>
              {initial}
            </span>
            <span className='font-semibold text-gray-900'>{displayName}</span>
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

          {showLogout && (
            <div className='animate-fade-in absolute right-0 top-12 z-50 w-40 rounded-md border border-gray-200 bg-white shadow-lg'>
              <button
                onClick={handleLogout}
                className='flex w-full items-center gap-2 px-4 py-2 text-left font-semibold text-red-600 hover:bg-red-50'
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

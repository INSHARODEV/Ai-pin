// components/SortBy.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

/** Any string keys are fine: 'dateJoined', 'branches', 'sales', etc. */
export type SortKey = string;
export type SortDir = 'desc' | 'asc';
export type SortValue = { key: SortKey; dir: SortDir };
export type SortOption = { key: SortKey; dir: SortDir; label: string };

const ACCENT = '#0D70C8';

/** Default options (used if you don't pass your own) */
export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { key: 'dateJoined', dir: 'desc', label: 'Date Joined (Newest first)' },
  { key: 'dateJoined', dir: 'asc', label: 'Date Joined (Oldest first)' },
  { key: 'branches', dir: 'desc', label: 'Branch count (High to low)' },
  { key: 'branches', dir: 'asc', label: 'Branch count (Low to high)' },
];

function isActive(a: SortValue, b: SortValue) {
  return a.key === b.key && a.dir === b.dir;
}

/** Helper to get label for a value with the provided options */
export function labelFor(
  value: SortValue,
  options: SortOption[] = DEFAULT_SORT_OPTIONS
) {
  const found = options.find(o => isActive(o, value));
  return found?.label ?? '';
}

export interface SortByProps {
  value: SortValue;
  onChange: (key: SortKey, dir: SortDir) => void;
  options?: SortOption[]; // override the menu items
  title?: string; // defaults to "Sort by:"
}

export default function SortBy({
  value,
  onChange,
  options = DEFAULT_SORT_OPTIONS,
  title = 'Sort by:',
}: SortByProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (!menuRef.current || !btnRef.current) return;
      if (!menuRef.current.contains(t) && !btnRef.current.contains(t))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className='relative w-full'>
      {/* Pill */}
      <button
        ref={btnRef}
        type='button'
        onClick={() => setOpen(o => !o)}
        className='flex w-full items-center justify-start gap-2 rounded-xl bg-[#FEFEFE] shadow-custom px-4 py-3 text-sm text-gray-700'
        aria-haspopup='menu'
        aria-expanded={open}
      >
        <span
          className='grid h-6 w-6 place-items-center rounded-full'
          style={{ backgroundColor: '#E8F1FB' }}
        >
          {/* double chevron icon */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='h-4 w-4'
            fill={ACCENT}
            aria-hidden='true'
          >
            <path d='M7 14l5-5 5 5H7z' />
            <path d='M7 10l5 5 5-5H7z' />
          </svg>
        </span>
        <span className='font-medium'>{title}</span>
        <span className='font-semibold text-gray-900'>
          {labelFor(value, options)}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={menuRef}
          role='menu'
          aria-label='Sort options'
          className='absolute z-20 mt-2 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-gray-200'
        >
          {options.map(opt => {
            const active = isActive(opt, value);
            return (
              <button
                key={`${opt.key}-${opt.dir}`}
                type='button'
                onClick={() => {
                  onChange(opt.key, opt.dir);
                  setOpen(false);
                }}
                className={[
                  'block w-full text-left rounded-xl px-4 py-3 text-[15px]',
                  active
                    ? 'bg-blue-50 ring-1 ring-blue-100 text-gray-900'
                    : 'hover:bg-gray-50 text-gray-800',
                ].join(' ')}
                role='menuitem'
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

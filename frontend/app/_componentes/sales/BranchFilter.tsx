// components/sales/BranchFilter.tsx
'use client';

import * as React from 'react';

export default function BranchFilter({
  branches,
  value,
  onChange,
}: {
  branches: string[];
  value: string; // 'All Branches' or branch name
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const popRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current || !popRef.current) return;
      if (!btnRef.current.contains(t) && !popRef.current.contains(t))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className='relative w-full'>
      <button
        ref={btnRef}
        type='button'
        onClick={() => setOpen(o => !o)}
        className='flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm'
      >
        <span className='grid h-6 w-6 place-items-center rounded-full bg-[#E8F1FB]'>
          {/* funnel */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            viewBox='0 0 24 24'
            fill='#0D70C8'
          >
            <path d='M3 4h18l-7 8v6l-4 2v-8L3 4z' />
          </svg>
        </span>
        <span className='font-medium'>Filter by:</span>
        <span className='font-semibold text-gray-900'>{value}</span>
      </button>

      {open && (
        <div
          ref={popRef}
          className='absolute z-20 mt-2 w-[280px] rounded-2xl bg-white p-2 shadow-xl ring-1 ring-gray-200'
          role='menu'
        >
          {['All Branches', ...branches].map(b => (
            <button
              key={b}
              onClick={() => {
                onChange(b);
                setOpen(false);
              }}
              className={`block w-full rounded-xl px-4 py-3 text-left text-[15px] ${
                b === value
                  ? 'bg-blue-50 ring-1 ring-blue-100 text-gray-900'
                  : 'hover:bg-gray-50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// components/ui/KebabMenu.tsx
'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';

export type KebabItem = {
  label: string;
  onClick: () => void;
  tone?: 'danger' | 'default';
  icon?: React.ReactNode;
};

export default function KebabMenu({ items }: { items: KebabItem[] }) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const popRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (!btnRef.current || !popRef.current) return;
      if (!btnRef.current.contains(t) && !popRef.current.contains(t)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className='relative'>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        aria-haspopup='menu'
        aria-expanded={open}
        className='rounded-full p-2 text-gray-500 hover:bg-gray-100'
      >
        <MoreVertical className='h-5 w-5' />
      </button>

      {open && (
        <div
          ref={popRef}
          role='menu'
          className='absolute right-0 z-20 mt-2 w-56 rounded-xl bg-white p-2 shadow-xl ring-1 ring-gray-200'
        >
          {items.map((it, i) => (
            <button
              key={i}
              role='menuitem'
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                it.tone === 'danger'
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => {
                setOpen(false);
                it.onClick();
              }}
            >
              {it.icon}
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// components/ui/Modal.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string; // e.g. "max-w-lg", "max-w-xl"
  hideCloseButton?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-lg',
  hideCloseButton = false,
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-[100] grid place-items-center'>
      {/* overlay */}
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onClose}
        aria-hidden='true'
      />
      {/* modal */}
      <div
        role='dialog'
        aria-modal='true'
        className={`relative mx-4 w-full ${maxWidthClass} rounded-2xl bg-white p-6 shadow-xl`}
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            aria-label='Close'
            className='absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100'
          >
            <X className='h-5 w-5' />
          </button>
        )}
        {title ? (
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>{title}</h3>
        ) : null}
        {children}
      </div>
    </div>
  );
}

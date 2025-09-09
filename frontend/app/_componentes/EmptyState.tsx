'use client';

import Image from 'next/image';
import React from 'react';

interface EmptyStateProps {
  image: string; // path in /public (e.g. "/images/empty-emps.png")
  title?: string; // headline text
  message: string; // body text
  ctaLabel?: string; // button label (optional)
  ctaHref?: string; // link if it's navigation
  onCtaClick?: () => void; // click handler if it's a button
}

export default function EmptyState({
  image,
  title = 'Nothing Found!',
  message,
  ctaLabel,
  ctaHref,
  onCtaClick,
}: EmptyStateProps) {
  return (
    <div className='w-full flex flex-col items-center text-center py-10'>
      {/* Illustration */}
      <div className='mb-6'>
        <Image
          src={image}
          alt='Empty state illustration'
          width={200}
          height={200}
          priority
        />
      </div>

      {/* Text */}
      <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
      <p className='mt-2 max-w-md text-gray-600'>{message}</p>

      {/* CTA */}
      {ctaLabel && (
        <div className='mt-6'>
          {ctaHref ? (
            <a
              href={ctaHref}
              className='inline-flex items-center gap-2 rounded-lg bg-[#1976D2] px-7 py-1 text-white font-bold text-sm shadow hover:opacity-90'
            >
              {ctaLabel}
              <span className='text-lg leading-none'>+</span>
            </a>
          ) : (
            <button
              type='button'
              onClick={onCtaClick}
              className='inline-flex items-center gap-2 rounded-lg bg-[#1976D2] px-7 py-1 text-white font-bold text-sm shadow hover:opacity-90'
            >
              {ctaLabel}
              <span className='text-lg leading-none'>+</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

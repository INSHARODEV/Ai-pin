'use client';

import React from 'react';
import Image from 'next/image';

type Variant = 'blue' | 'green' | 'red' | 'orange';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  variant: Variant;
  icon?: React.ReactNode; // only required if variant = "blue"
 
}

const variantStyles: Record<Variant, string> = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  red: 'bg-red-50',
  orange: 'bg-orange-50',
};

export function StatCard({
  title,
  value,
  description,
  variant,
  icon,
 
}: StatCardProps) {
  let variantIcon: React.ReactNode;

  if (variant === 'green') {
    variantIcon = (
      <Image src='/arrow-up.svg' alt='Up' width={18} height={18} priority />
    );
  } else if (variant === 'red') {
    variantIcon = (
      <Image src='/arrow-down.svg' alt='Down' width={18} height={18} priority />
    );
  } else if (variant === 'orange') {
    variantIcon = (
      <Image
        src='/arrow-minimize.svg'
        alt='Minimize'
        width={18}
        height={18}
        priority
      />
    );
  } else if (variant === 'blue') {
    // variantIcon = icon ?? null;
    variantIcon = (
      <Image src='/profile-icon.svg' alt='Up' width={18} height={18} priority />
    );
  }

  return (
    <div className='rounded-2xl shadow-md flex w-full flex-col justify-between bg-white'>
      <div className='px-6 py-4 flex flex-col gap-4'>
        <h3 className='text-xl font-semibold'>{title}</h3>
        <div className='flex items-center justify-between'>
          <p className='text-3xl font-semibold text-gray-900'>{value}</p>
          {variantIcon && (
            <div className={`${variantStyles[variant]} p-2 rounded-full`}>
              {variantIcon}
            </div>
          )}
        </div>
      </div>
      <p
        className={`px-6 py-3 w-full ${variantStyles[variant]} rounded-b-2xl text-sm`}
      >
        {description}
      </p>
    </div>
  );
}

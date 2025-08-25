'use client';

import { ArrowUp, CircleArrowUp, CircleArrowDown } from 'lucide-react';
import React from 'react';
interface props {
  title: string;
  rating: number;
  incresing: boolean;
}
export default function StatusCard({ incresing, rating, title }: props) {
  return (
    <div className='flex h-40 flex-1 flex-col rounded-md bg-white p-6'>
      <p>{title}</p>

      <p className='my-5 flex items-end justify-between text-6xl font-bold'>
        <span>{rating}%</span>
        {incresing ? (
          <CircleArrowUp size={32} />
        ) : (
          <CircleArrowDown size={32} />
        )}
      </p>
    </div>
  );
}

import * as React from 'react';
import { cn } from '@/app/lib/cn';
import { BadgeVariant } from '@/app/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
  destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
  outline: 'text-gray-900 border-gray-300',
  success: 'border-transparent bg-green-600 text-white hover:bg-green-700',
  warning: 'border-transparent bg-yellow-600 text-white hover:bg-yellow-700',
  info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
  neutral: 'border-transparent bg-gray-500 text-white hover:bg-gray-600',
};

export function Badge({
  variant = 'default',
  className,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  return <div className={cn(base, variants[variant], className)} {...props} />;
}

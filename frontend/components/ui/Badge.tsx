// components/ui/Badge.tsx
import * as React from 'react';

type Variant = 'success' | 'warning' | 'destructive' | 'neutral' | 'secondary';

const VARIANT_STYLES: Record<Variant, string> = {
  success: 'bg-green-100 text-green-800 ring-1 ring-green-200',
  warning: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
  destructive: 'bg-red-100 text-red-800 ring-1 ring-red-200',
  neutral: 'bg-gray-100 text-gray-800 ring-1 ring-gray-200',
  secondary: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({
  variant = 'secondary',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    />
  );
}

export default Badge;

// app/_guards/role-guard.tsx
'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Role = 'SUPERVISOR' | 'SELLER' | 'ADMIN' | string;

function getUserRole(): Role | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.role ?? null;
  } catch {
    return null;
  }
}

// What each role is allowed to access:
const ALLOW: Record<string, string[]> = {
  SUPERVISOR: ['/branch'],
  SELLER: ['/sales'],
  ADMIN: ['/forms', '/branch', '/sales', '/admin', '/forms'],
  MANAGER: ['/forms', '/branch', '/sales'],
};

// Default landing for a role:
const DEFAULT_FOR_ROLE: Record<string, string> = {
  SUPERVISOR: '/branch',
  SELLER: '/sales',
  ADMIN: '/admin',
};

const PUBLIC_PATHS = new Set<string>(['/login', '/']);

export function RoleGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  const destination = useMemo(() => {
    // Public pages: let through
    if (PUBLIC_PATHS.has(pathname)) return null;

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (!token) return '/login';

    const role = getUserRole();
    if (!role) return '/login';

    const allowedPrefixes = ALLOW[role] ?? [];
    const isAllowed = allowedPrefixes.some(p => pathname.startsWith(p));
    if (isAllowed) return null; // stay

    // Not allowed: bounce to the role’s default home
    return DEFAULT_FOR_ROLE[role] ?? '/login';
  }, [pathname]);

  useEffect(() => {
    if (destination) {
      router.replace(destination);
    }
    setChecking(false);
  }, [destination, router]);

  if (checking) {
    return (
      <div className='min-h-screen grid place-items-center'>
        <div className='flex items-center gap-3 text-gray-600'>
          <span className='h-3 w-3 animate-pulse rounded-full bg-gray-400' />
          <span>Checking permissions…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

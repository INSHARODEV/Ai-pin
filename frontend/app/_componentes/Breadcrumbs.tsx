// app/_componentes/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function capitalize(s: string) {
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}

function normalize(path: string) {
  return path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
}

export default function Breadcrumbs({
  rootHref = '/admin/companies',
  rootLabel = 'Main dashboard',
}: {
  rootHref?: string;
  rootLabel?: string;
}) {
  const pathname = usePathname(); // e.g. /admin/companies/123/branches/456

  // If we're exactly on the companies root, show nothing
  if (normalize(pathname) === normalize(rootHref)) return null;

  const parts = pathname.split('/').filter(Boolean);
  const baseIdx = parts.indexOf('companies'); // -1 if not under companies
  const crumbs: Array<{ href: string; label: string }> = [];

  if (baseIdx >= 0) {
    // 1) root
    crumbs.push({ href: rootHref, label: rootLabel });

    // 2) subsequent segments
    for (let i = baseIdx + 1; i < parts.length; i++) {
      const seg = parts[i];
      const prev = parts[i - 1] ?? '';
      let label = seg;

      // Heuristics for dynamic IDs
      const looksLikeId = /^[0-9a-f-]{6,}$/i.test(seg) || /^\d+$/.test(seg);
      if (looksLikeId) {
        if (prev === 'companies') label = 'Company';
        else if (prev === 'branches') label = 'Branch';
        else label = capitalize(prev || 'Item');
      } else {
        if (seg === 'branches') label = 'Branches';
        else if (seg === 'sales') label = 'Sales';
        else label = capitalize(seg);
      }

      const href = '/' + parts.slice(0, i + 1).join('/');
      crumbs.push({ href, label });
    }
  } else {
    // fallback if not under /companies
    crumbs.push({ href: pathname, label: capitalize(parts.at(-1) ?? 'Home') });
  }

  return (
    <nav
      aria-label='Breadcrumb'
      className='flex items-center gap-2 text-sm font-poppins'
    >
      {crumbs.map((c, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span
            key={`${c.href}::${idx}`}
            className='inline-flex items-center gap-2'
          >
            {isLast ? (
              <span className='text-[#1D1D1D] font-semibold'>{c.label}</span>
            ) : (
              <Link href={c.href} className='text-[#666666] hover:underline'>
                {c.label}
              </Link>
            )}
            {!isLast && (
              <svg
                aria-hidden='true'
                viewBox='0 0 20 20'
                className='h-3 w-3 text-gray-400'
                fill='currentColor'
              >
                <path d='M7.05 4.55L11.5 9l-4.45 4.45L8 14.5l5.5-5.5L8 3.5l-.95 1.05z' />
              </svg>
            )}
          </span>
        );
      })}
    </nav>
  );
}

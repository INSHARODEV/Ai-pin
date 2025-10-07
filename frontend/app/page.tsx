  // 'use client';

import RealTIme from "./_componentes/RealTIme";

 
export default function Page() {
  return (
    <RealTIme />
  )
}
// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';

// type Role = 'SUPERVISOR' | 'SELLER' | string;

// function getUserRole(): Role | null {
//   try {
//     const raw = localStorage.getItem('user');
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     return parsed?.role ?? null;
//   } catch {
//     return null;
//   }
// }

// export default function Home() {
//   const router = useRouter();
//   const [checking, setChecking] = useState(true);

//   const destination = useMemo(() => {
//     const token =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('accessToken')
//         : null;
//     if (!token) return '/login';

//     const role = getUserRole();
//     if (!role) return '/login';

//     const routeByRole: Record<Role, string> = {
//       SUPERVISOR: '/branch',
//       SELLER: '/sales',
//     };

//     return routeByRole[role] ?? '/login';
//   }, []);

//   useEffect(() => {
//     router.replace(destination);
//     setChecking(false);
//   }, [destination, router]);

//   // Minimal fallback UI while we redirect (prevents layout flash)
//   if (checking) {
//     return (
//       <div className='min-h-screen grid place-items-center'>
//         <div className='flex items-center gap-3 text-gray-600'>
//           <span className='h-3 w-3 animate-pulse rounded-full bg-gray-400' />
//           <span>Checking session…</span>
//         </div>
//       </div>
//     );
//   }

//   // Optional: if redirect is blocked for some reason, show neutral landing.
//   return (
//     <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
//       <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'></main>
//       <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'></footer>
//     </div>
//   );
// }

 
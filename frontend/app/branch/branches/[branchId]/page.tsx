// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useShiftsContext } from '@/app/branch/layout';
// import { StatCard } from '@/app/_componentes/reusable/StatCard';
// import BranchShiftsTable, {
//   BranchShiftRow,
// } from '@/app/_componentes/BranchShiftsTable';
// import BranchEmployeesList, {
//   BranchEmployeeItem,
// } from '@/app/_componentes/BranchEmployeesList';
// import { MakeApiCall, Methods } from '@/app/actions';

// export default function BranchPage() {

//   const { branchId } = useParams<{ branchId: string }>();
//   const { shifts } = useShiftsContext();
//   const [branche,setBranch]=useState({} as any)
//   const [actionsOpen, setActionsOpen] = React.useState(false);
//   const actionsBtnRef = React.useRef<HTMLButtonElement | null>(null);
//   const actionsMenuRef = React.useRef<HTMLDivElement | null>(null);

  
//   React.useEffect(() => {
     


//     if (!actionsOpen) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === 'Escape' && setActionsOpen(false);
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [actionsOpen]) 
//   useEffect(()=>{
//     async function  getBranch(){
//       const bs=await MakeApiCall({method:Methods.GET,url:`/branch/branch/${branchId}`})
//     setBranch(bs)
//     }
      
//        getBranch()
//   },[])
//   // Close if focus leaves trigger+menu
//   React.useEffect(() => {
//     if (!actionsOpen) return;
//     const onFocus = (e: FocusEvent) => {
//       const t = e.target as Node;
//       if (
//         t &&
//         !actionsMenuRef.current?.contains(t) &&
//         !actionsBtnRef.current?.contains(t)
//       )
//         setActionsOpen(false);
//     };
//     window.addEventListener('focusin', onFocus);
//     return () => window.removeEventListener('focusin', onFocus);
//   }, [actionsOpen]);

//   // ---- demo header data (replace with real) ----
//   const branch = {
//     name: 'Branch Name',
//     mood: 'Friendly',
//     supervisor: 'Supervisor Name',
//     salesCount: 9,
//     rating: 4.2, // Overall Performance Rating
//     changePct: 85, // Performance Change (%)
//   };

//   // Right panel employees (replace with real)
//   const employees: BranchEmployeeItem[] = [
//     {
//       id: 'e1',
//       name: 'Sales Name',
//       email: 'sales.email@gmail.com',
//       status: 'green',
//     },
//     {
//       id: 'e2',
//       name: 'Sales Name',
//       email: 'sales.email@gmail.com',
//       status: 'red',
//     },
//     {
//       id: 'e3',
//       name: 'Sales Name',
//       email: 'sales.email@gmail.com',
//       status: 'orange',
//     },
//     {
//       id: 'e4',
//       name: 'Sales Name',
//       email: 'sales.email@gmail.com',
//       status: 'green',
//     },
//   ];

//   // Map context shifts to table rows (filter by branch if you have it on shift)
//   const rows: BranchShiftRow[] = useMemo(() => {
//     const arr = Array.isArray(shifts) ? shifts : [];
//     return (
//       arr
//         // .filter((s:any)=> String(s.branchId)===String(branchId))
//         .slice(0, 8)
//         .map((s: any, i: number) => ({
//           id: String(s._id ?? s.id ?? i),
//           name: s.fullName ?? 'Full Name',
//           date: s.date ?? '12th August 2025',
//           time: s.startTime ?? '12:45 PM',
//           performanceLabel:
//             s.performanceLabel ??
//             (typeof s.performance === 'number'
//               ? s.performance === 0
//                 ? 'Critical'
//                 : s.performance > 80
//                   ? 'High'
//                   : 'Average'
//               : (s.performance ?? (i === 0 ? 'In Progress' : 'Average'))), // first row demo
//           status:
//             s.status ??
//             (i % 5 === 0
//               ? 'gray'
//               : (['green', 'orange', 'red'] as const)[i % 3]),
//         }))
//     );
//   }, [shifts, branchId]);

//   return (
//     <div className='p-6'>
//       {/* Header grid */}
//       <section className='flex gap-2'>
//         {/* Left: Branch summary */}
//         <div className='rounded-2xl bg-white shadow-custom p-5 w-2/3 flex flex-col gap-6'>
//           <div className='flex items-start justify-between'>
//             <div className='flex flex-col gap-2'>
//               <div className='flex items-center gap-3'>
//                 <h1 className='text-2xl font-semibold text-gray-900'>
//                   {branch.name}
//                 </h1>
//                 <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
//                   {branch.mood}
//                 </span>
//               </div>

//               <div className='flex flex-col gap-5'>
//                 <div>
//                   <div className='text-gray-400 font-semibold text-xs'>
//                     Supervised by
//                   </div>
//                   <div className='text-gray-900 font-medium leading-tight text-lg'>
//                     {branch.supervisor}
//                   </div>
//                 </div>
//                 <div>
//                   <div className='text-gray-400 font-semibold text-xs'>
//                     Sales Representatives
//                   </div>
//                   <div className='text-gray-900 font-medium leading-tight text-lg'>
//                     {branch.salesCount} Persons
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Kebab trigger */}
//             <div className='relative'>
//               <button
//                 ref={actionsBtnRef}
//                 type='button'
//                 aria-haspopup='menu'
//                 aria-expanded={actionsOpen}
//                 aria-label='Branch actions'
//                 onClick={() => setActionsOpen(v => !v)}
//                 className='rounded-full p-2 hover:bg-gray-100 text-gray-600'
//               >
//                 {/* three dots icon */}
//                 <svg
//                   viewBox='0 0 24 24'
//                   className='h-5 w-5'
//                   fill='currentColor'
//                 >
//                   <circle cx='5' cy='12' r='2' />
//                   <circle cx='12' cy='12' r='2' />
//                   <circle cx='19' cy='12' r='2' />
//                 </svg>
//               </button>

//               {/* <div className='px-4 pb-3 text-sm'>
//                 <Link
//                   href='#'
//                   className='text-blue-600 hover:underline'
//                   onClick={() => setActionsOpen(false)}
//                 >
//                   View
//                 </Link>
//               </div> */}
//               {actionsOpen && (
//                 <>
//                   {/* backdrop for outside click */}
//                   <div
//                     className='fixed inset-0 z-40'
//                     onClick={() => setActionsOpen(false)}
//                   />
//                   {/* popup panel */}
//                   <div
//                     ref={actionsMenuRef}
//                     role='menu'
//                     aria-label='Branch actions'
//                     className='absolute right-0 z-50 mt-2 w-80 max-w-xs overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-custom'
//                   >
//                     <button
//                       type='button'
//                       className='flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left text-gray-700'
//                       // onClick={() => setEditBranchOpen(true)}
//                       onClick={() => setActionsOpen(false)}
//                       role='menuitem'
//                     >
//                       <span className='inline-flex items-center gap-2'>
//                         ✏️ Edit Info
//                       </span>
//                     </button>

//                     <button
//                       type='button'
//                       className='flex w-full items-center justify-between px-4 py-3 text-left text-rose-600 hover:bg-rose-50'
//                       // onClick={() => setDeleteBranchOpen(true)}
//                       onClick={() => setActionsOpen(false)}
//                       role='menuitem'
//                     >
//                       <span className='inline-flex items-center gap-2'>
//                         🗑️ Delete Branch
//                       </span>
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Stat cards row (two) */}
//           <div className='mt-5 grid gap-4 md:grid-cols-2'>
//             <StatCard
//               title='Overall Performance Rating'
//               value={branch.rating}
//               description='Average Across All Branches'
//               variant='green'
//             />
//             <StatCard
//               title='Performance Change'
//               value={`+${branch.changePct}%`}
//               description='This week vs Last week'
//               variant='green'
//             />
//           </div>
//         </div>

//         {/* Right: Employees list card */}
//         <div className='rounded-2xl bg-white shadow-custom p-5 w-1/3'>
//           <div className='mb-3 text-gray-900 font-semibold'>Employees :</div>
//           <BranchEmployeesList employees={employees} />
//         </div>
//       </section>

//       {/* Last Shifts */}
//       <section className='space-y-3'>
//         <div className='text-sm font-semibold text-gray-800'>Last Shifts</div>
//         <BranchShiftsTable rows={rows} />
//       </section>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useShiftsContext } from '@/app/branch/layout';
import { StatCard } from '@/app/_componentes/reusable/StatCard';
import BranchShiftsTable, {
  BranchShiftRow,
} from '@/app/_componentes/BranchShiftsTable';
import BranchEmployeesList, {
  BranchEmployeeItem,
} from '@/app/_componentes/BranchEmployeesList';
import { MakeApiCall, Methods } from '@/app/actions';

export default function BranchPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const { shifts } = useShiftsContext();
  const [branche, setBranch] = useState({} as any);
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const actionsBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const actionsMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!actionsOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setActionsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actionsOpen]);

  useEffect(() => {
    async function getBranch() {
      const bs = await MakeApiCall({
        method: Methods.GET,
        url: `/branch/branch/${branchId}`,
      });
      setBranch(bs);
    }

    getBranch();
  }, []);

  // Close if focus leaves trigger+menu
  React.useEffect(() => {
    if (!actionsOpen) return;
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Node;
      if (
        t &&
        !actionsMenuRef.current?.contains(t) &&
        !actionsBtnRef.current?.contains(t)
      )
        setActionsOpen(false);
    };
    window.addEventListener('focusin', onFocus);
    return () => window.removeEventListener('focusin', onFocus);
  }, [actionsOpen]);

  // Generate branch status/mood based on performance or default to "Active"
  const getBranchMood = () => {
    if (!branche.shifts || branche.shifts.length === 0) return 'Active';
    // You can add logic here to determine mood based on performance metrics
    return 'Active';
  };

  // Create employees array from API response
  const employees: BranchEmployeeItem[] = useMemo(() => {
    if (!branche.sellers) return [];
    
    return branche.sellers.map((seller: any, index: number) => ({
      id: seller._id,
      name: seller.firstName,
      email: seller.email,
      status: (['green', 'orange', 'red'] as const)[index % 3], // Rotate through statuses
    }));
  }, [branche.sellers]);

  // Map shifts to table rows
  const rows: BranchShiftRow[] = useMemo(() => {
    if (!branche.shifts || !Array.isArray(branche.shifts)) return [];
    
    return branche.shifts
      .slice(0, 8)
      .map((shift: any, i: number) => {
        // Find the employee for this shift
        const employee = branche.sellers?.find((seller: any) => seller._id === shift.emp);
        
        return {
          id: String(shift._id),
          name: employee ? employee.firstName : 'Unknown Employee',
          date: new Date(shift.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          time: new Date(shift.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          performanceLabel: shift.performance 
            ? (shift.performance > 80 ? 'High' : shift.performance > 50 ? 'Average' : 'Critical')
            : (i === 0 ? 'In Progress' : 'Average'),
          status: (i % 5 === 0 ? 'gray' : (['green', 'orange', 'red'] as const)[i % 3]),
        };
      });
  }, [branche.shifts, branche.sellers]);

  // Calculate performance metrics
  const getPerformanceRating = () => {
    if (!branche.shifts || branche.shifts.length === 0) return 4.0;
    // Add your performance calculation logic here
    return 4.2; // Default for now
  };

  const getPerformanceChange = () => {
    // Add logic to calculate week-over-week performance change
    return 85; // Default for now
  };

  return (
    <div className='p-6'>
      {/* Header grid */}
      <section className='flex gap-2'>
        {/* Left: Branch summary */}
        <div className='rounded-2xl bg-white shadow-custom p-5 w-2/3 flex flex-col gap-6'>
          <div className='flex items-start justify-between'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  {branche.name || 'Branch Name'}
                </h1>
                <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
                  {getBranchMood()}
                </span>
              </div>

              <div className='flex flex-col gap-5'>
                <div>
                  <div className='text-gray-400 font-semibold text-xs'>
                    Supervised by
                  </div>
                  <div className='text-gray-900 font-medium leading-tight text-lg'>
                    {branche.supervisor?.firstName || 'No Supervisor Assigned'}
                  </div>
                </div>
                <div>
                  <div className='text-gray-400 font-semibold text-xs'>
                    Sales Representatives
                  </div>
                  <div className='text-gray-900 font-medium leading-tight text-lg'>
                    {branche.salesCount || 0} Persons
                  </div>
                </div>
              </div>
            </div>

            {/* Kebab trigger */}
            <div className='relative'>
              <button
                ref={actionsBtnRef}
                type='button'
                aria-haspopup='menu'
                aria-expanded={actionsOpen}
                aria-label='Branch actions'
                onClick={() => setActionsOpen(v => !v)}
                className='rounded-full p-2 hover:bg-gray-100 text-gray-600'
              >
                {/* three dots icon */}
                <svg
                  viewBox='0 0 24 24'
                  className='h-5 w-5'
                  fill='currentColor'
                >
                  <circle cx='5' cy='12' r='2' />
                  <circle cx='12' cy='12' r='2' />
                  <circle cx='19' cy='12' r='2' />
                </svg>
              </button>

              {actionsOpen && (
                <>
                  {/* backdrop for outside click */}
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setActionsOpen(false)}
                  />
                  {/* popup panel */}
                  <div
                    ref={actionsMenuRef}
                    role='menu'
                    aria-label='Branch actions'
                    className='absolute right-0 z-50 mt-2 w-80 max-w-xs overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-custom'
                  >
                    <button
                      type='button'
                      className='flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left text-gray-700'
                      onClick={() => setActionsOpen(false)}
                      role='menuitem'
                    >
                      <span className='inline-flex items-center gap-2'>
                        ✏️ Edit Info
                      </span>
                    </button>

                    <button
                      type='button'
                      className='flex w-full items-center justify-between px-4 py-3 text-left text-rose-600 hover:bg-rose-50'
                      onClick={() => setActionsOpen(false)}
                      role='menuitem'
                    >
                      <span className='inline-flex items-center gap-2'>
                        🗑️ Delete Branch
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stat cards row (two) */}
          <div className='mt-5 grid gap-4 md:grid-cols-2'>
            <StatCard
              title='Overall Performance Rating'
              value={getPerformanceRating()}
              description='Average Across All Branches'
              variant='green'
            />
            <StatCard
              title='Performance Change'
              value={`+${getPerformanceChange()}%`}
              description='This week vs Last week'
              variant='green'
            />
          </div>
        </div>

        {/* Right: Employees list card */}
        <div className='rounded-2xl bg-white shadow-custom p-5 w-1/3'>
          <div className='mb-3 text-gray-900 font-semibold'>Employees :</div>
          <BranchEmployeesList employees={employees} />
        </div>
      </section>

      {/* Last Shifts */}
      <section className='space-y-3'>
        <div className='text-sm font-semibold text-gray-800'>Last Shifts</div>
        <BranchShiftsTable rows={rows} />
      </section>
    </div>
  );
}
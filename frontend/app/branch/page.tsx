'use client'
 
import { StatCard } from '@/app/_componentes/reusable/StatCard';
import { Shift } from '../types';
import { ShiftsTable } from '../_componentes/ShiftsTable';
import Image from 'next/image';
import BranchTable from '../_componentes/BranchTable';
import { useEffect, useState } from 'react';
import { MakeApiCall, Methods } from '../actions';
 
export default function Page() {
  const [shifts,setShifts]= useState<Shift[]>()
  const [numberOfPages,setNumberOfPages]= useState(1)
  const [currentPageNumber,setCurrentPage]= useState(1)
  useEffect(()=>{
   async function  getShifts(){
    const { numberOfPages, page, data } = await MakeApiCall({
      url: '/shift',
      method: Methods.GET,
      queryString: 'limit=7',
    });
    console.log(data);
    setShifts(data as Shift[]);
    setNumberOfPages(numberOfPages);
    setCurrentPage(page);
   }
   getShifts()
  
  },[])
  

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='px-6 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Welcome Name!
          </h1>
          <p className='text-gray-600'>12th Aug 2025, 12:45 PM</p>
        </div>

        <section className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
          <StatCard
            title='Rating'
            value='4.2'
            description='For the last 7 shifts'
            variant='green'
          />
          <StatCard
            title='Skill Improvement'
            value='-6%'
            description='Change in performance'
            variant='red'
          />
          <StatCard
            title='Skill Improvement'
            value='-6%'
            description='Change in performance'
            variant='blue'
          />
        </section>

        <BranchTable />
      </main>
    </div>
  );
}

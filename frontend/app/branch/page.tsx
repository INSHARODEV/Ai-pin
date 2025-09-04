'use client'
 
import { StatCard } from '@/app/_componentes/reusable/StatCard';
 
import BranchTable from '../_componentes/BranchTable';
 
 import { useShiftsContext } from './layout';
export interface Params{
  currentPageNumber:any
  emps:any
  firstGroup:any
  numberOfPages:any
  rating:any
  secondGroup:any
  shifts:any
   performanceDelta:any
}
   
export default function Page( ) {
 
  const { shifts, rating, performanceDelta ,emps} = useShiftsContext();
  
  

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
            value= {rating}
            description='For the last 7 shifts'
            variant={rating>2.5?'green':'red'}
          />
          <StatCard
            title='Skill Improvement'
            value={performanceDelta}
            variant={
              performanceDelta > 0 
               ? "green" 
               : performanceDelta === 0 
                 ? "orange" 
                 : "red"
           }
            description='Change in performance'
     
          />
          <StatCard
            title='Employees worked'
            value={emps  }
            description='Employees worked'
            variant='blue'
          />
        </section>
 {shifts&& <BranchTable   shifst= {shifts}/>}

 <div>Loading ...</div>
 
       
      </main>
    </div>
  );
}

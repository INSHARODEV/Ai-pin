import { Activity } from 'lucide-react'
import React from 'react'

export default function Logo() {
  return (
   
  <div className='flex gap-3 items-center '>
 <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600'>
    <Activity className='h-5 w-5 text-white' />
 
  </div>
  <span className='text-xl font-semibold text-gray-900'>AI Pin</span>
 </div>)
}

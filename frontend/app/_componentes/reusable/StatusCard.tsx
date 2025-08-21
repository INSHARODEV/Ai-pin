import { ArrowUp ,CircleArrowUp,CircleArrowDown} from 'lucide-react'
import React from 'react'
interface props{
title:string,
rating:number,
incresing:boolean
}
export default function StatusCard({incresing,rating,title}:props) {
  return (
    <div className='bg-white p-6 rounded-md flex flex-1 flex-col  h-40 '>
<p>{title}</p>

<p className='text-6xl font-bold flex  items-end justify-between my-5'>
    <p>{ rating}%</p>
    {incresing ? <CircleArrowUp size={32} /> : <CircleArrowDown size={32} />}
      </p>
    </div>
  )
}

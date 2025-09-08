import React, { ReactNode } from 'react'
import FormSidebar from '../_componentes/Form-sidebar'
interface LayoutProps {
    children: ReactNode;
  }
export default function Layout({children}:LayoutProps) {
  return (
    <div className="flex ">
      {/* Sidebar */}
      <div className='w-1/5 h-[100vh] bg-[rgba(249,250,251,1)] '>

     
      <div  >
        <FormSidebar />
      </div>
      </div>
      {/* Main content */}
    
      
        <main className= "w-4/5">{children}</main>
   
    </div>
  )
}

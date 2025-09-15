'use client';

import React, { useState } from 'react';
import { Calendar, User, Search } from 'lucide-react';
import { ConversationSidebar } from '@/app/_componentes/ConversationsList';
import { MainDashboard } from '@/app/_componentes/PerformancePanel';
import { ChatPanel } from '@/app/_componentes/ChatTranscript';
import { DateRange, HeaderDateRange } from '@/app/_componentes/CalendarPanel';

const Index = () => {
  const [range, setRange] = useState<DateRange>({
    from: new Date(2025, 7, 1),
    to: new Date(2025, 7, 4),
  }); // Aug is 7
  const markers = [new Date(2025, 7, 1), new Date(2025, 7, 25)];
  return (
    <div className='h-screen flex flex-col py-4 gap-3 bg-[#F9FAFB]'>
      <div className='px-4'>
        <header className='flex items-center justify-evenly bg-white rounded-2xl p-2 shadow-custom'>
          <div className='flex items-start px-2 gap-4 w-full'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <HeaderDateRange
                value={range}
                onChange={setRange}
                weekStartsOn={1}
                markers={markers}
              />
            </div>
          </div>
          <hr className='w-0.5 h-9 bg-[#AEAEAE]'></hr>
          <div className='flex justify-between px-3 gap-4 w-full'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <div className='p-2 rounded-full bg-[#0D70C81A]'>
                <User color='#0D70C8' className='w-4 h-4' />
              </div>
              Sales Name
            </div>
            <button
              aria-label='Search'
              className='p-2 rounded-full bg-[#0D70C8] text-white hover:bg-[#0D70E9] hover:shadow-xl'
            >
              <Search className='w-4 h-4' />
            </button>
          </div>
        </header>
      </div>
      <div className='h-screen flex text-foreground w-full'>
        <ConversationSidebar />
        <MainDashboard />
        <ChatPanel />
      </div>
    </div>
  );
};
export default Index;

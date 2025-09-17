'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, User, Search } from 'lucide-react';
import { ConversationSidebar } from '@/app/_componentes/ConversationsList';
import { MainDashboard } from '@/app/_componentes/PerformancePanel';
import { ChatPanel } from '@/app/_componentes/ChatTranscript';
import { useParams } from 'next/navigation';
import { MakeApiCall, Methods } from '@/app/actions';
import { ID, Transcript } from '../../../../../shard/src';

const Index = () => {
  const { id } = useParams<{ id: string }>();
  const [transcriptions, setTranscriptions] = useState<Transcript[]>([]);
  const [selected, setSelected] = useState<(Transcript & ID) | null>(null);

  useEffect(() => {
    async function getTranscriptions() {
      const res = await MakeApiCall({
        method: Methods.GET,
        url: `/trasncriptions?empId=${id}`, // <-- fixed typo
      });

      if (res?.data) {
        setTranscriptions(res.data);
        setSelected(res.data[0]); // default to first conversation
      }
    }

    getTranscriptions();
  }, [id]);

  return (
    <div className='h-screen flex flex-col py-4 gap-3 bg-[#F9FAFB]'>
      <div className='px-4'>
        <header className='flex items-center justify-evenly bg-white rounded-2xl p-2 shadow-custom'>
          <div className='flex items-start px-2 gap-4 w-full'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <div className='p-2 rounded-full bg-[#0D70C81A]'>
                <Calendar color='#0D70C8' className='w-4 h-4' />
              </div>
              1 Aug 2025 - 4 Aug 2025
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
        <ConversationSidebar
          transcriptions={transcriptions}
          selectedId={selected?._id}
          onSelect={setSelected}
        />
        <MainDashboard transcription={selected} />
        <ChatPanel transcription={selected} />
      </div>
    </div>
  );
};

export default Index;

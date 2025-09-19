'use client';

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  const [selected, setSelected] = useState<Transcript & ID | null>(null);

  // 📅 date range state
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // 📌 handle date range selection
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setIsDatePickerOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return 'Select Date Range';
    if (!startDate) return `Until ${endDate?.toLocaleDateString()}`;
    if (!endDate) return `From ${startDate.toLocaleDateString()}`;

    const start = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const end = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${start} - ${end}`;
  };

   useEffect(() => {
    async function getTranscriptions() {
      const res = await MakeApiCall({
        method: Methods.GET,
        url: `/trasncriptions?empId=${id}&start=${startDate?.toISOString()}&end=${endDate?.toISOString()}`,
      });
  
      if (res?.data) {
        setTranscriptions(res.data);
     
      }
    }
  
    getTranscriptions();
  }, [id, startDate, endDate]);

  return (
    <div className="h-screen flex flex-col py-4 gap-3 bg-[#F9FAFB]">
      <div className="px-4 relative">
        <header className="flex items-center justify-evenly bg-white rounded-2xl p-2 shadow-custom relative">
          <div className="flex items-start px-2 gap-4 w-full">
            {/* 📅 Date range button */}
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <div className="p-2 rounded-full bg-[#0D70C81A]">
                <Calendar color="#0D70C8" className="w-4 h-4" />
              </div>
              {formatDateRange()}
            </button>

            {/* 📌 Date picker popover */}
            {isDatePickerOpen && (
              <div className="absolute top-14 left-6 z-50 bg-white shadow-lg rounded-xl p-2">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateRangeChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              </div>
            )}
          </div>

          <hr className="w-0.5 h-9 bg-[#AEAEAE]" />

          <div className="flex justify-between px-3 gap-4 w-full">
            {/* <div className="flex items-center gap-2 text-sm font-semibold">
              <div className="p-2 rounded-full bg-[#0D70C81A]">
                <User color="#0D70C8" className="w-4 h-4" />
              </div>
              Sales Name
            </div> */}
            {/* <button
              aria-label="Search"
              className="p-2 rounded-full bg-[#0D70C8] text-white hover:bg-[#0D70E9] hover:shadow-xl"
            >
              <Search className="w-4 h-4" />
            </button> */}
          </div>
        </header>
      </div>

      {/* 🔹 Main layout */}
      <div className="h-screen flex text-foreground w-full">
        <ConversationSidebar
          transcriptions={transcriptions}
          selectedId={selected?._id}
          onSelect={setSelected}
        />
        <MainDashboard transcription={selected}  />
        <ChatPanel transcription={selected} />
      </div>
    </div>
  );
};

export default Index;

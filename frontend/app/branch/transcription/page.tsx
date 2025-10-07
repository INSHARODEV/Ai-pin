'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, User, Search, XCircle } from 'lucide-react';
import { ConversationSidebar } from '@/app/_componentes/ConversationsList';
import { MainDashboard } from '@/app/_componentes/PerformancePanel';
import { ChatPanel } from '@/app/_componentes/ChatTranscript';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { MakeApiCall, Methods } from '@/app/actions';
import { ID, Transcript } from '../../../../shard/src';

type Employee = { _id: string; name: string; avatar?: string };

type ViewState =
  | 'needDates'
  | 'needEmployee'
  | 'loading'
  | 'empty'
  | 'error'
  | 'active';

export default function TranscriptionSupervisorPage() {
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Filters (start/end null so page starts disabled)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empOpen, setEmpOpen] = useState(false);
  const [empQuery, setEmpQuery] = useState('');

  // deep link (?empId=.. or route param)
  const preselectedFromRoute = params?.id ?? searchParams.get('empId') ?? '';
  const [employeeId, setEmployeeId] = useState<string>(preselectedFromRoute);

  // ── Data
  const [transcriptions, setTranscriptions] = useState<(Transcript & ID)[]>([]);
  const [selected, setSelected] = useState<(Transcript & ID) | null>(null);

  // UI
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // Refs
  const dateRef = useRef<HTMLDivElement>(null);
  const empRef = useRef<HTMLDivElement>(null);

  // Derive state
  const viewState: ViewState = useMemo(() => {
    if (!startDate || !endDate) return 'needDates';
    if (!employeeId) return 'needEmployee';
    if (isFetching) return 'loading';
    if (errorMsg) return 'error';
    if (startDate && endDate && employeeId && transcriptions.length === 0) {
      return 'empty';
    }
    return 'active';
  }, [
    startDate,
    endDate,
    employeeId,
    isFetching,
    errorMsg,
    transcriptions.length,
  ]);

  const needSelection =
    viewState === 'needDates' || viewState === 'needEmployee';

  // Helpers
  const formatDateRange = () => {
    if (!startDate && !endDate) return 'Choose dates';
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

  const filteredEmployees = useMemo(() => {
    const q = empQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e => e.name?.toLowerCase().includes(q));
  }, [empQuery, employees]);

  // Fetch employees
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await MakeApiCall({
          method: Methods.GET,
          url: `/employees?scope=branch`,
        });
        if (!ignore && res?.data) setEmployees(res.data as Employee[]);
      } catch {
        // ignore
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch transcripts
  useEffect(() => {
    if (!startDate || !endDate || !employeeId) return;
    setIsFetching(true);
    setErrorMsg(null);
    setSelected(null);

    (async () => {
      try {
        const res = await MakeApiCall({
          method: Methods.GET,
          url: `/trasncriptions?empId=${employeeId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
        });
        const data = (res?.data ?? []) as (Transcript & ID)[];
        setTranscriptions(data);
        setSelected(data[0] ?? null);
      } catch (e: any) {
        setErrorMsg('Unable to load transcriptions. Please try again.');
        setTranscriptions([]);
        setSelected(null);
      } finally {
        setIsFetching(false);
      }
    })();
  }, [employeeId, startDate, endDate]);

  // Keep URL synced
  useEffect(() => {
    const p = new URLSearchParams(searchParams.toString());
    if (employeeId) p.set('empId', employeeId);
    else p.delete('empId');
    router.replace(`?${p.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  // Close popovers on outside / esc
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      const inDate = !!dateRef.current && dateRef.current.contains(t);
      const inEmp = !!empRef.current && empRef.current.contains(t);

      if (!inDate && !inEmp) {
        setIsDatePickerOpen(false);
        setEmpOpen(false);
      } else if (inDate) {
        setEmpOpen(false);
      } else if (inEmp) {
        setIsDatePickerOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDatePickerOpen(false);
        setEmpOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Close employee popover when clicking outside it
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!empRef.current) return;
      if (!empRef.current.contains(e.target as Node)) setEmpOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className='h-screen flex flex-col py-4 gap-3 bg-[#F9FAFB]'>
      {/* Header */}
      <div className='px-4 relative'>
        <header className='flex items-center justify-between rounded-2xl p-2 shadow-custom relative bg-white gap-2'>
          {/* Date chip */}
          <div
            className='relative w-1/2 hover:bg-[#F9FAFB] transition'
            ref={dateRef}
          >
            <button
              onClick={() => setIsDatePickerOpen(o => !o)}
              className='w-full flex items-center gap-2 text-sm font-semibold bg-white'
              aria-haspopup='dialog'
              aria-expanded={isDatePickerOpen}
            >
              <div className='p-2 rounded-full bg-[#0D70C81A]'>
                <Calendar color='#0D70C8' className='w-4 h-4' />
              </div>
              {formatDateRange()}
            </button>

            {isDatePickerOpen && (
              <div className='absolute top-14 left-3 z-50 bg-white shadow-xl rounded-xl p-2'>
                <DatePicker
                  selected={startDate}
                  onChange={(dates: [Date | null, Date | null]) => {
                    const [s, e] = dates;
                    setStartDate(s);
                    setEndDate(e);
                    if (s && e) setIsDatePickerOpen(false);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              </div>
            )}
          </div>

          {/* vertical divider */}
          <span className='w-[1px] h-9 bg-[#E6E8EB]' />

          {/* Employee chip */}
          <div
            className='relative w-1/2 hover:bg-[#F9FAFB] transition'
            ref={empRef}
          >
            <button
              className={`w-full flex items-center gap-2 text-sm font-semibold bg-white justify-between ${
                !startDate || !endDate ? 'opacity-60 pointer-events-none' : ''
              }`}
              onClick={() => setEmpOpen(o => !o)}
              aria-haspopup='listbox'
              aria-expanded={empOpen}
            >
              <span className='flex items-center gap-2'>
                <div className='p-2 rounded-full bg-[#0D70C81A]'>
                  <User color='#0D70C8' className='w-4 h-4' />
                </div>
                {employeeId
                  ? (employees.find(e => e._id === employeeId)?.name ??
                    'Employee')
                  : 'Choose Employee'}
              </span>
            </button>

            {empOpen && (
              <div className='absolute top-12 left-0 z-50 w-[280px] bg-white shadow-xl rounded-xl border border-[#EEF0F2]'>
                <div className='flex items-center gap-2 px-3 py-2 border-b'>
                  <Search className='w-4 h-4 opacity-60' />
                  <input
                    className='w-full outline-none text-sm py-2'
                    placeholder='Search employee…'
                    value={empQuery}
                    onChange={e => setEmpQuery(e.target.value)}
                  />
                  {empQuery && (
                    <button
                      aria-label='Clear'
                      onClick={() => setEmpQuery('')}
                      className='opacity-60 hover:opacity-100'
                    >
                      <XCircle className='w-4 h-4' />
                    </button>
                  )}
                </div>

                <ul className='max-h-64 overflow-auto py-1' role='listbox'>
                  {filteredEmployees.length === 0 && (
                    <li className='px-3 py-3 text-sm text-gray-500'>
                      No matches
                    </li>
                  )}
                  {filteredEmployees.map(e => (
                    <li
                      key={e._id}
                      role='option'
                      aria-selected={employeeId === e._id}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#F7F9FB] ${
                        employeeId === e._id ? 'bg-[#F2F6FC]' : ''
                      }`}
                      onClick={() => {
                        setEmployeeId(e._id);
                        setEmpOpen(false);
                      }}
                    >
                      {e.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* (optional) right-side global search */}
          <button
            className='p-2 rounded-full bg-[#0D70C8] text-white hover:bg-[#0D70E9] hover:shadow-xl'
            title='Search (coming soon)'
          >
            <Search className='w-4 h-4' />
          </button>
        </header>
      </div>

      {/* Main */}
      <div className='flex w-full h-[calc(100vh-120px)] px-4'>
        {/* Loading */}
        {viewState === 'loading' ? (
          <div className='grid place-items-center w-full'>
            <div className='animate-spin h-8 w-8 rounded-full border-2 border-gray-300 border-t-[#0D70C8]' />
          </div>
        ) : viewState === 'error' ? (
          <div className='grid place-items-center w-full'>
            <div className='text-center space-y-2'>
              <p className='text-lg font-semibold'>Something went wrong</p>
              <p className='text-sm text-gray-500'>{errorMsg}</p>
            </div>
          </div>
        ) : viewState === 'empty' ? (
          <div className='grid place-items-center w-full'>
            <div className='text-center space-y-2'>
              <p className='text-lg font-semibold'>No conversations found</p>
              <p className='text-sm text-gray-500'>
                Try different dates or another employee.
              </p>
            </div>
          </div>
        ) : (
          // Active or needSelection: we always render the 3 panes.
          <div className='flex w-full'>
            <ConversationSidebar
              transcriptions={needSelection ? [] : transcriptions}
              selectedId={needSelection ? undefined : selected?._id}
              onSelect={setSelected}
              showPlaceholder={needSelection}
            />
            <MainDashboard
              transcription={
                needSelection ? undefined : (selected ?? undefined)
              }
              showPlaceholder={needSelection}
            />
            <ChatPanel
              transcription={
                needSelection ? undefined : (selected ?? undefined)
              }
              showPlaceholder={needSelection}
            />
          </div>
        )}
      </div>
    </div>
  );
}

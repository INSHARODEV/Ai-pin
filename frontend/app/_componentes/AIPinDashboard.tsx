'use client';

import { Activity, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BarChartIcon from './icons/BarChartIcon';
import { useShiftsContext } from '../branch/layout';

const AIPinDashboard = () => {
  const currentPath = usePathname();
  const { empsNames } = useShiftsContext();

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/branch') {
      return currentPath === '/branch';
    }
    return currentPath === path;
  };

  // Helper function to get navigation item classes
  const getNavClasses = (path: string) => {
    const baseClasses =
      'py-2 px-4 hover:bg-blue-200 transition-colors cursor-pointer rounded-r-lg';
    const activeClasses = 'bg-blue-100';

    return isActive(path) ? `${baseClasses} ${activeClasses}` : baseClasses;
  };

  // Helper function to get text classes
  const getTextClasses = (path: string) => {
    return isActive(path)
      ? 'text-[#0D70C8] font-semibold'
      : 'text-muted-foreground';
  };

  return (
    <div className='py-10 bg-white text-gray-400 flex flex-col'>
      {/* Header */}
      <div className='px-4 flex items-center gap-3 pb-4'>
        <div className='w-12 h-12 rounded-xl flex items-center justify-center bg-[#0D70C8]'>
          <Activity className='w-6 h-6 stroke-2 text-white' />
        </div>
        <h1 className='text-2xl font-semibold text-foreground'>AI Pin</h1>
      </div>

      <div className='flex flex-col gap-2 pr-5'>
        {/* Overview Section */}
        <Link href='/branch'>
          <div className={getNavClasses('/branch')}>
            <div className='flex items-center gap-3'>
              <BarChartIcon isActive={isActive('/branch')} />
              <span
                className={`text-lg font-medium ${getTextClasses('/branch')}`}
              >
                Overview
              </span>
            </div>
          </div>
        </Link>

        {/* Transcription Section */}
        <Link href='/branch/transcription'>
          <div className={`${getNavClasses('/branch/transcription')} mb-6`}>
            <div className='flex items-center gap-3'>
              <FileText
                className={`w-5 h-5 ${isActive('/branch/transcription') ? 'text-[#0D70C8]' : 'text-muted-foreground'}`}
              />
              <span
                className={`text-lg font-medium ${getTextClasses('/branch/transcription')}`}
              >
                Transcription
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Employees Section */}
      <div>
        <h2 className='px-4 text-xs text-muted-foreground mb-4 font-bold'>
          Employees
        </h2>
        <div>
          {empsNames &&
            empsNames.map(
              ({ name, _id }: { name: any; _id: any }, index: number) => (
                <div
                  key={index}
                  className='px-4 py-3 hover:bg-blue-200 transition-colors cursor-pointer rounded-r-lg'
                >
                  <Link
                    className='text-muted-foreground'
                    href={`branch/transcription/${_id}`}
                  >
                    {name}
                  </Link>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default AIPinDashboard;

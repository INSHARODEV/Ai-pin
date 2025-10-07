'use client';

import React from 'react';

type SidebarProps = {
  transcriptions: any[];
  selectedId?: string;
  onSelect: (t: any) => void;
  /** Forces placeholder. If omitted, placeholders show when list is empty. */
  showPlaceholder?: boolean;
};

const getStatusColor = (performance: number) => {
  if (performance >= 80) return 'bg-green-500';
  if (performance >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Local, tiny skeletons so no cross-file imports needed
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200/80 ${className}`} />
);
const BlueDot = () => <span className='w-2 h-2 rounded-full bg-[#0D70C8]' />;

export const ConversationSidebar: React.FC<SidebarProps> = ({
  transcriptions,
  selectedId,
  onSelect,
  showPlaceholder,
}) => {
  const shouldShowPlaceholder = showPlaceholder || transcriptions.length === 0;

  if (shouldShowPlaceholder) {
    return (
      <aside className='flex flex-col gap-6 w-64 rounded-r-xl h-full py-4 bg-[#FEFEFE] shadow-custom overflow-y-auto'>
        <section>
          <h3 className='px-5 py-2 font-bold text-[#AEAEAE] uppercase tracking-wider'>
            DATE
          </h3>
          <div className='flex flex-col gap-2 px-3'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between gap-3 px-2 py-3 rounded-md'
              >
                <div className='flex-1'>
                  <Skeleton className='h-3 w-24 mb-2' />
                  <Skeleton className='h-3 w-40' />
                </div>
                <BlueDot />
              </div>
            ))}
          </div>

          <h3 className='px-5 pt-6 pb-2 font-bold text-[#AEAEAE] uppercase tracking-wider'>
            DATE
          </h3>
          <div className='flex flex-col gap-2 px-3'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between gap-3 px-2 py-3 rounded-md'
              >
                <div className='flex-1'>
                  <Skeleton className='h-3 w-20 mb-2' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <BlueDot />
              </div>
            ))}
          </div>
        </section>
      </aside>
    );
  }

  return (
    <aside className='flex flex-col gap-6 w-64 rounded-r-xl h-full py-4 bg-[#FEFEFE] shadow-custom overflow-y-auto'>
      <section>
        <h3 className='px-5 py-2 font-bold text-[#AEAEAE] uppercase tracking-wider'>
          TODAY
        </h3>
        <div>
          {transcriptions.map(conv => (
            <div
              key={conv._id}
              onClick={() => onSelect(conv)}
              className={`flex justify-between gap-3 font-semibold px-3 py-3 cursor-pointer transition-colors rounded-md ${
                conv._id === selectedId ? 'bg-[#0D70C81A]' : 'hover:bg-muted/50'
              }`}
            >
              <div className='px-2'>
                <p>{conv.summary?.slice(0, 30) || 'No summary'}</p>
                <p className='text-xs text-[#AEAEAE]'>
                  {new Date(conv.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(conv.performance)}`}
              />
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

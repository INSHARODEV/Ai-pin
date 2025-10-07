'use client';

import React from 'react';

type Props = {
  transcription?: any;
  /** Forces placeholder. If omitted, placeholder shows when no transcription. */
  showPlaceholder?: boolean;
};

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200/80 ${className}`} />
);

export const ChatPanel: React.FC<Props> = ({
  transcription,
  showPlaceholder,
}) => {
  const chatMessages =
    transcription?.turns?.map((turn: any, index: number) => ({
      id: index,
      sender: turn.speaker_label === 'Sales Rep' ? 'sales' : 'customer',
      content: turn.transcription,
    })) || [];

  const shouldShowPlaceholder = showPlaceholder || !transcription;

  if (shouldShowPlaceholder) {
    // Placeholder S/C rows with gray lines
    return (
      <aside className='w-80 flex flex-col bg-[#FEFEFE] rounded-l-xl shadow-custom'>
        <div className='flex-1 p-4 overflow-y-auto'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='flex items-start gap-3 py-2'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  i % 2 ? 'bg-[#00B9C6]' : 'bg-[#F16DC5]'
                }`}
              >
                {i % 2 ? 'S' : 'C'}
              </div>
              <div className='flex-1'>
                <span className='text-sm font-medium'>
                  {i % 2 ? 'Sales Name:' : 'Customer:'}
                </span>
                <div className='px-3 py-2'>
                  <Skeleton className='h-3 w-56 mb-2' />
                  <Skeleton className='h-3 w-40' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className='w-80 flex flex-col bg-[#FEFEFE] rounded-l-xl shadow-custom'>
      <div className='flex-1 p-4 overflow-y-auto'>
        {chatMessages.map((message: any) => (
          <div key={message.id} className='flex items-start gap-3 py-2'>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                message.sender === 'sales' ? 'bg-[#00B9C6]' : 'bg-[#F16DC5]'
              }`}
            >
              {message.sender === 'sales' ? 'S' : 'C'}
            </div>

            <div>
              <span className='text-sm font-medium'>
                {message.sender === 'sales' ? 'Sales Name:' : 'Customer:'}
              </span>
              <div className='px-3 py-2 rounded-lg'>
                <p className='text-sm break-words'>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

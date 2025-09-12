import React from 'react';

interface Props {
  transcriptions: any[];
  selectedId?: string;
  onSelect: (t: any) => void;
}

const getStatusColor = (performance: number) => {
  if (performance >= 80) return 'bg-green-500';
  if (performance >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const ConversationSidebar = ({
  transcriptions,
  selectedId,
  onSelect,
}: Props) => {
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
                conv._id === selectedId
                  ? 'bg-[#0D70C81A]'
                  : 'hover:bg-muted/50'
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

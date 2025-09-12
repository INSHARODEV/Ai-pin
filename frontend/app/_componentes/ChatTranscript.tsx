interface Props {
  transcription?: any;
}

export const ChatPanel = ({ transcription }: Props) => {
  const chatMessages =
    transcription?.turns?.map((turn: any, index: number) => ({
      id: index,
      sender: turn.speaker_label === 'Sales Rep' ? 'sales' : 'customer',
      content: turn.transcription,
    })) || [];

  return (
    <aside className='w-80 flex flex-col bg-[#FEFEFE] rounded-l-xl shadow-custom'>
      <div className='flex-1 p-4 overflow-y-auto'>
        {chatMessages.map((message:any) => (
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
                {message.sender === 'sales' ? 'Sales Rep:' : 'Customer:'}
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

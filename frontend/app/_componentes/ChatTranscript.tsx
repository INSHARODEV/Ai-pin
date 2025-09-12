interface ChatMessage {
  id: number;
  sender: 'sales' | 'customer';
  content: string;
  time?: string;
}
const chatMessages: ChatMessage[] = [
  { id: 1, sender: 'sales', content: 'Hello, How are you?' },
  { id: 2, sender: 'sales', content: 'Hello, How are you?' },
  {
    id: 3,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
  { id: 4, sender: 'sales', content: 'Hello, How are you?' },
  {
    id: 5,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
  {
    id: 6,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
  { id: 7, sender: 'sales', content: 'Hello, How are you?' },
  {
    id: 8,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
  {
    id: 9,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
  {
    id: 10,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
  { id: 11, sender: 'sales', content: '6.5$' },
  {
    id: 12,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
  { id: 13, sender: 'sales', content: '6.5$' },
  {
    id: 14,
    sender: 'customer',
    content: "I'm fine thank you!",
  },
];

export const ChatPanel = () => {
  return (
    <aside className='w-80 flex flex-col bg-[#FEFEFE] rounded-l-xl shadow-custom'>
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className=''>
          {chatMessages.map(message => (
            <div key={message.id} className='flex items-start gap-3 py-2'>
              <div
                className={
                  `w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ` +
                  (message.sender === 'sales' ? 'bg-[#00B9C6]' : 'bg-[#F16DC5]')
                }
              >
                {message.sender === 'sales' ? 'S' : 'C'}
              </div>

              <div className='flex'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>
                    {message.sender === 'sales' ? 'Sales Name:' : 'Customer:'}
                  </span>
                </div>
                <div className={`px-3 py-2 rounded-lg`}>
                  <p className='text-sm break-words'>{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <footer className='p-3 border-t border-border'>
        <form className='flex gap-2'>
          <input
            className='flex-1 border border-border rounded-lg px-3 py-2 bg-background text-sm outline-none focus:ring-2 focus:ring-primary'
            placeholder='Type a message...'
          />
          <button
            type='button'
            className='px-3 py-2 rounded-lg text-sm border border-border hover:bg-muted'
          >
            Send
          </button>
        </form>
      </footer>
    </aside>
  );
};

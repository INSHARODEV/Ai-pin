interface Conversation {
  id: number;
  title: string;
  time: string;
  status: 'active' | 'warning' | 'error';
}
const conversations: Conversation[] = [
  { id: 4, title: 'Conversation 4', time: '10:20 AM', status: 'active' },
  { id: 3, title: 'Conversation 3', time: '10:20 AM', status: 'active' },
  { id: 2, title: 'Conversation 2', time: '10:20 AM', status: 'warning' },
  { id: 1, title: 'Conversation 1', time: '10:20 AM', status: 'error' },
];
const yesterdayConversations: Conversation[] = [
  { id: 7, title: 'Conversation 7', time: '10:20 AM', status: 'active' },
  { id: 6, title: 'Conversation 6', time: '10:20 AM', status: 'active' },
  { id: 5, title: 'Conversation 5', time: '10:20 AM', status: 'active' },
  { id: 4, title: 'Conversation 4', time: '10:20 AM', status: 'active' },
  { id: 3, title: 'Conversation 3', time: '10:20 AM', status: 'active' },
  { id: 2, title: 'Conversation 2', time: '10:20 AM', status: 'warning' },
  { id: 1, title: 'Conversation 1', time: '10:20 AM', status: 'error' },
];
const getStatusColor = (status: Conversation['status']) => {
  switch (status) {
    case 'active':
      return 'bg-red-500';
    case 'warning':
      return 'bg-green-500';
    case 'error':
      return 'bg-blue-500';
    default:
      return 'bg-muted';
  }
};

export const ConversationSidebar = () => {
  return (
    <aside className='flex flex-col gap-6 w-64 rounded-r-xl h-full py-4 bg-[#FEFEFE] shadow-custom overflow-y-auto'>
      <section>
        <h3 className='px-5 py-2 font-bold text-[#AEAEAE] uppercase tracking-wider'>
          TODAY
        </h3>
        <div className=''>
          {conversations.map(conv => (
            <div
              key={conv.id}
              className='flex justify-between gap-3 font-semibold px-3 py-3 bg-card cursor-pointer transition-colors hover:bg-[#0D70C81A]'
            >
              <div className='px-2'>
                <p>{conv.title}</p>
                <p className='text-xs text-[#AEAEAE]'>{conv.time}</p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(conv.status)}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className='px-5 py-2 font-bold text-[#AEAEAE] uppercase tracking-wider'>
          YESTERDAY
        </h3>
        <div className=''>
          {conversations.map(conv => (
            <div
              key={conv.id}
              className='flex justify-between gap-3 font-semibold px-3 py-3 bg-card cursor-pointer transition-colors hover:bg-[#0D70C81A]'
            >
              <div className='px-2'>
                <p>{conv.title}</p>
                <p className='text-xs text-[#AEAEAE]'>{conv.time}</p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(conv.status)}`}
              />
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

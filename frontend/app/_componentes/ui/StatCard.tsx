// import * as React from 'react';
// import { TrendingDown, TrendingUp } from 'lucide-react';

// import { cn } from '@/app/lib/cn';
// import { StatColor, TrendDirection } from '@/app/types';
// import { Card } from './Card';

// export interface StatCardProps {
//   title: string;
//   value: string | number;
//   trendDirection: TrendDirection;
//   description: string;
//   color?: StatColor;
// }

// const colorText: Record<StatColor, string> = {
//   blue: 'text-blue-600',
//   green: 'text-green-600',
//   red: 'text-red-600',
// };

// const colorPill: Record<StatColor, string> = {
//   blue: 'bg-blue-50 text-blue-700',
//   green: 'bg-green-50 text-green-700',
//   red: 'bg-red-50 text-red-700',
// };

// export function StatCard({
//   title,
//   value,
//   trendDirection,
//   description,
//   color = 'blue',
// }: StatCardProps) {
//   return (
//     <Card className='p-6'>
//       <div className='space-y-2'>
//         <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
//         <div className='flex items-center space-x-2'>
//           <span className='text-3xl font-bold text-gray-900'>{value}</span>
//           <div className={cn('flex items-center', colorText[color])}>
//             {trendDirection === 'up' ? (
//               <TrendingUp className='h-4 w-4' />
//             ) : (
//               <TrendingDown className='h-4 w-4' />
//             )}
//           </div>
//         </div>
//         <div
//           className={cn(
//             'inline-block rounded-full px-3 py-1 text-sm',
//             colorPill[color]
//           )}
//         >
//           {description}
//         </div>
//       </div>
//     </Card>
//   );
// }

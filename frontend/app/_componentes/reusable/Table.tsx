// components/reusable/Table.tsx
import * as React from 'react';
import { Badge } from '../ui/Badge';
import { number } from 'zod';

type StatusColor = 'green' | 'red' | 'orange' | 'gray';

export type BadgeValue = 'Low' | 'High' | 'Standard' | 'Critical' | 'Average';
type LinkCell = {
  kind: 'link';
  label: string;
  href?: string;
  onClick?: () => void;
};
type BadgeCell = { kind: 'badge'; value: BadgeValue };
type StatusCell = { kind: 'status'; value: StatusColor };
type PlainCell = string | number | React.ReactNode;

export type TableCell = PlainCell | LinkCell | BadgeCell | StatusCell;

export interface TableProps {
  headers: string[];
  numberOfPages:number;
  setPage:any,
page:number
  data: Array<Array<TableCell>>;
  emptyMessage?: React.ReactNode;
}

export default function Table({ headers, data, emptyMessage,numberOfPages,page,setPage }: TableProps) {
  const getPerformanceBadgeVariant = (performance: string) => {
    switch (performance) {
      case 'High':
        return 'success';
      case 'Low':
        return 'warning';
      case 'Average':
        return 'warning';
      case 'Critical':
        return 'destructive';
      case 'Standard':
        return 'neutral';
      default:
        return 'secondary';
    }
  };
console.log('ta table',numberOfPages,
 )
  const getStatusDot = (status: StatusColor) => {
    const colors: Record<StatusColor, string> = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      gray: 'bg-gray-400',
    };
    return (
      <span
        aria-label={`${status} status`}
        className={`inline-block h-3 w-3 rounded-full ${colors[status]}`}
      />
    );
  };

  return (
    <div>
      <table className='min-w-full overflow-hidden rounded-lg bg-white shadow-custom'>
        <thead>
          <tr className='bg-[#0D70C8]'>
            {headers.map((header, i) => (
              <th
                key={i}
                className='px-6 py-4 text-left text-sm font-medium text-white'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className='px-6 py-10 text-center'>
                <div className='mx-auto max-w-xl text-gray-600'>
                  {emptyMessage ?? 'No records to display.'}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                {row.map((cell, cellIndex) => {
                  if (
                    typeof cell === 'object' &&
                    cell !== null &&
                    'kind' in cell
                  ) {
                    const c = cell as LinkCell | BadgeCell | StatusCell;
                    return (
                      <td key={cellIndex} className='px-6 py-4 text-sm'>
                        {c.kind === 'badge' ? (
                          <Badge
                            variant={
                              getPerformanceBadgeVariant(
                                (c as BadgeCell).value
                              ) as any
                            }
                          >
                            {(c as BadgeCell).value}
                          </Badge>
                        ) : c.kind === 'status' ? (
                          getStatusDot((c as StatusCell).value)
                        ) : (c as LinkCell).href ? (
                          <a
                            href={(c as LinkCell).href}
                            className='text-blue-600 hover:underline'
                          >
                            {(c as LinkCell).label}
                          </a>
                        ) : (
                          <button
                            type='button'
                            onClick={(c as LinkCell).onClick}
                            className='text-blue-600 hover:underline'
                          >
                            {(c as LinkCell).label}
                          </button>
                        )}
                      </td>
                    );
                  }
                  return (
                    <td key={cellIndex} className='px-6 py-4 text-sm'>
                      <span className='text-gray-700'>
                        {cell as React.ReactNode}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))
          )}
       
        </tbody>
      
      </table>
      <div className="flex justify-center gap-2 mt-4">
  {Array.from({ length: numberOfPages }).map((_, i) => (
    <button
      key={i}
      onClick={() => setPage(i + 1)}
      className={`px-3 py-1 rounded-md text-sm ${
        page === i + 1
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {i + 1}
    </button>
  ))}
</div>
    </div>
  );
}

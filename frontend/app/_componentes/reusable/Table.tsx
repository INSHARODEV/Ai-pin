// components/reusable/Table.tsx
import * as React from 'react';
import { Badge } from '../ui/Badge';

type StatusColor = 'green' | 'red' | 'orange';

export type BadgeValue = 'Low' | 'High' | 'Standard' | 'Critical';
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
  data: Array<Array<TableCell>>;
  emptyMessage?: React.ReactNode;
}

export default function Table({ headers, data, emptyMessage }: TableProps) {
  const getPerformanceBadgeVariant = (performance: string) => {
    switch (performance) {
      case 'High':
        return 'success';
      case 'Low':
        return 'warning';
      case 'Critical':
        return 'destructive';
      case 'Standard':
        return 'neutral';
      default:
        return 'secondary';
    }
  };

  const getStatusDot = (status: StatusColor) => {
    const colors: Record<StatusColor, string> = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
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
      <table className='min-w-full overflow-hidden rounded-lg bg-white shadow-[0_0_7px_0_#C9C9C940]'>
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
    </div>
  );
}

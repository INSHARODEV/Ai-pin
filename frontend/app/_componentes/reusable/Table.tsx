import * as React from 'react';

export interface TableProps {
  headers: string[];
  data: Array<Array<React.ReactNode>>;
}

export default function Table({ headers, data }: TableProps) {
  const getPerformanceStyle = (performance: string) => {
    switch (performance.toLowerCase()) {
      case 'in progress':
        return 'text-blue-600 font-medium';
      case 'friendly':
        return 'text-green-600 font-medium';
      case 'confused':
        return 'text-yellow-600 font-medium';
      case 'neutral':
        return 'text-gray-600 font-medium';
      case 'frustrated':
        return 'text-orange-600 font-medium';
      case 'aggressive':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-600 font-medium';
    }
  };

  return (
    <div className=''>
      <table className='min-w-full overflow-hidden rounded-lg bg-white shadow-sm shadow-black'>
        <thead>
          <tr className='bg-blue-600'>
            {headers.map((header, index) => (
              <th
                key={index}
                className='px-6 py-4 text-left text-sm font-medium text-white'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 text-sm ${
                    cellIndex === 4 && typeof cell === 'string'
                      ? getPerformanceStyle(cell)
                      : 'text-gray-700'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

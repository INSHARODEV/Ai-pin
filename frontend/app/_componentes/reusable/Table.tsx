import React, { ReactNode } from 'react';

interface Params {
  headers: any
  data: any
}

export default function Table({
  headers, data
}: Params) {
  
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
    <div className={`overflow-x-auto shadow-lg shadow-black"`}>
      <table className="min-w-full bg-white rounded-lg overflow-hidden " >
        <thead>
          <tr className="bg-blue-600">
            {headers.map((header: string, index: number): any => (
              <th
                key={index}
                className="px-6 py-4 text-left font-medium text-white text-sm"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: unknown[], rowIndex: number) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              {row.map((cell: any, cellIndex: number) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 text-sm ${
                    cellIndex === 4 ? getPerformanceStyle(cell) : 'text-gray-700'
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
import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { QaReasonSummary } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/helpers';

const columnHelper = createColumnHelper<QaReasonSummary>();

const columns = [
  columnHelper.accessor('reason', { header: 'Rejection Reason' }),
  columnHelper.accessor('count', { header: 'Count' }),
  columnHelper.accessor('share', {
    header: 'Share of Rejections',
    cell: info => formatPercentage(info.getValue()),
  }),
  columnHelper.accessor('totalPremium', {
    header: 'Premium Lost',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('agents', {
    header: 'Agents Involved',
    cell: info => info.getValue().length,
  }),
];

const QaReasonSummaryTable: React.FC<{ data: QaReasonSummary[] }> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'count', desc: true }]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0) {
    return <p className="text-center text-gray-500 py-4">No rejections found within the selected filters.</p>
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QaReasonSummaryTable;

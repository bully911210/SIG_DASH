
import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { CleanRow } from '../../types';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/helpers';

const columnHelper = createColumnHelper<CleanRow>();

const columns = [
  columnHelper.accessor('created', {
    header: 'Created',
    cell: info => format(info.getValue(), 'yyyy-MM-dd HH:mm'),
  }),
  columnHelper.accessor('agent', { header: 'Agent' }),
  columnHelper.accessor('clientName', { header: 'Client' }),
  columnHelper.accessor('product', { header: 'Product' }),
  columnHelper.accessor('qaStatus', { 
    header: 'Reason',
    cell: info => {
      const row = info.row.original;
      const reasons = [];
      if (row.qaStatus === 'Rejected') reasons.push('Rejected QA');
      if (row.debitGap > 30) reasons.push(`Gap: ${row.debitGap}d`);
      if (row.isDuplicate) reasons.push('Duplicate');
      return <span className="text-red-600 font-semibold">{reasons.join(', ')}</span>;
    }
  }),
  columnHelper.accessor('premiumEffective', {
    header: 'Premium',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('qaRaw', { header: 'QA Notes', cell: info => <span className="text-xs">{info.getValue()}</span> }),
];

const ProblemSalesTable: React.FC<{ data: CleanRow[] }> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'created', desc: true }]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0) {
    return <p className="text-center text-gray-500 py-4">No problem sales found within the selected filters.</p>
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-red-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider cursor-pointer"
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
            <tr key={row.id} className="hover:bg-red-50">
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

export default ProblemSalesTable;

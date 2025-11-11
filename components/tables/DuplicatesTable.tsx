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
  columnHelper.accessor('idNumber', { header: 'Client ID' }),
  columnHelper.accessor('clientName', { header: 'Client Name' }),
  columnHelper.accessor('product', { header: 'Product' }),
  columnHelper.accessor('agent', { header: 'Agent' }),
  columnHelper.accessor('premiumEffective', {
    header: 'Premium',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('qaStatus', {
    header: 'QA Status',
    cell: info => {
      const status = info.getValue();
      const color = status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>{status}</span>;
    },
  }),
];

const DuplicatesTable: React.FC<{ data: CleanRow[] }> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'idNumber', desc: false }]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0) {
    return <p className="text-center text-gray-500 py-4">No duplicate sales found within the selected filters.</p>
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

export default DuplicatesTable;

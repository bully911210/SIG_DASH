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

const columnHelper = createColumnHelper<CleanRow>();

const columns = [
  columnHelper.accessor('created', {
    header: 'Created',
    cell: info => format(info.getValue(), 'yyyy-MM-dd'),
  }),
  columnHelper.accessor('agent', { header: 'Agent' }),
  columnHelper.accessor('clientName', { header: 'Client' }),
  columnHelper.accessor('clientEmail', {
    header: 'Email',
    cell: info => info.getValue() ? info.getValue() : <span className="font-semibold text-orange-600">MISSING</span>,
  }),
  columnHelper.accessor('clientPhone', {
    header: 'Phone',
    cell: info => info.getValue() ? info.getValue() : <span className="font-semibold text-orange-600">MISSING</span>,
  }),
  columnHelper.accessor('product', { header: 'Product' }),
];

const MissingContactsTable: React.FC<{ data: CleanRow[] }> = ({ data }) => {
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
    return <p className="text-center text-gray-500 py-4">No records with missing contact info found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-orange-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider cursor-pointer"
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
            <tr key={row.id} className="hover:bg-orange-50">
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

export default MissingContactsTable;

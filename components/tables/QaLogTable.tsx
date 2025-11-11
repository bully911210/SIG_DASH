
import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
    header: 'QA Status',
    cell: info => {
      const status = info.getValue();
      const color = status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>{status}</span>;
    },
  }),
  columnHelper.accessor('debitDate', {
    header: 'Debit Date',
    cell: info => info.getValue() ? format(info.getValue() as Date, 'yyyy-MM-dd') : '—',
  }),
  columnHelper.accessor('debitGap', {
    header: 'Debit Gap',
    cell: info => `${info.getValue()} days`,
  }),
  columnHelper.accessor('premiumEffective', {
    header: 'Premium',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('city', { header: 'City', cell: info => info.getValue() || '—' }),
  columnHelper.accessor('province', { header: 'Province', cell: info => info.getValue() || '—' }),
];

const QaLogTable: React.FC<{ data: CleanRow[] }> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'created', desc: true }]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
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
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="font-medium">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Previous</button>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default QaLogTable;


import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { AgentSummary } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/helpers';

const columnHelper = createColumnHelper<AgentSummary>();

const columns = [
  columnHelper.accessor('agent', { header: 'Agent' }),
  columnHelper.accessor('sales', { header: 'Sales' }),
  columnHelper.accessor('totalPremium', { 
    header: 'Total Premium',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('avgPremium', {
    header: 'Avg Premium',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('rejected', { header: 'Rejected' }),
  columnHelper.accessor('passRate', {
    header: 'Pass Rate',
    cell: info => formatPercentage(info.getValue()),
  }),
  columnHelper.accessor('avgDebitGap', {
    header: 'Avg Debit Gap',
    cell: info => `${info.getValue().toFixed(1)} days`,
  }),
];

const AgentSummaryTable: React.FC<{ data: AgentSummary[] }> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'sales', desc: true }]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
     <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
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

export default AgentSummaryTable;

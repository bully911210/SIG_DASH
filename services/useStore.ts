import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Papa from 'papaparse';
import { normalizeData } from './dataProcessor';
import { CleanRow, RawRow, FilterState } from '../types';
import { format, subDays, min, max } from 'date-fns';

interface AppState {
  rawRows: RawRow[];
  cleanRows: CleanRow[];
  fileName: string | null;
  isLoading: boolean;
  filters: FilterState;
  setFile: (file: File) => Promise<void>;
  setFilters: (newFilters: Partial<FilterState>) => void;
  clearFilters: () => void;
  clearData: () => void;
  getInitialFilters: (rows: CleanRow[]) => FilterState;
}

const defaultFilters: FilterState = {
  dateRange: {
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  },
  agents: [],
  products: [],
  provinces: [],
  qaStatus: 'All',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      rawRows: [],
      cleanRows: [],
      fileName: null,
      isLoading: false,
      filters: defaultFilters,
      
      getInitialFilters: (rows: CleanRow[]): FilterState => {
        if (rows.length === 0) return defaultFilters;
        const dates = rows.map(r => r.created);
        const minDate = min(dates);
        const maxDate = max(dates);
        
        return {
          dateRange: {
            from: format(minDate, 'yyyy-MM-dd'),
            to: format(maxDate, 'yyyy-MM-dd'),
          },
          agents: [],
          products: [],
          provinces: [],
          qaStatus: 'All',
        };
      },

      setFile: async (file: File) => {
        set({ isLoading: true });
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rawRows = results.data as RawRow[];
            const cleanRows = normalizeData(rawRows);
            const initialFilters = get().getInitialFilters(cleanRows);
            set({
              rawRows,
              cleanRows,
              fileName: file.name,
              isLoading: false,
              filters: initialFilters,
            });
          },
          error: (error: any) => {
            console.error("CSV Parsing Error:", error);
            set({ isLoading: false });
          },
        });
      },

      setFilters: (newFilters: Partial<FilterState>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },
      
      clearFilters: () => {
         const initialFilters = get().getInitialFilters(get().cleanRows);
         set({ filters: initialFilters });
      },

      clearData: () => {
        set({
          rawRows: [],
          cleanRows: [],
          fileName: null,
          filters: defaultFilters
        });
      },
    }),
    {
      name: 'sig-sales-dashboard-storage',
      partialize: (state) => ({ cleanRows: state.cleanRows, fileName: state.fileName }),
    }
  )
);
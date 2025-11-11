import { parse, parseISO, format, differenceInDays, getISOWeek, isValid } from 'date-fns';
import { RawRow, CleanRow } from '../types';

const COL_MAP: Record<string, keyof Partial<CleanRow>> = {
  'Created': 'created',
  'Agent Name': 'agent',
  'Product': 'product',
  'Verkoop Tiepe': 'verkoopType',
  'Client Details: Client Name': 'clientName',
  'Client Details: Client Email': 'clientEmail',
  'Client Details: Client Phone Number': 'clientPhone',
  'Client Details: City/Town': 'city',
  'Client Details: Province': 'province',
  'Client ID Number': 'idNumber',
  'Monthly Premium': 'monthlyPremium',
  'Annual Premium': 'annualPremium',
  'Debit Order Date': 'debitDate',
  'Payment Frequency': 'paymentFrequency',
  'QA (Admin Only)': 'qaRaw',
};

const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/[\s,R]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const parseFlexibleDate = (value: any): Date | null => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  const formats = [
    'yyyy-MM-dd HH:mm:ss',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy'
  ];
  
  // Try ISO parse first
  let date = parseISO(trimmed);
  if(isValid(date)) return date;

  for (const fmt of formats) {
    date = parse(trimmed, fmt, new Date());
    if (isValid(date)) {
      return date;
    }
  }
  return null;
};

export const normalizeData = (rows: RawRow[]): CleanRow[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  // First pass to identify duplicates
  rows.forEach(row => {
    const id = (row['Client ID Number'] as string)?.trim();
    const product = (row['Product'] as string)?.trim();
    if (id && product) {
      const key = `${id}|${product}`;
      if (seen.has(key)) {
        duplicates.add(key);
      } else {
        seen.add(key);
      }
    }
  });
  
  seen.clear(); // clear for reuse in cleaning

  const cleanedRows: CleanRow[] = rows
    .map((row, index) => {
      const initialClean: any = { id: index };
      for (const key in COL_MAP) {
        const mappedKey = COL_MAP[key as keyof typeof COL_MAP];
        initialClean[mappedKey] = row[key];
      }
      
      const agent = (initialClean.agent as string)?.trim();
      const product = (initialClean.product as string)?.trim();
      const createdDate = parseFlexibleDate(initialClean.created);

      if (!agent || !product || !createdDate) {
        return null;
      }
      
      const debitDate = parseFlexibleDate(initialClean.debitDate);
      const monthlyPremium = parseNumber(initialClean.monthlyPremium);
      const annualPremium = parseNumber(initialClean.annualPremium);

      const premiumEffective = monthlyPremium > 0 ? monthlyPremium : (annualPremium / 12);

      const qaRaw = (initialClean.qaRaw as string)?.trim() || '';
      const qaStatus = /reject/i.test(qaRaw) ? "Rejected" : "Passed";

      const qaReasonMatch = qaRaw.match(/\((.*?)\)/);
      const qaReason = qaStatus === 'Rejected' 
        ? (qaReasonMatch ? qaReasonMatch[1].trim() : 'Unknown Reason') 
        : '';

      const idNumber = String(initialClean.idNumber || '').trim();
      const duplicateKey = `${idNumber}|${product}`;

      return {
        id: index,
        created: createdDate,
        date: format(createdDate, 'yyyy-MM-dd'),
        month: format(createdDate, 'yyyy-MM'),
        week: getISOWeek(createdDate),
        agent,
        product,
        verkoopType: (initialClean.verkoopType as string)?.trim() || '',
        clientName: (initialClean.clientName as string)?.trim() || '',
        clientEmail: (initialClean.clientEmail as string)?.trim() || null,
        clientPhone: String(initialClean.clientPhone || '').trim(),
        city: (initialClean.city as string)?.trim() || null,
        province: (initialClean.province as string)?.trim() || null,
        idNumber,
        monthlyPremium,
        annualPremium,
        premiumEffective,
        debitDate,
        debitGap: debitDate ? Math.abs(differenceInDays(debitDate, createdDate)) : 0,
        paymentFrequency: (initialClean.paymentFrequency as string)?.trim() || '',
        qaRaw,
        qaStatus,
        qaReason,
        isDuplicate: duplicates.has(duplicateKey),
      };
    })
    .filter((row): row is CleanRow => row !== null);

  return cleanedRows;
};

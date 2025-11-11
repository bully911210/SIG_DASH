export type RawRow = Record<string, string | number | null>;

export interface CleanRow {
  id: number;
  created: Date;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  week: number;
  agent: string;
  product: string;
  verkoopType: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string;
  city: string | null;
  province: string | null;
  idNumber: string;
  monthlyPremium: number;
  annualPremium: number;
  premiumEffective: number;
  debitDate: Date | null;
  debitGap: number;
  paymentFrequency: string;
  qaRaw: string | null;
  qaStatus: "Passed" | "Rejected";
  qaReason: string;
  isDuplicate: boolean;
}

export interface FilterState {
  dateRange: {
    from: string; // YYYY-MM-DD
    to: string; // YYYY-MM-DD
  };
  agents: string[];
  products: string[];
  provinces: string[];
  qaStatus: "All" | "Passed" | "Rejected";
}

export interface AgentSummary {
  agent: string;
  sales: number;
  totalPremium: number;
  avgPremium: number;
  rejected: number;
  passRate: number;
  avgDebitGap: number;
}

export interface QaReasonSummary {
    reason: string;
    count: number;
    share: number;
    totalPremium: number;
    agents: string[];
}

export interface StatsPanelMetrics {
    provinceProfitDensity: number;
    debitLagRiskIndex: number;
    avgPremiumUplift: number;
}

import { useMemo } from 'react';
import { useStore } from '../services/useStore';
import { CleanRow, AgentSummary, QaReasonSummary, StatsPanelMetrics } from '../types';
import { parseISO, isWithinInterval, eachDayOfInterval, format, subDays, compareAsc } from 'date-fns';

// Helper for standard deviation
const stdev = (arr: number[]): number => {
    if (arr.length < 2) return 0;
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b) / n;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
    return Math.sqrt(variance);
};

const getMode = (arr: (string | null | undefined)[]): string => {
    if (arr.length === 0) return 'N/A';
    // FIX: Corrected typo from `constcounts` to `const counts`.
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let mode = 'N/A';
    for (const item of arr) {
        if (!item) continue;
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > maxCount) {
            maxCount = counts[item];
            mode = item;
        }
    }
    return mode;
}

export const useFilteredData = () => {
  const { cleanRows, filters } = useStore();

  return useMemo(() => {
    const { dateRange, agents, products, provinces, qaStatus } = filters;
    const fromDate = parseISO(dateRange.from);
    const toDate = parseISO(dateRange.to + 'T23:59:59'); // Include end of day

    const filteredData = cleanRows.filter((row) => {
      const inDateRange = isWithinInterval(row.created, { start: fromDate, end: toDate });
      const agentMatch = agents.length === 0 || agents.includes(row.agent);
      const productMatch = products.length === 0 || products.includes(row.product);
      const provinceMatch = provinces.length === 0 || (row.province && provinces.includes(row.province));
      const qaMatch = qaStatus === 'All' || row.qaStatus === qaStatus;

      return inDateRange && agentMatch && productMatch && provinceMatch && qaMatch;
    });
    
    // KPI Calculations
    const numSales = filteredData.length;
    const totalPremium = filteredData.reduce((acc, row) => acc + row.premiumEffective, 0);
    const avgPremium = numSales > 0 ? totalPremium / numSales : 0;
    const activeAgents = new Set(filteredData.map(r => r.agent)).size;
    const rejectedCount = filteredData.filter(r => r.qaStatus === 'Rejected').length;
    const passRate = numSales > 0 ? (numSales - rejectedCount) / numSales : 0;
    const totalDebitGap = filteredData.reduce((acc, row) => acc + row.debitGap, 0);
    const avgDebitGap = numSales > 0 ? totalDebitGap / numSales : 0;
    
    const premiumLost = filteredData
      .filter(r => r.qaStatus === 'Rejected')
      .reduce((acc, row) => acc + row.premiumEffective, 0);

    const reactivationsCount = filteredData.filter(r => r.verkoopType === 'Reactivation').length;
    const reactivationsPercent = numSales > 0 ? reactivationsCount / numSales : 0;

    const debitDatesWithDay = filteredData.filter(r => r.debitDate).map(r => r.debitDate!.getDate());
    const avgDebitDay = debitDatesWithDay.length > 0
        ? debitDatesWithDay.reduce((a, b) => a + b, 0) / debitDatesWithDay.length
        : 0;
        
    const duplicateCount = filteredData.filter(r => r.isDuplicate).length;

    const missingEmailCount = filteredData.filter(r => !r.clientEmail).length;
    const missingEmailPercent = numSales > 0 ? missingEmailCount / numSales : 0;
    
    const topProvinceByPremium = getMode(filteredData.map(r => r.province));
    const topProductByVolume = getMode(filteredData.map(r => r.product));


    const kpiMetrics = {
      totalPremium,
      avgPremium,
      numSales,
      activeAgents,
      passRate,
      rejectedCount,
      avgDebitGap,
      premiumLost,
      reactivationsPercent,
      avgDebitDay,
      duplicateCount,
      missingEmailPercent,
      topProvinceByPremium,
      topProductByVolume
    };

    // Agent Summary
    const agentMap = new Map<string, { sales: number; totalPremium: number; rejected: number; totalDebitGap: number }>();
    filteredData.forEach(row => {
      if (!agentMap.has(row.agent)) {
        agentMap.set(row.agent, { sales: 0, totalPremium: 0, rejected: 0, totalDebitGap: 0 });
      }
      const summary = agentMap.get(row.agent)!;
      summary.sales += 1;
      summary.totalPremium += row.premiumEffective;
      summary.totalDebitGap += row.debitGap;
      if (row.qaStatus === 'Rejected') {
        summary.rejected += 1;
      }
    });

    const agentSummary: AgentSummary[] = Array.from(agentMap.entries()).map(([agent, data]) => ({
      agent,
      sales: data.sales,
      totalPremium: data.totalPremium,
      avgPremium: data.sales > 0 ? data.totalPremium / data.sales : 0,
      rejected: data.rejected,
      passRate: data.sales > 0 ? (data.sales - data.rejected) / data.sales : 0,
      avgDebitGap: data.sales > 0 ? data.totalDebitGap / data.sales : 0,
    })).sort((a, b) => b.sales - a.sales);
    
    // Stats Panel Metrics
    const uniqueClients = new Set(filteredData.map(r => r.idNumber)).size;
    const provinceProfitDensity = uniqueClients > 0 ? totalPremium / uniqueClients : 0;
    const debitLagRiskCount = filteredData.filter(r => r.debitGap > 25).length;
    const debitLagRiskIndex = numSales > 0 ? debitLagRiskCount / numSales : 0;
    
    const increasePremiums = filteredData.filter(r => r.verkoopType === 'Increase').map(r => r.premiumEffective);
    const newMemberPremiums = filteredData.filter(r => r.verkoopType === 'New Member').map(r => r.premiumEffective);
    const avgIncreasePremium = increasePremiums.length > 0 ? increasePremiums.reduce((a, b) => a + b, 0) / increasePremiums.length : 0;
    const avgNewMemberPremium = newMemberPremiums.length > 0 ? newMemberPremiums.reduce((a, b) => a + b, 0) / newMemberPremiums.length : 0;
    const avgPremiumUplift = avgIncreasePremium - avgNewMemberPremium;
    
    const statsPanelMetrics: StatsPanelMetrics = {
        provinceProfitDensity,
        debitLagRiskIndex,
        avgPremiumUplift
    };
    
    // Problem & Data Hygiene Tables
    const highGapRejects = filteredData.filter(r => r.debitGap > 25 && r.qaStatus === 'Rejected');
    const missingContacts = filteredData.filter(r => !r.clientEmail || !r.clientPhone);
    const duplicates = filteredData.filter(r => r.isDuplicate);

    // QA Reason Summary Table
    const rejectedSales = filteredData.filter(r => r.qaStatus === 'Rejected');
    const reasonMap = new Map<string, { count: number; totalPremium: number; agents: Set<string> }>();
    rejectedSales.forEach(row => {
        if (!reasonMap.has(row.qaReason)) {
            reasonMap.set(row.qaReason, { count: 0, totalPremium: 0, agents: new Set() });
        }
        const summary = reasonMap.get(row.qaReason)!;
        summary.count += 1;
        summary.totalPremium += row.premiumEffective;
        summary.agents.add(row.agent);
    });
    const qaReasonSummary: QaReasonSummary[] = Array.from(reasonMap.entries()).map(([reason, data]) => ({
        reason,
        count: data.count,
        share: rejectedSales.length > 0 ? data.count / rejectedSales.length : 0,
        totalPremium: data.totalPremium,
        agents: Array.from(data.agents),
    })).sort((a, b) => b.count - a.count);

    // Rolling QA Chart Data
    const dailyStats: Record<string, { passed: number; total: number }> = {};
    filteredData.forEach(row => {
        if (!dailyStats[row.date]) {
            dailyStats[row.date] = { passed: 0, total: 0 };
        }
        dailyStats[row.date].total++;
        if (row.qaStatus === 'Passed') {
            dailyStats[row.date].passed++;
        }
    });

    const sortedDates = Object.keys(dailyStats).sort((a, b) => compareAsc(parseISO(a), parseISO(b)));
    const rollingQaData: { date: string; rate: number }[] = [];
    if (sortedDates.length > 0) {
        const dateInterval = eachDayOfInterval({ start: parseISO(sortedDates[0]), end: parseISO(sortedDates[sortedDates.length - 1]) });
        dateInterval.forEach(currentDate => {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            let total = 0;
            let passed = 0;
            for (let i = 0; i < 7; i++) {
                const pastDateStr = format(subDays(currentDate, i), 'yyyy-MM-dd');
                if (dailyStats[pastDateStr]) {
                    total += dailyStats[pastDateStr].total;
                    passed += dailyStats[pastDateStr].passed;
                }
            }
            rollingQaData.push({ date: dateStr, rate: total > 0 ? passed / total : 0 });
        });
    }

    // Agent Consistency Chart Data
    const agentDailyRates: Record<string, Record<string, {passed: number, total: number}>> = {};
    filteredData.forEach(row => {
        if (!agentDailyRates[row.agent]) agentDailyRates[row.agent] = {};
        if (!agentDailyRates[row.agent][row.date]) agentDailyRates[row.agent][row.date] = { passed: 0, total: 0 };
        agentDailyRates[row.agent][row.date].total++;
        if(row.qaStatus === 'Passed') agentDailyRates[row.agent][row.date].passed++;
    });

    const agentConsistencyData = Object.entries(agentDailyRates).map(([agent, dailyData]) => {
        const rates = Object.values(dailyData).map(d => d.total > 0 ? d.passed / d.total : 0);
        const dailyRateStdev = stdev(rates);
        return {
            agent,
            consistencyIndex: (1 - dailyRateStdev) * 100
        };
    }).sort((a,b) => b.consistencyIndex - a.consistencyIndex);

    // Agent QA Trend Data
    const agentTrendData: Record<string, {date: string, rate: number}[]> = {};
    Object.entries(agentDailyRates).forEach(([agent, dailyData]) => {
      agentTrendData[agent] = Object.entries(dailyData).map(([date, data]) => ({
        date,
        rate: data.total > 0 ? data.passed / data.total : 0,
      })).sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
    });


    // Unique values for filters
    const allAgents = [...new Set(cleanRows.map(r => r.agent))].sort();
    const allProducts = [...new Set(cleanRows.map(r => r.product))].sort();
    const allProvinces = [...new Set(cleanRows.map(r => r.province).filter(p => p))].sort() as string[];


    return {
      filteredData,
      kpiMetrics,
      agentSummary,
      statsPanelMetrics,
      problemSales: duplicates, // Keep original problem sales for existing component
      highGapRejects,
      missingContacts,
      duplicates,
      qaReasonSummary,
      rollingQaData,
      agentConsistencyData,
      agentTrendData,
      filterOptions: {
        allAgents,
        allProducts,
        allProvinces,
      }
    };
  }, [cleanRows, filters]);
};
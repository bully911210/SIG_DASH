import React, { useRef, useState } from 'react';
import { useFilteredData } from '../hooks/useFilteredData';
import { formatCurrency, formatPercentage } from '../utils/helpers';
import KpiCard from './KpiCard';
import Filters from './Filters';
import AgentQaChart from './charts/AgentQaChart';
import QaTrendChart from './charts/QaTrendChart';
import DebitGapHistogram from './charts/DebitGapHistogram';
import ProductPremiumChart from './charts/ProductPremiumChart';
import AgentSummaryTable from './tables/AgentSummaryTable';
import QaLogTable from './tables/QaLogTable';
import ProblemSalesTable from './tables/ProblemSalesTable';
import ExportButtons from './ExportButtons';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { useStore } from '../services/useStore';
import RollingQaChart from './charts/RollingQaChart';
import DebitGapScatterChart from './charts/DebitGapScatterChart';
import QaReasonChart from './charts/QaReasonChart';
import DuplicatesByProductChart from './charts/DuplicatesByProductChart';
import HighGapRejectsTable from './tables/HighGapRejectsTable';
import MissingContactsTable from './tables/MissingContactsTable';
import DuplicatesTable from './tables/DuplicatesTable';
import QaReasonSummaryTable from './tables/QaReasonSummaryTable';
import StatsPanel from './StatsPanel';
import AgentTrendChart from './charts/AgentTrendChart';
import SalesTypeBreakdownChart from './charts/SalesTypeBreakdownChart';
import ProductMomentumChart from './charts/ProductMomentumChart';
import DebitDayDistributionChart from './charts/DebitDayDistributionChart';
import AgentConsistencyChart from './charts/AgentConsistencyChart';
import EmailCaptureChart from './charts/EmailCaptureChart';
import ProvinceQaHeatmap from './charts/ProvinceQaHeatmap';

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left"
            >
                <h3 className="text-xl font-semibold text-sig-blue flex justify-between items-center">
                    {title}
                    <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </h3>
            </button>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
};


const Dashboard: React.FC = () => {
  const { 
    filteredData, 
    kpiMetrics, 
    agentSummary, 
    filterOptions,
    highGapRejects,
    missingContacts,
    duplicates,
    qaReasonSummary,
    rollingQaData,
    statsPanelMetrics,
    agentConsistencyData,
    agentTrendData,
  } = useFilteredData();
  const isLoading = useStore(state => state.isLoading);
  const dashboardRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <SpinnerIcon className="w-12 h-12 text-sig-light-blue" />
        <span className="ml-4 text-lg">Loading Dashboard...</span>
      </div>
    );
  }
  
  if (!filteredData) {
      return <div>Error loading data.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-sig-blue">Sales Operations Intelligence</h2>
          <ExportButtons 
            filteredData={filteredData}
            dashboardRef={dashboardRef}
            agentSummary={agentSummary}
          />
      </div>
      
      <Filters options={filterOptions} />
      
      <div id="dashboard-export-area" ref={dashboardRef} className="space-y-6 bg-gray-100 p-4 rounded-lg">
        
        <Section title="Key Metrics & Strategic Insights">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                <KpiCard title="Total Premium" value={formatCurrency(kpiMetrics.totalPremium)} />
                <KpiCard title="No. of Sales" value={kpiMetrics.numSales.toLocaleString()} />
                <KpiCard title="QA Pass Rate" value={formatPercentage(kpiMetrics.passRate)} />
                <KpiCard title="Rejected Sales" value={kpiMetrics.rejectedCount.toLocaleString()} />
                <KpiCard title="Avg Premium" value={formatCurrency(kpiMetrics.avgPremium)} />
                <KpiCard title="Active Agents" value={kpiMetrics.activeAgents.toLocaleString()} />
                <KpiCard title="Avg Debit Gap" value={`${kpiMetrics.avgDebitGap.toFixed(1)} days`} />
                <KpiCard title="Premium Lost" value={formatCurrency(kpiMetrics.premiumLost)} />
                <KpiCard title="% Reactivations" value={formatPercentage(kpiMetrics.reactivationsPercent)} />
                <KpiCard title="Avg Debit Day" value={kpiMetrics.avgDebitDay.toFixed(1)} />
                <KpiCard title="Duplicate Sales" value={kpiMetrics.duplicateCount.toLocaleString()} />
                <KpiCard title="Missing Email %" value={formatPercentage(kpiMetrics.missingEmailPercent)} />
                <KpiCard title="Top Province" value={kpiMetrics.topProvinceByPremium} />
                <KpiCard title="Top Product" value={kpiMetrics.topProductByVolume} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <StatsPanel title="Province Profit Density" value={formatCurrency(statsPanelMetrics.provinceProfitDensity)} tooltip="Total premium divided by unique clients." />
               <StatsPanel title="Debit Lag Risk Index" value={formatPercentage(statsPanelMetrics.debitLagRiskIndex)} tooltip="Percentage of sales with a debit gap > 25 days." />
               <StatsPanel title="Avg Premium Uplift" value={formatCurrency(statsPanelMetrics.avgPremiumUplift)} tooltip="Average premium difference between 'Increase' and 'New Member' sales." />
            </div>
        </Section>

        <Section title="Operational Charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow"><AgentQaChart data={filteredData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><QaTrendChart data={filteredData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><DebitGapHistogram data={filteredData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><ProductPremiumChart data={filteredData} /></div>
            </div>
        </Section>

        <Section title="Advanced Analytics" defaultOpen={false}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow"><AgentTrendChart data={agentTrendData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><RollingQaChart data={rollingQaData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><DebitGapScatterChart data={filteredData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><ProductMomentumChart data={filteredData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><SalesTypeBreakdownChart data={filteredData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><DebitDayDistributionChart data={filteredData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><AgentConsistencyChart data={agentConsistencyData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><EmailCaptureChart data={agentSummary} /></div>
            </div>
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
                 <h4 className="text-lg font-semibold mb-4 text-sig-blue">Province QA Heatmap</h4>
                <ProvinceQaHeatmap data={filteredData} />
            </div>
        </Section>
        
        <Section title="Data Hygiene & Risk" defaultOpen={false}>
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4 text-sig-blue">QA Rejection Reason Summary</h4>
                    <QaReasonSummaryTable data={qaReasonSummary} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4 text-sig-blue">High-Gap Rejections ({highGapRejects.length})</h4>
                    <HighGapRejectsTable data={highGapRejects} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4 text-sig-blue">Duplicate Sales ({duplicates.length})</h4>
                    <DuplicatesTable data={duplicates} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4 text-sig-blue">Missing Contact Info ({missingContacts.length})</h4>
                    <MissingContactsTable data={missingContacts} />
                </div>
            </div>
        </Section>

        <Section title="Operational Summaries" defaultOpen={false}>
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4 text-sig-blue">Agent Summary</h4>
                    <AgentSummaryTable data={agentSummary} />
                </div>
                 <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4 text-sig-blue">Full QA Log</h4>
                    <QaLogTable data={filteredData} />
                </div>
            </div>
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;

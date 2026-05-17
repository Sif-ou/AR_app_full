'use client'
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Tag, 
  Users, 
  ShoppingBag, 
  Filter, 
  Download, 
  Pause, 
  Play, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Lock // Imported for the access restriction layout
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface KPICardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  subtitle: string;
}

interface PromoCampaign {
  code: string;
  status: 'Active' | 'Paused' | 'Expired';
  budgetUsed: number;
  redemptions: number;
  cac: number;
  netProfit: number;
  type: string;
}

// --- Mock Data ---
const INITIAL_CAMPAIGNS: PromoCampaign[] = [
  { code: 'SPRING40', status: 'Active', budgetUsed: 82, redemptions: 4120, cac: 12.40, netProfit: 34200, type: 'Flash Sale' },
  { code: 'INFLUENCER_X', status: 'Active', budgetUsed: 45, redemptions: 1890, cac: 9.10, netProfit: 18500, type: 'Influencer' },
  { code: 'FLASH20', status: 'Expired', budgetUsed: 100, redemptions: 5000, cac: 15.50, netProfit: 41000, type: 'Flash Sale' },
  { code: 'WELCOME10', status: 'Active', budgetUsed: 28, redemptions: 2110, cac: 8.50, netProfit: 19400, type: 'Email' },
  { code: 'BOGO_WEEKEND', status: 'Paused', budgetUsed: 12, redemptions: 440, cac: 22.10, netProfit: 1200, type: 'BOGO' },
];

export default function PromoDashboard() {
  // --- ROLE VERIFICATION GATE ---
  // Replace this mock hook state with your actual global auth platform (e.g., NextAuth, Clerk, custom context)
  const [currentUser] = useState({
    name: "Alex",
    roles: ["MARKETING MANAGER"] // Change or empty this array to test authorization logic
  });

  const hasAccess = currentUser?.roles?.includes("MARKETING MANAGER");

  // State Management
  const [campaigns, setCampaigns] = useState<PromoCampaign[]>(INITIAL_CAMPAIGNS);
  const [filterType, setFilterType] = useState<string>('All');

  // Toggle status handler for the action buttons
  const toggleStatus = (code: string) => {
    setCampaigns(prev => prev.map(camp => {
      if (camp.code === code) {
        const nextStatus: PromoCampaign['status'] = camp.status === 'Active' ? 'Paused' : 'Active';
        return { ...camp, status: nextStatus };
      }
      return camp;
    }));
  };

  const filteredCampaigns = filterType === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.type === filterType);

  // --- ACCESS DENIED UI ---
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center p-6 font-sans antialiased">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-md">
          <div className="inline-flex p-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl mb-5">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Level Clearance Required</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            This module processes live financial allocation metrics and budget deployments. You must hold the 
            <span className="mx-1 px-2 py-0.5 font-mono text-xs text-indigo-300 bg-indigo-950/50 border border-indigo-800/60 rounded">
              MARKETING MANAGER
            </span> 
            role attribute to review or alter campaign incentives.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl py-2.5 text-sm font-semibold transition-colors focus:outline-none"
          >
            Return to Directory
          </button>
        </div>
      </div>
    );
  }

  // --- REGULAR RENDERING (Clearance Met) ---
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 font-sans antialiased">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Promo Performance Insights Hub</h1>
          <p className="text-sm text-slate-400">Real-time optimization and ROI tracking for active marketing incentives.</p>
        </div>
        
        {/* Actions / Global Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-800">All Channels</option>
              <option value="Flash Sale" className="bg-slate-800">Flash Sale</option>
              <option value="Influencer" className="bg-slate-800">Influencer</option>
              <option value="Email" className="bg-slate-800">Email</option>
              <option value="BOGO" className="bg-slate-800">BOGO</option>
            </select>
          </div>
        </div>
      </header>

      {/* --- EXECUTIVE SUMMARY / KPI CARDS --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard 
          title="Total Promo Revenue" 
          value="$142,500" 
          change="+18.4%" 
          isPositive={true} 
          icon={<DollarSign className="w-5 h-5 text-indigo-400" />}
          subtitle="vs. previous 30 days"
        />
        <KPICard 
          title="Blended Promo ROI" 
          value="4.2x" 
          change="+0.3x" 
          isPositive={true} 
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          subtitle="Target threshold: 3.5x"
        />
        <KPICard 
          title="Total Redemptions" 
          value="12,450" 
          change="+8.2%" 
          isPositive={true} 
          icon={<Tag className="w-5 h-5 text-amber-400" />}
          subtitle="Across all active streams"
        />
        <KPICard 
          title="Average Order Value" 
          value="$68.50" 
          change="-2.1%" 
          isPositive={false} 
          icon={<ShoppingBag className="w-5 h-5 text-rose-400" />}
          subtitle="Expected margin dip"
        />
      </section>

      {/* --- ANALYTICS VISUALIZATIONS SECTION --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Simulated Chart: Campaign Revenue vs Conversion Rate */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Promo Distribution & Conversion</h3>
              <p className="text-xs text-slate-400">Comparing top campaign revenue output against actual checkouts.</p>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">Live Dual Axis</span>
          </div>
          
          {/* Mock Visual representation of Chart Rows */}
          <div className="space-y-4 pt-2">
            {[
              { name: 'SPRING40', rev: '$34.2K', width: 'w-[85%]', conv: '4.8%', color: 'bg-indigo-500' },
              { name: 'FLASH20', rev: '$41.0K', width: 'w-[100%]', conv: '5.2%', color: 'bg-indigo-500' },
              { name: 'WELCOME10', rev: '$19.4K', width: 'w-[48%]', conv: '3.1%', color: 'bg-slate-700' },
              { name: 'INFLUENCER_X', rev: '$18.5K', width: 'w-[45%]', conv: '6.4%', color: 'bg-emerald-500' },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300 font-mono">{bar.name}</span>
                  <span className="text-slate-400">Revenue: <strong className="text-white">{bar.rev}</strong> • Conv: <strong className="text-emerald-400">{bar.conv}</strong></span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full transition-all duration-500`} style={{ width: bar.width.split('[')[1].split(']')[0] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Acquisition Breakdown Mock */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Acquisition Breakdown</h3>
            <p className="text-xs text-slate-400 mb-6">Ensuring promo codes bring fresh leads instead of margin dilution.</p>
            
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32 rounded-full border-[12px] border-indigo-500 flex items-center justify-center border-t-slate-700">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">65%</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">New Users</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-slate-300">New Client Inflow</span>
              </div>
              <span className="font-semibold text-white">8,092 accounts</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-slate-300">Returning Customers</span>
              </div>
              <span className="font-semibold text-white">4,358 accounts</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE MONITOR DATA TABLE --- */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Live Active Promo Monitor</h3>
            <p className="text-xs text-slate-400">Track structural integrity, current budgets, and operational targets.</p>
          </div>
          <span className="text-xs text-slate-400">Showing {filteredCampaigns.length} campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-5">Promo Code</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Budget Deployment</th>
                <th className="py-3 px-5 text-right">Redemptions</th>
                <th className="py-3 px-5 text-right">CAC</th>
                <th className="py-3 px-5 text-right">Net Profit</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.code} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="py-3.5 px-5">
                    <span className="text-white block font-mono font-bold tracking-wide">{camp.code}</span>
                    <span className="text-[11px] text-slate-400">{camp.type}</span>
                  </td>
                  
                  <td className="py-3.5 px-5">
                    {camp.status === 'Active' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                    {camp.status === 'Paused' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Paused
                      </span>
                    )}
                    {camp.status === 'Expired' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        <AlertCircle className="w-3 h-3" /> Expired
                      </span>
                    )}
                  </td>
                  
                  <td className="py-3.5 px-5 min-w-[150px]">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${camp.budgetUsed >= 90 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${camp.budgetUsed}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-300 w-8 text-right">{camp.budgetUsed}%</span>
                    </div>
                  </td>
                  
                  <td className="py-3.5 px-5 text-right font-mono text-slate-200">
                    {camp.redemptions.toLocaleString()}
                  </td>
                  
                  <td className="py-3.5 px-5 text-right font-mono text-slate-200">
                    ${camp.cac.toFixed(2)}
                  </td>
                  
                  <td className="py-3.5 px-5 text-right font-mono text-emerald-400">
                    ${camp.netProfit.toLocaleString()}
                  </td>
                  
                  <td className="py-3.5 px-5 text-center">
                    {camp.status === 'Expired' ? (
                      <span className="text-xs text-slate-500 italic">Locked</span>
                    ) : (
                      <button 
                        onClick={() => toggleStatus(camp.code)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                          camp.status === 'Active' 
                            ? 'bg-slate-800 border-slate-700 hover:bg-rose-950/30 hover:border-rose-900/50 hover:text-rose-400 text-slate-300' 
                            : 'bg-indigo-600 border-transparent hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {camp.status === 'Active' ? (
                          <>
                            <Pause className="w-3 h-3" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" /> Resume
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// --- Internal Sub-Component: KPI Cards ---
function KPICard({ title, value, change, isPositive, icon, subtitle }: KPICardProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-700/80 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</span>
        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700/50">
          {icon}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
          <span className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
            isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
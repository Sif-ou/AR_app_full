'use client'
import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  Filter, 
  RotateCcw, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search,
  CheckCircle,
  Truck
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  statusType: 'normal' | 'warning' | 'success' | 'info';
  icon: React.ReactNode;
  subtitle: string;
}

interface StockItem {
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unitCost: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// --- Mock Inventory Data ---
const INITIAL_STOCK: StockItem[] = [
  { sku: 'CPU-INT-12900', name: 'Intel Core i9-12900K', category: 'Processors', currentStock: 42, minThreshold: 15, maxCapacity: 120, unitCost: 420.00, supplier: 'Silicon Dist. Inc', status: 'In Stock' },
  { sku: 'GPU-NV-4070Ti', name: 'NVIDIA RTX 4070 Ti Super', category: 'GPU', currentStock: 4, minThreshold: 10, maxCapacity: 50, unitCost: 799.00, supplier: 'NexGen Logistics', status: 'Low Stock' },
  { sku: 'RAM-COR-32GB', name: 'Corsair Vengeance DDR5 32GB', category: 'Memory', currentStock: 118, minThreshold: 30, maxCapacity: 200, unitCost: 115.00, supplier: 'Global Parts Corp', status: 'In Stock' },
  { sku: 'SSD-SAM-2TB', name: 'Samsung 990 Pro 2TB NVMe', category: 'Storage', currentStock: 0, minThreshold: 25, maxCapacity: 150, unitCost: 160.00, supplier: 'Silicon Dist. Inc', status: 'Out of Stock' },
  { sku: 'PSU-EVG-850W', name: 'EVGA SuperNOVA 850G Gold', category: 'Power Supplies', currentStock: 8, minThreshold: 12, maxCapacity: 60, unitCost: 135.00, supplier: 'VoltForce Wholesale', status: 'Low Stock' },
];

export default function StockDashboard() {
  const [inventory, setInventory] = useState<StockItem[]>(INITIAL_STOCK);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Logic to issue an instant restock order simulation
  const triggerQuickReorder = (sku: string) => {
    setInventory(prev => prev.map(item => {
      if (item.sku === sku) {
        // Set stock to full capacity for mock simulation
        return { ...item, currentStock: item.maxCapacity, status: 'In Stock' };
      }
      return item;
    }));
  };

  // Filter computations
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Derived metrics
  const totalSkuCount = inventory.length;
  const lowStockCount = inventory.filter(i => i.status === 'Low Stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'Out of Stock').length;
  const totalValuation = inventory.reduce((acc, item) => acc + (item.currentStock * item.unitCost), 0);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 font-sans antialiased">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Warehouse Inventory Control</h1>
          <p className="text-sm text-slate-400">Real-time stock valuation, capacity distribution, and procurement pipeline tools.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar input */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3" />
            <input 
              type="text"
              placeholder="Search SKU or item description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent pl-6 pr-2 text-slate-200 focus:outline-none placeholder-slate-500 w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-800">All Categories</option>
              <option value="Processors" className="bg-slate-800">Processors</option>
              <option value="GPU" className="bg-slate-800">GPU</option>
              <option value="Memory" className="bg-slate-800">Memory</option>
              <option value="Storage" className="bg-slate-800">Storage</option>
              <option value="Power Supplies" className="bg-slate-800">Power Supplies</option>
            </select>
          </div>
          
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-600/10">
            <Plus className="w-4 h-4" />
            Receive Stock
          </button>
        </div>
      </header>

      {/* --- EXECUTIVE MANAGEMENT CARDS --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard 
          title="Total Stock Valuation" 
          value={`$${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          statusType="info"
          icon={<Package className="w-5 h-5 text-sky-400" />}
          subtitle="Capital tied in physical assets"
        />
        <KPICard 
          title="Active SKUs Tracked" 
          value={totalSkuCount.toString()} 
          statusType="normal"
          icon={<Layers className="w-5 h-5 text-indigo-400" />}
          subtitle="Across 5 storage categories"
        />
        <KPICard 
          title="Critical Shortages" 
          value={lowStockCount.toString()} 
          statusType={lowStockCount > 0 ? "warning" : "success"}
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          subtitle="Below safety threshold limit"
        />
        <KPICard 
          title="Total Stockouts" 
          value={outOfStockCount.toString()} 
          statusType={outOfStockCount > 0 ? "warning" : "success"}
          icon={<RotateCcw className="w-5 h-5 text-rose-400" />}
          subtitle="Unfulfilled backorder risk"
        />
      </section>

      {/* --- WAREHOUSE METRICS & CAPACITY BLOCK --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Fulfillment Activities Log */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Material Flow Analysis</h3>
              <p className="text-xs text-slate-400">Tracking inward inbound supply shipments versus outbound order dispatching.</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-400"><ArrowDownLeft className="w-3.5 h-3.5" /> Inbound</span>
              <span className="flex items-center gap-1 text-sky-400"><ArrowUpRight className="w-3.5 h-3.5" /> Outbound</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { time: '10 mins ago', desc: 'Received 50x Corsair Memory units', type: 'inbound', supplier: 'Global Parts Corp' },
              { time: '42 mins ago', desc: 'Dispatched 12x GPU orders to fulfillment hub', type: 'outbound', supplier: 'UPS Freight' },
              { time: '2 hours ago', desc: 'Restock pipeline confirmation: 40x Power Supplies', type: 'inbound', supplier: 'VoltForce Wholesale' },
              { time: '5 hours ago', desc: 'Dispatched 30x Processors to retail partners', type: 'outbound', supplier: 'FedEx Express' },
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded ${log.type === 'inbound' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-sky-500/10 text-sky-400'}`}>
                    {log.type === 'inbound' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">{log.desc}</span>
                    <span className="text-[10px] text-slate-400">{log.supplier}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-medium">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Capacity Volumetric Gauge Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Volumetric Floor Capacity</h3>
            <p className="text-xs text-slate-400 mb-6">Current active racking allocations utilized inside the regional facility layout.</p>
            
            <div className="flex items-center justify-center py-2">
              <div className="relative w-32 h-32 rounded-full border-[12px] border-emerald-500 flex items-center justify-center border-t-slate-800 rotate-[45deg]">
                <div className="text-center -rotate-[45deg]">
                  <span className="block text-2xl font-bold text-white">74%</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Occupied</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Dedicated Pallet Bays:</span>
              <span className="font-semibold text-white">1,200 Bays</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Remaining Buffer Space:</span>
              <span className="font-semibold text-amber-400">312 Bays left</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STOCK MONITOR DATA TABLE --- */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">SKU Inventory Master Register</h3>
            <p className="text-xs text-slate-400">Review safe minimum threshold constraints against active real-time tracking points.</p>
          </div>
          <span className="text-xs text-slate-400">Showing {filteredInventory.length} of {totalSkuCount} SKUs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-5">Item Particulars</th>
                <th className="py-3 px-5">Stock Status</th>
                <th className="py-3 px-5 text-right">Available Qty</th>
                <th className="py-3 px-5 text-right">Min Threshold</th>
                <th className="py-3 px-5 text-right">Unit Cost</th>
                <th className="py-3 px-5 text-right">Total Asset Worth</th>
                <th className="py-3 px-5 text-center">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredInventory.map((item) => {
                const totalItemValue = item.currentStock * item.unitCost;
                // Calculate item bar percentage safety line
                const percentageOfMax = Math.min((item.currentStock / item.maxCapacity) * 100, 100);

                return (
                  <tr key={item.sku} className="hover:bg-slate-800/20 transition-colors group">
                    {/* Part Identity Details */}
                    <td className="py-3.5 px-5">
                      <span className="text-white block font-semibold text-sm">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono tracking-wide">{item.sku} • {item.category}</span>
                    </td>
                    
                    {/* Status Rules */}
                    <td className="py-3.5 px-5">
                      {item.status === 'In Stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Healthy
                        </span>
                      )}
                      {item.status === 'Low Stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Reorder Flag
                        </span>
                      )}
                      {item.status === 'Out of Stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" /> Depleted
                        </span>
                      )}
                    </td>
                    
                    {/* Visual Capacity Stack bar alongside numeric count */}
                    <td className="py-3.5 px-5 text-right">
                      <span className="block font-mono text-white text-sm">{item.currentStock} units</span>
                      <div className="w-24 bg-slate-800 h-1 rounded-full overflow-hidden inline-block mt-1">
                        <div 
                          className={`h-full rounded-full ${item.status === 'In Stock' ? 'bg-indigo-500' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${percentageOfMax}%` }}
                        />
                      </div>
                    </td>
                    
                    {/* Static metrics safety lines */}
                    <td className="py-3.5 px-5 text-right font-mono text-slate-400">
                      {item.minThreshold}
                    </td>
                    
                    {/* Unit Cost */}
                    <td className="py-3.5 px-5 text-right font-mono text-slate-400">
                      ${item.unitCost.toFixed(2)}
                    </td>
                    
                    {/* Aggregated value */}
                    <td className="py-3.5 px-5 text-right font-mono text-slate-200">
                      ${totalItemValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    
                    {/* Purchase actions */}
                    <td className="py-3.5 px-5 text-center">
                      {item.status === 'In Stock' ? (
                        <span className="text-xs text-slate-500 flex items-center justify-center gap-1 font-normal">
                          <CheckCircle className="w-3 h-3 text-slate-600" /> Optimal
                        </span>
                      ) : (
                        <button 
                          onClick={() => triggerQuickReorder(item.sku)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-700 hover:border-transparent text-slate-300 transition-all shadow-sm"
                        >
                          <Truck className="w-3 h-3" /> Quick Order
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// --- Internal Sub-Component: KPI Cards ---
function KPICard({ title, value, statusType, icon, subtitle }: KPICardProps) {
  const statusBorderColor = {
    normal: 'border-slate-800 hover:border-slate-700',
    warning: 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/5',
    success: 'border-emerald-500/30 hover:border-emerald-500/50',
    info: 'border-slate-800 hover:border-slate-700'
  }[statusType];

  return (
    <div className={`bg-slate-900/60 border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 backdrop-blur-sm ${statusBorderColor}`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</span>
        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700/50">
          {icon}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
} 
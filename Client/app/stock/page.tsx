'use client'
import React, { useState, useEffect } from 'react';
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
  Truck,
  X,
  LogOut
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

// --- Furniture Inventory Mock Data ---
const INITIAL_STOCK: StockItem[] = [
  { sku: 'SOF-VEL-GRN-01', name: 'Emerald Velvet 3-Seater Sofa', category: 'Living Room', currentStock: 18, minThreshold: 5, maxCapacity: 40, unitCost: 450.00, supplier: 'Nordic Comfort MFG', status: 'In Stock' },
  { sku: 'TAB-OAK-RND-04', name: 'Solid Oak Round Dining Table', category: 'Dining', currentStock: 3, minThreshold: 6, maxCapacity: 25, unitCost: 299.00, supplier: 'TimberCraft Logistics', status: 'Low Stock' },
  { sku: 'CHR-ERG-BLK-09', name: 'Ergonomic Mesh Office Chair', category: 'Office', currentStock: 65, minThreshold: 15, maxCapacity: 100, unitCost: 85.00, supplier: 'Vertex Workspace Supply', status: 'In Stock' },
  { sku: 'BED-KNG-SHL-12', name: 'King-Size Tufted Platform Bed', category: 'Bedroom', currentStock: 0, minThreshold: 8, maxCapacity: 30, unitCost: 380.00, supplier: 'DreamRest Imports', status: 'Out of Stock' },
  { sku: 'LMP-BRS-FLR-02', name: 'Mid-Century Brass Floor Lamp', category: 'Lighting', currentStock: 4, minThreshold: 10, maxCapacity: 60, unitCost: 45.00, supplier: 'Aura Light Dist.', status: 'Low Stock' },
];

const CATEGORIES = ["Living Room", "Dining", "Office", "Bedroom", "Lighting"];

export default function StockDashboard() {
  // --- ROLE & AUTH STATE MANAGEMENT ---
  // Initializes the state checking local storage (or defaults to 'STOCK' if none exists yet)
  const [userRole, setUserRole] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role') || 'STOCK';
    }
    return 'STOCK';
  });

  const [inventory, setInventory] = useState<StockItem[]>(INITIAL_STOCK);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newStock, setNewStock] = useState({
    sku: '',
    name: '',
    category: CATEGORIES[0],
    currentStock: 0,
    minThreshold: 5,
    maxCapacity: 50,
    unitCost: 0.00,
    supplier: ''
  });

  // --- SIGN OUT LOGIC ---
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('role');
      localStorage.removeItem('token'); // Clears standard auth token if tracking one
    }
    setUserRole(null); // Instantly triggers lock-out UI state
  };

  // Strict enforcement: Block any user whose role is NOT explicitly 'STOCK'
  if (userRole !== 'STOCK') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm text-center shadow-xl">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Access Restrained</h2>
          <p className="text-sm text-slate-400 mb-4">
            This module is restricted. Your session has ended or you lack authorized 'STOCK' management clearances.
          </p>
          <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded font-mono border border-slate-800">
            Status: Unauthorized / Signed Out
          </div>
        </div>
      </div>
    );
  }

  // Logic to issue an instant restock order simulation
  const triggerQuickReorder = (sku: string) => {
    setInventory(prev => prev.map(item => {
      if (item.sku === sku) {
        return { ...item, currentStock: item.maxCapacity, status: 'In Stock' };
      }
      return item;
    }));
  };

  // Logic to add entirely new item to inventory
  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStock.sku || !newStock.name || !newStock.supplier) return;

    let calculatedStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (newStock.currentStock === 0) {
      calculatedStatus = 'Out of Stock';
    } else if (newStock.currentStock <= newStock.minThreshold) {
      calculatedStatus = 'Low Stock';
    }

    const completedItem: StockItem = {
      sku: newStock.sku,
      name: newStock.name,
      category: newStock.category,
      currentStock: Number(newStock.currentStock),
      minThreshold: Number(newStock.minThreshold),
      maxCapacity: Number(newStock.maxCapacity),
      unitCost: Number(newStock.unitCost),
      supplier: newStock.supplier,
      status: calculatedStatus
    };

    setInventory(prev => [completedItem, ...prev]);
    
    setNewStock({
      sku: '',
      name: '',
      category: CATEGORIES[0],
      currentStock: 0,
      minThreshold: 5,
      maxCapacity: 50,
      unitCost: 0.00,
      supplier: ''
    });
    setIsModalOpen(false);
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
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 font-sans antialiased relative">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Showroom & Warehouse Inventory Control</h1>
          <p className="text-sm text-slate-400">Real-time stock valuation, showroom floor allocations, and manufacturing procurement pipeline.</p>
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
              <option value="All" className="bg-slate-800">All Collections</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-600/10"
          >
            <Plus className="w-4 h-4" />
            Receive Stock
          </button>

          {/* --- SIGN OUT BUTTON --- */}
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* --- ADD STOCK MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Receive New Furniture Batch</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">SKU Code *</label>
                  <input 
                    type="text" required placeholder="e.g. SOF-VEL-BLU"
                    value={newStock.sku} onChange={e => setNewStock({...newStock, sku: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Collection Category</label>
                  <select 
                    value={newStock.category} onChange={e => setNewStock({...newStock, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Item Name & Finish Details *</label>
                <input 
                  type="text" required placeholder="e.g. Aurora Lounge Chair"
                  value={newStock.name} onChange={e => setNewStock({...newStock, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Qty Units</label>
                  <input 
                    type="number" min="0" value={newStock.currentStock} 
                    onChange={e => setNewStock({...newStock, currentStock: Math.max(0, parseInt(e.target.value) || 0)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Min Alert Line</label>
                  <input 
                    type="number" min="1" value={newStock.minThreshold} 
                    onChange={e => setNewStock({...newStock, minThreshold: Math.max(1, parseInt(e.target.value) || 1)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Max Bay Cap</label>
                  <input 
                    type="number" min="1" value={newStock.maxCapacity} 
                    onChange={e => setNewStock({...newStock, maxCapacity: Math.max(1, parseInt(e.target.value) || 1)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Unit Wholesale Cost ($) *</label>
                  <input 
                    type="number" step="0.01" min="0" required placeholder="0.00"
                    value={newStock.unitCost || ''} onChange={e => setNewStock({...newStock, unitCost: Math.max(0, parseFloat(e.target.value) || 0)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Manufacturer / Supplier *</label>
                  <input 
                    type="text" required placeholder="e.g. TimberCraft Logistics"
                    value={newStock.supplier} onChange={e => setNewStock({...newStock, supplier: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-800/80">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-600/10"
                >
                  Add Asset Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EXECUTIVE MANAGEMENT CARDS --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard 
          title="Total Inventory Valuation" 
          value={`$${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          statusType="info"
          icon={<Package className="w-5 h-5 text-sky-400" />}
          subtitle="Capital tied in furniture assets"
        />
        <KPICard 
          title="Active SKUs Tracked" 
          value={totalSkuCount.toString()} 
          statusType="normal"
          icon={<Layers className="w-5 h-5 text-indigo-400" />}
          subtitle={`Across ${CATEGORIES.length} design lines`}
        />
        <KPICard 
          title="Critical Shortages" 
          value={lowStockCount.toString()} 
          statusType={lowStockCount > 0 ? "warning" : "success"}
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          subtitle="Below showroom trigger limits"
        />
        <KPICard 
          title="Total Stockouts" 
          value={outOfStockCount.toString()} 
          statusType={outOfStockCount > 0 ? "warning" : "success"}
          icon={<RotateCcw className="w-5 h-5 text-rose-400" />}
          subtitle="Backorder & custom quote delays"
        />
      </section>

      {/* --- WAREHOUSE METRICS & CAPACITY BLOCK --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Material Flow Analysis</h3>
              <p className="text-xs text-slate-400">Tracking factory inbound supply runs versus home delivery/showroom dispatches.</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-400"><ArrowDownLeft className="w-3.5 h-3.5" /> Inbound</span>
              <span className="flex items-center gap-1 text-sky-400"><ArrowUpRight className="w-3.5 h-3.5" /> Outbound</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { time: '12 mins ago', desc: 'Received 10x Oak Dining Tables batch', type: 'inbound', supplier: 'TimberCraft Logistics' },
              { time: '45 mins ago', desc: 'Dispatched 2x Emerald Velvet Sofas for delivery', type: 'outbound', supplier: 'HomeDelivery Fleet' },
              { time: '2 hours ago', desc: 'Factory pipeline allocation: 35x Ergonomic Chairs', type: 'inbound', supplier: 'Vertex Workspace Supply' },
              { time: '6 hours ago', desc: 'Transferred 15x Brass Lamps to Main Showroom', type: 'outbound', supplier: 'Internal Transit' },
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

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Volumetric Staging Capacity</h3>
            <p className="text-xs text-slate-400 mb-6">High-volume flat-pack racks and fully assembled furniture staging footprints.</p>
            
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
              <span className="text-slate-400">Total Dedicated Furniture Bays:</span>
              <span className="font-semibold text-white">1,200 Bays</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bulk Assembly Space:</span>
              <span className="font-semibold text-amber-400">312 Bays left</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STOCK MONITOR DATA TABLE --- */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Master Inventory Asset SKU Register</h3>
            <p className="text-xs text-slate-400">Review safe baseline display and storage parameters against real-time stock levels.</p>
          </div>
          <span className="text-xs text-slate-400">Showing {filteredInventory.length} of {totalSkuCount} Furniture Items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-5">Item Particulars</th>
                <th className="py-3 px-5">Stock Status</th>
                <th className="py-3 px-5 text-right">Available Units</th>
                <th className="py-3 px-5 text-right">Min Buffer Threshold</th>
                <th className="py-3 px-5 text-right">Net Wholesale Cost</th>
                <th className="py-3 px-5 text-right">Total Asset Worth</th>
                <th className="py-3 px-5 text-center">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredInventory.map((item) => {
                const totalItemValue = item.currentStock * item.unitCost;
                const percentageOfMax = Math.min((item.currentStock / item.maxCapacity) * 100, 100);

                return (
                  <tr key={item.sku} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="py-3.5 px-5">
                      <span className="text-white block font-semibold text-sm">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono tracking-wide">{item.sku} • {item.category}</span>
                    </td>
                    
                    <td className="py-3.5 px-5">
                      {item.status === 'In Stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Healthy Stack
                        </span>
                      )}
                      {item.status === 'Low Stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" /> Reorder Flag
                        </span>
                      )}
                      {item.status === 'Out of Stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" /> Depleted Box
                        </span>
                      )}
                    </td>
                    
                    <td className="py-3.5 px-5 text-right">
                      <span className="block font-mono text-white text-sm">{item.currentStock} units</span>
                      <div className="w-24 bg-slate-800 h-1 rounded-full overflow-hidden inline-block mt-1">
                        <div 
                          className={`h-full rounded-full ${item.status === 'In Stock' ? 'bg-indigo-500' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${percentageOfMax}%` }}
                        />
                      </div>
                    </td>
                    
                    <td className="py-3.5 px-5 text-right font-mono text-slate-400">
                      {item.minThreshold}
                    </td>
                    
                    <td className="py-3.5 px-5 text-right font-mono text-slate-400">
                      ${item.unitCost.toFixed(2)}
                    </td>
                    
                    <td className="py-3.5 px-5 text-right font-mono text-slate-200">
                      ${totalItemValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    
                    <td className="py-3.5 px-5 text-center">
                      {item.status === 'In Stock' ? (
                        <span className="text-xs text-slate-500 flex items-center justify-center gap-1 font-normal">
                          <CheckCircle className="w-3 h-3 text-slate-600" /> Optimal Stock
                        </span>
                      ) : (
                        <button 
                          onClick={() => triggerQuickReorder(item.sku)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-700 hover:border-transparent text-slate-300 transition-all shadow-sm"
                        >
                          <Truck className="w-3 h-3" /> Restock Batch
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
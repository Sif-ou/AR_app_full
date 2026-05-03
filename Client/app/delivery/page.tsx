'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Navigation,
  Package,
  Clock,
  CheckCircle2,
  Phone,
  AlertCircle,
  Menu,
  X,
  Bell,
  LogOut,
  History,
  Wallet,
  Star,
  ChevronRight,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for the delivery guy
const activeDeliveries = [
  { 
    id: 'DEL-101', 
    customer: 'Sarah ', 
    address: '123 Rue Didouche Mourad, Algiers', 
    status: 'on-the-way',
    timeLimit: '15 mins',
    total: '$154'
  },
  { 
    id: 'DEL-102', 
    customer: 'Ahmed ', 
    address: 'Universite Constantine 2 Abdelhamid Mehri', 
    status: 'pending',
    timeLimit: '45 mins',
    total: '$64'
  }
]

const deliveryHistory = [
  { id: 'DEL-099', date: 'Today, 2:30 PM', earnings: '$5.50', status: 'completed' },
  { id: 'DEL-098', date: 'Today, 1:15 PM', earnings: '$4.20', status: 'completed' },
  { id: 'DEL-097', date: 'Yesterday', earnings: '$6.00', status: 'completed' },
]

export default function DeliveryDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('active-orders')

  const handleOpenMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[51] lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[52] w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <span className="font-bold text-xl tracking-tight flex items-center gap-2">
              <Package className="text-blue-500" /> AR<span className="text-blue-500">Go</span>
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/10" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'active-orders', label: 'Active Deliveries', icon: Navigation },
              { id: 'history', label: 'My History', icon: History },
              { id: 'earnings', label: 'Earnings', icon: Wallet },
              { id: 'performance', label: 'My Ratings', icon: Star },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                  activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 flex items-center justify-center">
                <span className="font-bold">I</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Islam </p>
                <Badge variant="outline" className="text-[10px] text-green-400 border-green-400 bg-green-400/10">Online</Badge>
              </div>
              <Link href="/account" className="flex-shrink-0">
                <LogOut className="h-4 w-4 text-slate-500 cursor-pointer hover:text-red-400 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
          {/* VISIBLE SIDEBAR BUTTON */}
          <Button 
            variant="secondary" 
            size="icon" 
            className="lg:hidden mr-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-sm transition-all" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-slate-900" />
          </Button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Today's Earnings</p>
              <p className="font-bold text-slate-900 text-base sm:text-lg">$42.50</p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-6">
          {activeTab === 'active-orders' && (
            <>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold text-white">New Deliveries</h1>
                <Badge className="bg-blue-600 hover:bg-blue-600 px-3 py-1">2 Available</Badge>
              </div>

              {/* Delivery Cards */}
              <div className="grid gap-4">
                {activeDeliveries.map((delivery) => (
                  <Card key={delivery.id} className="overflow-hidden border-none bg-zinc-900 ring-1 ring-white/10 shadow-xl">
                    <CardContent className="p-0">
                      <div className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-xs text-slate-500 font-bold">{delivery.id}</span>
                            <Badge className={cn(
                              "text-[10px] uppercase font-bold",
                              delivery.status === 'on-the-way' ? 'bg-white text-black' : 'bg-zinc-800 text-slate-300'
                            )}>
                              {delivery.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-xl text-white">{delivery.customer}</h3>
                          <div className="flex items-start gap-2 text-slate-400 text-sm">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-500" />
                            <span className="leading-snug">{delivery.address}</span>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-3 sm:min-w-[140px]">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Target Time</p>
                            <p className="font-bold text-orange-500 text-lg flex items-center gap-1.5">
                              <Clock className="h-4 w-4" /> {delivery.timeLimit}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <a href="tel:+213600000000">
                              <Button size="icon" variant="outline" className="rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </a>
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5"
                              onClick={() => handleOpenMap(delivery.address)}
                            >
                              Go to Map
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step Status bar */}
                      <div className="bg-zinc-800/50 p-3 border-t border-white/5 flex flex-wrap sm:flex-nowrap justify-between gap-y-2 text-[11px] font-bold">
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle2 className="h-3.5 w-3.5" /> <span>Picked Up</span>
                        </div>
                        <div className={cn("flex items-center gap-2", delivery.status === 'on-the-way' ? "text-blue-400" : "text-slate-500")}>
                          <Navigation className="h-3.5 w-3.5" /> <span>In Transit</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Package className="h-3.5 w-3.5" /> <span>Arrived</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <Card className="bg-zinc-900 border-none ring-1 ring-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {deliveryHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-white/5 bg-white/5 rounded-xl gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-green-500/10 p-2 rounded-full flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{item.id}</p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-white">{item.earnings}</p>
                      <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20 bg-green-500/5">Success</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!['active-orders', 'history'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <AlertCircle className="h-16 w-16 text-zinc-800 mb-4" />
               <h2 className="text-xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
               <p className="text-slate-500 max-w-xs mx-auto">This section is currently being updated with live data.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
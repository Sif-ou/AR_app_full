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
    customer: 'Sarah Mitchell', 
    address: '123 Rue Didouche Mourad, Algiers', 
    status: 'on-the-way',
    timeLimit: '15 mins',
    total: '$154'
  },
  { 
    id: 'DEL-102', 
    customer: 'James Chen', 
    address: 'Apartment 4B, Sky Tower', 
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

  // Function to handle opening Google Maps
  const handleOpenMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <span className="font-bold text-xl tracking-tight flex items-center gap-2">
              <Package className="text-accent" /> AR<span className="text-accent">Go</span>
            </span>
            <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
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
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  activeTab === item.id ? "bg-accent text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <span className="font-bold">I</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Islam Courier</p>
                <Badge variant="outline" className="text-[10px] text-green-400 border-green-400">Online</Badge>
              </div>
              <LogOut className="h-4 w-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500">Today's Earnings</p>
              <p className="font-bold text-slate-900">$42.50</p>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-6">
          {activeTab === 'active-orders' && (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">New Deliveries</h1>
                <Badge className="bg-accent">2 Available</Badge>
              </div>

              {/* Delivery Cards */}
              <div className="grid gap-4">
                {activeDeliveries.map((delivery) => (
                  <Card key={delivery.id} className="overflow-hidden border-l-4 border-l-accent">
                    <CardContent className="p-0">
                      <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-500">{delivery.id}</span>
                            <Badge variant={delivery.status === 'on-the-way' ? 'default' : 'secondary'}>
                              {delivery.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg">{delivery.customer}</h3>
                          <div className="flex items-start gap-2 text-slate-600 text-sm">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <span>{delivery.address}</span>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col justify-between items-end gap-2">
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Target Time</p>
                            <p className="font-semibold text-orange-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {delivery.timeLimit}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="rounded-full">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button 
                              className="bg-accent hover:bg-accent/90 px-6"
                              onClick={() => handleOpenMap(delivery.address)}
                            >
                              Go to Map
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step Status bar */}
                      <div className="bg-slate-50 p-3 border-t flex justify-between text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-3 w-3" /> Picked Up
                        </div>
                        <div className={cn("flex items-center gap-1", delivery.status === 'on-the-way' ? "text-blue-600" : "")}>
                          <Navigation className="h-3 w-3" /> In Transit
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" /> Arrived
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deliveryHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.id}</p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.earnings}</p>
                      <Badge variant="outline" className="text-[10px]">Success</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Placeholder for other tabs */}
          {!['active-orders', 'history'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
               <h2 className="text-lg font-semibold capitalize">{activeTab.replace('-', ' ')}</h2>
               <p className="text-slate-500">Information coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
"use client";
import Link from 'next/link'
import React from 'react';
import { Truck, Globe, Clock, ShieldCheck, MapPin, Package } from 'lucide-react';

const ShippingPage = () => {
  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-blue-100">
      {/* Hero Section */}
      <div className="bg-slate-50 py-16 border-b">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 animate-fade-in"
          >
            Shipping & Delivery
          </h1>
          <p 
            className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            Everything you need to know about how we get your favorite products from our doorstep to yours.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <StatCard 
            icon={<Clock className="w-6 h-6 text-blue-600" />} 
            title="Fast Processing" 
            desc="Orders ship within 24-48 hours" 
          />
          <StatCard 
            icon={<Globe className="w-6 h-6 text-blue-600" />} 
            title="Global Reach" 
            desc="Shipping to over 50 countries" 
          />
          <StatCard 
            icon={<ShieldCheck className="w-6 h-6 text-blue-600" />} 
            title="Secure Tracking" 
            desc="Real-time updates on every order" 
          />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6" /> Shipping Methods
              </h2>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b font-medium">
                    <tr>
                      <th className="px-6 py-4">Option</th>
                      <th className="px-6 py-4">Delivery</th>
                      <th className="px-6 py-4 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <TableRow label="Standard" time="5–7 Business Days" price="Free" />
                    <TableRow label="Priority" time="2–3 Business Days" price="$12.00" />
                    <TableRow label="Express" time="Next Day" price="$25.00" />
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" /> International Shipping
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We offer worldwide shipping. Please note that shipping times vary by destination. 
                Customs duties and import taxes are calculated at checkout for most countries to avoid surprises.
              </p>
            </section>
          </div>

          {/* Sidebar / FAQ */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-2xl">
              <Package className="w-10 h-10 mb-4 text-blue-400" />
              <h3 className="text-xl font-bold mb-2">Track Your Package</h3>
              <p className="text-slate-400 text-sm mb-6">
                Enter your order number to see exactly where your items are.
              </p>
              <Link href="/track" className="w-full">
                <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded-lg font-semibold">
                  Track Order
                </button>
              </Link>
            </div>

            <div className="p-6 border rounded-2xl">
              <h3 className="font-bold mb-4">Common Questions</h3>
              <div className="space-y-4 text-sm">
                <details className="cursor-pointer group">
                  <summary className="font-medium group-hover:text-blue-600 transition-colors">Do you ship to P.O. Boxes?</summary>
                  <p className="mt-2 text-slate-500">Yes, via Standard shipping only.</p>
                </details>
                <details className="cursor-pointer group">
                  <summary className="font-medium group-hover:text-blue-600 transition-colors">Can I change my address?</summary>
                  <p className="mt-2 text-slate-500">Only if the order hasn't been processed (usually within 2 hours).</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 bg-white border rounded-2xl hover:shadow-lg transition-shadow">
    <div className="mb-4 bg-blue-50 w-fit p-3 rounded-xl">{icon}</div>
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
);

const TableRow = ({ label, time, price }: { label: string, time: string, price: string }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4 font-medium">{label}</td>
    <td className="px-6 py-4 text-slate-500">{time}</td>
    <td className="px-6 py-4 text-right font-semibold">{price}</td>
  </tr>
);

export default ShippingPage;
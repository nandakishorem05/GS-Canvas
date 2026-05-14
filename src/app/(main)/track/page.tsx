"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TrackedOrder {
  _id: string;
  customerDetails: {
    name: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch('/api/admin/orders'); // Fetch all orders to filter by email/ID
      if (res.ok) {
        const data = await res.json();
        const all = data.orders || [];

        const term = searchQuery.trim().toLowerCase();
        const matches = all.filter((o: any) => {
          const matchId = o._id.toLowerCase().includes(term);
          const matchEmail = o.customerDetails?.email?.toLowerCase() === term;
          return matchId || matchEmail;
        });

        setOrders(matches);
      }
    } catch (err) {
      console.error("Tracking lookup error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = (st: string) => {
    switch (st) {
      case 'Confirmed': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0; // Pending
    }
  };

  return (
    <div className="container mx-auto px-6 md:px-12 py-16 max-w-5xl">
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <Package size={32} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold">Track Your Orders</h1>
        <p className="text-foreground/60 max-w-md mx-auto text-sm md:text-base">
          Enter your <span className="font-semibold text-foreground">Email Address</span> or <span className="font-semibold text-foreground">Razorpay Order ID</span> below to track live fulfillment and delivery updates.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchOrder} className="max-w-2xl mx-auto mb-16 flex gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-4 text-foreground/40" />
          <input
            type="text"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. rahul@example.com or rzp_order_..."
            className="w-full bg-white dark:bg-black border border-border rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-foreground shadow-sm text-sm font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white dark:bg-white dark:text-black px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-md flex items-center gap-2 flex-shrink-0"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Track Now <ArrowRight size={16} /></>}
        </button>
      </form>

      {/* Results Section */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="animate-spin mx-auto text-blue-600" size={36} />
          <p className="text-foreground/60 text-sm">Searching secure database for your orders...</p>
        </div>
      ) : hasSearched && orders.length === 0 ? (
        <div className="bg-white dark:bg-black border border-border p-12 rounded-2xl text-center space-y-4 shadow-sm max-w-xl mx-auto">
          <Package size={48} className="mx-auto text-foreground/30" />
          <h3 className="font-heading text-2xl font-bold">No orders found</h3>
          <p className="text-xs text-foreground/60 max-w-sm mx-auto leading-relaxed">
            We couldn't find any orders matching <span className="font-semibold">"{searchQuery}"</span>. Please make sure you entered the exact email address used during Razorpay checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest mt-4 shadow-md transition-all"
          >
            Browse Artworks
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const shortId = "rzp_ord_" + order._id.substring(order._id.length - 6);
            const step = getStatusStep(order.status);

            return (
              <div key={order._id} className="bg-white dark:bg-black border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">Order Identifier</span>
                    <h2 className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">{shortId}</h2>
                    <p className="text-xs text-foreground/60 mt-0.5">Ordered by: <span className="font-semibold">{order.customerDetails?.name}</span> ({order.customerDetails?.email})</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">Total Paid</span>
                    <span className="font-heading font-bold text-xl">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    <span className="block bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded mt-1 inline-block">
                      {order.paymentStatus || 'Paid'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/60">Live Fulfillment Status: <span className="text-foreground">{order.status || 'Pending'}</span></h4>
                  
                  <div className="relative flex justify-between items-center max-w-3xl mx-auto pt-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-100 dark:bg-neutral-800 -translate-y-1/2 z-0" />
                    
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
                      style={{ width: `${(step / 3) * 100}%` }}
                    />

                    {/* Step 0: Order Placed */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-xs font-bold mt-2">Order Placed</span>
                    </div>

                    {/* Step 1: Confirmed */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                        step >= 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-black border-2 border-border text-foreground/40'
                      }`}>
                        <Clock size={20} />
                      </div>
                      <span className="text-xs font-semibold mt-2">Confirmed</span>
                    </div>

                    {/* Step 2: Shipped */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                        step >= 2 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-black border-2 border-border text-foreground/40'
                      }`}>
                        <Truck size={20} />
                      </div>
                      <span className="text-xs font-semibold mt-2">Shipped</span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                        step >= 3 ? 'bg-green-600 text-white' : 'bg-white dark:bg-black border-2 border-border text-foreground/40'
                      }`}>
                        <Package size={20} />
                      </div>
                      <span className="text-xs font-semibold mt-2">Delivered</span>
                    </div>

                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border-t border-border pt-6 flex items-start gap-3 text-sm">
                  <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-foreground/60 mb-1">Shipping Destination</h5>
                    <p className="font-semibold">{order.shippingAddress?.street}</p>
                    <p className="text-foreground/80">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                    <p className="text-xs text-foreground/50 mt-1">Shipped securely in reinforced protective tube packaging.</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

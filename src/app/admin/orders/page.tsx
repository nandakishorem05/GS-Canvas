"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Loader2, MapPin, Phone, Mail, CheckCircle, Clock } from "lucide-react";

interface OrderItem {
  _id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  items: any[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching admin orders:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        if (selectedOrder?._id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const handleUpdatePayment = async (id: string, newPayment: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPayment })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, paymentStatus: newPayment } : o));
        if (selectedOrder?._id === id) {
          setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newPayment } : null);
        }
      }
    } catch (error) {
      console.error('Update payment error:', error);
    }
  };

  const filteredOrders = orders.filter(o => {
    const term = searchQuery.toLowerCase();
    const matchId = o._id.toLowerCase().includes(term);
    const matchName = o.customerDetails?.name?.toLowerCase().includes(term);
    const matchEmail = o.customerDetails?.email?.toLowerCase().includes(term);
    return matchId || matchName || matchEmail;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">Orders</h1>
          <p className="text-sm text-foreground/60">Manage customer checkouts, shipping addresses, and status</p>
        </div>
        <button
          onClick={fetchOrders}
          className="border border-border bg-white dark:bg-black text-foreground px-4 py-2 font-medium flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg shadow-sm"
        >
          <Download size={16} /> Refresh Orders
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-white dark:bg-black border border-border rounded-xl">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="text-foreground/60">Loading live orders from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Orders Table */}
          <div className={`bg-white dark:bg-black border border-border rounded-xl shadow-sm overflow-hidden ${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <div className="p-4 border-b border-border flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-2.5 text-foreground/50" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Customer Name, or Email..." 
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <button className="border border-border rounded-lg px-4 py-2 flex items-center gap-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <Filter size={16} /> Filter
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-foreground/60 mb-2">No orders received yet.</p>
                <p className="text-xs text-foreground/40">When customers check out with Razorpay, orders will instantly populate here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-foreground/60 uppercase bg-neutral-50 dark:bg-neutral-900 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Payment</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.map((order) => {
                      const orderIdStr = order._id.toString();
                      const shortId = "rzp_ord_" + orderIdStr.substring(orderIdStr.length - 6);
                      const isSelected = selectedOrder?._id === order._id;

                      return (
                        <tr 
                          key={order._id} 
                          onClick={() => setSelectedOrder(order)}
                          className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'}`}
                        >
                          <td className="px-6 py-4 font-mono font-semibold text-blue-600 dark:text-blue-400">{shortId}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold block">{order.customerDetails?.name || "Customer"}</span>
                            <span className="text-xs text-foreground/50">{order.customerDetails?.email}</span>
                          </td>
                          <td className="px-6 py-4 font-heading font-semibold">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                               order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                               order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                               'bg-orange-100 text-orange-700'
                             }`}>
                               {order.paymentStatus || 'Paid'}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                               order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                               order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                               'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                             }`}>
                               {order.status || 'Pending'}
                             </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detailed Order Panel (Address & Fulfillment) */}
          {selectedOrder && (
            <div className="lg:col-span-5 bg-white dark:bg-black border border-border p-6 rounded-xl shadow-md space-y-6 relative h-fit">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <h2 className="font-heading text-xl font-bold">Order Summary</h2>
                  <span className="font-mono text-xs text-foreground/50">rzp_ord_{selectedOrder._id.substring(selectedOrder._id.length - 6)}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-xs underline text-foreground/50 hover:text-foreground">Close</button>
              </div>

              {/* Customer Info */}
              <div className="space-y-3 text-sm">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground/60 mb-2">Customer Details</h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center font-bold text-blue-600">
                    {selectedOrder.customerDetails?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <span className="font-semibold block">{selectedOrder.customerDetails?.name || "Customer Name"}</span>
                    <span className="text-xs text-foreground/50 flex items-center gap-1"><Mail size={12} /> {selectedOrder.customerDetails?.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/70 pt-1">
                  <Phone size={14} className="text-foreground/50" /> {selectedOrder.customerDetails?.phone || "+91 9876543210"}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground/60 flex items-center gap-1.5 mb-2">
                  <MapPin size={14} /> Complete Delivery Address
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg space-y-1 text-xs">
                  <p className="font-semibold text-foreground">{selectedOrder.shippingAddress?.street || "Flat / House No., Apartment"}</p>
                  <p className="text-foreground/80">{selectedOrder.shippingAddress?.city || "Mumbai"}, {selectedOrder.shippingAddress?.state || "Maharashtra"}</p>
                  <p className="text-foreground/80 font-mono font-medium">PIN Code: {selectedOrder.shippingAddress?.zipCode || "400001"}</p>
                  <p className="text-foreground/50">{selectedOrder.shippingAddress?.country || "India"}</p>
                </div>
              </div>

              {/* Status Management */}
              <div className="border-t border-border pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Fulfillment Status</label>
                  <div className="flex gap-2">
                    {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedOrder._id, st)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                          selectedOrder.status === st ? 'bg-black text-white dark:bg-white dark:text-black border-foreground' : 'border-border hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Payment Status</label>
                  <div className="flex gap-2">
                    {['Pending', 'Paid', 'Failed'].map(pay => (
                      <button
                        key={pay}
                        onClick={() => handleUpdatePayment(selectedOrder._id, pay)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                          selectedOrder.paymentStatus === pay ? 'bg-blue-600 text-white border-blue-600' : 'border-border hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        }`}
                      >
                        {pay}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}

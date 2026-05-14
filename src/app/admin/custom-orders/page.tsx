'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Image as ImageIcon, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomOrderItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  size: string;
  instructions: string;
  imageUrl: string;
  status: 'pending' | 'reviewed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminCustomOrders() {
  const [orders, setOrders] = useState<CustomOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/custom-orders');
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load custom orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/custom-orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus as any } : o));
      }
    } catch (err) {
      console.error('Update error', err);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Custom Canvas Orders</h1>
          <p className="text-zinc-400">Review custom artwork prints uploaded by customers</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <Input 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Search by name or email..." 
            className="pl-10 bg-zinc-900 border-zinc-800 text-white" 
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 flex justify-center items-center gap-2">
            <Loader2 className="animate-spin" size={20} /> Loading custom requests...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No custom order requests found.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filteredOrders.map((order) => (
              <motion.div key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-zinc-700 relative">
                      {order.imageUrl ? (
                        <img src={order.imageUrl} alt="Custom Art" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={28} className="text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg text-white">{order.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          order.status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                          order.status === 'reviewed' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                          order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                          'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{order.email} • {order.phone}</p>
                      <p className="text-sm text-blue-400 mt-1 font-medium">Requested Size: {order.size}</p>
                      {order.instructions && (
                        <p className="text-sm text-zinc-300 mt-3 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                          <strong className="text-zinc-400 block mb-1">Customer Instructions:</strong>
                          {order.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {order.status !== 'reviewed' && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order._id, 'reviewed')} className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                        Mark Reviewed
                      </Button>
                    )}
                    {order.status !== 'completed' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order._id, 'completed')} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5">
                        <CheckCircle size={15} /> Complete
                      </Button>
                    )}
                    {order.status !== 'cancelled' && (
                      <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(order._id, 'cancelled')} className="text-red-400 hover:bg-red-500/10">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

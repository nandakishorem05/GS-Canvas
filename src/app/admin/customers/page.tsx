'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, User as UserIcon, Ban, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomerItem {
  _id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  createdAt: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (res.ok) {
        setCustomers(data);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCustomers(customers.map(c => c._id === id ? { ...c, status: newStatus as any } : c));
      }
    } catch (err) {
      console.error('Update error', err);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Customers</h1>
          <p className="text-zinc-400">View registered customers and manage account status</p>
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
            <Loader2 className="animate-spin" size={20} /> Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No customers found.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filteredCustomers.map((customer) => (
              <motion.div key={customer._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-blue-400">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{customer.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        customer.status === 'active' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {customer.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{customer.email}</p>
                    <p className="text-xs text-zinc-500 mt-1">Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleToggleStatus(customer._id, customer.status)}
                  className={`border-zinc-700 ${customer.status === 'active' ? 'hover:bg-red-500/10 hover:text-red-400' : 'hover:bg-green-500/10 hover:text-green-400'}`}
                >
                  {customer.status === 'active' ? <><Ban size={16} className="mr-2" /> Block User</> : <><CheckCircle2 size={16} className="mr-2" /> Unblock User</>}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

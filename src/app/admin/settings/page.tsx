'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [currency, setCurrency] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok) {
        setStoreName(data.storeName || '');
        setStoreEmail(data.storeEmail || '');
        setStorePhone(data.storePhone || '');
        setCurrency(data.currency || 'USD');
        setTaxRate(data.taxRate || 0);
        setShippingFee(data.shippingFee || 0);
        setFreeShippingThreshold(data.freeShippingThreshold || 0);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          storeName, storeEmail, storePhone, currency, 
          taxRate: Number(taxRate), 
          shippingFee: Number(shippingFee), 
          freeShippingThreshold: Number(freeShippingThreshold) 
        }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      setSuccess('Store settings updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Store Settings</h1>
        <p className="text-zinc-400">Manage global store configurations, shipping rules, and contact info</p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-zinc-500 flex justify-center items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="animate-spin" size={20} /> Loading store settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">{success}</div>}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-3">General Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-zinc-300">Store Name</Label>
                <Input id="storeName" value={storeName} onChange={e => setStoreName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-zinc-300">Currency</Label>
                <Input id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeEmail" className="text-zinc-300">Support Email</Label>
                <Input id="storeEmail" type="email" value={storeEmail} onChange={e => setStoreEmail(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storePhone" className="text-zinc-300">Support Phone</Label>
                <Input id="storePhone" value={storePhone} onChange={e => setStorePhone(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-3">Taxes & Shipping</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-zinc-300">Tax Rate (%)</Label>
                <Input id="taxRate" type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingFee" className="text-zinc-300">Base Shipping Fee</Label>
                <Input id="shippingFee" type="number" value={shippingFee} onChange={e => setShippingFee(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold" className="text-zinc-300">Free Shipping Threshold</Label>
                <Input id="freeShippingThreshold" type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Configuration
          </Button>
        </form>
      )}
    </div>
  );
}

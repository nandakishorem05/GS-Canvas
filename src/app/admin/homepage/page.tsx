'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AdminHomepage() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [featuredProductsTitle, setFeaturedProductsTitle] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/homepage');
      const data = await res.json();
      if (res.ok) {
        setHeroTitle(data.heroTitle || '');
        setHeroSubtitle(data.heroSubtitle || '');
        setHeroImage(data.heroImage || '');
        setFeaturedProductsTitle(data.featuredProductsTitle || '');
      }
    } catch (err) {
      console.error('Failed to load homepage content', err);
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
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroTitle, heroSubtitle, heroImage, featuredProductsTitle }),
      });

      if (!res.ok) throw new Error('Failed to save homepage content');
      setSuccess('Homepage content updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Homepage Customization</h1>
        <p className="text-zinc-400">Update hero headings, subtitles, and landing page assets</p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-zinc-500 flex justify-center items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="animate-spin" size={20} /> Loading customization settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">{success}</div>}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-3">Hero Section</h2>
            
            <div className="space-y-2">
              <Label htmlFor="heroTitle" className="text-zinc-300">Hero Main Title</Label>
              <Input 
                id="heroTitle" 
                value={heroTitle} 
                onChange={e => setHeroTitle(e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroSubtitle" className="text-zinc-300">Hero Subtitle</Label>
              <Input 
                id="heroSubtitle" 
                value={heroSubtitle} 
                onChange={e => setHeroSubtitle(e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroImage" className="text-zinc-300">Hero Background Image URL</Label>
              <Input 
                id="heroImage" 
                value={heroImage} 
                onChange={e => setHeroImage(e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-3">Featured Section</h2>
            
            <div className="space-y-2">
              <Label htmlFor="featuredProductsTitle" className="text-zinc-300">Featured Products Section Title</Label>
              <Input 
                id="featuredProductsTitle" 
                value={featuredProductsTitle} 
                onChange={e => setFeaturedProductsTitle(e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>
          </div>

          <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
          </Button>
        </form>
      )}
    </div>
  );
}

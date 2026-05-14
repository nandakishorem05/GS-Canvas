'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Tag, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Category Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      setSuccess('Category created successfully!');
      setName('');
      setDescription('');
      setSlug('');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== id));
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
        <p className="text-zinc-400">Manage product categories and tags</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category Form */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-fit">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus size={20} className="text-blue-500" /> Add New Category
          </h2>

          <form onSubmit={handleCreate} className="space-y-5">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">{success}</div>}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Name</Label>
              <Input 
                id="name" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Modern Canvas" 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-zinc-300">Slug (optional)</Label>
              <Input 
                id="slug" 
                value={slug} 
                onChange={e => setSlug(e.target.value)} 
                placeholder="e.g. modern-canvas" 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Input 
                id="description" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Category description..." 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null} Add Category
            </Button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <Input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Search categories..." 
              className="pl-10 bg-zinc-900 border-zinc-800 text-white w-full max-w-md" 
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-zinc-500 flex justify-center items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Loading categories...
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                No categories found. Create one to get started!
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {filteredCategories.map((category) => (
                  <motion.div 
                    key={category._id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-zinc-800 rounded-lg text-blue-400">
                        <Tag size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{category.name}</h3>
                        <p className="text-xs text-zinc-400">/{category.slug}</p>
                        {category.description && <p className="text-sm text-zinc-400 mt-0.5">{category.description}</p>}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(category._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon } from "lucide-react";

interface AdminProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Canvas Prints",
    imageUrl: "",
  });

  const categoriesList = ["Canvas Prints", "Wall Posters", "Custom Sketches", "Paintings"];

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const liveData = await res.json();
        if (liveData && liveData.length > 0) {
          const mapped = liveData.map((p: any) => ({
            id: p._id.toString(),
            title: p.title,
            category: p.category?.name || p.category || 'Canvas Prints',
            price: p.price,
            image: p.images && p.images[0] ? p.images[0] : '/canvas-sample.png',
          }));
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching admin products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const catRes = await fetch('/api/admin/categories');
      let catId = "60c72b2f9b1d8b001c8e4d10"; 
      if (catRes.ok) {
        const catData = await catRes.json();
        const found = catData.categories?.find((c: any) => c.name === formData.category);
        if (found) catId = found._id;
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || "Premium handcrafted wall decor piece.",
          price: Number(formData.price) || 14999,
          category: catId,
          images: formData.imageUrl ? [formData.imageUrl] : ["/canvas-sample.png"],
          tags: [formData.category],
          stockQuantity: 10,
          isPublished: true
        })
      });

      if (res.ok) {
        await fetchProducts();
        setIsModalOpen(false);
        setFormData({ title: "", description: "", price: "", category: "Canvas Prints", imageUrl: "" });
      } else {
        alert('Failed to save product to database');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Internal error while saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      if (id.length !== 24) {
        setProducts(products.filter(p => p.id !== id));
        return;
      }

      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product from database");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-8 relative font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2 text-white">Products</h1>
          <p className="text-sm text-zinc-400">Manage your product catalog & uploaded photos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
          <p className="text-zinc-400">Loading products from live database...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-zinc-400 mb-2 font-medium">No products in database yet.</p>
          <p className="text-xs text-zinc-600">Click "Add New Product" above to publish your first real canvas print!</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Product Image & Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price (INR)</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden border border-zinc-700 flex-shrink-0">
                         <Image src={product.image} alt={product.title} fill className="object-cover" />
                      </div>
                      <span className="font-bold text-base text-white">{product.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-800 px-3 py-1 rounded-md text-xs font-medium text-zinc-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-heading font-semibold text-base text-white">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-400 hover:text-white mr-4 p-1"><Edit2 size={18} /></button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90dvh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <div>
              <h2 className="font-heading text-2xl font-bold mb-1">Add New Product</h2>
              <p className="text-xs text-zinc-400">Upload photo and fill in item details for your storefront</p>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-300 flex items-center gap-1">
                  <ImageIcon size={14} /> Product Photo / Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/... or /canvas-sample.png"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono text-xs text-white placeholder:text-zinc-500"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Paste an image link or leave blank for default canvas photo.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-300">Artwork Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Royal Bengal Tiger Canvas"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-300">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                  >
                    {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-300">Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="14999"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-semibold text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-300">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the artwork, materials used, frame quality..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none text-white placeholder:text-zinc-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Saving to Database...
                  </>
                ) : (
                  <>Publish Product</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { mockProducts, categories as mockCategories, styles } from "@/lib/mock-data";

interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  style?: string;
  isBestSeller?: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductItem[]>(mockProducts);
  const [categories, setCategories] = useState<string[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [priceRange, setPriceRange] = useState<number>(50000);

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const liveData = await res.json();
          if (liveData && liveData.length > 0) {
            const mappedProducts: ProductItem[] = liveData.map((p: any) => ({
              id: p._id.toString(),
              title: p.title,
              category: p.category?.name || p.category || 'Canvas Prints',
              price: p.price,
              image: p.images && p.images[0] ? p.images[0] : '/canvas-sample.png',
              description: p.description,
              style: p.tags && p.tags[0] ? p.tags[0] : 'Modern',
              isBestSeller: p.isFeatured || false,
            }));
            setProducts(mappedProducts);

            // Extract unique categories from live data
            const uniqueCategories = Array.from(new Set(mappedProducts.map(p => p.category)));
            setCategories(["All", ...uniqueCategories]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch live products, using mock data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStyle = selectedStyle === "All" || p.style === selectedStyle;
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCategory && matchesStyle && matchesPrice;
  });

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
      
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-28 space-y-10">
          <div>
            <h1 className="font-heading text-3xl font-bold mb-6">Collection</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 pl-8 focus:outline-none focus:border-foreground transition-colors"
              />
              <Search size={16} className="absolute left-0 top-3 text-foreground/50" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4">Category</h3>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setSelectedCategory(c)}
                    className={`text-sm hover:text-foreground transition-colors ${
                      selectedCategory === c ? "text-foreground font-semibold" : "text-foreground/60"
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4">Style</h3>
            <ul className="space-y-3">
              {styles.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => setSelectedStyle(s)}
                    className={`text-sm hover:text-foreground transition-colors ${
                      selectedStyle === s ? "text-foreground font-semibold" : "text-foreground/60"
                    }`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex justify-between">
              Max Price <span>₹{priceRange.toLocaleString('en-IN')}</span>
            </h3>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black dark:accent-white"
            />
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-foreground/60">Showing {filteredProducts.length} results</p>
          <button className="flex items-center gap-2 text-sm font-medium">
            Sort by: Featured <ChevronDown size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-foreground/60">Loading live collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-heading text-2xl mb-2">No artworks found.</h3>
            <p className="text-foreground/60">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedStyle("All"); setPriceRange(50000); }}
              className="mt-6 border-b border-foreground font-medium pb-1"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 mb-4 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.isBestSeller && (
                      <div className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1">
                        Bestseller
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-foreground/80 transition-colors">{product.title}</h3>
                      <p className="text-sm text-foreground/50">{product.category}</p>
                    </div>
                    <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

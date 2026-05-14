"use client";

import { useState, useEffect, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Share2, Star, Truck, ShoppingBag, Loader2 } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import { useCart } from "@/components/providers/cart-provider";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("24x36 in");
  const [selectedFrame, setSelectedFrame] = useState("Unframed");

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        if (id.length === 24) {
          const res = await fetch(`/api/products`);
          if (res.ok) {
            const list = await res.json();
            const liveMatch = list.find((p: any) => p._id.toString() === id);
            if (liveMatch) {
              setProduct({
                id: liveMatch._id.toString(),
                title: liveMatch.title,
                category: liveMatch.category?.name || liveMatch.category || "Canvas Prints",
                price: liveMatch.price || 14999,
                image: liveMatch.images && liveMatch.images[0] ? liveMatch.images[0] : "/canvas-sample.png",
                description: liveMatch.description,
                isBestSeller: liveMatch.isFeatured || false,
              });
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Live fetch error", e);
      }

      // Fallback to mock
      const mockMatch = mockProducts.find(p => p.id === id);
      if (mockMatch) {
        setProduct(mockMatch);
      } else {
        notFound();
      }
      setIsLoading(false);
    }

    fetchProductDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-foreground/60">Loading artwork details...</p>
      </div>
    );
  }

  if (!product) return null;

  const relatedProducts = mockProducts.filter(p => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize
    });
  };

  return (
    <div className="container mx-auto px-6 md:px-12 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-foreground/50 mb-8 uppercase tracking-widest">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{product.category}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left: Image Gallery & Mockup */}
        <div className="w-full lg:w-3/5">
          <div className="sticky top-28 space-y-6">
            <div className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden cursor-zoom-in group rounded-xl border border-border">
               <Image
                 src={product.image}
                 alt={product.title}
                 fill
                 className="object-cover transition-transform duration-1000 group-hover:scale-110 origin-center"
               />
               {product.isBestSeller && (
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded shadow-sm">
                    Bestseller
                  </div>
               )}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
               {[product.image, "/hero-bg.png", "/canvas-sample.png", "/sketch-sample.png"].map((img, idx) => (
                 <button key={idx} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === 0 ? 'border-foreground shadow-md' : 'border-transparent hover:border-border'}`}>
                   <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Product Details & Cart Actions */}
        <div className="w-full lg:w-2/5">
           <div className="sticky top-28 space-y-8">
             <div>
               <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
               <div className="flex items-center gap-4 text-sm mb-4">
                 <span className="font-heading text-3xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                 <div className="flex items-center gap-1 text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="text-foreground/50 ml-1">(42 Reviews)</span>
                 </div>
               </div>
               <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
                 {product.description} Crafted on archival museum-grade canvas with rich pigmented inks that guarantee 100+ years of vibrant color.
               </p>
             </div>

             {/* Size Selector */}
             <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">Select Canvas Size</span>
                  <button className="text-xs text-foreground/50 underline">Size Guide</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["18x24 in", "24x36 in", "30x40 in", "Custom Size"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`border py-3 text-sm rounded-lg font-medium transition-all ${selectedSize === sz ? 'bg-black text-white dark:bg-white dark:text-black border-foreground shadow-md' : 'border-border hover:border-foreground/50 text-foreground/80'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
             </div>

             {/* Frame Selector */}
             <div>
               <span className="text-xs font-bold uppercase tracking-wider block mb-3 text-foreground/80">Frame Option</span>
               <div className="flex gap-4">
                  {[
                    { name: "Unframed", color: "transparent" },
                    { name: "Matte Black", color: "#1a1a1a" },
                    { name: "Walnut", color: "#5c4033" },
                    { name: "White", color: "#f0f0f0" }
                  ].map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setSelectedFrame(f.name)}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${selectedFrame === f.name ? 'border-foreground shadow-md scale-105' : 'border-border'}`}>
                        <span className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: f.color }}></span>
                      </span>
                      <span className={`text-[10px] uppercase font-semibold ${selectedFrame === f.name ? 'text-foreground' : 'text-foreground/60'}`}>{f.name}</span>
                    </button>
                  ))}
                </div>
             </div>

             {/* Actions */}
             <div className="space-y-4 pt-4 border-t border-border">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button
                   onClick={handleAddToCart}
                   className="w-full bg-neutral-100 dark:bg-neutral-900 border border-border text-foreground py-4 font-bold tracking-widest uppercase hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm"
                 >
                   <ShoppingBag size={18} /> Add to Cart
                 </button>

                 <Link
                   href={`/checkout?item=${product.id}&price=${product.price}&title=${encodeURIComponent(product.title)}&img=${encodeURIComponent(product.image)}`}
                   className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-4 font-bold tracking-widest uppercase transition-all rounded-xl shadow-lg block flex items-center justify-center text-xs"
                 >
                   Buy Now - ₹{product.price.toLocaleString('en-IN')}
                 </Link>
               </div>

               <div className="flex gap-4">
                 <button className="flex-1 border border-border py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                   <Heart size={16} /> Wishlist
                 </button>
                 <button className="flex-1 border border-border py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                   <Share2 size={16} /> Share
                 </button>
               </div>
             </div>

             {/* Info */}
             <div className="border-t border-border pt-6 space-y-4 text-sm">
                <div className="flex items-start gap-4">
                  <Truck className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm">Free Global Shipping via BlueDart</h4>
                    <p className="text-xs text-foreground/60">Delivered securely within 5-7 business days in sturdy tube packaging.</p>
                  </div>
                </div>
             </div>

           </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 border-t border-border pt-16">
          <h2 className="font-heading text-3xl font-bold mb-10 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p: any) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group block">
                <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 mb-4 overflow-hidden rounded-xl border border-border">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1">{p.title}</h3>
                <span className="font-medium text-sm text-foreground/70">₹{p.price.toLocaleString('en-IN')}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

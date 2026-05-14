import { mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Share2, Star, Truck } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product: any = null;
  let categoryName = "Canvas Prints";
  
  // Try fetching from MongoDB first
  try {
    await connectToDatabase();
    if (id.length === 24) { // Valid MongoDB ObjectId
      const liveProduct = await Product.findById(id).populate('category', 'name');
      if (liveProduct) {
        categoryName = liveProduct.category?.name || "Canvas Prints";
        product = {
          id: liveProduct._id.toString(),
          title: liveProduct.title,
          category: categoryName,
          price: liveProduct.price,
          image: liveProduct.images && liveProduct.images[0] ? liveProduct.images[0] : "/canvas-sample.png",
          description: liveProduct.description,
          isBestSeller: liveProduct.isFeatured || false,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch live product details:", error);
  }

  // Fallback to mock data if not found in DB
  if (!product) {
    const mockMatch = mockProducts.find(p => p.id === id);
    if (mockMatch) {
      product = mockMatch;
      categoryName = mockMatch.category;
    } else {
      notFound();
    }
  }

  // Find related products (fallback to mock slice)
  const relatedProducts = mockProducts.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="container mx-auto px-6 md:px-12 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-foreground/50 mb-8 uppercase tracking-widest">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{categoryName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left: Image Gallery & 3D Mockup */}
        <div className="w-full lg:w-3/5">
          <div className="sticky top-28 space-y-6">
            <div className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden cursor-zoom-in group">
               <Image
                 src={product.image}
                 alt={product.title}
                 fill
                 className="object-cover transition-transform duration-1000 group-hover:scale-125 origin-center"
               />
               <div className="absolute top-4 left-4 flex flex-col gap-2">
                 {product.isBestSeller && (
                    <span className="bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1">Bestseller</span>
                 )}
               </div>
               <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 text-xs font-mono uppercase shadow-sm">
                 Hover to zoom
               </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
               {[product.image, "/hero-bg.png", "/canvas-sample.png", "/sketch-sample.png"].map((img, idx) => (
                 <button key={idx} className={`relative aspect-square border-2 ${idx === 0 ? 'border-foreground' : 'border-transparent hover:border-foreground/50'}`}>
                   <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Product Details & Sticky Card */}
        <div className="w-full lg:w-2/5">
           <div className="sticky top-28">
             <div className="mb-8">
               <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
               <div className="flex items-center gap-4 text-sm mb-4">
                 <span className="font-heading text-2xl">₹{product.price.toLocaleString('en-IN')}</span>
                 <div className="flex items-center gap-1 text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="text-foreground/50 ml-1">(42)</span>
                 </div>
               </div>
               <p className="text-foreground/70 leading-relaxed">
                 {product.description} This premium piece is crafted using archival quality materials to ensure it lasts a lifetime while making a bold statement in any room.
               </p>
             </div>

             <div className="space-y-8 mb-10">
               {/* Size Selector */}
               <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider">Select Size</span>
                    <button className="text-xs text-foreground/50 underline">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["18x24 in", "24x36 in", "30x40 in", "Custom Size"].map((s, i) => (
                      <button key={i} className={`border py-3 text-sm transition-colors ${i === 0 ? 'border-foreground font-medium' : 'border-border hover:border-foreground/50'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Frame Selector */}
               <div>
                 <span className="text-xs font-bold uppercase tracking-wider block mb-3">Frame Option</span>
                 <div className="flex gap-3">
                    {[
                      { name: "Unframed", color: "transparent" },
                      { name: "Matte Black", color: "#1a1a1a" },
                      { name: "Walnut", color: "#5c4033" },
                      { name: "White", color: "#f0f0f0" }
                    ].map((f, i) => (
                      <button key={i} className="flex flex-col items-center gap-2 group">
                        <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${i === 1 ? 'border-foreground' : 'border-border'}`}>
                          <span className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: f.color }}></span>
                        </span>
                        <span className="text-[10px] uppercase text-foreground/60 group-hover:text-foreground">{f.name}</span>
                      </button>
                    ))}
                  </div>
               </div>
             </div>

             {/* Actions */}
             <div className="flex flex-col gap-4 mb-8">
               <Link
                 href={`/checkout?item=${product.id}&price=${product.price}&title=${encodeURIComponent(product.title)}&img=${encodeURIComponent(product.image)}`}
                 className="w-full text-center bg-black text-white dark:bg-white dark:text-black py-4 font-bold tracking-widest uppercase hover:opacity-90 transition-opacity block rounded-md shadow-md"
               >
                 Proceed to Checkout - ₹{product.price.toLocaleString('en-IN')}
               </Link>
               <div className="flex gap-4">
                 <button className="flex-1 border border-border py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                   <Heart size={18} /> Wishlist
                 </button>
                 <button className="flex-1 border border-border py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                   <Share2 size={18} /> Share
                 </button>
               </div>
             </div>

             {/* Info */}
             <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Truck className="text-foreground/50 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-sm">Free Global Shipping</h4>
                    <p className="text-xs text-foreground/60">Delivered within 5-7 business days.</p>
                  </div>
                </div>
                <div className="border border-border p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                  <h4 className="font-bold text-sm flex justify-between">Product Details <span>+</span></h4>
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
                <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 mb-4 overflow-hidden">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-heading text-lg font-semibold">{p.title}</h3>
                <span className="font-medium text-sm text-foreground/70">₹{p.price.toLocaleString('en-IN')}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

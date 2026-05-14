"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CollectionsPage() {
  const curatedCollections = [
    {
      title: "Abstract Noir",
      subtitle: "Deep blacks and subtle minimalist textures",
      image: "/canvas-sample.png",
      href: "/shop?category=Canvas%20Prints",
      itemCount: "12 Artworks",
    },
    {
      title: "Cinematic Darkroom",
      subtitle: "Moody photography capturing profound depths",
      image: "/hero-bg.png",
      href: "/shop?category=Wall%20Posters",
      itemCount: "8 Artworks",
    },
    {
      title: "Pencil & Graphite",
      subtitle: "Meticulous hand-drawn custom sketches",
      image: "/sketch-sample.png",
      href: "/shop?category=Custom%20Sketches",
      itemCount: "15 Artworks",
    },
  ];

  return (
    <div className="container mx-auto px-6 md:px-12 py-16 max-w-6xl">
      <div className="text-center space-y-4 mb-16">
        <h1 className="font-heading text-4xl md:text-6xl font-bold">Curated Collections</h1>
        <p className="text-foreground/60 max-w-xl mx-auto text-sm md:text-base">
          Explore our exclusive thematic releases. Each collection is thoughtfully curated to bring sophisticated, premium aesthetics to your space.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {curatedCollections.map((col, idx) => (
          <Link key={col.title} href={col.href} className="group block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-border shadow-sm mb-6"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded">
                  {col.itemCount}
                </span>
                <h2 className="font-heading text-2xl font-bold">{col.title}</h2>
                <p className="text-xs text-white/80 line-clamp-2">{col.subtitle}</p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:underline">
                  Explore Collection <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

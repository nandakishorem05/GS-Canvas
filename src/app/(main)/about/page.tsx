"use client";

import Image from "next/image";
import { Award, ShieldCheck, Sparkles, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 md:px-12 py-16 max-w-6xl space-y-24 font-sans">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest bg-neutral-100 dark:bg-neutral-900 px-4 py-1.5 rounded-full">
          Our Brand Story
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
          Redefining Wall Décor with Uncompromising Craftsmanship
        </h1>
        <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
          At GS Canvas, we believe that blank walls are missed opportunities. Every piece in our collection is crafted with museum-grade archival canvas, state-of-the-art pigmented inks, and solid wooden frames designed to last generations.
        </p>
      </div>

      {/* Founder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-neutral-50 dark:bg-neutral-900/50 border border-border p-8 md:p-12 rounded-3xl shadow-sm">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-lg bg-neutral-200 dark:bg-neutral-800">
            <Image
              src="/founder.jpeg"
              alt="Govind Gopasukumar - Founder of GS Canvas"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Founder & CEO</span>
              <h3 className="font-heading text-2xl font-bold">Govind Gopasukumar</h3>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Meet the Founder</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-snug">
            "Your vision deserves to be celebrated on a canvas that lasts a lifetime."
          </h2>
          <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
            Founded by <span className="font-semibold text-foreground">Govind Gopasukumar</span>, GS Canvas was born out of a profound passion for minimalist design, rich aesthetics, and uncompromising physical quality. Observing a market flooded with flimsy paper posters and dull synthetic prints, Govind set out to build a truly premium custom art platform.
          </p>
          <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
            Whether it is an atmospheric darkroom photograph or a bespoke custom sketch of a loved one, Govind ensures every piece leaving our studio meets the strictest gallery standards.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-2xl text-blue-600 dark:text-blue-400">100%</h4>
              <p className="text-xs text-foreground/60">Museum Grade Materials</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-2xl text-blue-600 dark:text-blue-400">5 Star</h4>
              <p className="text-xs text-foreground/60">Craftsmanship Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="font-heading text-3xl font-bold">Why GS Canvas?</h2>
          <p className="text-sm text-foreground/60">The pillars that define our quality and service.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: "Archival Quality Canvas",
              desc: "Heavyweight cotton-poly blend canvas certified for 100+ years without fading or yellowing.",
            },
            {
              icon: ShieldCheck,
              title: "Handcrafted Wooden Frames",
              desc: "Responsibly sourced solid pine and walnut wood reinforced for maximum durability.",
            },
            {
              icon: Heart,
              title: "Bespoke Personalization",
              desc: "From custom sizes to professional pencil portrait sketches done by master artists.",
            },
          ].map((val) => (
            <div key={val.title} className="bg-white dark:bg-black border border-border p-8 rounded-2xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-blue-600 flex items-center justify-center">
                <val.icon size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold">{val.title}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

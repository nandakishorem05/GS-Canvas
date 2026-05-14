"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Crop, Image as ImageIcon, Settings, Trash2, Maximize, PaintBucket, Palette, SlidersHorizontal, Frame } from "lucide-react";
import Image from "next/image";

type FilterType = "none" | "grayscale" | "sepia" | "invert" | "sketch";

export function StudioEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("none");
  const [size, setSize] = useState("18x24");
  const [frameStyle, setFrameStyle] = useState("black");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const getFilterStyle = () => {
    switch (filter) {
      case "grayscale": return "grayscale(100%)";
      case "sepia": return "sepia(80%)";
      case "invert": return "invert(100%)";
      case "sketch": return "grayscale(100%) contrast(150%) brightness(120%)";
      default: return "none";
    }
  };

  const getFrameCSS = () => {
    switch (frameStyle) {
      case "black": return "border-[16px] border-[#1a1a1a] shadow-2xl";
      case "white": return "border-[16px] border-[#f0f0f0] shadow-2xl";
      case "wood": return "border-[16px] border-[#8b5a2b] shadow-2xl";
      default: return "shadow-xl";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-80px)] bg-neutral-100 dark:bg-neutral-950">
      
      {/* Left Panel: Tools */}
      <div className="w-full lg:w-72 bg-white dark:bg-black border-r border-border p-6 flex flex-col overflow-y-auto">
        <h2 className="font-heading text-2xl font-bold mb-8">Studio Tools</h2>
        
        <div className="space-y-8">
          {/* Upload */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider flex items-center gap-2">
              <Upload size={16} /> Upload Image
            </h3>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-border hover:border-foreground transition-colors flex flex-col items-center justify-center gap-2 text-sm text-foreground/60 hover:text-foreground"
            >
              <ImageIcon size={24} />
              <span>Click to Browse</span>
            </button>
            {uploadedImage && (
               <button 
                onClick={() => setUploadedImage(null)}
                className="w-full py-2 flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
               >
                 <Trash2 size={16} /> Remove Image
               </button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider flex items-center gap-2">
              <Palette size={16} /> Artistic Filters
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["none", "grayscale", "sepia", "sketch"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as FilterType)}
                  className={`py-2 text-xs uppercase tracking-wider border transition-all ${
                    filter === f ? "border-foreground bg-foreground text-background font-bold" : "border-border hover:border-foreground/50 text-foreground/70"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {/* Frame & Material */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider flex items-center gap-2">
              <Frame size={16} /> Frame Style
            </h3>
            <div className="flex gap-3">
               {[
                 { id: "none", color: "transparent" },
                 { id: "black", color: "#1a1a1a" },
                 { id: "white", color: "#f0f0f0" },
                 { id: "wood", color: "#8b5a2b" }
               ].map((f) => (
                 <button
                   key={f.id}
                   onClick={() => setFrameStyle(f.id)}
                   className={`w-8 h-8 rounded-full border-2 transition-transform ${
                     frameStyle === f.id ? "scale-125 border-blue-500" : "border-gray-300"
                   }`}
                   style={{ backgroundColor: f.color }}
                   title={f.id}
                 />
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center Panel: Preview */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden relative">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-2 text-sm font-mono shadow-sm pointer-events-auto">
            Live Preview
          </div>
          <div className="flex gap-2 pointer-events-auto">
             <button className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 hover:bg-white dark:hover:bg-black transition-colors shadow-sm">
               <Maximize size={18} />
             </button>
          </div>
        </div>

        {/* Live Mockup Area */}
        <div className="flex-1 flex items-center justify-center relative bg-[url('/wall-texture.jpg')] bg-cover bg-center">
          {/* Placeholder Wall Texture */}
          <div className="absolute inset-0 bg-neutral-200/50 dark:bg-neutral-900/50 mix-blend-multiply pointer-events-none" />
          
          {uploadedImage ? (
            <motion.div 
              layout
              className={`relative bg-white flex items-center justify-center transition-all duration-500 ease-in-out ${getFrameCSS()}`}
              style={{
                 width: size === "18x24" ? "360px" : size === "24x36" ? "480px" : "600px",
                 height: size === "18x24" ? "480px" : size === "24x36" ? "720px" : "600px" // Using 1:1 for 30x30
              }}
            >
               <img 
                 src={uploadedImage} 
                 alt="Artwork Preview" 
                 className="w-full h-full object-cover"
                 style={{ filter: getFilterStyle() }}
               />
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" /> {/* Glass reflection */}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-foreground/40 gap-4">
               <ImageIcon size={64} className="opacity-20" />
               <p className="font-heading text-xl">Upload an image to start</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Configuration & Pricing */}
      <div className="w-full lg:w-80 bg-white dark:bg-black border-l border-border p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-8">Order Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider block mb-3">
                Size
              </label>
              <div className="space-y-2">
                {["18x24", "24x36", "30x30"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-full text-left px-4 py-3 border text-sm transition-colors ${
                      size === s ? "border-foreground bg-neutral-50 dark:bg-neutral-900 font-medium" : "border-border hover:border-foreground/50"
                    }`}
                  >
                    {s} Inches
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider block mb-3">
                Material
              </label>
              <select className="w-full bg-transparent border border-border p-3 text-sm focus:outline-none focus:border-foreground">
                <option value="premium-canvas">Premium Canvas</option>
                <option value="matte-paper">Matte Archival Paper</option>
                <option value="acrylic">HD Acrylic</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex justify-between items-end mb-6">
             <span className="text-foreground/70">Total</span>
             <span className="font-heading text-3xl font-bold">
               ${size === "18x24" ? "149" : size === "24x36" ? "229" : "279"}
             </span>
          </div>
          <button className="w-full bg-black text-white dark:bg-white dark:text-black py-4 font-bold tracking-widest uppercase hover:opacity-90 transition-opacity">
            Add to Cart
          </button>
          <p className="text-center text-xs text-foreground/50 mt-4">
             Free standard shipping on all custom orders.
          </p>
        </div>
      </div>
    </div>
  );
}

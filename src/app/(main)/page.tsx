"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[100dvh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <Image
            src="/hero-bg.png"
            alt="Professional Canvas Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60" />
        </motion.div>

        <motion.div 
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              YOUR VISION
              <br />
              <span className="text-blue-100 italic font-light">OUR CANVAS</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-slate-200 text-base sm:text-lg md:text-xl font-medium tracking-wide mb-8 sm:mb-10 max-w-2xl px-4"
          >
            Elevate your space with premium wall décor and custom artworks crafted to perfection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
          >
            <Link
              href="/shop"
              className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors w-full sm:w-auto rounded-md shadow-lg"
            >
              Shop Collection
            </Link>
            <Link
              href="/studio"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-slate-900 transition-colors w-full sm:w-auto rounded-md"
            >
              Create Custom Artwork
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 sm:py-24 bg-background relative z-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">Curated Collections</h2>
            <p className="text-muted-foreground text-sm tracking-wide uppercase font-medium">Discover your perfect piece</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: "Wall Posters", img: "/canvas-sample.png" },
              { title: "Canvas Prints", img: "/hero-bg.png" },
              { title: "Custom Sketches", img: "/sketch-sample.png" },
            ].map((category, index) => (
              <Link href="/shop" key={index} className="group relative h-[300px] sm:h-[400px] overflow-hidden block rounded-xl shadow-md">
                <Image
                  src={category.img}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-500" />
                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8">
                  <h3 className="text-white font-heading text-xl sm:text-2xl mb-2 drop-shadow-md">{category.title}</h3>
                  <span className="text-white/90 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all font-medium">
                    Explore <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* "Create Your Own Art" Teaser */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white overflow-hidden relative z-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 sm:gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-white">Turn Memories Into Masterpieces</h2>
              <p className="text-slate-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Our Custom Artwork Studio allows you to upload any image and transform it into a premium canvas, elegant sketch, or vibrant poster. Experience real-time previews and luxury finishes.
              </p>
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 text-slate-200">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  </div>
                  <span>Upload & crop your own image</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  </div>
                  <span>Apply artistic filters & remove backgrounds</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  </div>
                  <span>Live 3D wall preview</span>
                </li>
              </ul>
              <Link
                href="/studio"
                className="inline-block w-full sm:w-auto text-center bg-primary text-primary-foreground px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-md shadow-lg shadow-primary/20"
              >
                Launch Studio
              </Link>
            </motion.div>
          </div>
          <div className="w-full lg:w-1/2 relative h-[350px] sm:h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }}
              className="absolute inset-0 relative w-full h-full shadow-2xl rounded-xl overflow-hidden border border-white/10"
            >
              <Image 
                src="/sketch-sample.png" 
                alt="Custom Art Transformation" 
                fill 
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-xs font-mono px-3 py-1.5 text-slate-200 rounded-md border border-slate-700">
                Style: Pencil Sketch
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-4 flex justify-between items-center border border-white/20 rounded-lg">
                <span className="text-sm font-medium text-white drop-shadow-md">18" x 24" Premium Frame</span>
                <span className="font-heading font-bold text-lg text-white drop-shadow-md">$149</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-secondary/30 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 sm:mb-16 text-foreground">Loved by Art Enthusiasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                text: "The quality of the canvas print I received is simply breathtaking. It looks like a museum piece in my living room.",
                author: "Elena R.",
                role: "Interior Designer",
              },
              {
                text: "I used the custom studio to turn a photo of my dog into a sketch. The detail and framing are impeccably luxurious.",
                author: "Michael T.",
                role: "Verified Buyer",
              },
              {
                text: "GS Canvas completely transformed my workspace. The minimal aesthetics and premium finish are unmatched.",
                author: "Sarah K.",
                role: "Architect",
              },
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-card text-card-foreground p-6 sm:p-8 flex flex-col items-center text-center rounded-2xl shadow-sm border border-border"
              >
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-8 flex-grow">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-foreground font-heading text-lg">{review.author}</h4>
                  <p className="text-xs text-primary uppercase tracking-widest mt-1 font-semibold">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Mail, Globe, Smartphone, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-50 py-16 border-t border-slate-800">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-wider mb-2">GS CANVAS</h2>
              <p className="text-slate-400 text-sm font-medium tracking-wide">
                YOUR VISION OUR CANVAS
              </p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Premium wall décor and custom artwork crafted to elevate your space. 
              Upload your vision, and we will bring it to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl mb-6 text-slate-200">Explore</h3>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">Shop Collection</Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">Custom Studio</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">Art Journal</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-xl mb-6 text-slate-200">Support</h3>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">Track Order</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-xl mb-6 text-slate-200">Stay Inspired</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-slate-800/50 border border-slate-700 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-md"
              />
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 transition-colors uppercase tracking-wider rounded-md"
              >
                Subscribe
              </button>
            </form>
            <div className="flex items-center gap-4 mt-8 text-slate-400">
              <a href="#" className="hover:text-primary transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Smartphone size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Heart size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} GS Canvas. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

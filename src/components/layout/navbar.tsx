"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Trash2, ArrowRight, Package, Smartphone, ShieldCheck, Loader2 } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();

  // OTP Auth State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Load customer session
    const storedUser = localStorage.getItem("gs_customer_phone");
    if (storedUser) setCurrentUser(storedUser);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      alert("Please enter the 4-digit verification code");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("gs_customer_phone", phone);
      setCurrentUser(phone);
      setIsAuthOpen(false);
      setStep("phone");
    }, 1200);
  };

  const handleLogout = () => {
    localStorage.removeItem("gs_customer_phone");
    setCurrentUser(null);
  };

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Custom Studio", href: "/studio" },
    { name: "Collections", href: "/collections" },
    { name: "Track Orders", href: "/track" },
    { name: "About", href: "/about" },
  ];

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md shadow-sm py-4 border-b border-border/50"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 relative z-10 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center"
            >
              <img src="/logo.png" alt="GS Canvas Logo" className="h-20 object-contain drop-shadow-md" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide uppercase text-foreground/80 hover:text-foreground transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/track" className="text-foreground/80 hover:text-foreground transition-colors hidden lg:block" title="Track My Orders">
              <Package size={20} />
            </Link>
            
            {/* Profile Icon for Customer OTP Auth */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1.5 p-1 relative"
              title={currentUser ? `Logged in as ${currentUser}` : "Customer Login"}
            >
              <User size={20} />
              {currentUser && (
                <span className="w-2 h-2 rounded-full bg-green-500 absolute -bottom-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-foreground/80 hover:text-foreground transition-colors relative p-1"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 shadow-lg md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex justify-between pt-2">
              <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }} className="flex items-center gap-2 text-sm font-semibold">
                <User size={18} /> {currentUser ? "My Profile" : "Login with OTP"}
              </button>
              <Link href="/track" className="flex items-center gap-2 text-sm font-semibold text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                <Package size={18} /> Track Orders
              </Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Customer OTP Login / Profile Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-black border border-border rounded-2xl w-full max-w-md p-8 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-6 right-6 text-foreground/50 hover:text-foreground"
              >
                <X size={24} />
              </button>

              {currentUser ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-blue-600 font-bold text-xl">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold">Welcome Back</h3>
                    <p className="text-sm font-mono text-foreground/60 mt-1">{currentUser}</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mt-2">
                      Verified Customer
                    </span>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <Link
                      href="/track"
                      onClick={() => setIsAuthOpen(false)}
                      className="w-full bg-neutral-100 dark:bg-neutral-900 border border-border py-3 rounded-lg font-bold text-xs uppercase tracking-widest block hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all text-center"
                    >
                      Track My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : step === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-2">
                      <Smartphone size={24} />
                    </div>
                    <h3 className="font-heading text-2xl font-bold">Login / Sign Up</h3>
                    <p className="text-xs text-foreground/60">Enter your mobile number to receive a secure OTP code.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Mobile Number</label>
                    <div className="flex">
                      <span className="bg-neutral-100 dark:bg-neutral-900 border border-r-0 border-border px-4 py-3 rounded-l-lg text-sm font-medium flex items-center text-foreground/60">+91</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-r-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white dark:bg-white dark:text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send One-Time Password"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-heading text-2xl font-bold">Enter Verification Code</h3>
                    <p className="text-xs text-foreground/60">We sent a 4-digit OTP code to <span className="font-semibold">+91 {phone}</span>.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-center">4-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-1/2 mx-auto bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl px-4 py-4 text-2xl tracking-widest text-center focus:outline-none focus:border-foreground font-mono block font-bold"
                    />
                    <span className="text-[10px] text-foreground/50 text-center block mt-2">For demo, enter any 4 digits (e.g. 1234).</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify & Secure Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="w-full text-center text-xs text-foreground/50 underline block"
                  >
                    Change Mobile Number
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Side Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-black z-50 shadow-2xl flex flex-col border-l border-border"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                  <ShoppingBag size={24} /> Shopping Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-foreground/50 hover:text-foreground p-1">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-foreground/40">
                      <ShoppingBag size={32} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold">Your cart is empty</h3>
                    <p className="text-xs text-foreground/60 max-w-xs mx-auto">Explore our curated collection or custom studio to find your perfect artwork piece.</p>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest mt-2"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 border-b border-border pb-4">
                      <div className="relative w-20 h-24 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-foreground/50 mb-2">Size: {item.size} | Qty: {item.quantity}</p>
                        <span className="font-heading font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-foreground/40 hover:text-red-500 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-border space-y-4 bg-neutral-50 dark:bg-neutral-900">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60">Subtotal</span>
                    <span className="font-heading font-bold text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-foreground/50">Free global shipping & GST included. Checkout securely via Razorpay.</p>
                  <Link
                    href={`/checkout?item=${items[0].id}&price=${cartTotal}&title=${encodeURIComponent(items[0].title)}&img=${encodeURIComponent(items[0].image)}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all block text-center"
                  >
                    Proceed to Razorpay Checkout <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

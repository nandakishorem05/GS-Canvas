"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Truck, Lock, ArrowLeft, CreditCard, Smartphone, Loader2 } from "lucide-react";
import Link from "next/link";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get("title") || "Premium Canvas Artwork";
  const price = Number(searchParams.get("price")) || 14999;
  const img = searchParams.get("img") || "/canvas-sample.png";
  const itemId = searchParams.get("item") || "60c72b2f9b1d8b001c8e4d10";

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("rzp_order_983120");

  // Customer OTP State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const storedPhone = localStorage.getItem("gs_customer_phone");
    if (storedPhone) {
      setCurrentUser(storedPhone);
      setFormData(prev => ({ ...prev, phone: storedPhone }));
    }
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsOtpLoading(true);
    setTimeout(() => {
      setIsOtpLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      alert("Please enter the 4-digit verification code");
      return;
    }
    setIsOtpLoading(true);
    setTimeout(() => {
      setIsOtpLoading(false);
      localStorage.setItem("gs_customer_phone", phone);
      setCurrentUser(phone);
      setFormData(prev => ({ ...prev, phone: phone }));
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRazorpayCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Save order to live MongoDB
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          title: title,
          price: price,
          itemId: itemId
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order?._id) {
          setOrderId("rzp_order_" + data.order._id.toString().substring(0, 8));
        }
      }

      // Simulate Gateway verification delay
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 2000);

    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-20 text-center px-4"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="font-heading text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto">
          Thank you for your order, <span className="font-semibold">{formData.fullName}</span>. We have received your payment via <span className="font-semibold">Razorpay</span> and started processing your beautiful artwork.
        </p>
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-border p-6 rounded-xl mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Order ID:</span>
            <span className="font-mono font-semibold">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Item:</span>
            <span className="font-semibold">{title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Amount Paid:</span>
            <span className="font-semibold text-green-600">₹{price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-2">
            <span className="text-foreground/60">Delivery Address:</span>
            <span className="font-semibold text-right">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</span>
          </div>
        </div>
        <Link
          href="/shop"
          className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-md font-bold uppercase tracking-widest text-sm hover:opacity-90 shadow-md"
        >
          Return to Shop
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 max-w-6xl">
      <Link href="/shop" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8">
        <ArrowLeft size={16} /> Back to Shopping
      </Link>

      <h1 className="font-heading text-3xl font-bold mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form or OTP Prompt */}
        <div className="lg:col-span-7 space-y-8">
          
          {!currentUser ? (
            <div className="bg-white dark:bg-black border border-border p-8 rounded-2xl shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-2">
                  <Smartphone size={24} />
                </div>
                <h2 className="font-heading text-2xl font-bold">OTP Authentication Required</h2>
                <p className="text-xs text-foreground/60">Please login or sign up with your mobile number to continue with your checkout.</p>
              </div>

              {step === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-4 max-w-md mx-auto">
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
                    disabled={isOtpLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    {isOtpLoading ? <Loader2 className="animate-spin" size={18} /> : "Send OTP Verification Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md mx-auto">
                  <div className="text-center">
                    <p className="text-xs text-foreground/60 mb-4">We sent a 4-digit OTP code to <span className="font-semibold">+91 {phone}</span>.</p>
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
                    disabled={isOtpLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    {isOtpLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify & Proceed to Address"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="w-full text-center text-xs text-foreground/50 underline block pt-2"
                  >
                    Change Mobile Number
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleRazorpayCheckout} className="space-y-8">
              <div className="bg-white dark:bg-black border border-border p-6 md:p-8 rounded-xl shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                    <Truck size={20} className="text-foreground/60" /> Shipping & Delivery Address
                  </h2>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                    <ShieldCheck size={14} /> Verified: +91 {currentUser}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Flat / House No., Apartment, Street name"
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">PIN Code</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Banner */}
              <div className="bg-white dark:bg-black border border-border p-6 rounded-xl shadow-sm space-y-4">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 border-b border-border pb-4">
                  <CreditCard size={20} className="text-foreground/60" /> Payment Gateway
                </h2>
                <div className="flex items-center justify-between p-4 border border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Razorpay Secure Gateway</span>
                      <span className="text-xs text-foreground/60">UPI, Google Pay, Cards, NetBanking</span>
                    </div>
                  </div>
                  <img src="https://badges.razorpay.com/badge-dark.png" alt="Razorpay Secure" className="h-8 object-contain" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Initializing Razorpay...
                  </>
                ) : (
                  <>
                    <Lock size={18} /> Pay ₹{price.toLocaleString('en-IN')} with Razorpay
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 bg-white dark:bg-black border border-border p-6 md:p-8 rounded-xl shadow-sm space-y-6">
            <h2 className="font-heading text-xl font-bold border-b border-border pb-4">Order Summary</h2>

            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                <Image src={img} alt={title} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">{title}</h3>
                <p className="text-xs text-foreground/50 mb-2">Size: 24x36 in | Frame: Unframed</p>
                <span className="font-heading font-bold text-sm">₹{price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm border-b border-border pb-6">
              <div className="flex justify-between">
                <span className="text-foreground/60">Subtotal</span>
                <span>₹{price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Estimated Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Taxes (GST 18%)</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                <span>Total Amount</span>
                <span>₹{price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-foreground/60">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
                <span>256-Bit SSL Encrypted & Secure Checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-blue-600 flex-shrink-0" />
                <span>Dispatched within 24-48 hours via BlueDart / Delhivery</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading secure checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

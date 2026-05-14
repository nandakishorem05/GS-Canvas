"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, Smartphone, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TrackedOrder {
  _id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  items: any[];
}

export default function TrackOrderPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);

  // OTP Login State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  useEffect(() => {
    const storedPhone = localStorage.getItem("gs_customer_phone");
    if (storedPhone) {
      setCurrentUser(storedPhone);
      fetchCustomerOrders(storedPhone);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchCustomerOrders(userPhone: string) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        const list = data.orders || [];

        const cleanPhone = userPhone.replace(/\D/g, '');
        const myOrders = list.filter((o: any) => {
          const oPhone = o.customerDetails?.phone ? o.customerDetails.phone.replace(/\D/g, '') : '';
          return oPhone.includes(cleanPhone) || cleanPhone.includes(oPhone);
        });

        setOrders(myOrders);
      }
    } catch (err) {
      console.error("Failed to fetch customer orders", err);
    } finally {
      setIsLoading(false);
    }
  }

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
      fetchCustomerOrders(phone);
    }, 1200);
  };

  const getStatusStep = (st: string) => {
    switch (st) {
      case 'Confirmed': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0; // Pending
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 text-center space-y-4 font-sans">
        <Loader2 className="animate-spin mx-auto text-blue-600" size={36} />
        <p className="text-foreground/60 text-sm font-medium">Loading your secure order history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-16 max-w-5xl font-sans">
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-md border border-blue-500/20">
          <Package size={32} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold">My Orders</h1>
        <p className="text-foreground/60 max-w-md mx-auto text-sm md:text-base">
          Track fulfillment status and view complete purchase history for your verified mobile number.
        </p>
      </div>

      {!currentUser ? (
        <div className="bg-white dark:bg-black border border-border p-8 md:p-12 rounded-2xl shadow-sm max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-2">
              <Smartphone size={24} />
            </div>
            <h2 className="font-heading text-2xl font-bold">Login Required</h2>
            <p className="text-xs text-foreground/60">Enter your mobile number to view and track your orders.</p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                className="w-full bg-black text-white dark:bg-white dark:text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 mt-4 hover:opacity-90"
              >
                {isOtpLoading ? <Loader2 className="animate-spin" size={18} /> : "Send One-Time Password"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {isOtpLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify & View My Orders"}
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
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-black border border-border p-12 rounded-2xl text-center space-y-4 shadow-sm max-w-xl mx-auto">
          <Package size={48} className="mx-auto text-foreground/30" />
          <h3 className="font-heading text-2xl font-bold">No orders found for +91 {currentUser}</h3>
          <p className="text-xs text-foreground/60 max-w-sm mx-auto leading-relaxed">
            Once you place an order on our store via Razorpay checkout, your beautiful artwork pieces will instantly appear here with live tracking updates.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-md transition-colors"
            >
              Start Shopping
            </Link>
            <button
              onClick={() => { localStorage.removeItem("gs_customer_phone"); setCurrentUser(null); }}
              className="inline-block bg-neutral-100 dark:bg-neutral-900 text-foreground font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              Logout / Switch Phone
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-border">
            <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-green-600" /> Verified Account: +91 {currentUser}
            </span>
            <button
              onClick={() => { localStorage.removeItem("gs_customer_phone"); setCurrentUser(null); }}
              className="text-xs underline text-red-500 hover:text-red-600 font-medium"
            >
              Logout / Switch Phone Number
            </button>
          </div>

          {orders.map((order) => {
            const shortId = "rzp_ord_" + order._id.substring(order._id.length - 6);
            const step = getStatusStep(order.status);

            return (
              <div key={order._id} className="bg-white dark:bg-black border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">Order Identifier</span>
                    <h2 className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">{shortId}</h2>
                    <p className="text-xs text-foreground/60 mt-0.5">Ordered by: <span className="font-semibold">{order.customerDetails?.name}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">Total Paid</span>
                    <span className="font-heading font-bold text-xl">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    <span className="block bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded mt-1 inline-block">
                      {order.paymentStatus || 'Paid'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/60">Live Fulfillment Status: <span className="text-foreground font-bold">{order.status || 'Pending'}</span></h4>
                  
                  <div className="relative flex justify-between items-center max-w-3xl mx-auto pt-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-100 dark:bg-neutral-800 -translate-y-1/2 z-0" />
                    
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
                      style={{ width: `${(step / 3) * 100}%` }}
                    />

                    {/* Step 0: Order Placed */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-xs font-bold mt-2">Order Placed</span>
                    </div>

                    {/* Step 1: Confirmed */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                        step >= 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-black border-2 border-border text-foreground/40'
                      }`}>
                        <Clock size={20} />
                      </div>
                      <span className="text-xs font-semibold mt-2">Confirmed</span>
                    </div>

                    {/* Step 2: Shipped */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                        step >= 2 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-black border-2 border-border text-foreground/40'
                      }`}>
                        <Truck size={20} />
                      </div>
                      <span className="text-xs font-semibold mt-2">Shipped</span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                        step >= 3 ? 'bg-green-600 text-white' : 'bg-white dark:bg-black border-2 border-border text-foreground/40'
                      }`}>
                        <Package size={20} />
                      </div>
                      <span className="text-xs font-semibold mt-2">Delivered</span>
                    </div>

                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border-t border-border pt-6 flex items-start gap-3 text-sm">
                  <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-foreground/60 mb-1">Shipping Destination</h5>
                    <p className="font-semibold">{order.shippingAddress?.street}</p>
                    <p className="text-foreground/80">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                    <p className="text-xs text-foreground/50 mt-1">Shipped securely in reinforced protective tube packaging.</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

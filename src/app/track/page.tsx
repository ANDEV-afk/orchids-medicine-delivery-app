"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, Clock, Package, Truck, Store, 
  CheckCircle2, ChevronRight, User, MessageSquare,
  Brain, Sparkles, Shield, Fingerprint, PartyPopper, X, Star
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DoseuppLogo } from "@/components/DoseuppLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

const orderDetails = {
  orderId: "DU12345678",
  placedAt: "2:30 PM",
  estimatedDelivery: "2:42 PM",
  items: [
    { name: "Paracetamol 500mg", brand: "Crocin", quantity: 2, price: 25 },
    { name: "Vitamin D3 60000IU", brand: "Drise", quantity: 1, price: 85 },
  ],
  pharmacy: {
    name: "Apollo Pharmacy - Connaught Place",
    address: "Block A-12, Inner Circle, Connaught Place",
    phone: "+91 9876543210",
    rating: 4.9,
  },
  delivery: {
    address: "Connaught Place, New Delhi - 110001",
    fee: 25,
  },
  rider: {
    name: "Rahul Kumar",
    phone: "+91 9876543211",
    rating: 4.9,
    deliveries: 1250,
    vehicle: "Honda Activa",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
};

const trackingSteps = [
  { id: 1, title: "Order Placed", description: "Your order has been received", icon: Package, time: "2:30 PM" },
  { id: 2, title: "AI Pharmacy Selection", description: "Finding nearest pharmacy with stock", icon: Brain, time: "2:31 PM" },
  { id: 3, title: "Order Confirmed", description: "Pharmacy has confirmed your order", icon: CheckCircle2, time: "2:32 PM" },
  { id: 4, title: "Preparing Order", description: "Pharmacy is preparing your medicines", icon: Store, time: "2:35 PM" },
  { id: 5, title: "Rider Assigned", description: "Rider is on the way to pharmacy", icon: User, time: "2:36 PM" },
  { id: 6, title: "Out for Delivery", description: "Rider has picked up your order", icon: Truck, time: "2:38 PM" },
  { id: 7, title: "Doorstep Verification", description: "Verify OTP to receive order", icon: Fingerprint, time: "2:41 PM" },
  { id: 8, title: "Delivered", description: "Order delivered successfully", icon: PartyPopper, time: "2:42 PM" },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [riderLocation, setRiderLocation] = useState({ x: 15, y: 85 });
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const correctOTP = "1234";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 6) return prev + 1;
        if (prev === 6) {
          setTimeout(() => setShowVerificationPopup(true), 1000);
          clearInterval(interval);
        }
        return prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressMap: Record<number, number> = { 1: 5, 2: 15, 3: 28, 4: 42, 5: 55, 6: 70, 7: 88, 8: 100 };
    setProgress(progressMap[currentStep] || 0);

    if (currentStep >= 6 && currentStep < 8) {
      const riderInterval = setInterval(() => {
        setRiderLocation(prev => ({
          x: Math.min(prev.x + 1.5, 85),
          y: Math.max(prev.y - 1, 25),
        }));
      }, 150);
      return () => clearInterval(riderInterval);
    }
  }, [currentStep]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otp.join("") === correctOTP) {
      setShowVerificationPopup(false);
      setCurrentStep(7);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(8);
      setShowDeliveredPopup(true);
    }
    setVerifying(false);
  };

  const subtotal = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + orderDetails.delivery.fee;
  const orderId = searchParams.get("orderId") || orderDetails.orderId;

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <DoseuppLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/order">
              <Button className="btn-primary-gradient font-semibold">
                Order More
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-primary pulse-dot" />
              <span className="text-sm text-primary font-medium">Live Tracking</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Track Your Order</h1>
            <p className="text-muted-foreground">Order #{orderId}</p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-6"
            >
              <div className="glass-card rounded-3xl overflow-hidden">
                <div className="h-56 bg-gradient-to-br from-secondary/50 to-card relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px'
                    }} />
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                      d="M 10 90 Q 25 75, 40 70 T 65 50 T 90 20"
                      stroke="url(#routeGradient)"
                      strokeWidth="0.8"
                      strokeDasharray="3,2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <motion.div
                    className="absolute bottom-4 left-4 bg-accent backdrop-blur-sm px-3 py-2 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-white" />
                      <span className="text-xs text-white font-medium">Pharmacy</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-4 right-4 bg-primary backdrop-blur-sm px-3 py-2 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-white" />
                      <span className="text-xs text-white font-medium">Your Location</span>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {currentStep >= 6 && (
                      <motion.div
                        className="absolute"
                        style={{ 
                          left: `${riderLocation.x}%`, 
                          top: `${riderLocation.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <motion.div
                          className="relative"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <div className="absolute inset-0 bg-primary/30 rounded-full blur-md scale-150" />
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                            <Truck className="w-5 h-5 text-white" />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="text-2xl font-bold text-primary">{orderDetails.estimatedDelivery}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Delivery Progress</span>
                      <span className="text-primary font-semibold">{progress}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full progress-bar-animated rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Store className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="font-medium text-sm line-clamp-1 text-foreground">{orderDetails.pharmacy.name.split(' - ')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="font-medium text-sm line-clamp-1 text-foreground">{orderDetails.delivery.address.split(',')[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {currentStep >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                    <Truck className="w-5 h-5 text-primary" />
                    Delivery Partner
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                      <img 
                        src={orderDetails.rider.image} 
                        alt={orderDetails.rider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{orderDetails.rider.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {orderDetails.rider.rating} • {orderDetails.rider.deliveries} deliveries
                      </p>
                      <p className="text-xs text-muted-foreground">{orderDetails.rider.vehicle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-white">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-white">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {currentStep === 6 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">Verification OTP</p>
                          <p className="text-2xl font-bold text-primary tracking-widest">1234</p>
                          <p className="text-xs text-muted-foreground">Share this OTP with rider at delivery</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold mb-4 text-foreground">Order Progress</h3>
                <div className="space-y-1">
                  {trackingSteps.map((step, i) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const Icon = step.icon;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="relative flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isCompleted || isCurrent ? 1 : 0.8 }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 ${
                              isCompleted || isCurrent
                                ? step.id === 8 && isCompleted 
                                  ? "bg-gradient-to-br from-green-500 to-emerald-500"
                                  : "bg-gradient-to-br from-primary to-accent"
                                : "bg-muted border border-border"
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isCompleted || isCurrent ? "text-white" : "text-muted-foreground"}`} />
                          </motion.div>
                          {i < trackingSteps.length - 1 && (
                            <div className={`w-0.5 h-6 ${isCompleted ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2 pb-2">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium text-sm ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</p>
                            {(isCompleted || isCurrent) && step.time && (
                              <span className="text-xs text-muted-foreground">{step.time}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          {isCurrent && step.id === 2 && (
                            <div className="ai-thinking mt-2 rounded-lg px-3 py-1.5 text-xs text-accent flex items-center gap-2">
                              <Sparkles className="w-3 h-3" />
                              AI analyzing pharmacies...
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold mb-4 text-foreground">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {orderDetails.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-foreground">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-foreground">₹{orderDetails.delivery.fee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>
              </div>

              <Link href="/order">
                <Button className="w-full btn-primary-gradient font-bold py-5">
                  Order More Medicines <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVerificationPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-card rounded-3xl p-8 max-w-md w-full text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 glow-primary"
                >
                  <Fingerprint className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-2 text-foreground">Doorstep Verification</h2>
                <p className="text-muted-foreground mb-6">
                  Rider is at your doorstep! Enter the OTP shared by the rider to receive your order.
                </p>

                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(i, e.target.value)}
                      className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  ))}
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.join("").length < 4 || verifying}
                  className="w-full btn-primary-gradient font-bold py-6"
                >
                  {verifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Verify & Receive Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  OTP ensures your order is delivered to the right person
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeliveredPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="glass-card rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              <button
                onClick={() => setShowDeliveredPopup(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                className="relative"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="absolute inset-0 w-24 h-24 rounded-full bg-green-500 mx-auto"
                />
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 relative">
                  <PartyPopper className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-foreground">Order Delivered!</h2>
                <p className="text-muted-foreground mb-6">
                  Your medicines have been delivered successfully. Thank you for choosing Doseupp!
                </p>

                <div className="glass-card rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Rate your delivery experience</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-primary"
                      >
                        <Star className="w-8 h-8 fill-primary" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeliveredPopup(false)}
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-white py-5 font-medium"
                  >
                    Close
                  </Button>
                  <Link href="/order" className="flex-1">
                    <Button className="w-full btn-primary-gradient font-bold py-5">
                      Order Again
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
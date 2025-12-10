"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, Clock, Package, Truck, Store, 
  CheckCircle2, ChevronRight, User, MessageSquare,
  Brain, Sparkles, Shield, Fingerprint, PartyPopper, X, Star, ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DoseuppLogo } from "@/components/DoseuppLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

type OrderItem = {
  name: string;
  brand: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderData = {
  orderId: string;
  items: OrderItem[];
  pharmacy: {
    name: string;
    address: string;
  };
  deliveryAddress: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentMethod?: "online" | "cod";
};

const getTrackingSteps = (isCOD: boolean) => [
  { id: 1, title: "Order Placed", description: "Your order has been received", icon: Package, time: "2:30 PM" },
  { id: 2, title: "AI Pharmacy Selection", description: "Finding nearest pharmacy with stock", icon: Brain, time: "2:31 PM" },
  { id: 3, title: "Order Confirmed", description: "Pharmacy has confirmed your order", icon: CheckCircle2, time: "2:32 PM" },
  { id: 4, title: "Preparing Order", description: "Pharmacy is preparing your medicines", icon: Store, time: "2:35 PM" },
  { id: 5, title: "Rider Assigned", description: "Rider is on the way to pharmacy", icon: User, time: "2:36 PM" },
  { id: 6, title: "Out for Delivery", description: "Rider has picked up your order", icon: Truck, time: "2:38 PM" },
  ...(isCOD ? [{ id: 7, title: "Doorstep Verification", description: "Verify OTP to receive order", icon: Fingerprint, time: "2:41 PM" }] : []),
  { id: isCOD ? 8 : 7, title: "Delivered", description: "Order delivered successfully", icon: PartyPopper, time: isCOD ? "2:42 PM" : "2:41 PM" },
];

const rider = {
  name: "Rahul Kumar",
  phone: "+91 9876543211",
  rating: 4.9,
  deliveries: 1250,
  vehicle: "Honda Activa",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
};

function TrackContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [riderLocation, setRiderLocation] = useState({ x: 15, y: 85 });
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [rating, setRating] = useState(0);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [hasOrder, setHasOrder] = useState<boolean | null>(null);
  const correctOTP = "1234";

  const isCOD = orderData?.paymentMethod === "cod";
  const trackingSteps = getTrackingSteps(isCOD);
  const maxStep = isCOD ? 8 : 7;

  useEffect(() => {
    const storedOrder = localStorage.getItem("doseupp_current_order");
    if (storedOrder) {
      const parsed = JSON.parse(storedOrder);
      setOrderData(parsed);
      setHasOrder(true);
    } else {
      setHasOrder(false);
    }
  }, []);

  useEffect(() => {
    // Only run tracking animation if there's an order
    if (!hasOrder) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        // For COD: stop at step 6 and show verification popup
        // For online: go directly to step 7 (delivered)
        if (isCOD) {
          if (prev < 6) return prev + 1;
          if (prev === 6) {
            setTimeout(() => setShowVerificationPopup(true), 1000);
            clearInterval(interval);
          }
          return prev;
        } else {
          // For online payment, skip verification
          if (prev < 6) return prev + 1;
          if (prev === 6) {
            clearInterval(interval);
            // Auto complete after a brief pause
            setTimeout(() => {
              setCurrentStep(7);
              setShowDeliveredPopup(true);
              localStorage.removeItem("doseupp_current_order");
            }, 2000);
          }
          return prev;
        }
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [hasOrder, isCOD]);

  useEffect(() => {
    // Progress mapping based on payment method
    const progressMap: Record<number, number> = isCOD
      ? { 1: 5, 2: 15, 3: 28, 4: 42, 5: 55, 6: 70, 7: 88, 8: 100 }
      : { 1: 8, 2: 20, 3: 35, 4: 50, 5: 70, 6: 85, 7: 100 };
    setProgress(progressMap[currentStep] || 0);

    if (currentStep >= 6 && currentStep < maxStep) {
      const riderInterval = setInterval(() => {
        setRiderLocation(prev => ({
          x: Math.min(prev.x + 1.5, 85),
          y: Math.max(prev.y - 1, 25),
        }));
      }, 150);
      return () => clearInterval(riderInterval);
    }
  }, [currentStep, isCOD, maxStep]);

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
      localStorage.removeItem("doseupp_current_order");
    }
    setVerifying(false);
  };

  // Show loading while checking for order
  if (hasOrder === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  // Show empty state if no order exists
  if (!hasOrder) {
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
                  Order Now
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="pt-28 pb-16 px-6 flex items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6"
            >
              <Package className="w-12 h-12 text-muted-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">No Active Orders</h1>
            <p className="text-muted-foreground mb-6">
              You don't have any orders to track right now. Place an order to see live tracking.
            </p>
            <Link href="/order">
              <Button className="btn-primary-gradient font-bold px-8 py-6">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Medicines
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const orderId = searchParams.get("orderId") || orderData?.orderId || "DU12345678";
  const orderItems = orderData?.items || [];
  const subtotal = orderData?.subtotal || 0;
  const deliveryFee = orderData?.deliveryFee || 25;
  const total = orderData?.total || 0;
  const pharmacyName = orderData?.pharmacy?.name || "Apollo Pharmacy";
  const deliveryAddress = orderData?.deliveryAddress || "Connaught Place, New Delhi";

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
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4"
            >
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <span className="text-sm text-primary font-medium">Live Tracking</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-2 text-foreground"
            >
              Track Your Order
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Order #{orderId}
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="lg:col-span-3 space-y-6"
            >
              <motion.div 
                className="glass-card rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-56 bg-gradient-to-br from-secondary/50 to-card relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 opacity-30"
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  >
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px'
                    }} />
                  </motion.div>
                  
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
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-white" />
                      <span className="text-xs text-white font-medium">Pharmacy</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-4 right-4 bg-primary backdrop-blur-sm px-3 py-2 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
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
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 10 }}
                      >
                        <motion.div
                          className="relative"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <motion.div 
                            className="absolute inset-0 bg-primary/30 rounded-full blur-md"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg relative">
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
                      <motion.p 
                        className="text-2xl font-bold text-primary"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        12 min
                      </motion.p>
                    </div>
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <Clock className="w-8 h-8 text-primary" />
                    </motion.div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Delivery Progress</span>
                      <motion.span 
                        className="text-primary font-semibold"
                        key={progress}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {progress}%
                      </motion.span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 50%, #2563eb 100%)", backgroundSize: "200% 100%" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%`, backgroundPosition: ["0% 0%", "200% 0%"] }}
                        transition={{ width: { duration: 0.5 }, backgroundPosition: { repeat: Infinity, duration: 2, ease: "linear" } }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                    <motion.div 
                      className="flex items-center gap-3"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Store className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="font-medium text-sm line-clamp-1 text-foreground">{pharmacyName.split(' - ')[0]}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="font-medium text-sm line-clamp-1 text-foreground">{deliveryAddress.split(',')[0]}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {currentStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="glass-card rounded-2xl p-5"
                  >
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Truck className="w-5 h-5 text-primary" />
                      </motion.div>
                      Delivery Partner
                    </h3>
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <img 
                          src={rider.image} 
                          alt={rider.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{rider.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ⭐ {rider.rating} • {rider.deliveries} deliveries
                        </p>
                        <p className="text-xs text-muted-foreground">{rider.vehicle}</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-white">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-white">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {currentStep === 6 && isCOD && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30 overflow-hidden"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <Fingerprint className="w-5 h-5 text-primary" />
                            </motion.div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">Verification OTP</p>
                              <motion.p 
                                className="text-2xl font-bold text-primary tracking-widest"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                1234
                              </motion.p>
                              <p className="text-xs text-muted-foreground">Share this OTP with rider at delivery</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="lg:col-span-2 space-y-6"
            >
              <motion.div 
                className="glass-card rounded-2xl p-5"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="font-bold mb-4 text-foreground">Order Progress</h3>
                <div className="space-y-1">
                  {trackingSteps.map((step, i) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const Icon = step.icon;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className="relative flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ 
                              scale: isCurrent ? [1, 1.1, 1] : (isCompleted ? 1 : 0.8),
                            }}
                            transition={{ 
                              scale: isCurrent ? { repeat: Infinity, duration: 1.5 } : { duration: 0.3 }
                            }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 ${
                              isCompleted || isCurrent
                                ? step.id === maxStep && isCompleted 
                                  ? "bg-gradient-to-br from-green-500 to-emerald-500"
                                  : "bg-gradient-to-br from-primary to-accent"
                                : "bg-muted border border-border"
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isCompleted || isCurrent ? "text-white" : "text-muted-foreground"}`} />
                          </motion.div>
                          {i < trackingSteps.length - 1 && (
                            <motion.div 
                              className={`w-0.5 h-6 ${isCompleted ? "bg-primary" : "bg-border"}`}
                              initial={{ height: 0 }}
                              animate={{ height: 24 }}
                              transition={{ delay: i * 0.08 + 0.2 }}
                            />
                          )}
                        </div>
                        <div className="flex-1 pt-2 pb-2">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium text-sm ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</p>
                            {(isCompleted || isCurrent) && step.time && (
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-muted-foreground"
                              >
                                {step.time}
                              </motion.span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          {isCurrent && step.id === 2 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="ai-thinking mt-2 rounded-lg px-3 py-1.5 text-xs text-accent flex items-center gap-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                              >
                                <Sparkles className="w-3 h-3" />
                              </motion.div>
                              AI analyzing pharmacies...
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div 
                className="glass-card rounded-2xl p-5"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="font-bold mb-4 text-foreground">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {orderItems.length > 0 ? (
                    orderItems.map((item, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.brand} × {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-foreground">₹{item.price * item.quantity}</span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No order data available
                    </div>
                  )}
                </div>
                {orderItems.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="text-foreground">₹{deliveryFee}</span>
                    </div>
                    <motion.div 
                      className="flex justify-between font-bold text-lg pt-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹{total}</span>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              <Link href="/order">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full btn-primary-gradient font-bold py-5">
                    Order More Medicines <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVerificationPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
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
                  <motion.input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(i, e.target.value)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    whileFocus={{ scale: 1.05, borderColor: "hsl(var(--primary))" }}
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.join("").length < 4 || verifying}
                  className="w-full btn-primary-gradient font-bold py-6"
                >
                  {verifying ? (
                    <>
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Verify & Receive Order
                    </>
                  )}
                </Button>
              </motion.div>

              <p className="text-xs text-muted-foreground mt-4">
                OTP ensures your order is delivered to the right person
              </p>
            </motion.div>
          </motion.div>
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
              initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.3, opacity: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 15 }}
              className="glass-card rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              <button
                onClick={() => setShowDeliveredPopup(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                className="relative"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: Math.cos(i * 45 * Math.PI / 180) * 80,
                      y: Math.sin(i * 45 * Math.PI / 180) * 80,
                    }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                    className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: ['#22c55e', '#60a5fa', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6', '#f97316'][i],
                      marginLeft: -6,
                      marginTop: -6,
                    }}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.8, repeat: 2 }}
                  className="absolute inset-0 w-24 h-24 rounded-full bg-green-500 mx-auto"
                />
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 relative">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <PartyPopper className="w-12 h-12 text-white" />
                  </motion.div>
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

                <motion.div 
                  className="glass-card rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-muted-foreground mb-3">Rate your delivery experience</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + star * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.3, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        className="text-primary"
                      >
                        <Star className={`w-8 h-8 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"}`} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={() => setShowDeliveredPopup(false)}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white py-5 font-medium"
                    >
                      Close
                    </Button>
                  </motion.div>
                  <Link href="/order" className="flex-1">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full btn-primary-gradient font-bold py-5">
                        Order Again
                      </Button>
                    </motion.div>
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
        <motion.div 
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
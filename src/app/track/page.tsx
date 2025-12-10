"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pill, MapPin, Phone, Clock, Package, Truck, Store, 
  CheckCircle2, ChevronRight, User, Navigation, MessageSquare,
  Brain, Sparkles, Shield, Zap
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const orderDetails = {
  orderId: "MR12345678",
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
  },
};

const trackingSteps = [
  { id: 1, title: "Order Placed", description: "Your order has been received", icon: Package, time: "2:30 PM" },
  { id: 2, title: "AI Pharmacy Selection", description: "Finding nearest pharmacy with stock", icon: Brain, time: "2:31 PM" },
  { id: 3, title: "Order Confirmed", description: "Pharmacy has confirmed your order", icon: CheckCircle2, time: "2:32 PM" },
  { id: 4, title: "Preparing Order", description: "Pharmacy is preparing your medicines", icon: Store, time: "2:35 PM" },
  { id: 5, title: "Out for Delivery", description: "Rider is on the way", icon: Truck, time: "2:38 PM" },
  { id: 6, title: "Delivered", description: "Order has been delivered", icon: CheckCircle2, time: "" },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [riderLocation, setRiderLocation] = useState({ x: 20, y: 80 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 5) return prev + 1;
        return prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressMap: Record<number, number> = { 1: 5, 2: 20, 3: 40, 4: 60, 5: 85, 6: 100 };
    setProgress(progressMap[currentStep] || 0);

    if (currentStep >= 5) {
      const riderInterval = setInterval(() => {
        setRiderLocation(prev => ({
          x: Math.min(prev.x + 2, 80),
          y: Math.max(prev.y - 1.5, 30),
        }));
      }, 200);
      return () => clearInterval(riderInterval);
    }
  }, [currentStep]);

  const subtotal = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + orderDetails.delivery.fee;
  const orderId = searchParams.get("orderId") || orderDetails.orderId;

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Pill className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold gradient-text">MedRush</span>
          </Link>
          <Link href="/order">
            <Button className="bg-gradient-to-r from-primary to-emerald-400 text-background font-semibold">
              Order More
            </Button>
          </Link>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Track Your Order</h1>
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
                <div className="h-56 bg-gradient-to-br from-card to-secondary relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px'
                    }} />
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                      d="M 15 85 Q 30 70, 45 65 T 75 40 T 85 25"
                      stroke="url(#routeGradient)"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <motion.div
                    className="absolute bottom-4 left-4 bg-accent/90 backdrop-blur-sm px-3 py-2 rounded-xl"
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
                    className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-2 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-background" />
                      <span className="text-xs text-background font-medium">Your Location</span>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {currentStep >= 5 && (
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
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                            <Truck className="w-5 h-5 text-background" />
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
                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full progress-bar-animated rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Store className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="font-medium text-sm line-clamp-1">{orderDetails.pharmacy.name.split(' - ')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="font-medium text-sm line-clamp-1">{orderDetails.delivery.address.split(',')[0]}</p>
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
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Delivery Partner
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <User className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{orderDetails.rider.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {orderDetails.rider.rating} • {orderDetails.rider.deliveries} deliveries
                      </p>
                      <p className="text-xs text-muted-foreground">{orderDetails.rider.vehicle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
                <h3 className="font-bold mb-4">Order Progress</h3>
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
                                ? "bg-gradient-to-br from-primary to-emerald-400"
                                : "bg-card border border-border/50"
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isCompleted || isCurrent ? "text-background" : "text-muted-foreground"}`} />
                          </motion.div>
                          {i < trackingSteps.length - 1 && (
                            <div className={`w-0.5 h-8 ${isCompleted ? "bg-primary" : "bg-border/50"}`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2 pb-3">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium text-sm ${isCurrent ? "text-primary" : ""}`}>{step.title}</p>
                            {(isCompleted || isCurrent) && step.time && (
                              <span className="text-xs text-muted-foreground">{step.time}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          {isCurrent && step.id === 2 && (
                            <div className="ai-thinking mt-2 rounded-lg px-3 py-1.5 text-xs text-cyan-400 flex items-center gap-2">
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
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {orderDetails.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>₹{orderDetails.delivery.fee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>
              </div>

              <Link href="/order">
                <Button className="w-full bg-gradient-to-r from-primary to-emerald-400 text-background font-bold py-5">
                  Order More Medicines <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
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

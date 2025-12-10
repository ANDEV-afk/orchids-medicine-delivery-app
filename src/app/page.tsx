"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Pill, Truck, Clock, Shield, Store, ChevronRight, Search, MapPin, 
  Star, Zap, Brain, BadgeCheck, TrendingUp, Users, Package
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPharmaciesWithDistances, type Pharmacy, subscribeToPharmacies } from "@/lib/pharmacy-store";

const stats = [
  { value: "500+", label: "Partner Pharmacies", icon: Store },
  { value: "50K+", label: "Deliveries Done", icon: Package },
  { value: "12 min", label: "Avg Delivery Time", icon: Clock },
  { value: "4.9", label: "Customer Rating", icon: Star },
];

const features = [
  { icon: Brain, title: "AI-Powered Selection", desc: "Smart algorithm finds the nearest pharmacy with your medicines in stock" },
  { icon: Clock, title: "12-Minute Delivery", desc: "Get medicines delivered faster than any other platform" },
  { icon: Shield, title: "Verified Pharmacies", desc: "All partners are licensed and verified by our team" },
  { icon: TrendingUp, title: "Best Prices", desc: "Compare prices and save up to 40% on medicines" },
];

const userLocation = { lat: 28.6139, lng: 77.2090 };

export default function Home() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPharmacies = () => {
      const pharmaciesWithDistance = getPharmaciesWithDistances(userLocation.lat, userLocation.lng);
      setPharmacies(pharmaciesWithDistance.slice(0, 6));
    };
    loadPharmacies();
    const unsubscribe = subscribeToPharmacies(loadPharmacies);
    return () => unsubscribe();
  }, []);

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
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/order" className="text-muted-foreground hover:text-foreground transition-colors">Order Medicine</Link>
            <Link href="/track" className="text-muted-foreground hover:text-foreground transition-colors">Track Order</Link>
            <Link href="/pharmacy/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">Partner with Us</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/pharmacy/onboarding">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hidden sm:flex">
                <Store className="w-4 h-4 mr-2" />
                For Pharmacies
              </Button>
            </Link>
            <Link href="/order">
              <Button className="bg-gradient-to-r from-primary to-emerald-400 hover:opacity-90 text-background font-semibold">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 mb-8"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Smart Inventory System</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Medicine Delivery{" "}
              <span className="gradient-text">Reimagined</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Our AI finds the nearest pharmacy with your medicines in stock. 
              Order, track, and receive in under 15 minutes.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search medicines, vitamins, health products..." 
                  className="pl-12 pr-4 py-6 text-lg bg-card/50 border-border/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href="/order">
                <Button size="lg" className="px-10 py-6 bg-gradient-to-r from-primary to-emerald-400 hover:opacity-90 text-background font-bold rounded-2xl text-lg">
                  Get Started <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="gradient-text">MedRush</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most advanced medicine delivery platform powered by AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 card-hover group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-5 group-hover:glow-primary transition-all">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Partner Pharmacies</h2>
              <p className="text-muted-foreground">
                {pharmacies.length}+ verified pharmacies in Delhi NCR
              </p>
            </div>
            <Link href="/order">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pharmacies.map((pharmacy, i) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden card-hover group cursor-pointer"
              >
                <div className="h-36 overflow-hidden relative">
                  <img 
                    src={pharmacy.image} 
                    alt={pharmacy.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  {!pharmacy.isVerified && (
                    <span className="absolute top-3 right-3 new-badge text-xs px-2.5 py-1 rounded-full text-white font-medium">
                      NEW
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold line-clamp-1">{pharmacy.name}</h3>
                        {pharmacy.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{pharmacy.area}, {pharmacy.city}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg shrink-0">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="text-sm font-semibold text-primary">{pharmacy.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      {pharmacy.distance}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-accent" />
                      {pharmacy.deliveryTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      ₹{pharmacy.deliveryFee}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-medium">Grow your business 40%</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Own a Pharmacy?</h2>
                <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
                  Join our network of 500+ pharmacies in Delhi NCR. Get access to thousands of customers, 
                  smart inventory management, and daily settlements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/pharmacy/onboarding">
                    <Button size="lg" className="px-10 py-6 bg-gradient-to-r from-primary to-emerald-400 hover:opacity-90 text-background font-bold rounded-2xl">
                      Partner with Us <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/pharmacy/dashboard">
                    <Button size="lg" variant="outline" className="px-8 py-6 border-primary/50 text-primary hover:bg-primary/10 rounded-2xl">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary float-animation">
                <Store className="w-16 h-16 md:w-24 md:h-24 text-background" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Pill className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold gradient-text">MedRush</span>
            </div>
            <div className="flex items-center gap-8 text-muted-foreground">
              <Link href="/order" className="hover:text-foreground transition-colors">Order</Link>
              <Link href="/track" className="hover:text-foreground transition-colors">Track</Link>
              <Link href="/pharmacy/onboarding" className="hover:text-foreground transition-colors">Partner</Link>
              <Link href="/pharmacy/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            </div>
            <p className="text-muted-foreground text-sm">© 2024 MedRush. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

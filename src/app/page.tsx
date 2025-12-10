"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  Truck, Clock, Shield, Store, ChevronRight, Search, MapPin, 
  Star, Zap, Brain, BadgeCheck, TrendingUp, Package, Plus, Heart,
  Sparkles, Rocket, Users, Award, ShoppingCart, Check
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DoseuppLogo } from "@/components/DoseuppLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getPharmaciesWithDistances, type Pharmacy, subscribeToPharmacies } from "@/lib/pharmacy-store";
import { getFeaturedMedicines, type Medicine, medicines } from "@/lib/medicines-store";

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

const trustedBy = [
  "Apollo Pharmacy", "MedPlus", "Fortis", "Max Healthcare", "Wellness Forever",
  "NetMeds", "PharmEasy", "1mg", "Guardian", "LifeCare"
];

const userLocation = { lat: 28.6139, lng: 77.2090 };

function MarqueeSection() {
  return (
    <div className="py-8 border-y border-border bg-card/50">
      <div className="marquee-container">
        <div className="marquee-content">
          {[...trustedBy, ...trustedBy].map((brand, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="text-muted-foreground font-medium whitespace-nowrap">{brand}</span>
              <Sparkles className="w-4 h-4 text-primary/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MobilePhoneAnimation() {
  const [currentMedicine, setCurrentMedicine] = useState(0);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const demoMedicines = medicines.slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMedicine(prev => {
        const next = (prev + 1) % demoMedicines.length;
        setCartItems(items => [...items, demoMedicines[next].id]);
        setShowAddedToast(true);
        setTimeout(() => setShowAddedToast(false), 1500);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-[280px] h-[560px]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] blur-2xl" />
      <div className="relative w-full h-full bg-card border-4 border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="h-8 bg-card border-b border-border flex items-center justify-center">
          <div className="w-20 h-5 bg-muted rounded-full" />
        </div>
        
        <div className="p-3 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-foreground">Doseupp</span>
          </div>
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            <AnimatePresence>
              {cartItems.length > 0 && (
                <motion.span 
                  key={cartItems.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-3 space-y-3 bg-background h-[calc(100%-6rem)] overflow-hidden">
          <div className="bg-muted rounded-lg p-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search medicines...</span>
          </div>

          <div className="space-y-2">
            {demoMedicines.map((med, index) => (
              <motion.div
                key={med.id}
                animate={{
                  scale: currentMedicine === index ? 1.02 : 1,
                  borderColor: currentMedicine === index ? "hsl(var(--primary))" : "hsl(var(--border))"
                }}
                className="bg-card rounded-xl p-2 border-2 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground">{med.brand}</p>
                    <p className="text-xs font-semibold text-foreground truncate">{med.name}</p>
                    <p className="text-xs font-bold text-primary">₹{med.price}</p>
                  </div>
                  <motion.button
                    animate={{
                      backgroundColor: cartItems.includes(med.id) ? "hsl(var(--primary))" : "hsl(var(--muted))"
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                  >
                    {cartItems.includes(med.id) ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showAddedToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-20 left-3 right-3 bg-primary text-white p-3 rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span className="text-xs font-medium">Added to cart!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 left-3 right-3">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-gradient-to-r from-primary to-accent text-white p-3 rounded-xl text-center"
          >
            <span className="text-xs font-bold">Checkout • ₹{cartItems.reduce((sum, id) => sum + (medicines.find(m => m.id === id)?.price || 0), 0)}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    const loadPharmacies = () => {
      const pharmaciesWithDistance = getPharmaciesWithDistances(userLocation.lat, userLocation.lng);
      setPharmacies(pharmaciesWithDistance.slice(0, 6));
    };
    loadPharmacies();
    setFeaturedMedicines(getFeaturedMedicines());
    const unsubscribe = subscribeToPharmacies(loadPharmacies);
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <DoseuppLogo size="md" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/order" className="text-muted-foreground hover:text-primary transition-colors font-medium">Order Medicine</Link>
            <Link href="/track" className="text-muted-foreground hover:text-primary transition-colors font-medium">Track Order</Link>
            <Link href="/pharmacy/onboarding" className="text-muted-foreground hover:text-primary transition-colors font-medium">Partner with Us</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/pharmacy/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary hidden sm:flex font-medium">
                Login
              </Button>
            </Link>
            <Link href="/pharmacy/onboarding">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white hidden sm:flex font-medium">
                <Store className="w-4 h-4 mr-2" />
                For Pharmacies
              </Button>
            </Link>
            <Link href="/order">
              <Button className="btn-primary-gradient font-semibold px-6">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 mb-8"
              >
                <Rocket className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Ultrafast Medicine Delivery in Delhi NCR</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-foreground">
                Your Health,{" "}
                <span className="gradient-text">Delivered Fast</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                AI-powered medicine delivery in under 12 minutes. 
                From prescription to doorstep, we&apos;ve got you covered.
              </p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search medicines, vitamins..." 
                    className="pl-12 pr-4 py-6 text-lg bg-card border-border rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link href="/order">
                  <Button size="lg" className="px-10 py-6 btn-primary-gradient font-bold rounded-2xl text-lg">
                    Get Started <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <MobilePhoneAnimation />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
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
      </motion.section>

      <MarqueeSection />

      <AnimatedSection className="py-20 px-6 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Featured Medicines</h2>
              <p className="text-muted-foreground">
                Top selling medicines at the best prices
              </p>
            </div>
            <Link href="/order">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-medium">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredMedicines.map((medicine, i) => {
              const discount = Math.round((1 - medicine.price / medicine.originalPrice) * 100);
              return (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="medicine-card rounded-2xl overflow-hidden group"
                >
                  <div className="relative h-32 bg-gradient-to-br from-secondary/50 to-card overflow-hidden">
                    <img 
                      src={medicine.image} 
                      alt={medicine.name}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-accent text-white border-0 font-bold">
                        {discount}% OFF
                      </Badge>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4 text-primary" />
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{medicine.brand}</p>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-1 text-foreground">{medicine.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-primary">₹{medicine.price}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{medicine.originalPrice}</span>
                    </div>
                    <Link href="/order">
                      <Button
                        className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add to Cart
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Why Choose <span className="gradient-text">Doseupp</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most advanced medicine delivery platform powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card rounded-2xl p-6 card-hover group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-5 group-hover:glow-primary transition-all">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-6 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Partner Pharmacies</h2>
              <p className="text-muted-foreground">
                {pharmacies.length}+ verified pharmacies in Delhi NCR
              </p>
            </div>
            <Link href="/order">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-medium">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pharmacies.map((pharmacy, i) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card rounded-2xl overflow-hidden card-hover group cursor-pointer"
              >
                <div className="h-36 overflow-hidden relative">
                  <img 
                    src={pharmacy.image} 
                    alt={pharmacy.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
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
                        <h3 className="font-bold line-clamp-1 text-foreground">{pharmacy.name}</h3>
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
                      <span className="text-foreground font-medium">{pharmacy.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-foreground font-medium">{pharmacy.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">₹{pharmacy.deliveryFee}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-medium">Grow your business 40%</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Own a Pharmacy?</h2>
                <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
                  Join our network of 500+ pharmacies in Delhi NCR. Get access to thousands of customers, 
                  smart inventory management, and daily settlements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/pharmacy/onboarding">
                    <Button size="lg" className="px-10 py-6 btn-primary-gradient font-bold rounded-2xl">
                      Partner with Us <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/pharmacy/dashboard">
                    <Button size="lg" variant="outline" className="px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-medium">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
              >
                <Store className="w-16 h-16 md:w-24 md:h-24 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      <footer className="py-12 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <DoseuppLogo size="md" />
            <div className="flex items-center gap-8 text-muted-foreground">
              <Link href="/order" className="hover:text-primary transition-colors font-medium">Order</Link>
              <Link href="/track" className="hover:text-primary transition-colors font-medium">Track</Link>
              <Link href="/pharmacy/onboarding" className="hover:text-primary transition-colors font-medium">Partner</Link>
              <Link href="/pharmacy/dashboard" className="hover:text-primary transition-colors font-medium">Dashboard</Link>
            </div>
            <p className="text-muted-foreground text-sm">© 2024 Doseupp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
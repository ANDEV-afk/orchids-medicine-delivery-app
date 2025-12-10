"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, Clock, Plus, Minus, ShoppingCart, 
  Pill, ChevronRight, X, SlidersHorizontal, Truck,
  CreditCard, Banknote, Check, Package, Sparkles, Brain,
  CheckCircle, AlertCircle, Navigation, Zap, Shield, BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPharmaciesWithDistances, findNearestPharmacyWithStock, type Pharmacy, subscribeToPharmacies } from "@/lib/pharmacy-store";

const categories = [
  { name: "All", icon: "💊" },
  { name: "Pain Relief", icon: "🩹" },
  { name: "Antibiotics", icon: "💉" },
  { name: "Vitamins", icon: "🍊" },
  { name: "Cold & Flu", icon: "🤧" },
  { name: "Diabetes", icon: "🩺" },
  { name: "Heart Care", icon: "❤️" },
  { name: "Skin Care", icon: "✨" },
];

const medicines = [
  { id: 1, name: "Paracetamol 500mg", brand: "Crocin", category: "Pain Relief", price: 25, originalPrice: 35, stock: 50, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200" },
  { id: 2, name: "Azithromycin 500mg", brand: "Azithral", category: "Antibiotics", price: 120, originalPrice: 150, stock: 25, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200" },
  { id: 3, name: "Vitamin D3 60000IU", brand: "Drise", category: "Vitamins", price: 85, originalPrice: 100, stock: 100, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200" },
  { id: 4, name: "Cetirizine 10mg", brand: "Cetcip", category: "Cold & Flu", price: 35, originalPrice: 45, stock: 80, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200" },
  { id: 5, name: "Metformin 500mg", brand: "Glycomet", category: "Diabetes", price: 45, originalPrice: 55, stock: 60, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200" },
  { id: 6, name: "Aspirin 75mg", brand: "Ecosprin", category: "Heart Care", price: 30, originalPrice: 40, stock: 90, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200" },
  { id: 7, name: "Multivitamin Tablets", brand: "Supradyn", category: "Vitamins", price: 145, originalPrice: 180, stock: 45, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200" },
  { id: 8, name: "Omeprazole 20mg", brand: "Pan", category: "Pain Relief", price: 55, originalPrice: 70, stock: 70, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200" },
];

type CartItem = {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
};

type OrderStatus = "idle" | "processing" | "pharmacy_selected" | "confirmed" | "preparing" | "out_for_delivery";

const userLocation = { lat: 28.6139, lng: 77.2090, address: "Connaught Place, New Delhi" };

export default function OrderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [aiSelecting, setAiSelecting] = useState(false);
  const [showAllPharmacies, setShowAllPharmacies] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const loadPharmacies = () => {
      const pharmaciesWithDistance = getPharmaciesWithDistances(userLocation.lat, userLocation.lng);
      setPharmacies(pharmaciesWithDistance);
      if (pharmaciesWithDistance.length > 0 && !selectedPharmacy) {
        setSelectedPharmacy(pharmaciesWithDistance[0]);
      }
    };
    loadPharmacies();
    const unsubscribe = subscribeToPharmacies(loadPharmacies);
    return () => unsubscribe();
  }, []);

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: typeof medicines[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: medicine.id, name: medicine.name, brand: medicine.brand, price: medicine.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const getItemQuantity = (id: number) => {
    return cart.find(item => item.id === id)?.quantity || 0;
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAISelectPharmacy = async () => {
    setAiSelecting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const medicineIds = cart.map(item => item.id);
    const nearest = findNearestPharmacyWithStock(userLocation.lat, userLocation.lng, medicineIds);
    
    if (nearest) {
      setSelectedPharmacy(nearest);
    }
    setAiSelecting(false);
  };

  const handlePlaceOrder = async () => {
    setOrderStatus("processing");
    setOrderId(`MR${Date.now().toString().slice(-8)}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOrderStatus("pharmacy_selected");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOrderStatus("confirmed");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOrderStatus("preparing");
    
    setCheckoutStep(3);
  };

  const displayedPharmacies = showAllPharmacies ? pharmacies : pharmacies.slice(0, 6);

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
          
          <div className="relative flex-1 max-w-xl mx-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search medicines, brands..." 
              className="pl-12 bg-card/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-gradient-to-r from-primary to-emerald-400 text-background font-semibold hover:opacity-90"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </Button>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide"
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.name 
                    ? "bg-gradient-to-r from-primary to-emerald-400 text-background font-semibold shadow-lg glow-primary" 
                    : "bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-card"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="text-sm">📍 <span className="font-semibold">{userLocation.address}</span></span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border/50 hover:border-primary/50"
              onClick={() => setShowAllPharmacies(!showAllPharmacies)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showAllPharmacies ? "Show Less" : "View All Pharmacies"}
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">Partner Pharmacies</h2>
                <Badge className="bg-primary/20 text-primary border-0">{pharmacies.length} in Delhi NCR</Badge>
              </div>
              {cart.length > 0 && (
                <Button
                  onClick={handleAISelectPharmacy}
                  disabled={aiSelecting}
                  className="bg-gradient-to-r from-cyan-500 to-primary text-background font-semibold"
                >
                  {aiSelecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Smart Select Pharmacy
                    </>
                  )}
                </Button>
              )}
            </div>

            {aiSelecting && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="ai-thinking rounded-2xl p-4 mb-4 border border-cyan-500/30"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <div>
                    <p className="font-semibold text-cyan-400">AI Smart Selection</p>
                    <p className="text-sm text-muted-foreground">Analyzing stock availability, distance, and delivery times...</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {displayedPharmacies.map((pharmacy, index) => (
                  <motion.div
                    key={pharmacy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    className={`glass-card rounded-2xl p-4 cursor-pointer transition-all card-hover ${
                      selectedPharmacy?.id === pharmacy.id 
                        ? "border-primary glow-primary" 
                        : "hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold line-clamp-1">{pharmacy.name}</h3>
                          {pharmacy.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                          )}
                          {!pharmacy.isVerified && (
                            <span className="new-badge text-xs px-2 py-0.5 rounded-full text-white">NEW</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{pharmacy.area}, {pharmacy.city}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span className="text-sm font-semibold text-primary">{pharmacy.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {pharmacy.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent" /> {pharmacy.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> ₹{pharmacy.deliveryFee}
                      </span>
                    </div>
                    {selectedPharmacy?.id === pharmacy.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 text-primary text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Selected for delivery
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {pharmacies.length > 6 && !showAllPharmacies && (
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-primary hover:bg-primary/10"
                onClick={() => setShowAllPharmacies(true)}
              >
                View all {pharmacies.length} pharmacies <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4">Medicines</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedicines.map((medicine, index) => {
                const quantity = getItemQuantity(medicine.id);
                const discount = Math.round((1 - medicine.price / medicine.originalPrice) * 100);
                
                return (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl overflow-hidden group card-hover"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-secondary to-card overflow-hidden">
                      <img 
                        src={medicine.image} 
                        alt={medicine.name}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                      />
                      {discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-accent text-white border-0 font-bold">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{medicine.brand}</p>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-1">{medicine.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">₹{medicine.price}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{medicine.originalPrice}</span>
                      </div>
                      
                      {quantity === 0 ? (
                        <Button
                          onClick={() => addToCart(medicine)}
                          className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-background transition-all font-semibold"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add to Cart
                        </Button>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-between bg-primary rounded-xl p-1"
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(medicine.id)}
                            className="h-8 w-8 p-0 text-background hover:bg-white/20"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold text-background">{quantity}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addToCart(medicine)}
                            className="h-8 w-8 p-0 text-background hover:bg-white/20"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => { setIsCartOpen(false); setCheckoutStep(0); setOrderStatus("idle"); }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-full max-w-md glass-card z-50 flex flex-col"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {checkoutStep === 0 && "Your Cart"}
                    {checkoutStep === 1 && "Delivery Address"}
                    {checkoutStep === 2 && "Payment"}
                    {checkoutStep === 3 && "Order Tracking"}
                  </h2>
                  {checkoutStep === 0 && cart.length > 0 && (
                    <p className="text-sm text-muted-foreground">{cartCount} items</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setIsCartOpen(false); setCheckoutStep(0); setOrderStatus("idle"); }}
                  className="hover:bg-card"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-6">
                {checkoutStep === 0 && (
                  <>
                    {cart.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-4">Your cart is empty</p>
                        <Button 
                          onClick={() => setIsCartOpen(false)}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-background"
                        >
                          Start Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPharmacy && (
                          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-primary" />
                              <span className="text-sm font-semibold text-primary">Delivering from</span>
                            </div>
                            <p className="font-semibold">{selectedPharmacy.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedPharmacy.distance} away • {selectedPharmacy.deliveryTime}</p>
                          </div>
                        )}
                        
                        {cart.map((item) => (
                          <motion.div 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-4 p-4 bg-card rounded-xl"
                          >
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">{item.brand}</p>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-primary font-bold">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="h-7 w-7 p-0 hover:bg-card"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center font-bold">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addToCart(medicines.find(m => m.id === item.id)!)}
                                className="h-7 w-7 p-0 hover:bg-card"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold">Home</p>
                          <p className="text-sm text-muted-foreground">
                            {userLocation.address}, New Delhi - 110001
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-semibold">Office</p>
                          <p className="text-sm text-muted-foreground">
                            Cyber Hub, DLF Phase 2, Gurgaon - 122002
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10">
                      <Plus className="w-4 h-4 mr-2" /> Add New Address
                    </Button>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-4">
                    {orderStatus !== "idle" ? (
                      <div className="space-y-4">
                        <div className="text-center py-4">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                          </div>
                          <h3 className="text-lg font-bold mb-2">Processing Order</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className={`flex items-center gap-3 p-3 rounded-xl ${orderStatus !== "idle" ? "bg-primary/10" : "bg-card"}`}>
                            {orderStatus === "processing" ? (
                              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                            <span className={orderStatus !== "idle" ? "text-primary font-medium" : ""}>Placing order...</span>
                          </div>
                          
                          <div className={`flex items-center gap-3 p-3 rounded-xl ${["pharmacy_selected", "confirmed", "preparing"].includes(orderStatus) ? "bg-primary/10" : "bg-card"}`}>
                            {orderStatus === "pharmacy_selected" ? (
                              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : ["confirmed", "preparing"].includes(orderStatus) ? (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                            )}
                            <span className={["pharmacy_selected", "confirmed", "preparing"].includes(orderStatus) ? "text-primary font-medium" : "text-muted-foreground"}>
                              AI selecting nearest pharmacy...
                            </span>
                          </div>
                          
                          <div className={`flex items-center gap-3 p-3 rounded-xl ${["confirmed", "preparing"].includes(orderStatus) ? "bg-primary/10" : "bg-card"}`}>
                            {orderStatus === "confirmed" ? (
                              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : orderStatus === "preparing" ? (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                            )}
                            <span className={["confirmed", "preparing"].includes(orderStatus) ? "text-primary font-medium" : "text-muted-foreground"}>
                              Confirming with pharmacy...
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          onClick={() => setPaymentMethod("online")}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === "online" 
                              ? "bg-primary/10 border border-primary" 
                              : "bg-card hover:bg-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className={`w-5 h-5 ${paymentMethod === "online" ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="flex-1">
                              <p className="font-semibold">Pay Online</p>
                              <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking</p>
                            </div>
                            {paymentMethod === "online" && <CheckCircle className="w-5 h-5 text-primary" />}
                          </div>
                        </div>
                        <div 
                          onClick={() => setPaymentMethod("cod")}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === "cod" 
                              ? "bg-primary/10 border border-primary" 
                              : "bg-card hover:bg-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Banknote className={`w-5 h-5 ${paymentMethod === "cod" ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="flex-1">
                              <p className="font-semibold">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Pay when you receive</p>
                            </div>
                            {paymentMethod === "cod" && <CheckCircle className="w-5 h-5 text-primary" />}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="text-center py-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center mx-auto mb-4 glow-primary">
                        <Package className="w-10 h-10 text-background" />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">Order Confirmed!</h3>
                      <p className="text-muted-foreground">Order #{orderId}</p>
                    </motion.div>
                    
                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Truck className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Estimated Delivery</p>
                          <p className="text-lg text-primary font-bold">{selectedPharmacy?.deliveryTime || "15 min"}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">From</p>
                            <p className="font-medium">{selectedPharmacy?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">To</p>
                            <p className="font-medium">{userLocation.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link href={`/track?orderId=${orderId}`}>
                      <Button className="w-full bg-gradient-to-r from-primary to-emerald-400 text-background font-bold py-6">
                        Track Order Live <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>

              {checkoutStep < 3 && cart.length > 0 && orderStatus === "idle" && (
                <div className="p-6 border-t border-border/50 bg-card/50">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>₹{selectedPharmacy?.deliveryFee || 25}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50">
                      <span>Total</span>
                      <span className="text-primary">₹{cartTotal + (selectedPharmacy?.deliveryFee || 25)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => checkoutStep < 2 ? setCheckoutStep(checkoutStep + 1) : handlePlaceOrder()}
                    className="w-full bg-gradient-to-r from-primary to-emerald-400 text-background font-bold py-6"
                  >
                    {checkoutStep === 0 && "Proceed to Checkout"}
                    {checkoutStep === 1 && "Continue to Payment"}
                    {checkoutStep === 2 && "Place Order"}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

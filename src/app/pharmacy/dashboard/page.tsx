"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Clock, CheckCircle2, XCircle, 
  DollarSign, ShoppingBag, Users, Settings, Bell, Search,
  ChevronRight, X, Truck, MapPin, Phone, Bike,
  Navigation, Star, User, Plus, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DoseuppLogo } from "@/components/DoseuppLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getPharmacyById, type Pharmacy, updatePharmacyInventory, getPharmacies } from "@/lib/pharmacy-store";
import { medicines } from "@/lib/medicines-store";

const riders = [
  { id: "R001", name: "Rajesh Kumar", phone: "+91 9876543220", status: "available", rating: 4.8, trips: 234, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { id: "R002", name: "Sunil Verma", phone: "+91 9876543221", status: "on_delivery", rating: 4.6, trips: 189, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: "R003", name: "Amit Singh", phone: "+91 9876543222", status: "available", rating: 4.9, trips: 312, image: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop" },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-600", icon: Clock },
  preparing: { label: "Preparing", color: "bg-blue-500/20 text-blue-600", icon: Package },
  ready: { label: "Ready", color: "bg-primary/20 text-primary", icon: CheckCircle2 },
  dispatched: { label: "On the way", color: "bg-accent/20 text-accent", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500/20 text-green-600", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

type Order = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: string;
  time: string;
  address: string;
  phone: string;
  riderId: string | null;
};

function generateOrdersForPharmacy(pharmacyName: string): Order[] {
  const baseOrders = [
    { customer: "Rahul Sharma", items: ["Paracetamol 500mg x2", "Vitamin D3 x1"], total: 135, status: "pending", time: "2 min ago", address: "123, Sector 22, Gurgaon", phone: "+91 9876543210" },
    { customer: "Priya Singh", items: ["Azithromycin 500mg x1"], total: 120, status: "preparing", time: "8 min ago", address: "456, DLF Phase 2, Gurgaon", phone: "+91 9876543211" },
    { customer: "Amit Kumar", items: ["Metformin 500mg x2", "Aspirin 75mg x1"], total: 120, status: "ready", time: "15 min ago", address: "789, Sector 14, Gurgaon", phone: "+91 9876543212" },
    { customer: "Neha Gupta", items: ["Multivitamin x1", "Cetirizine x2"], total: 215, status: "dispatched", time: "25 min ago", address: "321, Cyber City, Gurgaon", phone: "+91 9876543213" },
    { customer: "Vikram Patel", items: ["Omeprazole 20mg x1"], total: 55, status: "delivered", time: "45 min ago", address: "654, Sector 56, Gurgaon", phone: "+91 9876543214" },
  ];
  
  const hash = pharmacyName.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
  const orderCount = 3 + Math.abs(hash % 4);
  
  return baseOrders.slice(0, orderCount).map((order, i) => ({
    ...order,
    id: `DU${Math.abs(hash) + i}`,
    riderId: order.status === "dispatched" || order.status === "ready" ? "R001" : null
  }));
}

export default function PharmacyDashboard() {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Array<{ id: number; type: string; message: string; time: string; read: boolean }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRiderSelect, setShowRiderSelect] = useState(false);
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  useEffect(() => {
    // Use first pharmacy as default demo pharmacy
    const defaultPharmacy = getPharmacies()[0];
    if (defaultPharmacy) {
      setPharmacy(defaultPharmacy);
      setOrders(generateOrdersForPharmacy(defaultPharmacy.name));
      setNotifications([
        { id: 1, type: "order", message: `New order received`, time: "2 min ago", read: false },
        { id: 2, type: "rider", message: "Rajesh Kumar is now available", time: "5 min ago", read: false },
        { id: 3, type: "stock", message: "Some items running low on stock", time: "10 min ago", read: false },
      ]);
    }
  }, []);

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const updateOrderStatus = (orderId: string, newStatus: string, riderId?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, riderId: riderId || order.riderId }
        : order
    ));
    setSelectedOrder(prev => prev ? { ...prev, status: newStatus, riderId: riderId || prev.riderId } : null);
    
    if (newStatus === "dispatched" && riderId) {
      const rider = riders.find(r => r.id === riderId);
      setNotifications(prev => [{
        id: Date.now(),
        type: "rider",
        message: `Order #${orderId} assigned to ${rider?.name}`,
        time: "Just now",
        read: false
      }, ...prev]);
    }
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getRiderForOrder = (riderId: string | null) => {
    if (!riderId) return null;
    return riders.find(r => r.id === riderId);
  };

  const getInventoryItems = () => {
    if (!pharmacy) return [];
    return Object.entries(pharmacy.inventory).map(([medId, stock]) => {
      const medicine = medicines.find(m => m.id === parseInt(medId));
      return {
        id: parseInt(medId),
        name: medicine?.name || "Unknown",
        brand: medicine?.brand || "Unknown",
        stock,
        lowStock: stock < 20
      };
    });
  };

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-background mesh-gradient flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Today's Orders", value: pharmacy.stats?.todayOrders || orders.length, change: "+12%", icon: ShoppingBag },
    { label: "Revenue", value: `₹${(pharmacy.stats?.revenue || 0).toLocaleString()}`, change: "+8%", icon: DollarSign },
    { label: "Pending Orders", value: pharmacy.stats?.pendingOrders || orders.filter(o => o.status === "pending").length, change: "-2", icon: Clock },
    { label: "Customers", value: pharmacy.stats?.customers || 0, change: "+23", icon: Users },
  ];

  const inventoryItems = getInventoryItems();
  const lowStockItems = inventoryItems.filter(i => i.lowStock);

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <DoseuppLogo size="md" />
            <Badge variant="outline" className="ml-2 border-primary text-primary">Pharmacy</Badge>
          </Link>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative text-foreground hover:bg-muted"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                    {unreadNotifications}
                  </span>
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-80 glass-card rounded-xl border border-border shadow-xl z-50"
                  >
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                      <Badge variant="secondary">{unreadNotifications} new</Badge>
                    </div>
                    <ScrollArea className="h-64">
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationRead(notification.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                              notification.read ? "bg-muted/30" : "bg-primary/10"
                            }`}
                          >
                            <p className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
              {pharmacy.name.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back, {pharmacy.name.split(' - ')[0]}!</h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your store today.</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {pharmacy.area}, {pharmacy.city}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {pharmacy.rating} ({pharmacy.reviews} reviews)
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Orders</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-10 w-48 bg-muted border-border text-foreground" />
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-muted mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="preparing">Preparing</TabsTrigger>
                    <TabsTrigger value="ready">Ready</TabsTrigger>
                    <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
                  </TabsList>

                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No orders found
                        </div>
                      ) : (
                        filteredOrders.map((order) => {
                          const status = statusConfig[order.status];
                          const rider = getRiderForOrder(order.riderId);
                          return (
                            <motion.div
                              key={order.id}
                              layout
                              onClick={() => setSelectedOrder(order)}
                              className="p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-foreground">#{order.id}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                                    <status.icon className="w-3 h-3" />
                                    {status.label}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{order.time}</span>
                              </div>
                              <p className="font-medium mb-1 text-foreground">{order.customer}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {order.items.join(", ")}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-semibold text-primary">₹{order.total}</span>
                                {rider && (
                                  <div className="flex items-center gap-2">
                                    <img src={rider.image} alt={rider.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-xs text-muted-foreground">{rider.name}</span>
                                  </div>
                                )}
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </Tabs>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Available Riders</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/30">
                    {riders.filter(r => r.status === "available").length} online
                  </Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {riders.map((rider) => (
                    <div
                      key={rider.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        rider.status === "available" 
                          ? "bg-primary/5 border-primary/30" 
                          : "bg-muted/50 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img src={rider.image} alt={rider.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-foreground">{rider.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            rider.status === "available" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                          }`}>
                            {rider.status === "available" ? "Available" : "On Delivery"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-foreground font-medium">{rider.rating}</span>
                        </div>
                        <span className="text-muted-foreground">{rider.trips} trips</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Inventory</h2>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-primary text-primary"
                    onClick={() => setShowInventoryModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Manage
                  </Button>
                </div>
                {lowStockItems.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">{lowStockItems.length} items low on stock</span>
                  </div>
                )}
                <div className="space-y-3">
                  {inventoryItems.slice(0, 5).map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl ${item.lowStock ? 'bg-destructive/10' : 'bg-muted/50'}`}>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${item.lowStock ? 'text-destructive' : 'text-foreground'}`}>{item.stock} left</p>
                        {item.lowStock && (
                          <Button size="sm" variant="link" className="text-xs text-primary p-0 h-auto">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg. Order Value</span>
                    <span className="font-semibold text-foreground">₹{Math.round((pharmacy.stats?.revenue || 0) / Math.max(pharmacy.stats?.todayOrders || 1, 1))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-primary">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg. Prep Time</span>
                    <span className="font-semibold text-foreground">4.5 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customer Rating</span>
                    <span className="font-semibold text-primary">{pharmacy.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => { setSelectedOrder(null); setShowRiderSelect(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card rounded-3xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Order #{selectedOrder.id}</h2>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(null); setShowRiderSelect(false); }}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedOrder.customer}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.time}</p>
                  </div>
                  <span className={`ml-auto text-xs px-3 py-1 rounded-full ${statusConfig[selectedOrder.status].color}`}>
                    {statusConfig[selectedOrder.status].label}
                  </span>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <p key={i} className="text-sm text-foreground">{item}</p>
                  ))}
                  <div className="pt-2 border-t border-border/50 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{selectedOrder.total}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="font-medium text-foreground">{selectedOrder.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedOrder.phone}</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.riderId && (
                  <div className="p-4 bg-accent/10 rounded-xl">
                    <p className="text-sm font-medium text-accent mb-2">Assigned Rider</p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={getRiderForOrder(selectedOrder.riderId)?.image} 
                        alt="" 
                        className="w-10 h-10 rounded-full" 
                      />
                      <div>
                        <p className="font-semibold text-foreground">{getRiderForOrder(selectedOrder.riderId)?.name}</p>
                        <p className="text-sm text-muted-foreground">{getRiderForOrder(selectedOrder.riderId)?.phone}</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-auto border-accent text-accent">
                        <Phone className="w-4 h-4 mr-1" /> Call
                      </Button>
                    </div>
                  </div>
                )}

                {showRiderSelect && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-muted/50 rounded-xl"
                  >
                    <p className="text-sm font-medium text-foreground mb-3">Select Rider</p>
                    <div className="space-y-2">
                      {riders.filter(r => r.status === "available").map((rider) => (
                        <div
                          key={rider.id}
                          onClick={() => setSelectedRider(rider.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            selectedRider === rider.id 
                              ? "bg-primary/10 border-2 border-primary" 
                              : "bg-card border-2 border-transparent hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={rider.image} alt={rider.name} className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{rider.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                {rider.rating} • {rider.trips} trips
                              </div>
                            </div>
                            {selectedRider === rider.id && (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3">
                {selectedOrder.status === "pending" && (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => updateOrderStatus(selectedOrder.id, "cancelled")}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="flex-1 btn-primary-gradient"
                      onClick={() => updateOrderStatus(selectedOrder.id, "preparing")}
                    >
                      Accept Order
                    </Button>
                  </>
                )}
                {selectedOrder.status === "preparing" && (
                  <Button 
                    className="w-full btn-primary-gradient"
                    onClick={() => updateOrderStatus(selectedOrder.id, "ready")}
                  >
                    Mark as Ready
                  </Button>
                )}
                {selectedOrder.status === "ready" && !showRiderSelect && (
                  <Button 
                    className="w-full btn-primary-gradient"
                    onClick={() => setShowRiderSelect(true)}
                  >
                    <Bike className="w-4 h-4 mr-2" /> Assign Rider
                  </Button>
                )}
                {selectedOrder.status === "ready" && showRiderSelect && (
                  <Button 
                    className="w-full btn-primary-gradient"
                    disabled={!selectedRider}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "dispatched", selectedRider!);
                      setShowRiderSelect(false);
                      setSelectedRider(null);
                    }}
                  >
                    Dispatch Order
                  </Button>
                )}
                {(selectedOrder.status === "dispatched" || selectedOrder.status === "delivered") && (
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    <Navigation className="w-4 h-4 mr-2" /> Track Delivery
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInventoryModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowInventoryModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl glass-card rounded-3xl p-6 z-50 max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Manage Inventory</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowInventoryModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-3 pr-4">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          defaultValue={item.stock}
                          className="w-20 text-center bg-card border-border"
                          onChange={(e) => {
                            if (pharmacy) {
                              updatePharmacyInventory(pharmacy.id, item.id, parseInt(e.target.value) || 0);
                            }
                          }}
                        />
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
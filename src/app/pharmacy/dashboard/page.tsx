"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, Clock, CheckCircle2, XCircle, TrendingUp, 
  DollarSign, ShoppingBag, Users, Settings, Bell, Search,
  ChevronRight, Eye, X, Truck, MapPin, Phone
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DoseuppLogo } from "@/components/DoseuppLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

const stats = [
  { label: "Today's Orders", value: "24", change: "+12%", icon: ShoppingBag, color: "primary" },
  { label: "Revenue", value: "₹15,840", change: "+8%", icon: DollarSign, color: "accent" },
  { label: "Pending Orders", value: "5", change: "-2", icon: Clock, color: "chart-4" },
  { label: "Customers", value: "156", change: "+23", icon: Users, color: "chart-2" },
];

const orders = [
  { 
    id: "MR12345", 
    customer: "Rahul Sharma", 
    items: ["Paracetamol 500mg x2", "Vitamin D3 x1"],
    total: 135,
    status: "pending",
    time: "2 min ago",
    address: "123, Sector 22, Gurgaon",
    phone: "+91 9876543210"
  },
  { 
    id: "MR12344", 
    customer: "Priya Singh", 
    items: ["Azithromycin 500mg x1"],
    total: 120,
    status: "preparing",
    time: "8 min ago",
    address: "456, DLF Phase 2, Gurgaon",
    phone: "+91 9876543211"
  },
  { 
    id: "MR12343", 
    customer: "Amit Kumar", 
    items: ["Metformin 500mg x2", "Aspirin 75mg x1"],
    total: 120,
    status: "ready",
    time: "15 min ago",
    address: "789, Sector 14, Gurgaon",
    phone: "+91 9876543212"
  },
  { 
    id: "MR12342", 
    customer: "Neha Gupta", 
    items: ["Multivitamin x1", "Cetirizine x2"],
    total: 215,
    status: "dispatched",
    time: "25 min ago",
    address: "321, Cyber City, Gurgaon",
    phone: "+91 9876543213"
  },
  { 
    id: "MR12341", 
    customer: "Vikram Patel", 
    items: ["Omeprazole 20mg x1"],
    total: 55,
    status: "delivered",
    time: "45 min ago",
    address: "654, Sector 56, Gurgaon",
    phone: "+91 9876543214"
  },
];

const inventory = [
  { name: "Paracetamol 500mg", brand: "Crocin", stock: 120, lowStock: false },
  { name: "Azithromycin 500mg", brand: "Azithral", stock: 8, lowStock: true },
  { name: "Vitamin D3 60000IU", brand: "Drise", stock: 45, lowStock: false },
  { name: "Cetirizine 10mg", brand: "Cetcip", stock: 5, lowStock: true },
  { name: "Metformin 500mg", brand: "Glycomet", stock: 89, lowStock: false },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-500", icon: Clock },
  preparing: { label: "Preparing", color: "bg-blue-500/20 text-blue-500", icon: Package },
  ready: { label: "Ready", color: "bg-primary/20 text-primary", icon: CheckCircle2 },
  dispatched: { label: "Dispatched", color: "bg-accent/20 text-accent", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500/20 text-green-500", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

export default function PharmacyDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
  };

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
            <Button variant="ghost" size="sm" className="relative text-foreground hover:bg-muted">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">3</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
              M
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back, MedPlus!</h1>
            <p className="text-muted-foreground">Heres whats happening with your store today.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}/20 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
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
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-3xl p-6 bg-white"
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
                      {filteredOrders.map((order) => {
                        const status = statusConfig[order.status];
                        return (
                          <div
                            key={order.id}
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
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </Tabs>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-3xl p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Low Stock Alert</h2>
                  <Badge variant="destructive" className="text-xs">
                    {inventory.filter(i => i.lowStock).length} items
                  </Badge>
                </div>
                <div className="space-y-3">
                  {inventory.filter(i => i.lowStock).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-destructive/10 rounded-xl">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-destructive">{item.stock} left</p>
                        <Button size="sm" variant="link" className="text-xs text-primary p-0 h-auto">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg. Order Value</span>
                    <span className="font-semibold">₹660</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-primary">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg. Prep Time</span>
                    <span className="font-semibold">4.5 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customer Rating</span>
                    <span className="font-semibold text-primary">4.8</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setSelectedOrder(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card rounded-3xl p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Order #{selectedOrder.id}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedOrder.customer}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.time}</p>
                </div>
                <span className={`ml-auto text-xs px-3 py-1 rounded-full ${statusConfig[selectedOrder.status].color}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <p key={i} className="text-sm">{item}</p>
                ))}
                <div className="pt-2 border-t border-border/50 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{selectedOrder.total}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>
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
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-background"
                    onClick={() => updateOrderStatus(selectedOrder.id, "preparing")}
                  >
                    Accept Order
                  </Button>
                </>
              )}
              {selectedOrder.status === "preparing" && (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent text-background"
                  onClick={() => updateOrderStatus(selectedOrder.id, "ready")}
                >
                  Mark as Ready
                </Button>
              )}
              {selectedOrder.status === "ready" && (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent text-background"
                  onClick={() => updateOrderStatus(selectedOrder.id, "dispatched")}
                >
                  Hand to Rider
                </Button>
              )}
              {(selectedOrder.status === "dispatched" || selectedOrder.status === "delivered") && (
                <Button variant="outline" className="w-full border-primary/50 text-primary">
                  <Eye className="w-4 h-4 mr-2" /> Track Delivery
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
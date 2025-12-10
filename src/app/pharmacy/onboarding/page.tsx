"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, Pill, ChevronRight, ChevronLeft, Upload, MapPin, 
  Phone, Mail, Building, FileCheck, Clock, CheckCircle2, User,
  Sparkles, BadgeCheck, Shield, Zap, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { addPharmacy } from "@/lib/pharmacy-store";

const steps = [
  { id: 1, title: "Basic Info", icon: Store },
  { id: 2, title: "Contact", icon: Phone },
  { id: 3, title: "Documents", icon: FileCheck },
  { id: 4, title: "Operations", icon: Clock },
];

const benefits = [
  { icon: TrendingUp, title: "Grow Revenue", desc: "Increase sales by 40%" },
  { icon: Zap, title: "Quick Onboarding", desc: "Go live in 24 hours" },
  { icon: Shield, title: "Secure Payments", desc: "Daily settlements" },
];

const delhiAreas = [
  "Connaught Place", "Karol Bagh", "Saket", "Dwarka", "Rohini", 
  "Lajpat Nagar", "Greater Kailash", "Vasant Kunj", "Patparganj",
  "Rajouri Garden", "Pitampura", "Janakpuri", "Nehru Place", "Defence Colony"
];

export default function PharmacyOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pharmacyName: "",
    ownerName: "",
    licenseNumber: "",
    gstNumber: "",
    address: "",
    area: "",
    city: "New Delhi",
    pincode: "",
    phone: "",
    email: "",
    drugLicense: null as File | null,
    gstCertificate: null as File | null,
    pharmacistLicense: null as File | null,
    openTime: "09:00",
    closeTime: "21:00",
    acceptCOD: true,
    acceptOnline: true,
    deliveryRadius: "5",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const areaCoords: { [key: string]: { lat: number; lng: number } } = {
        "Connaught Place": { lat: 28.6315, lng: 77.2167 },
        "Karol Bagh": { lat: 28.6519, lng: 77.1900 },
        "Saket": { lat: 28.5280, lng: 77.2190 },
        "Dwarka": { lat: 28.5921, lng: 77.0460 },
        "Rohini": { lat: 28.7419, lng: 77.1210 },
        "Lajpat Nagar": { lat: 28.5672, lng: 77.2410 },
        "Greater Kailash": { lat: 28.5505, lng: 77.2340 },
        "Vasant Kunj": { lat: 28.5208, lng: 77.1530 },
        "Patparganj": { lat: 28.6229, lng: 77.3090 },
        "Rajouri Garden": { lat: 28.6469, lng: 77.1211 },
        "Pitampura": { lat: 28.7029, lng: 77.1328 },
        "Janakpuri": { lat: 28.6219, lng: 77.0878 },
        "Nehru Place": { lat: 28.5494, lng: 77.2529 },
        "Defence Colony": { lat: 28.5743, lng: 77.2315 },
      };

      const coords = areaCoords[formData.area] || { lat: 28.6139, lng: 77.2090 };

      addPharmacy({
        name: formData.pharmacyName,
        ownerName: formData.ownerName,
        address: formData.address,
        area: formData.area,
        city: formData.city,
        pincode: formData.pincode,
        lat: coords.lat + (Math.random() - 0.5) * 0.01,
        lng: coords.lng + (Math.random() - 0.5) * 0.01,
        phone: formData.phone,
        email: formData.email,
        deliveryFee: 20,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        isOpen: true,
        image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background mesh-gradient flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-10 text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center mx-auto mb-6 glow-primary"
          >
            <CheckCircle2 className="w-12 h-12 text-background" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome to MedRush!</h1>
            <p className="text-primary font-semibold mb-4">{formData.pharmacyName}</p>
            <p className="text-muted-foreground mb-8">
              Your pharmacy is now visible to customers in {formData.area}. 
              Start receiving orders immediately!
            </p>
            <div className="glass-card rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <BadgeCheck className="w-5 h-5 text-accent" />
                <span className="text-sm">Pending verification (1-2 business days)</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm">Your pharmacy is now live for customers</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/order">
                <Button className="w-full bg-gradient-to-r from-primary to-emerald-400 text-background font-bold py-6">
                  View Your Pharmacy Live
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pharmacy/dashboard">
                <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 py-6">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Join 500+ Delhi NCR Pharmacies</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Partner with <span className="gradient-text">MedRush</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reach thousands of customers, increase your revenue, and grow your pharmacy business
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4 mb-12"
          >
            {benefits.map((benefit, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="flex items-center justify-between mb-10 px-4">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: currentStep >= step.id ? 1 : 0.8 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      currentStep >= step.id
                        ? "bg-gradient-to-br from-primary to-emerald-400 glow-primary"
                        : "bg-card border border-border/50"
                    }`}
                  >
                    <step.icon className={`w-6 h-6 ${currentStep >= step.id ? "text-background" : "text-muted-foreground"}`} />
                  </motion.div>
                  <span className={`mt-2 text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-1 mx-3 rounded-full ${currentStep > step.id ? "bg-primary" : "bg-card"}`} />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Basic Information</h2>
                      <p className="text-sm text-muted-foreground">Tell us about your pharmacy</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="pharmacyName"
                          placeholder="e.g., Apollo Pharmacy"
                          className="pl-11 bg-card border-border/50 focus:border-primary"
                          value={formData.pharmacyName}
                          onChange={(e) => setFormData({...formData, pharmacyName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="ownerName"
                          placeholder="Full name"
                          className="pl-11 bg-card border-border/50 focus:border-primary"
                          value={formData.ownerName}
                          onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Drug License Number</Label>
                      <Input 
                        id="licenseNumber"
                        placeholder="DL-XX-XXXXXXX"
                        className="bg-card border-border/50 focus:border-primary"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input 
                        id="gstNumber"
                        placeholder="XXAAAXXXXXXAAX"
                        className="bg-card border-border/50 focus:border-primary"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Textarea 
                        id="address"
                        placeholder="Shop number, building, street..."
                        className="pl-11 bg-card border-border/50 focus:border-primary min-h-[80px]"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="area">Area *</Label>
                      <select
                        id="area"
                        className="w-full h-10 px-3 rounded-md bg-card border border-border/50 focus:border-primary text-foreground"
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                      >
                        <option value="">Select area</option>
                        {delhiAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        value="New Delhi"
                        disabled
                        className="bg-card border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input 
                        id="pincode"
                        placeholder="110001"
                        className="bg-card border-border/50 focus:border-primary"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Contact Details</h2>
                      <p className="text-sm text-muted-foreground">How customers and we can reach you</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="pl-11 bg-card border-border/50 focus:border-primary"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="email"
                          type="email"
                          placeholder="pharmacy@example.com"
                          className="pl-11 bg-card border-border/50 focus:border-primary"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6 mt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Why we need this
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Order notifications via SMS and email</li>
                      <li>• Payment settlement updates</li>
                      <li>• Customer support communications</li>
                      <li>• Important platform announcements</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Document Upload</h2>
                      <p className="text-sm text-muted-foreground">Required for verification (optional for now)</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {[
                      { name: "Drug License", key: "drugLicense", required: true },
                      { name: "GST Certificate", key: "gstCertificate", required: false },
                      { name: "Pharmacist License", key: "pharmacistLicense", required: true },
                    ].map((doc) => (
                      <div key={doc.key} className="glass-card rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {doc.name}
                              {doc.required && <span className="text-xs text-accent">Required</span>}
                            </h3>
                            <p className="text-sm text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                          </div>
                          <label className="cursor-pointer">
                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
                              <Upload className="w-4 h-4" />
                              <span>Upload</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                    <p className="text-sm text-accent flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      You can skip documents now and upload later. Your pharmacy will go live immediately!
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Operations</h2>
                      <p className="text-sm text-muted-foreground">Set your working hours and preferences</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="openTime">Opening Time</Label>
                      <Input 
                        id="openTime"
                        type="time"
                        className="bg-card border-border/50 focus:border-primary"
                        value={formData.openTime}
                        onChange={(e) => setFormData({...formData, openTime: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="closeTime">Closing Time</Label>
                      <Input 
                        id="closeTime"
                        type="time"
                        className="bg-card border-border/50 focus:border-primary"
                        value={formData.closeTime}
                        onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                    <Input 
                      id="deliveryRadius"
                      type="number"
                      placeholder="5"
                      className="bg-card border-border/50 focus:border-primary"
                      value={formData.deliveryRadius}
                      onChange={(e) => setFormData({...formData, deliveryRadius: e.target.value})}
                    />
                  </div>
                  
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h3 className="font-semibold">Payment Methods</h3>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="cod" 
                        checked={formData.acceptCOD}
                        onCheckedChange={(checked) => setFormData({...formData, acceptCOD: checked as boolean})}
                      />
                      <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery (COD)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="online" 
                        checked={formData.acceptOnline}
                        onCheckedChange={(checked) => setFormData({...formData, acceptOnline: checked as boolean})}
                      />
                      <Label htmlFor="online" className="cursor-pointer">Online Payment (UPI, Cards, Wallets)</Label>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                    <p className="text-sm text-primary flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Your pharmacy will be visible to customers immediately after registration!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-border/50 hover:border-primary/50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-emerald-400 text-background font-bold px-8"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    {currentStep === 4 ? "Complete Registration" : "Continue"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

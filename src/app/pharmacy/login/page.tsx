"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Store, ChevronRight, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoseuppLogo } from "@/components/DoseuppLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { authenticatePharmacy } from "@/lib/pharmacy-store";

export default function PharmacyLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"pharmacy" | "user">("pharmacy");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (loginType === "pharmacy") {
      const pharmacy = authenticatePharmacy(email, password);
      if (pharmacy) {
        localStorage.setItem("doseupp_user_type", "pharmacy");
        localStorage.setItem("doseupp_pharmacy_id", pharmacy.id);
        localStorage.setItem("doseupp_pharmacy_name", pharmacy.name);
        router.push("/pharmacy/dashboard");
      } else {
        setError("Invalid email or password. Try: apollo@doseupp.com / apollo123");
        setIsLoading(false);
      }
    } else {
      localStorage.setItem("doseupp_user_type", "user");
      localStorage.removeItem("doseupp_pharmacy_id");
      router.push("/order");
    }
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient flex items-center justify-center p-6">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <DoseuppLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary font-medium">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              {loginType === "pharmacy" ? (
                <Store className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
            <button
              onClick={() => { setLoginType("pharmacy"); setError(""); }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                loginType === "pharmacy" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="w-4 h-4 inline mr-2" />
              Pharmacy
            </button>
            <button
              onClick={() => { setLoginType("user"); setError(""); }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                loginType === "user" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Customer
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {loginType === "pharmacy" && (
            <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/30">
              <p className="text-xs text-primary font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-muted-foreground">Email: apollo@doseupp.com</p>
              <p className="text-xs text-muted-foreground">Password: apollo123</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={loginType === "pharmacy" ? "pharmacy@doseupp.com" : "user@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-muted border-border text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary-gradient font-semibold py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {loginType === "pharmacy" ? (
              <p className="text-muted-foreground text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/pharmacy/onboarding" className="text-primary font-medium hover:underline">
                  Register your pharmacy
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                New to Doseupp?{" "}
                <Link href="/order" className="text-primary font-medium hover:underline">
                  Start ordering
                </Link>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <button className="text-primary hover:underline">Terms of Service</button>
          {" "}and{" "}
          <button className="text-primary hover:underline">Privacy Policy</button>
        </p>
      </motion.div>
    </div>
  );
}

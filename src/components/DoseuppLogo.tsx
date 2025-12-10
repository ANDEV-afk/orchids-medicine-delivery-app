"use client";

import { motion } from "framer-motion";

interface DoseuppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function DoseuppLogo({ size = "md", showText = true, className = "" }: DoseuppLogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <svg 
          width={s.icon} 
          height={s.icon} 
          viewBox="0 0 56 56" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="pillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
            </filter>
          </defs>
          
          <g filter="url(#shadow)">
            <ellipse cx="18" cy="28" rx="10" ry="16" fill="url(#pillGradient)" />
            <ellipse cx="18" cy="20" rx="10" ry="8" fill="white" />
            
            <path 
              d="M28 22 L38 18 L42 20 L32 24 Z" 
              fill="url(#wingGradient)"
            />
            <path 
              d="M28 28 L40 23 L45 25 L33 30 Z" 
              fill="url(#wingGradient)"
              opacity="0.9"
            />
            <path 
              d="M28 34 L42 28 L48 31 L34 37 Z" 
              fill="url(#wingGradient)"
              opacity="0.8"
            />
          </g>
        </svg>
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${s.text} font-bold tracking-tight doseupp-text`}>
            Doseupp
          </span>
          {size === "lg" && (
            <span className="text-xs text-muted-foreground tracking-widest uppercase">
              Ultrafast Medicine Delivery
            </span>
          )}
        </div>
      )}
    </div>
  );
}

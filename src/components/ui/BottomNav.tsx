"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Sparkles, Settings } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export function BottomNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: "/stats",
      label: "Stats",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "#2ECC71",
    },
    {
      href: "/",
      label: "Timer",
      icon: <Clock className="w-6 h-6" />,
      color: "#2ECC71",
    },
    {
      href: "/ai",
      label: "IA",
      icon: <Sparkles className="w-6 h-6" />,
      color: "#FFD700",
    },
    {
      href: "/settings",
      label: "Config",
      icon: <Settings className="w-6 h-6" />,
      color: "#2ECC71",
    },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A]/95 backdrop-blur-lg border-t border-[#2ECC71]/20 px-6 py-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <motion.a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 relative transition-colors ${
                isActive 
                  ? item.color === "#FFD700" ? "text-[#FFD700]" : "text-[#2ECC71]"
                  : "text-[#F9F9F9]/70 hover:text-[#2ECC71]"
              }`}
              style={{
                padding: isActive ? "0.75rem" : "0.5rem",
              }}
              whileHover={!isActive ? { scale: 1.1, y: -2 } : {}}
              whileTap={{ scale: 0.95 }}
              aria-label={`${item.label}${isActive ? " - página atual" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Glow animado para item ativo */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-12 h-12 rounded-full border"
                  style={{
                    backgroundColor: `${item.color}10`,
                    borderColor: `${item.color}30`,
                  }}
                  animate={{ 
                    scale: [1, 1.1, 1], 
                    opacity: [0.5, 0.7, 0.5] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}

              {/* Ícone */}
              <div className="relative z-10">
                {item.icon}
              </div>

              {/* Label */}
              <span 
                className={`text-xs tracking-wide relative z-10 ${
                  isActive ? "font-medium" : "font-light"
                }`}
              >
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </motion.nav>
  );
}

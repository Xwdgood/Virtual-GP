"use client";

import BrandLogo from "./BrandLogo";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
  showTagline?: boolean;
  className?: string;
}

export default function MobileLayout({ 
  children, 
  showLogo = true, 
  showTagline = true,
  className 
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-4">
      <div className={cn("w-full", className)}>
        {showLogo && (
          <BrandLogo showTagline={showTagline} className="mb-4" />
        )}
        {children}
        
        {/* 底部版权信息 */}
        <div className="text-center mt-8 text-xs text-gray-500">
          © 2024 VirtualGP. All rights reserved.
        </div>
      </div>
    </div>
  );
}

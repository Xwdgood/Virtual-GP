"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  showTagline?: boolean;
  className?: string;
}

export default function BrandLogo({ showTagline = true, className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <Image
        src="/images/loginicon.png"
        alt="VirtualGP Logo"
        width={80}
        height={80}
        className=""
      />
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-black tracking-wide transform hover:scale-110 transition-transform duration-500 drop-shadow-lg leading-none" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
          <span className="inline-block animate-pulse brightness-75 hover:brightness-150">V</span>
          <span className="inline-block animate-pulse brightness-75 hover:brightness-150">i</span>
          <span className="inline-block animate-pulse brightness-75 hover:brightness-150">r</span>
          <span className="inline-block animate-pulse brightness-75 hover:brightness-150">t</span>
          <span className="inline-block animate-pulse brightness-75 hover:brightness-150">u</span>
          <span className="inline-block animate-pulse brightness-75 hover:brightness-150">a</span>
          <span className="inline-block animate-pulse brightness-75 hover:brightness-150">l</span>
          <span className="inline-block">&nbsp;</span>
          <span className="inline-block text-black font-black hover:animate-bounce brightness-90 hover:brightness-200 transition-all duration-300">G</span>
          <span className="inline-block text-black font-black hover:animate-bounce brightness-90 hover:brightness-200 transition-all duration-300">P</span>
        </h1>
        {showTagline && (
          <p className="text-[#77b080] text-sm italic font-medium leading-none mt-1">Anywhere, any place, any time</p>
        )}
      </div>
    </div>
  );
}

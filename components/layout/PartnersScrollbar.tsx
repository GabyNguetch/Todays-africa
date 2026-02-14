// components/layout/PartnerScrollBar.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PARTNERS_DATA } from "@/lib/constant";

interface PartnerScrollBarProps {
  position?: "left" | "right";
}

export default function PartnerScrollBar({ position = "left" }: PartnerScrollBarProps) {
  // Dupliquer les partenaires pour un scroll infini
  const duplicatedPartners = [...PARTNERS_DATA, ...PARTNERS_DATA, ...PARTNERS_DATA];

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border-r border-l border-gray-200 dark:border-zinc-800">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b-2 border-[#3E7B52] px-2 py-3">
        <h3 className="text-[10px] font-bold uppercase text-center text-[#3E7B52] tracking-widest">
          Nos Partenaires
        </h3>
      </div>

      {/* Zone de scroll */}
      <div className="relative h-[calc(100%-50px)] overflow-hidden">
        <div 
          className={`flex flex-col gap-4 py-4 ${
            position === "left" 
              ? "animate-scroll-vertical-up" 
              : "animate-scroll-vertical-down"
          }`}
          style={{
            animationDuration: "80s"
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <Link
              key={`${partner.id}-${index}`}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 px-2"
            >
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-[#3E7B52] transition-all duration-300 p-3 relative overflow-hidden group-hover:shadow-lg">
                
                {/* Logo */}
                <div className="relative w-full h-16 mb-2 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    unoptimized
                  />
                </div>

                {/* Nom */}
                <h4 className="text-[9px] font-bold text-center text-gray-800 dark:text-white line-clamp-2 group-hover:text-[#3E7B52] transition-colors">
                  {partner.name}
                </h4>

                {/* Catégorie */}
                {partner.category && (
                  <p className="text-[8px] text-center text-gray-400 mt-1 uppercase tracking-wider">
                    {partner.category}
                  </p>
                )}

                {/* Effet hover */}
                <div className="absolute inset-0 bg-[#3E7B52]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Gradient fade en haut et en bas */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white dark:from-black to-transparent pointer-events-none z-5" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none z-5" />
    </div>
  );
}
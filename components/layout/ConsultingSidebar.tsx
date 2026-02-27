"use client";

import React from "react";
import Link from "next/link";
import { Building2, MapPin, Users, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

const COMPANY_INFO = {
  name: '"TA" INTERCULTURAL INTELLIGENCE CONSULTING CABINET',
  tagline: "Aider l'Afrique à mieux connaitre, Aider l'Afrique à mieux coopérer, Aider à mieux coopérer avec l'Afrique et le monde.",
  locations: ["Yaoundé", "Moscou"]
};

const LEADERSHIP = [
  { name: "C. M. BOKALLI", role: "DG Yaoundé", avatar: "CB" },
  { name: "Ingrida KIM", role: "DG Moscou", avatar: "IK" }
];

const BENEFITS = [
  "Expertise interculturelle unique",
  "Projets internationaux",
  "Formation continue",
  "Impact continental",
];

export default function ConsultingSidebar() {
  return (
    <aside className="w-full space-y-4 xl:space-y-6 2xl:space-y-8">
        
      {/* En-tête entreprise */}
      <div className="border-2 border-gray-200 dark:border-zinc-800 p-4 xl:p-5 2xl:p-6 bg-white dark:bg-zinc-900 space-y-3 xl:space-y-4">
        <Link href='/consulting-cabinet'>
          <div className="flex items-start gap-2 xl:gap-3">
            <div className="w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 bg-[#3E7B52] flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-white xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs xl:text-sm 2xl:text-base font-bold text-gray-900 dark:text-white leading-tight mb-1">
                {COMPANY_INFO.name}
              </h2>
              <p className="text-[10px] xl:text-xs 2xl:text-sm text-gray-500 dark:text-gray-400 leading-snug">
                {COMPANY_INFO.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] xl:text-xs 2xl:text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-zinc-800">
            <MapPin size={10} className="text-[#3E7B52] xl:w-3 xl:h-3" />
            <span>{COMPANY_INFO.locations.join(" • ")}</span>
          </div>
        </Link>
      </div>

      {/* Leadership */}
      <div className="space-y-2 xl:space-y-3">
        <h3 className="text-[10px] xl:text-xs 2xl:text-sm font-bold uppercase tracking-widest text-gray-500 px-2 border-l-2 border-[#3E7B52] flex items-center gap-2">
          <Users size={10} className="xl:w-3 xl:h-3" />
          Direction
        </h3>
        
        <div className="space-y-2">
          {LEADERSHIP.map((leader, i) => (
            <div key={i} className="flex items-center gap-2 xl:gap-3 p-2 xl:p-3 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#3E7B52] transition-colors">
              <div className="w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 bg-gray-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                <span className="text-[10px] xl:text-xs font-bold text-gray-700 dark:text-gray-200">
                  {leader.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs xl:text-sm 2xl:text-base font-bold text-gray-900 dark:text-white truncate">
                  {leader.name}
                </p>
                <p className="text-[9px] xl:text-[10px] 2xl:text-xs text-gray-500 dark:text-gray-400 truncate">
                  {leader.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avantages */}
      <div className="space-y-2 xl:space-y-3">
        <h3 className="text-[10px] xl:text-xs 2xl:text-sm font-bold uppercase tracking-widest text-gray-500 px-2 border-l-2 border-[#3E7B52]">
          Pourquoi Nous
        </h3>
        <div className="space-y-1.5 xl:space-y-2">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px] xl:text-xs 2xl:text-sm text-gray-600 dark:text-gray-400 leading-tight">
              <CheckCircle2 size={9} className="text-[#3E7B52] mt-0.5 shrink-0 xl:w-2.5 xl:h-2.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link href="/consulting-cabinet#apply" className="block">
        <Button className="w-full h-10 xl:h-11 2xl:h-12 bg-[#3E7B52] hover:bg-[#326342] text-white text-xs xl:text-sm 2xl:text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <UserPlus size={14} className="xl:w-4 xl:h-4" />
          Nous contacter
        </Button>
      </Link>
    </aside>
  );
}

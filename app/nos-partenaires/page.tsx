// app/nos-partenaires/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { PARTNERS_DATA } from "@/lib/constant";
import { Button } from "@/components/ui/Button";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      
      {/* Header */}
      <div className="bg-white dark:bg-black border-b-4 border-[#3E7B52]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#3E7B52] hover:text-[#326342] font-bold uppercase tracking-wider text-sm mb-6"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Nos Partenaires
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Découvrez les partenaires qui nous accompagnent dans notre mission d'informer 
            et de connecter l'Afrique contemporaine au monde.
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PARTNERS_DATA.map((partner) => (
            <div
              key={partner.id}
              className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 hover:border-[#3E7B52] dark:hover:border-[#3E7B52] transition-all duration-300 group"
            >
              {/* Logo Container */}
              <div className="relative h-48 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center p-8 border-b-2 border-gray-200 dark:border-zinc-800">
                <div className="w-full h-full flex items-center justify-center">
                  {/* Placeholder pour le logo - remplacer par <Image /> en production */}
                  <div className="w-32 h-32 bg-gradient-to-br from-[#3E7B52] to-[#2a5539] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {partner.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  {/* 
                  <Image 
                    src={partner.logo} 
                    alt={partner.name}
                    width={200}
                    height={120}
                    className="object-contain"
                  />
                  */}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h2 className="font-bold text-xl text-black dark:text-white mb-1">
                    {partner.name}
                  </h2>
                  {partner.category && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#3E7B52] bg-[#3E7B52]/10 px-2 py-1">
                      {partner.category}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {partner.description}
                </p>

                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#3E7B52] hover:text-[#326342] font-bold uppercase tracking-wider text-xs group-hover:gap-3 transition-all"
                >
                  Visiter le site
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white dark:bg-zinc-900 border-2 border-[#3E7B52] p-12">
          <h2 className="font-serif text-3xl font-bold text-black dark:text-white mb-4">
            Devenez Partenaire
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Vous souhaitez rejoindre notre réseau de partenaires et participer 
            au développement de l'information en Afrique ?
          </p>
          <Button className="h-12 px-8 bg-[#3E7B52] hover:bg-[#326342] text-white font-bold uppercase tracking-wider">
            Contactez-nous
          </Button>
        </div>
      </div>
    </div>
  );
}
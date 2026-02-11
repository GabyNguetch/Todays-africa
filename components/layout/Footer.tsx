// FICHIER: components/layout/Footer.tsx - VERSION NYT
"use client";

import React from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { APP_CONFIG, HOME_DATA } from "@/lib/constant";

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#3E7B52] bg-gray-50 dark:bg-zinc-950 py-16 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* À propos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-black dark:bg-white text-white dark:text-black p-1.5">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base uppercase tracking-tight text-black dark:text-white">
                {APP_CONFIG.name}
              </h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
              {HOME_DATA.footer.description}
            </p>
            
            <div className="pt-4 space-y-1.5 text-[10px] text-[#3E7B52] font-bold uppercase tracking-wider leading-relaxed">
              <div>AIDER L'AFRIQUE À MIEUX SE CONNAÎTRE</div>
              <div>AIDER À MIEUX CONNAÎTRE L'AFRIQUE</div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-black dark:text-white border-b-2 border-[#3E7B52] pb-2">
              Sections
            </h4>
            <ul className="space-y-2">
              {HOME_DATA.navLinks.slice(0, 5).map((item) => (
                <li key={item.slug}>
                  <Link 
                    href={`/category/${item.slug}`} 
                    className="text-xs text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-black dark:text-white border-b-2 border-[#3E7B52] pb-2">
              Informations
            </h4>
            <ul className="space-y-2">
              {HOME_DATA.footer.about.map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-xs text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-black dark:text-white border-b-2 border-[#3E7B52] pb-2">
              Newsletter
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Recevez notre sélection hebdomadaire d'analyses.
            </p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full h-10 px-3 border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#3E7B52]"
              />
              <button className="w-full h-10 bg-[#3E7B52] hover:bg-[#326342] text-white text-xs font-bold uppercase tracking-wider transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 dark:text-gray-600 uppercase tracking-wider">
            © {APP_CONFIG.year} {APP_CONFIG.name}. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[10px] text-gray-500 hover:text-[#3E7B52] dark:hover:text-white uppercase tracking-wider">
              Politique de confidentialité
            </Link>
            <Link href="#" className="text-[10px] text-gray-500 hover:text-[#3E7B52] dark:hover:text-white uppercase tracking-wider">
              Conditions d'utilisation
            </Link>
            <Link href="#" className="text-[10px] text-gray-500 hover:text-[#3E7B52] dark:hover:text-white uppercase tracking-wider">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
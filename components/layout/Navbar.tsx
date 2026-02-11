// FICHIER: components/layout/Navbar.tsx - VERSION NYT
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe, Menu, UserIcon, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import { PublicService } from "@/services/public";
import { Rubrique } from "@/types/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const all = await PublicService.getRubriques();
        const roots = all.filter(r => r.parentId === null);
        setRubriques(roots);
      } catch (e) {
        console.error("Erreur menu:", e);
      }
    };
    fetchMenu();
  }, []);

  const handleActionClick = () => {
    if (user) {
      if (['REDACTEUR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        router.push("/dashboard");
      } else {
        router.push("/profil");
      }
    } else {
      router.push("/login");
    }
  };

  const VISIBLE_COUNT = 6;
  const visibleRubriques = rubriques.slice(0, VISIBLE_COUNT);
  const hiddenRubriques = rubriques.slice(VISIBLE_COUNT);
  const hasMore = hiddenRubriques.length > 0;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b-4 border-[#3E7B52]">
        
        {/* Top bar - Pleine largeur */}
        <div className="border-b border-gray-200 dark:border-zinc-800 py-2 px-6 md:px-12">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="font-bold">{new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-4">
              {!user && (
                <Link href="/login" className="text-gray-600 hover:text-[#3E7B52] font-bold uppercase tracking-wider">
                  Connexion
                </Link>
              )}
              <Button 
                onClick={handleActionClick}
                className="h-8 px-4 bg-[#3E7B52] hover:bg-[#326342] text-white text-xs font-bold uppercase tracking-wider"
              >
                {user ? (
                  <>
                    <UserIcon size={12} className="mr-1"/> 
                    Profil
                  </>
                ) : (
                  "S'abonner"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="py-4 px-6 md:px-12">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-black dark:bg-white text-white dark:text-black p-2">
                <Globe size={24} strokeWidth={2.5} />
              </div>
              <div className="hidden md:block">
                <span className="font-serif text-2xl font-bold text-black dark:text-white tracking-tight">
                  {APP_CONFIG.name}
                </span>
                <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">
                  L'Afrique Contemporaine
                </div>
              </div>
            </Link>

            {/* Rubriques Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {rubriques.length === 0 ? (
                <div className="flex gap-4 animate-pulse">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-2 w-16 bg-gray-200 dark:bg-zinc-800"></div>
                  ))}
                </div>
              ) : (
                <>
                  {visibleRubriques.map((rub) => (
                    <Link 
                      key={rub.id} 
                      href={`/category/${rub.id}`}
                      className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-[#3E7B52]"
                    >
                      {rub.nom}
                    </Link>
                  ))}

                  {hasMore && (
                    <div className="relative group">
                      <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white py-2">
                        Plus <ChevronDown size={12} />
                      </button>
                      
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                        {hiddenRubriques.map((rub) => (
                          <Link 
                            key={rub.id} 
                            href={`/category/${rub.id}`}
                            className="block px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#3E7B52] uppercase tracking-wider"
                          >
                            {rub.nom}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Menu Mobile */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-black">
          
          <div className="flex justify-between items-center p-6 border-b-2 border-[#3E7B52]">
            <span className="font-serif text-xl font-bold uppercase tracking-tight">
              {APP_CONFIG.name}
            </span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 bg-gray-100 dark:bg-zinc-900"
            >
              <X size={24}/>
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-80px)]">
            
            {/* Navigation spéciale */}
            <Link 
              href="/intelligence-interculturelle"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-bold uppercase text-[#3E7B52] border-b-2 border-[#3E7B52] pb-3"
            >
              Intelligence Interculturelle
              <ArrowRight size={16} className="inline ml-2"/>
            </Link>
            
            <Link 
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-bold uppercase text-black dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-3"
            >
              Actualités
            </Link>
            
            <Link 
              href="/consulting-cabinet"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-bold uppercase text-black dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-3"
            >
              Consulting Cabinet
            </Link>
            
            <div className="h-px bg-gray-200 dark:border-zinc-800 my-6"></div>
            
            {/* Rubriques */}
            {rubriques.map(rub => (
              <Link 
                key={rub.id} 
                href={`/category/${rub.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold uppercase text-gray-800 dark:text-white border-b border-gray-100 dark:border-zinc-900 pb-3"
              >
                {rub.nom}
              </Link>
            ))}
            
            <div className="mt-8 space-y-3">
              <Button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleActionClick();
                }}
                className="w-full h-12 bg-[#3E7B52] text-white font-bold uppercase"
              >
                {user ? "Mon Profil" : "S'abonner"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
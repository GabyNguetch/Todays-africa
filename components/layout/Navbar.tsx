// components/layout/Navbar.tsx - VERSION REDESIGN AVEC RUBRIQUES STATIQUES (OPTIMISÉE - HAUTEUR RÉDUITE)
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe, Menu, UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import { PublicService } from "@/services/public";
import { Rubrique } from "@/types/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AFRICAN_COUNTRIES, AFRICAN_REGIONS, getCountriesByRegion } from "@/lib/constant";
import Image from "next/image";

type Language = "fr" | "en" | "es" | "ru" | "ar";

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ru", name: "Russe", flag: "RU" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

// Rubriques statiques
interface StaticRubrique {
  id: string;
  nom: string;
  slug: string;
  hasDropdown?: boolean;
}

const STATIC_RUBRIQUES: StaticRubrique[] = [
  { id: "pays", nom: "Pays", slug: "pays", hasDropdown: true },
  { id: "daily-briefing", nom: "Daily Briefing Pays", slug: "daily-briefing" },
  { id: "pays-a-la-une", nom: "Un Pays à la Une", slug: "pays-a-la-une" },
  { id: "profils", nom: "Profils", slug: "profils" },
  { id: "recherche-innovation", nom: "Recherche & Innovation", slug: "recherche-innovation" },
  { id: "carte-postale", nom: "Carte Postale", slug: "carte-postale" },
  { id: "peuples-cultures", nom: "Peuples & Cultures", slug: "peuples-cultures" },
  { id: "archives", nom: "Archives", slug: "archives" },
];

export default function Navbar() {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("fr");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [paysDropdownOpen, setPaysDropdownOpen] = useState(false);
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

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.pays-dropdown')) {
        setPaysDropdownOpen(false);
      }
      if (!target.closest('.language-dropdown')) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setLanguageMenuOpen(false);
    console.log("Langue changée:", lang);
  };

  const handleCountryClick = (countryCode: string) => {
    setPaysDropdownOpen(false);
    router.push(`/pays/${countryCode.toLowerCase()}`);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b-2 border-[#3E7B52]">
        
        {/* LIGNE 1: Top bar - Date | Langues (centre) | Nos Partenaires */}
        <div className="border-b border-gray-200 dark:border-zinc-800 py-1 px-4 md:px-8">
          <div className="flex items-center justify-between text-[10px]">
            
            {/* Gauche: Date */}
            <div className="flex-1 hidden md:block">
              <span className="font-bold text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {/* Centre: Sélecteur de langue */}
            <div className="flex-1 flex justify-center">
              <div className="relative language-dropdown">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 border border-gray-300 dark:border-zinc-700 hover:border-[#3E7B52] dark:hover:border-[#3E7B52] transition-colors text-[10px]"
                >
                  <Globe size={12} />
                  <span className="font-bold uppercase">
                    {LANGUAGES.find(l => l.code === currentLanguage)?.flag} {currentLanguage}
                  </span>
                  <ChevronDown size={10} className={`transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown langues */}
                {languageMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 shadow-lg z-10">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 ${
                          currentLanguage === lang.code ? 'bg-[#3E7B52]/10 text-[#3E7B52] font-bold' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-sm">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Droite: Nos Partenaires + Actions */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-3">
              <Link 
                href="/nos-partenaires" 
                className="hidden md:inline text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white font-bold uppercase tracking-wider text-[10px]"
              >
                Nos Partenaires
              </Link>
              
              {!user && (
                <Link href="/login" className="hidden md:inline text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white font-bold uppercase tracking-wider text-[10px]">
                  Connexion
                </Link>
              )}
              
              <Button 
                onClick={handleActionClick}
                className="h-6 px-2 md:px-3 bg-[#3E7B52] hover:bg-[#326342] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider"
              >
                {user ? (
                  <>
                    <UserIcon size={10} className="mr-1"/> 
                    Profil
                  </>
                ) : (
                  "S'abonner"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* LIGNE 2: Logo centré (RÉDUIT) */}
        <div className="py-2 md:py-3 px-4 md:px-8 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-center">
            <Link href="/" className="flex flex-col items-center gap-1 group">
              <div className="flex items-center gap-2">
                <div className="bg-transparent dark:bg-white text-white dark:text-black p-1.5">
                  <Image src="/images/logo.jpeg" alt="Logo" width={30} height={30} className="object-contain"/>
                </div>
                <div>
                  <span className="font-serif text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight">
                    {APP_CONFIG.name}
                  </span>
                </div>
              </div>
              <div className="text-[8px] text-gray-500 uppercase tracking-widest">
                L'Afrique Contemporaine
              </div>
            </Link>
          </div>
        </div>

        {/* LIGNE 3: Rubriques statiques + dynamiques (COMPACTE) */}
        <div className="hidden lg:block py-1 px-4 md:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Rubriques statiques */}
            {STATIC_RUBRIQUES.map((rub) => (
              <div key={rub.id} className="relative pays-dropdown">
                {rub.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setPaysDropdownOpen(!paysDropdownOpen)}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white transition-colors py-1 border-b-2 border-transparent hover:border-[#3E7B52] flex items-center gap-1"
                    >
                      {rub.nom}
                      <ChevronDown size={10} className={`transition-transform ${paysDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Mega Dropdown des pays */}
                    {paysDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[800px] max-h-[500px] overflow-y-auto bg-white dark:bg-zinc-900 border-2 border-[#3E7B52] shadow-2xl z-50 p-4">
                        <div className="grid grid-cols-5 gap-3">
                          {Object.entries(AFRICAN_REGIONS).map(([key, label]) => {
                            const regionCountries = getCountriesByRegion(key as any);
                            return (
                              <div key={key} className="space-y-1.5">
                                <h4 className="text-[10px] font-bold uppercase text-[#3E7B52] border-b border-[#3E7B52] pb-0.5">
                                  {label}
                                </h4>
                                <div className="space-y-0.5">
                                  {regionCountries.map((country) => (
                                    <button
                                      key={country.code}
                                      onClick={() => handleCountryClick(country.code)}
                                      className="w-full text-left text-[10px] py-0.5 px-1.5 hover:bg-[#3E7B52]/10 hover:text-[#3E7B52] transition-colors flex items-center gap-1.5"
                                    >
                                      <span className="text-sm">{country.flag}</span>
                                      <span className="font-medium">{country.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={`/${rub.slug}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white transition-colors py-1 border-b-2 border-transparent hover:border-[#3E7B52]"
                  >
                    {rub.nom}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Menu Mobile Button */}
        <div className="lg:hidden py-2 px-4 flex justify-center border-t border-gray-200 dark:border-zinc-800">
          <button 
            className="flex items-center gap-2 px-3 py-1.5 bg-[#3E7B52] text-white font-bold uppercase text-[10px]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={14} />
            Menu
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-black">
          
          <div className="flex justify-between items-center p-4 border-b-2 border-[#3E7B52]">
            <span className="font-serif text-lg font-bold uppercase tracking-tight">
              {APP_CONFIG.name}
            </span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 bg-gray-100 dark:bg-zinc-900"
            >
              <X size={20}/>
            </button>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-60px)]">
            
            {/* Sélecteur de langue mobile */}
            <div className="pb-3 border-b-2 border-gray-200 dark:border-zinc-800">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Langue</p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-1.5 text-xs font-bold border-2 transition-all ${
                      currentLanguage === lang.code 
                        ? 'border-[#3E7B52] bg-[#3E7B52]/10 text-[#3E7B52]' 
                        : 'border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Lien Nos Partenaires */}
            <Link 
              href="/nos-partenaires"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold uppercase text-[#3E7B52] border-b-2 border-[#3E7B52] pb-2"
            >
              Nos Partenaires
            </Link>
            
            <div className="h-px bg-gray-200 dark:border-zinc-800"></div>
            
            {/* Rubriques statiques */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1.5">Sections</p>
              {STATIC_RUBRIQUES.map(rub => (
                <Link 
                  key={rub.id} 
                  href={`/${rub.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase text-gray-800 dark:text-white border-b border-gray-100 dark:border-zinc-900 pb-2"
                >
                  {rub.nom}
                </Link>
              ))}
            </div>

            <div className="h-px bg-gray-200 dark:border-zinc-800"></div>

            {/* Rubriques backend */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1.5">Catégories</p>
              {rubriques.map(rub => (
                <Link 
                  key={rub.id} 
                  href={`/category/${rub.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase text-gray-800 dark:text-white border-b border-gray-100 dark:border-zinc-900 pb-2"
                >
                  {rub.nom}
                </Link>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
              <Button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleActionClick();
                }}
                className="w-full h-10 bg-[#3E7B52] text-white font-bold uppercase text-sm"
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
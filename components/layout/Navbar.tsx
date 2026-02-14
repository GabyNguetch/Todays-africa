// components/layout/Navbar.tsx - VERSION OPTIMISÉE AVEC GESTION D'ÉTAT
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe, Menu, UserIcon, X, Calendar, Users, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import { PublicService } from "@/services/public";
import { Rubrique } from "@/types/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AFRICAN_REGIONS, getCountriesByRegion } from "@/lib/constant";
import Image from "next/image";

type Language = "fr" | "en" | "es" | "ru" | "ar";

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function Navbar() {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [isLoadingRubriques, setIsLoadingRubriques] = useState(true);
  const [rubriqueError, setRubriqueError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("fr");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [paysDropdownOpen, setPaysDropdownOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoadingRubriques(true);
        setRubriqueError(null);
        
        const all = await PublicService.getRubriques();
        console.log("Toutes les rubriques:", all); // Debug
        
        // Filtrer uniquement les rubriques racines (sans parent)
        const roots = all.filter(r => r.parentId === null);
        console.log("Rubriques racines:", roots); // Debug
        
        setRubriques(roots);
      } catch (e) {
        console.error("Erreur lors du chargement des rubriques:", e);
        setRubriqueError("Impossible de charger les catégories");
      } finally {
        setIsLoadingRubriques(false);
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
        
        {/* LIGNE 1: Top bar compacte avec icônes */}
        <div className="border-b border-gray-200 dark:border-zinc-800 py-1.5 px-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Gauche: Date avec icône */}
            <div className="flex items-center gap-2 flex-1">
              <Calendar size={12} className="text-[#3E7B52] hidden md:block" />
              <span className="text-[9px] md:text-[10px] font-semibold text-gray-600 dark:text-gray-400 hidden md:block">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric' 
                }).replace(/\./g, '')}
              </span>
            </div>

            {/* Centre: Sélecteur de langue avec icône */}
            <div className="flex items-center justify-center flex-1">
              <div className="relative language-dropdown">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-300 dark:border-zinc-700 hover:border-[#3E7B52] dark:hover:border-[#3E7B52] transition-colors rounded-sm"
                >
                  <Globe size={11} className="text-[#3E7B52]" />
                  <span className="text-[10px] font-bold uppercase">
                    {LANGUAGES.find(l => l.code === currentLanguage)?.flag} {currentLanguage}
                  </span>
                  <ChevronDown size={10} className={`transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown langues */}
                {languageMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 shadow-lg z-[60]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors ${
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

            {/* Droite: Actions avec icônes */}
            <div className="flex items-center justify-end gap-2 md:gap-3 flex-1">
              <Link 
                href="/nos-partenaires" 
                className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white font-semibold text-[10px] transition-colors"
              >
                <Users size={11} />
                <span>Nos partenaires</span>
              </Link>
              
              {!user && (
                <Link 
                  href="/login" 
                  className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white font-semibold text-[10px] transition-colors"
                >
                  <UserIcon size={11} />
                  <span>Connexion</span>
                </Link>
              )}
              
              <Button 
                onClick={handleActionClick}
                className="h-7 px-3 bg-[#3E7B52] hover:bg-[#326342] text-white text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                {user ? (
                  <>
                    <UserIcon size={11} /> 
                    <span className="hidden sm:inline">Profil</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={11} />
                    <span>S'abonner</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* LIGNE 2: Logo centré (COMPACT) */}
        <div className="py-1.5 md:py-2 px-4 md:px-8 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-transparent dark:bg-white p-1 rounded-sm">
                <Image 
                  src="/images/logo.jpeg" 
                  alt="Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg md:text-xl font-bold text-black dark:text-white tracking-tight leading-none">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[7px] text-gray-500 uppercase tracking-widest leading-none mt-0.5">
                  L'Afrique Contemporaine
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* LIGNE 3: Rubriques (PAYS + Backend) + Verbatim */}
        <div className="hidden lg:block py-1.5 px-4 md:px-8 bg-gray-50 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3">
            
            {/* Rubriques */}
            <div className="flex items-center gap-4 flex-wrap flex-1">
              
              {/* Rubrique PAYS avec dropdown */}
              <div className="relative pays-dropdown">
                <button
                  onClick={() => setPaysDropdownOpen(!paysDropdownOpen)}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:text-[#3E7B52] dark:text-gray-300 dark:hover:text-white transition-colors py-1 border-b-2 border-transparent hover:border-[#3E7B52] flex items-center gap-1"
                >
                  Pays
                  <ChevronDown size={10} className={`transition-transform ${paysDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Mega Dropdown des 54 pays */}
                {paysDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[90vw] max-w-[1000px] max-h-[500px] overflow-y-auto bg-white dark:bg-zinc-900 border-2 border-[#3E7B52] shadow-2xl z-[60] p-5">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {Object.entries(AFRICAN_REGIONS).map(([key, label]) => {
                        const regionCountries = getCountriesByRegion(key as any);
                        return (
                          <div key={key} className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase text-[#3E7B52] border-b border-[#3E7B52] pb-1">
                              {label}
                            </h4>
                            <div className="space-y-1">
                              {regionCountries.map((country) => (
                                <button
                                  key={country.code}
                                  onClick={() => handleCountryClick(country.code)}
                                  className="w-full text-left text-[10px] py-1 px-2 hover:bg-[#3E7B52]/10 hover:text-[#3E7B52] transition-colors flex items-center gap-2 rounded-sm"
                                >
                                  <span className="text-base">{country.flag}</span>
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
              </div>

              {/* Rubriques dynamiques du backend */}
              {isLoadingRubriques ? (
                <div className="flex items-center gap-10 text-gray-500">
                  <Loader2 size={12} className="animate-spin" />
                  <span className="text-[9px]">Chargement...</span>
                </div>
              ) : rubriqueError ? (
                <span className="text-[9px] text-red-500">{rubriqueError}</span>
              ) : rubriques.length > 0 ? (
                rubriques.map((rub) => (
                  <Link 
                    key={rub.id}
                    href={`/category/${rub.id}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:text-[#3E7B52] dark:text-gray-300 dark:hover:text-white transition-colors py-1 border-b-2 border-transparent hover:border-[#3E7B52]"
                  >
                    {rub.nom}
                  </Link>
                ))
              ) : (
                <span className="text-[9px] text-gray-400">Aucune catégorie disponible</span>
              )}
            </div>

            {/* Bouton Verbatim */}
            <Link href="/verbatim">
              <Button className="h-8 px-4 bg-gradient-to-r from-[#3E7B52] to-[#2d5c3d] hover:from-[#326342] hover:to-[#1f4429] text-white text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md">
                Verbatim
              </Button>
            </Link>
          </div>
        </div>

        {/* Menu Mobile Button */}
        <div className="lg:hidden py-2 px-4 flex justify-center bg-gray-50 dark:bg-zinc-950">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#3E7B52] hover:bg-[#326342] text-white font-bold uppercase text-[10px] transition-colors rounded-sm"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={14} />
            Menu
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] bg-white dark:bg-black overflow-y-auto">
          
          {/* Header Mobile */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b-2 border-[#3E7B52] bg-white dark:bg-black">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.jpeg" alt="Logo" width={20} height={20} className="object-contain"/>
              <span className="font-serif text-base font-bold uppercase tracking-tight">
                {APP_CONFIG.name}
              </span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors rounded-sm"
            >
              <X size={18}/>
            </button>
          </div>

          <div className="p-4 space-y-4">
            
            {/* Sélecteur de langue mobile */}
            <div className="pb-4 border-b-2 border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-[#3E7B52]" />
                <p className="text-[10px] font-bold uppercase text-gray-500">Langue</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-3 py-2 text-xs font-bold border-2 transition-all rounded-sm ${
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

            {/* Liens rapides */}
            <div className="space-y-2 pb-4 border-b-2 border-gray-200 dark:border-zinc-800">
              <Link 
                href="/nos-partenaires"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-zinc-900 pb-3 hover:text-[#3E7B52] transition-colors"
              >
                <Users size={16} className="text-[#3E7B52]" />
                <span>Nos Partenaires</span>
              </Link>

            </div>

            {/* Section Pays */}
            <div className="space-y-2 pb-4 border-b-2 border-gray-200 dark:border-zinc-800">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Pays d'Afrique</p>
              <div className="space-y-3">
                {Object.entries(AFRICAN_REGIONS).map(([key, label]) => {
                  const regionCountries = getCountriesByRegion(key as any);
                  return (
                    <div key={key}>
                      <h4 className="text-[9px] font-bold uppercase text-[#3E7B52] mb-1.5">
                        {label}
                      </h4>
                      <div className="grid grid-cols-2 gap-1">
                        {regionCountries.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => {
                              handleCountryClick(country.code);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left text-[10px] py-1.5 px-2 hover:bg-[#3E7B52]/10 hover:text-[#3E7B52] transition-colors flex items-center gap-2 rounded-sm"
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

            {/* Rubriques backend */}
            <div className="space-y-2 pb-4">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Catégories</p>
              
              {isLoadingRubriques ? (
                <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs">Chargement des catégories...</span>
                </div>
              ) : rubriqueError ? (
                <div className="text-xs text-red-500 py-2">{rubriqueError}</div>
              ) : rubriques.length > 0 ? (
                rubriques.map(rub => (
                  <Link 
                    key={rub.id} 
                    href={`/category/${rub.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-zinc-900 pb-3 hover:text-[#3E7B52] transition-colors"
                  >
                    {rub.nom}
                  </Link>
                ))
              ) : (
                <div className="text-xs text-gray-400 py-2">Aucune catégorie disponible</div>
              )}
            </div>
            
            {/* Actions */}
            <div className="pt-4 space-y-2">
              <Button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleActionClick();
                }}
                className="w-full h-12 bg-[#3E7B52] hover:bg-[#326342] text-white font-bold uppercase text-sm transition-all flex items-center justify-center gap-2"
              >
                {user ? (
                  <>
                    <UserIcon size={16} />
                    Mon Profil
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    S'abonner
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
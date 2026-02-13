// app/page.tsx - VERSION AVEC PARTENAIRES DÉFILANTS
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderOpen, Clock, ChevronLeft, ChevronRight } from "lucide-react"; 
import { Button } from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicService } from "@/services/public";
import { ArticleReadDto, Rubrique } from "@/types/article";
import { OnboardingTour } from "@/components/ui/OnBoardingTour";
import InterculturelSidebar from "@/components/layout/InterculturalSidebar";
import ConsultingSidebar from "@/components/layout/ConsultingSidebar";
import PartnerScrollBar from "@/components/layout/PartnersScrollbar";
import { cn, getImageUrl } from "@/lib/utils";

// Skeleton pour le chargement
const SectionSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-64 bg-gray-200 dark:bg-zinc-800"></div>
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="min-w-[280px] h-72 bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
      ))}
    </div>
  </div>
);

type SectionData = {
  rubrique: Rubrique;
  articles: ArticleReadDto[];
};

export default function Home() {
  const [heroArticles, setHeroArticles] = useState<ArticleReadDto[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carrousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        console.log("📥 [HOME] Chargement données...");

        const [trendingData, feedData, allRubriques] = await Promise.all([
          PublicService.getTrendingArticles(),
          PublicService.getAllArticles(0, 6),
          PublicService.getRubriques()
        ]);

        const carouselSource = trendingData.length > 0 ? trendingData : feedData.content || [];
        const heroData = carouselSource.slice(0, 5);
        
        setHeroArticles(heroData);
        console.log("🎠 [CAROUSEL] Articles:", heroData.length);

        const rootCategories = allRubriques.filter(r => r.parentId === null);
        
        const sectionsPromises = rootCategories.map(async (rub) => {
          const arts = await PublicService.getArticlesByRubrique(rub.id);
          return { 
            rubrique: rub, 
            articles: arts ? arts.slice(0, 8) : [] 
          };
        });

        const loadedSections = await Promise.all(sectionsPromises);
        setSections(loadedSections);

      } catch(e) {
        console.error("❌ [HOME] Erreur:", e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Auto-play carrousel
  useEffect(() => {
    if (heroArticles.length <= 1) return;

    const timer = setInterval(() => {
      goToNextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [heroArticles.length, currentSlide]);

  const goToNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroArticles.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroArticles.length) % heroArticles.length);
      setIsTransitioning(false);
    }, 300);
  };

  const activeArticle = heroArticles[currentSlide];

  return (
    <div className="min-h-screen bg-white dark:bg-black font-serif">
      <Navbar />

      {/* HERO SECTION - Avec sidebars partenaires */}
      <section className="w-full bg-gray-50 dark:bg-zinc-950 border-t-4 border-[#3E7B52]">
        <div className="flex">
          
          {/* SIDEBAR GAUCHE - Partenaires défilants */}
          <div className="hidden xl:block w-48 flex-shrink-0">
            <div className="sticky top-20 h-[500px]">
              <PartnerScrollBar position="left" />
            </div>
          </div>

          {/* HERO CENTRAL */}
          <div className="flex-1">
            {loading ? (
              <div className="w-full h-[500px] bg-gray-200 dark:bg-zinc-900 animate-pulse" />
            ) : activeArticle ? (
              <div className="relative w-full h-[500px] group">
                {/* Images carousel */}
                <div className="relative w-full h-full overflow-hidden">
                  {heroArticles.map((article, idx) => (
                    <div
                      key={article.id}
                      className={cn(
                        "absolute inset-0 transition-all duration-1000 ease-in-out",
                        idx === currentSlide 
                          ? "opacity-100 z-10" 
                          : "opacity-0 z-0"
                      )}
                    >
                      <Image 
                        src={getImageUrl(article.imageCouvertureUrl)} 
                        alt={article.titre}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                        unoptimized={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                  ))}
                </div>

                {/* Contenu overlay */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pb-12">
                    <div className="max-w-3xl space-y-4">
                      <span className="inline-block px-3 py-1 bg-[#3E7B52] text-white text-xs font-bold uppercase tracking-widest">
                        À la une
                      </span>
                      
                      <Link href={`/article/${activeArticle.id}`}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight hover:text-[#3E7B52] transition-colors cursor-pointer">
                          {activeArticle.titre}
                        </h1>
                      </Link>

                      <p className="text-lg text-gray-200 leading-relaxed max-w-2xl">
                        {activeArticle.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-300 pt-2">
                        <span className="flex items-center gap-2">
                          <FolderOpen size={16} className="text-[#3E7B52]"/> 
                          {activeArticle.rubriqueNom || "Actualité"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock size={16}/> 
                          {new Date(activeArticle.datePublication || activeArticle.dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <button 
                    onClick={goToPrevSlide}
                    disabled={isTransitioning}
                    className="p-3 bg-white/10 backdrop-blur-md hover:bg-[#3E7B52] text-white transition-all disabled:opacity-50"
                  >
                    <ChevronLeft size={24}/>
                  </button>
                  <button 
                    onClick={goToNextSlide}
                    disabled={isTransitioning}
                    className="p-3 bg-white/10 backdrop-blur-md hover:bg-[#3E7B52] text-white transition-all disabled:opacity-50"
                  >
                    <ChevronRight size={24}/>
                  </button>
                </div>

                {/* Indicateurs */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {heroArticles.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isTransitioning && idx !== currentSlide) {
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setCurrentSlide(idx);
                            setIsTransitioning(false);
                          }, 300);
                        }
                      }}
                      disabled={isTransitioning}
                      className={cn(
                        "h-1 transition-all duration-500",
                        idx === currentSlide 
                          ? "w-12 bg-[#3E7B52]" 
                          : "w-3 bg-white/50 hover:bg-white/75"
                      )}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* SIDEBAR DROITE - Partenaires défilants */}
          <div className="hidden xl:block w-48 flex-shrink-0">
            <div className="sticky top-20 h-[500px]">
              <PartnerScrollBar position="right" />
            </div>
          </div>

        </div>
      </section>

      {/* GRID LAYOUT 3 COLONNES */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            
          {/* SIDEBAR GAUCHE - 15% */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <InterculturelSidebar />
          </div>

          {/* CONTENU CENTRAL - 70% */}
          <div className="col-span-1 lg:col-span-6 space-y-16">
            
            {loading ? (
              <div className="space-y-16">
                {[1, 2].map((k) => <SectionSkeleton key={k}/>)}
              </div>
            ) : (
              sections.map((section) => {
                if (section.articles.length === 0) return null;
                
                // Duplication pour boucle infinie
                const marqueeContent = section.articles.length < 4 
                  ? [...section.articles, ...section.articles, ...section.articles] 
                  : [...section.articles, ...section.articles];

                return (
                  <section 
                    key={section.rubrique.id} 
                    className="border-t-2 border-gray-200 dark:border-zinc-800 pt-8 space-y-6"
                  >
                    
                    {/* Header section */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#3E7B52]"></span>
                        {section.rubrique.nom}
                      </h2>
                      <Link href={`/category/${section.rubrique.id}`}>
                        <button className="text-xs font-bold text-gray-600 hover:text-[#3E7B52] flex items-center gap-1 transition-colors uppercase tracking-wider">
                          Tout voir <ArrowRight size={14}/>
                        </button>
                      </Link>
                    </div>

                    {/* Zone marquee scrolling infini */}
                    <div className="relative overflow-hidden">
                      <div 
                        className="flex gap-6 animate-scroll-continuous hover:[animation-play-state:paused]"
                        style={{ 
                          animationDuration: `${marqueeContent.length * 8}s` 
                        }}
                      >
                        {marqueeContent.map((art, idx) => (
                          <div 
                            key={`${art.id}-${idx}`} 
                            className="w-[280px] shrink-0 group"
                          >
                            <Link href={`/article/${art.id}`} className="block">
                              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-[#3E7B52] transition-all duration-300 overflow-hidden">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                  <Image 
                                    src={getImageUrl(art.imageCouvertureUrl)} 
                                    alt={art.titre}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                
                                {/* Contenu */}
                                <div className="p-4 space-y-3">
                                  <span className="text-xs font-bold text-[#3E7B52] uppercase tracking-widest">
                                    {art.rubriqueNom}
                                  </span>
                                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-3 group-hover:text-[#3E7B52] transition-colors">
                                    {art.titre}
                                  </h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {art.description}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                    <Clock size={12}/>
                                    {new Date(art.datePublication || art.dateCreation).toLocaleDateString('fr-FR', { 
                                      day: 'numeric', 
                                      month: 'short' 
                                    })}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })
            )}

            {/* CTA Newsletter */}
            <section className="border-2 border-[#3E7B52] bg-gray-50 dark:bg-zinc-900 p-8 md:p-12 text-center">
              <div className="max-w-lg mx-auto space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                  Restez Informés
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Recevez chaque semaine notre sélection d'analyses et d'actualités sur l'Afrique.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    className="flex-1 h-12 px-4 border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#3E7B52]"
                  />
                  <Button className="h-12 px-8 bg-[#3E7B52] hover:bg-[#326342] text-white font-bold uppercase tracking-wider">
                    S'abonner
                  </Button>
                </div>
              </div>
            </section>

          </div>

          {/* SIDEBAR DROITE - 15% */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <ConsultingSidebar />
          </div>

        </div>
      </div>
      
      <Footer />
      <OnboardingTour /> 

      {/* Styles animation scroll */}
      <style jsx global>{`
        @keyframes scroll-continuous {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes scroll-vertical-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        @keyframes scroll-vertical-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        
        .animate-scroll-continuous {
          animation: scroll-continuous linear infinite;
        }
        
        .animate-scroll-vertical-up {
          animation: scroll-vertical-up linear infinite;
        }
        
        .animate-scroll-vertical-down {
          animation: scroll-vertical-down linear infinite;
        }
        
        /* Smooth scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Hide scrollbar on mobile */
        @media (max-width: 1024px) {
          .scrollbar-thin {
            scrollbar-width: none;
          }
          .scrollbar-thin::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

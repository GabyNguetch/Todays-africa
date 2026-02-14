// app/page.tsx - VERSION AVEC CARROUSEL ACCÉLÉRÉ
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, TrendingUp } from "lucide-react"; 
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

const CAROUSEL_IMAGES = [
  "/images/carroussel.jpeg",
  "/images/caroussel.jpeg",
  "/images/carroussel.jpg",
  "/images/carroussel2.jpeg",
  "/images/carroussel3.jpeg",
];

// Skeleton pour le chargement
const SectionSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-800 rounded"></div>
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="min-w-[280px] h-64 bg-gray-200 dark:bg-zinc-800 rounded shrink-0"></div>
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
        const heroData = carouselSource.slice(0, 5); // 5 articles pour matcher les 5 images
        
        setHeroArticles(heroData);
        console.log("🎠 [HERO] Articles:", heroData.length);

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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      {/* HERO SECTION - Carrousel synchronisé images + articles */}
      <section className="relative w-full border-t-2 border-[#3E7B52] bg-gray-50 dark:bg-zinc-950">
        <div className="flex">
          
          {/* SIDEBAR GAUCHE - Partenaires défilants */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-20 h-[600px]">
              <PartnerScrollBar position="left" />
            </div>
          </div>

          {/* HERO CENTRAL - Carrousel */}
          <div className="flex-1 relative h-[600px] overflow-hidden">
            
            {/* Carrousel d'images de fond en défilement continu */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="flex animate-carousel-slide-bg">
                {/* Premier set d'images */}
                {CAROUSEL_IMAGES.map((img, idx) => (
                  <div key={`img-1-${idx}`} className="relative w-full h-[600px] flex-shrink-0" style={{ width: '100%' }}>
                    <Image 
                      src={img}
                      alt={`Background ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      unoptimized
                    />
                  </div>
                ))}
                {/* Duplication pour boucle infinie */}
                {CAROUSEL_IMAGES.map((img, idx) => (
                  <div key={`img-2-${idx}`} className="relative w-full h-[600px] flex-shrink-0" style={{ width: '100%' }}>
                    <Image 
                      src={img}
                      alt={`Background ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              
              {/* Overlay gradient sombre pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
            </div>

            {/* Contenu - Articles Trending défilants synchronisés */}
            <div className="relative z-10 h-full flex items-center">
              <div className="w-full px-6 md:px-12">
            
                {loading ? (
                  <div className="space-y-6">
                    <div className="h-8 w-64 bg-white/20 rounded animate-pulse" />
                    <div className="h-32 w-full bg-white/20 rounded animate-pulse" />
                  </div>
                ) : heroArticles.length > 0 ? (
                  <div className="space-y-8">
                    
                    {/* Badge section */}
                    <div className="flex items-center gap-3 max-w-6xl mx-auto">
                      <div className="px-4 py-2 bg-[#3E7B52] flex items-center gap-2">
                        <TrendingUp size={16} className="text-white" />
                        <span className="text-white font-bold uppercase tracking-widest text-xs">
                          Articles Tendance
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-white/30" />
                    </div>

                    {/* Articles défilants synchronisés avec les images */}
                    <div className="overflow-hidden">
                      <div className="flex animate-carousel-slide-articles" style={{ width: 'fit-content' }}>
                        {/* Premier set d'articles */}
                        {heroArticles.map((article, idx) => (
                          <div 
                            key={`article-1-${article.id}`}
                            className="w-screen flex-shrink-0 px-6 md:px-12"
                          >
                            <div className="max-w-6xl mx-auto">
                              <Link 
                                href={`/article/${article.id}`}
                                className="group block space-y-4"
                              >
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] group-hover:text-[#3E7B52] transition-colors duration-300">
                                  {article.titre}
                                </h1>

                                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl truncate">
                                  {article.description}...
                                </p>

                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <Clock size={14} /> 
                                  {new Date(
                                    article.datePublication || article.dateCreation
                                  ).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                              </Link>
                            </div>
                          </div>
                        ))}
                        
                        {/* Duplication pour boucle infinie */}
                        {heroArticles.map((article, idx) => (
                          <div 
                            key={`article-2-${article.id}`}
                            className="w-screen flex-shrink-0 px-6 md:px-12"
                          >
                            <div className="max-w-6xl mx-auto">
                              <Link 
                                href={`/article/${article.id}`}
                                className="group block space-y-4"
                              >
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] group-hover:text-[#3E7B52] transition-colors duration-300">
                                  {article.titre}
                                </h1>

                                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl truncate">
                                  {article.description}...
                                </p>

                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <Clock size={14} /> 
                                  {new Date(
                                    article.datePublication || article.dateCreation
                                  ).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* SIDEBAR DROITE - Partenaires défilants */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-20 h-[600px]">
              <PartnerScrollBar position="right" />
            </div>
          </div>

        </div>
      </section>

      {/* GRID LAYOUT 3 COLONNES */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
          {/* SIDEBAR GAUCHE - 2 colonnes - FIXE SANS SCROLLBAR */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 overflow-hidden">
              <InterculturelSidebar />
            </div>
          </aside>

          {/* CONTENU CENTRAL - 8 colonnes */}
          <main className="col-span-1 lg:col-span-8 space-y-16">
            
            {loading ? (
              <div className="space-y-16">
                {[1, 2, 3].map((k) => <SectionSkeleton key={k} />)}
              </div>
            ) : (
              sections.map((section) => {
                if (section.articles.length === 0) return null;
                
                // Duplication pour défilement infini
                const marqueeContent = section.articles.length < 4 
                  ? [...section.articles, ...section.articles, ...section.articles] 
                  : [...section.articles, ...section.articles];

                return (
                  <section 
                    key={section.rubrique.id} 
                    className="space-y-6"
                  >
                    
                    {/* Header section avec design amélioré */}
                    <div className="flex items-center justify-between pb-4 border-b-2 border-[#3E7B52]">
                      <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-[#3E7B52]" />
                        {section.rubrique.nom}
                      </h2>
                      <Link href={`/category/${section.rubrique.id}`}>
                        <button className="text-xs font-bold text-gray-600 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-[#3E7B52] flex items-center gap-2 transition-all duration-300 uppercase tracking-wider group">
                          Tout voir 
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>

                    {/* Zone défilement horizontal infini */}
                    <div className="relative overflow-hidden">
                      <div 
                        className="flex gap-6 animate-scroll-smooth hover:[animation-play-state:paused]"
                        style={{ 
                          animationDuration: `${marqueeContent.length * 10}s` 
                        }}
                      >
                        {marqueeContent.map((art, idx) => (
                          <article 
                            key={`${art.id}-${idx}`} 
                            className="w-[300px] shrink-0 group"
                          >
                            <Link href={`/article/${art.id}`} className="block h-full">
                              <div className="h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-[#3E7B52] dark:hover:border-[#3E7B52] transition-all duration-300 overflow-hidden hover:shadow-xl">
                                
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                  <Image 
                                    src={getImageUrl(art.imageCouvertureUrl)} 
                                    alt={art.titre}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  
                                  {/* Badge rubrique sur l'image */}
                                  <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 bg-[#3E7B52] text-white text-[10px] font-bold uppercase tracking-widest">
                                      {art.rubriqueNom}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Contenu */}
                                <div className="p-5 space-y-3">
                                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-3 group-hover:text-[#3E7B52] dark:group-hover:text-[#3E7B52] transition-colors min-h-[4.5rem]">
                                    {art.titre}
                                  </h3>
                                  
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                    {art.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                      <Clock size={12} />
                                      {new Date(art.datePublication || art.dateCreation).toLocaleDateString('fr-FR', { 
                                        day: 'numeric', 
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </div>
                                    <ArrowRight 
                                      size={14} 
                                      className="text-gray-400 group-hover:text-[#3E7B52] group-hover:translate-x-1 transition-all" 
                                    />
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })
            )}

            {/* CTA Newsletter avec design amélioré */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3E7B52] to-[#2d5c3d] opacity-5" />
              <div className="relative border-2 border-[#3E7B52] bg-gray-50 dark:bg-zinc-900 p-10 md:p-16">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <div className="inline-block p-3 bg-[#3E7B52]/10 rounded-full mb-4">
                    <svg className="w-8 h-8 text-[#3E7B52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                    Restez Informés
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Recevez chaque semaine notre sélection d'analyses approfondies et d'actualités exclusives sur l'Afrique contemporaine.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                    <input 
                      type="email" 
                      placeholder="votre.email@exemple.com" 
                      className="flex-1 h-14 px-5 border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#3E7B52] transition-colors"
                    />
                    <Button className="h-14 px-10 bg-[#3E7B52] hover:bg-[#2d5c3d] text-white font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105">
                      S'inscrire
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-500 pt-2">
                    En vous inscrivant, vous acceptez notre politique de confidentialité.
                  </p>
                </div>
              </div>
            </section>

          </main>

          {/* SIDEBAR DROITE - 2 colonnes - FIXE SANS SCROLLBAR */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 overflow-hidden">
              <ConsultingSidebar />
            </div>
          </aside>

        </div>
      </div>
      
      <Footer />
      <OnboardingTour /> 

      {/* Styles CSS avec animations optimisées */}
      <style jsx global>{`
        /* Carrousel images de fond - défilement lent (80s) */
        @keyframes carousel-slide-bg {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-carousel-slide-bg {
          animation: carousel-slide-bg 50s linear infinite;
        }
        
        /* Carrousel articles - défilement RAPIDE (25s) */
        @keyframes carousel-slide-articles {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-carousel-slide-articles {
          animation: carousel-slide-articles 25s linear infinite;
        }
        
        /* Défilement horizontal des articles sections */
        @keyframes scroll-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-scroll-smooth {
          animation: scroll-smooth linear infinite;
          will-change: transform;
        }
        
        /* Défilement vertical partenaires - vers le haut */
        @keyframes scroll-vertical-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-66.666%); }
        }
        
        .animate-scroll-vertical-up {
          animation: scroll-vertical-up linear infinite;
          will-change: transform;
        }
        
        /* Défilement vertical partenaires - vers le bas */
        @keyframes scroll-vertical-down {
          0% { transform: translateY(-66.666%); }
          100% { transform: translateY(0); }
        }
        
        .animate-scroll-vertical-down {
          animation: scroll-vertical-down linear infinite;
          will-change: transform;
        }
        
        /* Masquer complètement les scrollbars */
        .overflow-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .overflow-hidden::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth scroll général */
        * {
          scroll-behavior: smooth;
        }
        
        /* Optimisation performances */
        .animate-carousel-slide-bg,
        .animate-carousel-slide-articles,
        .animate-scroll-smooth,
        .animate-scroll-vertical-up,
        .animate-scroll-vertical-down {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
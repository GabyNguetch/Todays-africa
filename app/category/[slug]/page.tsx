"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { RefreshCw, FolderOpen, ArrowLeft, Grid3x3, BarChart3, FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/ui/ArticleCard";
import { PublicService } from "@/services/public";
import { ArticleReadDto, Rubrique } from "@/types/article";

// --- SQUELETTE DE CHARGEMENT ---
const CategorySkeleton = () => (
    <div className="group relative flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-zinc-800/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        
        <div className="p-6 space-y-4">
            <div className="relative h-48 w-full bg-gray-200 dark:bg-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300/50 dark:from-zinc-900/50"></div>
            </div>
            
            <div className="space-y-3">
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-zinc-800"></div>
                <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800"></div>
                <div className="h-6 w-2/3 bg-gray-200 dark:bg-zinc-800"></div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 mt-auto">
                <div className="h-3 w-1/3 bg-gray-100 dark:bg-zinc-800"></div>
            </div>
        </div>
    </div>
);

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [currentRubrique, setCurrentRubrique] = useState<Rubrique | null>(null);
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      console.error("❌ Slug manquant");
      setError(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
        console.group(`🔍 [CategoryPage] Recherche: "${slug}"`);
        setLoading(true);
        setError(false);

        try {
            // 1. Charger toutes les rubriques
            const allRubriques = await PublicService.getRubriques();
            console.log(`📥 ${allRubriques.length} rubriques disponibles`);

            if (allRubriques.length === 0) {
                console.warn("⚠️ Aucune rubrique disponible");
                setError(true);
                return;
            }

            // 2. Trouver la rubrique correspondante
            const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
            console.log(`🔎 Recherche pour: "${decodedSlug}"`);

            const matched = allRubriques.find(r => {
                const rId = String(r.id);
                const rSlug = r.slug?.toLowerCase() || ""; 
                const rNom = r.nom?.toLowerCase() || "";

                return (
                    rId === decodedSlug || 
                    rSlug === decodedSlug || 
                    rNom === decodedSlug
                );
            });

            if (!matched) {
                console.warn("⚠️ Rubrique introuvable");
                console.log("Rubriques disponibles:", allRubriques.map(r => 
                    `${r.id} - ${r.nom} - ${r.slug}`
                ));
                setError(true);
                return;
            }

            console.log(`✅ Rubrique trouvée: ${matched.nom} (ID: ${matched.id})`);
            setCurrentRubrique(matched);

            // 3. Charger les articles de cette rubrique
            console.log(`📡 Chargement articles rubrique ${matched.id}...`);
            const arts = await PublicService.getArticlesByRubrique(matched.id);
            
            console.log(`✅ ${arts.length} articles chargés`);
            setArticles(arts);

        } catch(error) {
            console.error("❌ Erreur fatale:", error);
            setError(true);
        } finally {
            setLoading(false);
            console.groupEnd();
        }
    };

    fetchData();
  }, [slug]);

  if (error && !loading) {
      return notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 flex-1">
        
        {/* HEADER */}
        <div className="mb-12 sm:mb-14 md:mb-16 relative">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" 
                 style={{backgroundImage: 'linear-gradient(#3E7B52 1px, transparent 1px), linear-gradient(90deg, #3E7B52 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
            </div>
            
            <div className="relative bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 p-6 sm:p-8 md:p-12 shadow-sm">
                {loading ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800"></div>
                        <div className="h-16 w-3/4 bg-gray-200 dark:bg-zinc-800"></div>
                        <div className="h-6 w-full max-w-2xl bg-gray-200 dark:bg-zinc-800"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* FIL D'ARIANE */}
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#3E7B52]/5 dark:bg-[#13EC13]/5 border border-[#3E7B52]/20 dark:border-[#13EC13]/20">
                                <Grid3x3 size={12} className="text-[#3E7B52] dark:text-[#13EC13]"/>
                                <span className="text-[#3E7B52] dark:text-[#13EC13]">Rubrique</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700"></div>
                            <span className="text-gray-600 dark:text-zinc-400">{currentRubrique?.nom}</span>
                        </div>

                        {/* TITRE */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 sm:gap-6">
                                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#3E7B52] dark:bg-[#13EC13] flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                                    <FolderOpen size={40} className="text-white dark:text-black" strokeWidth={1.5}/>
                                </div>
                                
                                <div className="flex-1">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-[#111] dark:text-white tracking-tight uppercase leading-[0.9] mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        {currentRubrique?.nom}
                                    </h1>
                                    
                                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-[#3E7B52] dark:bg-[#13EC13] text-white dark:text-black">
                                            <BarChart3 size={16} strokeWidth={2}/>
                                            <span className="text-sm font-bold">{articles.length} Articles</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700">
                                            <FileText size={16} className="text-gray-600 dark:text-zinc-400" strokeWidth={2}/>
                                            <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">Mis à jour</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* SÉPARATION */}
                        <div className="relative h-px bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3E7B52] dark:via-[#13EC13] to-transparent animate-[shimmer_3s_infinite]"></div>
                        </div>
                        
                        {/* DESCRIPTION */}
                        <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                            {currentRubrique?.description || `Toute l'actualité et les dossiers spéciaux concernant ${currentRubrique?.nom}.`}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* CONTENU ARTICLES */}
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="animate-in fade-in duration-500" style={{animationDelay: `${i * 80}ms`}}>
                        <CategorySkeleton />
                    </div>
                ))}
            </div>
        ) : (
            articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                    {articles.map((article, index) => (
                        <div 
                            key={article.id} 
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{animationDelay: `${index * 80}ms`}}
                        >
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative flex flex-col items-center justify-center py-32 bg-white dark:bg-zinc-900 border-2 border-dashed border-gray-300 dark:border-zinc-800 text-center px-6">
                        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]" 
                             style={{backgroundImage: 'linear-gradient(#3E7B52 1px, transparent 1px), linear-gradient(90deg, #3E7B52 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 border-2 border-gray-300 dark:border-zinc-700 flex items-center justify-center">
                                    <RefreshCw size={48} className="text-gray-400 dark:text-gray-500 animate-spin" style={{animationDuration: '4s'}} strokeWidth={1.5}/>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    Aucun article disponible
                                </h3>
                                <div className="w-20 h-1 bg-[#3E7B52] dark:bg-[#13EC13] mx-auto"></div>
                                <p className="text-gray-500 dark:text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
                                    La rédaction n'a pas encore publié d'article dans <span className="font-bold text-[#3E7B52] dark:text-[#13EC13]">{currentRubrique?.nom}</span>.
                                </p>
                            </div>
                            
                            <Link 
                                href="/" 
                                className="group inline-flex items-center gap-3 text-sm font-bold text-white dark:text-black bg-[#3E7B52] dark:bg-[#13EC13] px-8 py-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={2.5}/>
                                <span>Retour à l'accueil</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        )}
      </main>
      
      <Footer />

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
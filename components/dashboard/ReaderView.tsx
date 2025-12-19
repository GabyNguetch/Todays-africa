// FICHIER: components/dashboard/ReaderView.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard";
import { ArticleBackend } from "@/types/dashboard";
import { ArrowRight, BookOpen, Clock, Loader2, Star } from "lucide-react";
import Image from "next/image";

export default function ReaderView() {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<ArticleBackend[]>([]);
  const [feed, setFeed] = useState<ArticleBackend[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Récupération simultanée du Featured et du Feed général
      const [featData, feedData] = await Promise.all([
        dashboardService.getFeaturedArticles(),
        dashboardService.getAllPublicArticles(0, 10) // Page 0, 10 items
      ]);
      setFeatured(featData);
      setFeed(feedData.content || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-gray-400">
            <Loader2 className="animate-spin text-[#3E7B52]" size={40}/>
            <p>Chargement de votre flux de lecture...</p>
        </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 pb-12">
        
        {/* HEADER */}
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Espace Lecteur</h1>
            <p className="text-gray-500">Explorez l'actualité vérifiée et vos articles favoris.</p>
        </div>

        {/* SECTION 1: FEATURED (WORKFLOW PUBLIC 1) */}
        {featured.length > 0 && (
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Star className="text-yellow-500 fill-yellow-500" size={20} />
                    <h2 className="text-xl font-bold dark:text-white">Sélection du jour</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
        )}

        {/* SECTION 2: FLUX COMPLET (WORKFLOW PUBLIC 2) */}
        <section>
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-[#3E7B52] dark:text-[#13EC13]" size={20} />
                    <h2 className="text-xl font-bold dark:text-white">Flux d'Articles</h2>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {feed.map(article => (
                    <Link 
                        key={article.id} 
                        href={`/articles/${article.id}`} 
                        className="group flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-[#3E7B52]/30 dark:hover:border-[#13EC13]/30 hover:shadow-md transition-all"
                    >
                        {/* Image avec Fallback */}
                        <div className="w-full sm:w-48 h-32 relative rounded-lg overflow-hidden shrink-0 bg-gray-200">
                            <Image 
                                src={article.imageCouvertureUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop"}
                                alt={article.titre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold text-[#3E7B52] bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider dark:bg-[#13EC13]/10 dark:text-[#13EC13]">
                                    {article.rubriqueNom || "Actualité"}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {article.datePublication ? new Date(article.datePublication).toLocaleDateString() : "Récemment"}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#3E7B52] transition-colors mb-2 line-clamp-2">
                                {article.titre}
                            </h3>
                            
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {article.description || "Cliquez pour lire l'intégralité de cet article..."}
                            </p>

                            <div className="flex items-center text-[#3E7B52] text-xs font-bold gap-1 group-hover:gap-2 transition-all mt-auto">
                                Lire l'article <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    </div>
  );
}

// Mini composant carte local pour éviter la dépendance circulaire
function ArticleCard({ article }: { article: ArticleBackend }) {
    return (
        <Link href={`/articles/${article.id}`} className="relative h-64 rounded-xl overflow-hidden group shadow-lg">
            <Image 
                src={article.imageCouvertureUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"} 
                alt={article.titre} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex flex-col justify-end">
                <span className="text-xs text-green-300 font-bold uppercase mb-1">{article.rubriqueNom}</span>
                <h3 className="text-white font-bold leading-tight group-hover:underline decoration-green-400 decoration-2 underline-offset-4">{article.titre}</h3>
            </div>
        </Link>
    )
}
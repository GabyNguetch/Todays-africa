"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { PublicService } from '@/services/public';
import { ArticleReadDto } from '@/types/article';
import { getImageUrl, cn } from '@/lib/utils';

interface SimilarArticlesProps {
  currentArticleId: number;
}

// ✨ SQUELETTE DE CHARGEMENT POUR SIMULER LES MINI-CARDS
const SimilarSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-3">
                <div className="w-20 h-14 bg-gray-200 dark:bg-zinc-800 rounded-lg shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-2/3"></div>
                </div>
            </div>
        ))}
    </div>
);

export default function SimilarArticles({ currentArticleId }: SimilarArticlesProps) {
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilaires = async () => {
        setLoading(true);
        try {
            // Utilise l'endpoint /articles/{id}/similar?limit=5
            const data = await PublicService.getSimilarArticles(currentArticleId, 5);
            // Filtrer l'article courant si l'API ne le fait pas (sécurité)
            setArticles(data.filter(a => a.id !== currentArticleId));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    if (currentArticleId) fetchSimilaires();
  }, [currentArticleId]);

  // Ne rien afficher si vide et chargé
  if (!loading && articles.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm sticky top-24">
        
        {/* Titre Stylé */}
        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50 dark:border-zinc-800/50">
            <Sparkles className="text-[#3E7B52]" size={16}/>
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                Dans la même thématique
            </h4>
        </div>

        {/* Liste */}
        {loading ? (
            <SimilarSkeleton />
        ) : (
            <div className="flex flex-col gap-5">
                {articles.map((art) => (
                    <Link href={`/article/${art.id}`} key={art.id} className="group flex gap-3 items-start">
                        {/* Image miniature */}
                        <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 dark:border-zinc-800">
                             <Image 
                                src={getImageUrl(art.imageCouvertureUrl)} 
                                alt={art.titre}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                unoptimized
                             />
                        </div>
                        
                        {/* Contenu */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                             <span className="text-[9px] font-bold text-[#3E7B52] dark:text-[#13EC13] uppercase tracking-wide">
                                 {art.rubriqueNom || "Actualité"}
                             </span>
                             <h5 className="text-xs font-bold text-gray-800 dark:text-zinc-200 leading-snug line-clamp-2 group-hover:text-[#3E7B52] transition-colors">
                                 {art.titre}
                             </h5>
                        </div>
                    </Link>
                ))}
            </div>
        )}
        
        {/* Petit label algo */}
        <div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-zinc-800 text-center">
            <span className="text-[9px] text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded">
                Recommandé par notre algorithme et conçu pour vous plaire
            </span>
        </div>
    </div>
  );
}
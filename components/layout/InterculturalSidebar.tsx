// FICHIER: components/layout/InterculturelSidebar.tsx - VERSION NYT
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Brain, ArrowRight, TrendingUp } from "lucide-react";
import { PublicService } from "@/services/public";
import { ArticleReadDto } from "@/types/article";
import { PageResponse } from "@/types/dashboard";
import { getImageUrl } from "@/lib/utils";

export default function InterculturelSidebar() {
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response: PageResponse<ArticleReadDto> = await PublicService.getAdminArticles(0, 4);
        setArticles(response.content || []);
      } catch (error) {
        console.error("Erreur Interculturel Sidebar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <aside className="w-full space-y-6">
      
      {/* En-tête */}
      <div className="bg-[#3E7B52] text-white p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-widest">
            TODAY'S AFRICA
          </span>
        </div>
        
        <h3 className="text-lg font-bold leading-tight">
          Introduction à la Théorie de l'Intelligence Interculturelle et du Renseignement Interculturel
        </h3>

        <Link href="/intelligence-interculturelle">
          <button className="text-xs font-bold text-white flex items-center gap-2 hover:gap-3 transition-all border-b border-white/30 hover:border-white pb-1">
            En savoir plus <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      {/* Liste articles */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 px-2 border-l-2 border-[#3E7B52]">
          <TrendingUp size={14}/> Découvrir la théorie
        </h4>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-zinc-800"></div>
              <div className="h-2 bg-gray-200 dark:bg-zinc-800 w-2/3"></div>
            </div>
          ))
        ) : (
          articles.map((article) => (
            <Link href={`/article/${article.id}`} key={article.id} className="group block">
              <div className="border-b border-gray-200 dark:border-zinc-800 pb-3 hover:border-[#3E7B52] transition-colors">
                <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 group-hover:text-[#3E7B52] transition-colors mb-2">
                  {article.titre}
                </h5>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {article.rubriqueNom}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

    </aside>
  );
}
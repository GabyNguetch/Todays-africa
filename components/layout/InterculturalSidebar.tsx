"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, ArrowRight, TrendingUp } from "lucide-react";
import { PublicService } from "@/services/public";
import { ArticleReadDto } from "@/types/article";
import { PageResponse } from "@/types/dashboard";

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
    <aside className="w-full space-y-4 xl:space-y-6 2xl:space-y-8">
      
      {/* En-tête */}
      <div className="bg-[#3E7B52] text-white p-4 xl:p-5 2xl:p-7 space-y-3 xl:space-y-4">
        <div className="flex items-center gap-2 xl:gap-3">
          <Brain className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 shrink-0" />
          <span className="text-[10px] xl:text-xs 2xl:text-sm font-bold uppercase tracking-widest">
            TODAY'S AFRICA
          </span>
        </div>
        
        <h3 className="text-sm xl:text-base 2xl:text-lg font-bold leading-snug xl:leading-tight">
          Introduction à la Théorie de l'Intelligence Interculturelle et du Renseignement Interculturel
        </h3>

        <Link href="/intelligence-interculturelle">
          <button className="text-[10px] xl:text-xs 2xl:text-sm font-bold text-white flex items-center gap-2 hover:gap-3 transition-all border-b border-white/30 hover:border-white pb-1">
            En savoir plus <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      {/* Liste articles */}
      <div className="space-y-3 xl:space-y-4 2xl:space-y-5">
        <h4 className="flex items-center gap-2 text-[10px] xl:text-xs 2xl:text-sm font-bold uppercase tracking-widest text-gray-500 px-2 border-l-2 border-[#3E7B52]">
          <TrendingUp size={12} className="xl:w-3.5 xl:h-3.5 2xl:w-4 2xl:h-4" />
          Découvrir la théorie
        </h4>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-2 bg-gray-200 dark:bg-zinc-800 w-2/3 rounded"></div>
            </div>
          ))
        ) : (
          articles.map((article) => (
            <Link href={`/article/${article.id}`} key={article.id} className="group block">
              <div className="border-b border-gray-200 dark:border-zinc-800 pb-3 xl:pb-4 hover:border-[#3E7B52] transition-colors">
                <h5 className="text-xs xl:text-sm 2xl:text-base font-bold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 group-hover:text-[#3E7B52] transition-colors mb-1 xl:mb-2">
                  {article.titre}
                </h5>
                <span className="text-[9px] xl:text-[10px] 2xl:text-xs text-gray-500 uppercase tracking-wider">
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

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArticleReadDto } from "@/types/article";
import { Clock, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ArticleCardProps {
  article: ArticleReadDto;
  className?: string;
  imageHeight?: string; 
}

export default function ArticleCard({ article, className, imageHeight = "h-48" }: ArticleCardProps) {
  
  // --- 1. SÉCURISATION MAXIMALE DE LA RÉCUPÉRATION D'IMAGE ---
  const getCoverImage = () => {
    // A. Si l'image de couverture explicite existe, on la prend
    if (article.imageCouvertureUrl) return article.imageCouvertureUrl;

    // B. Sinon on cherche la première image dans les blocs de contenu
    // 🔥 CORRECTIF ICI : on vérifie que blocsContenu existe bien (Array.isArray) avant le find
    const blocs = Array.isArray(article.blocsContenu) ? article.blocsContenu : [];
    
    const firstImg = blocs.find(b => b.type === 'IMAGE');
    if (firstImg) return firstImg.contenu || firstImg.url || "";

    // C. Fallback par défaut si aucune image trouvée
    return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";
  };

  return (
    <Link 
      href={`/article/${article.id}`} 
      className={cn(
        "group flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:border-zinc-700 transition-all duration-300", 
        className
      )}
    >
      <div className={cn("relative w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden", imageHeight)}>
        <Image 
          src={getCoverImage()} 
          alt={article.titre || "Article sans titre"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          // Utilise le mode non-optimisé si c'est une image externe ou malformée
          unoptimized={true}
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Catégorie */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E7B52] dark:text-[#13EC13] bg-green-50 dark:bg-[#13EC13]/10 w-fit px-2 py-0.5 rounded">
          {article.rubriqueNom || "Actualité"}
        </span>
        
        {/* Titre */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-3 group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors">
          {article.titre}
        </h3>
        
        {/* Résumé */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {article.description || "Cliquez pour lire la suite de cet article..."}
        </p>
        
        {/* Footer Card */}
        <div className="pt-3 mt-auto border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-semibold uppercase flex items-center gap-1">
            <User size={12}/>
            <span className="truncate max-w-[80px]">{article.auteurNom || "Rédaction"}</span>
          </span>
          <span className="text-[10px] flex items-center gap-1">
            <Clock size={12} />
            {article.datePublication 
                ? format(new Date(article.datePublication), 'dd MMM yyyy', { locale: fr })
                : "Récemment"}
          </span>
        </div>
      </div>
    </Link>
  );
}
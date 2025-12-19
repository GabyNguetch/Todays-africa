"use client";

import React, { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicService } from "@/services/public"; // Utilise l'endpoint public
import { ArticleReadDto, BlocContenuDto } from "@/types/article";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);
  const [article, setArticle] = useState<ArticleReadDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        setIsLoading(true);
        if(!id) return;
        const numId = parseInt(id);
        
        if (!isNaN(numId)) {
            // Note: Utilise PublicService qui tape /api/proxy/public/articles/{id}
            const data = await PublicService.getArticleById(numId);
            setArticle(data);
        }
        setIsLoading(false);
    };
    load();
  }, [id]);

  if(isLoading) return <div className="h-screen bg-white dark:bg-black"></div>;
  if(!article) return notFound();

  // Trier les blocs
  const sortedBlocks = article.blocsContenu 
    ? [...article.blocsContenu].sort((a,b) => a.ordre - b.ordre) 
    : [];

  const renderBlock = (block: BlocContenuDto, idx: number) => {
      // Bloc Image
      if (block.type === 'IMAGE') {
          // Gestion sécurisée de l'URL : Priorité contenu, puis url
          const src = block.contenu || block.url;
          if(!src) return null;

          return (
            <figure key={`blk-${idx}`} className="my-8 w-full">
                <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-md">
                    <Image 
                        src={src} 
                        alt={block.altText || "Illustration article"} 
                        fill className="object-cover" 
                        unoptimized={true} // Important si URL externe (S3, Cloudinary via proxy)
                    />
                </div>
                {(block.legende || block.titre) && (
                    <figcaption className="text-center text-gray-500 text-xs mt-2 italic">
                        {block.legende || block.titre}
                    </figcaption>
                )}
            </figure>
          );
      }

      // Bloc Texte
      if (block.type === 'TEXTE') {
          return (
            <div 
                key={`blk-${idx}`} 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 font-serif leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: block.contenu }} // Le contenu est du HTML pur stocké par Tiptap
            />
          );
      }

      // Bloc Citation
      if (block.type === 'CITATION') {
          return (
            <blockquote key={`blk-${idx}`} className="border-l-4 border-[#3E7B52] pl-6 my-8 italic text-xl text-gray-800 dark:text-white bg-green-50 dark:bg-green-900/10 py-6 rounded-r-lg">
                "{block.contenu}"
            </blockquote>
          );
      }

      return null;
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header Article */}
        <header className="text-center mb-12">
            <span className="text-[#3E7B52] font-bold text-xs uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full mb-4 inline-block">
                {article.rubriqueNom || "Actualité"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                {article.titre}
            </h1>
            <p className="text-lg text-gray-500 font-serif mb-6">{article.description}</p>
            
            <div className="flex justify-center items-center gap-2 text-xs font-bold text-gray-400">
                <span>Par {article.auteurNom || "La Rédaction"}</span>
                <span>•</span>
                <span>{article.datePublication ? format(new Date(article.datePublication), 'dd MMMM yyyy', {locale: fr}) : "Non daté"}</span>
            </div>
        </header>

        {/* Cover Image (Si pas présente dans le corps, bonne pratique de l'afficher) */}
        {article.imageCouvertureUrl && (
            <div className="relative w-full h-[350px] md:h-[550px] rounded-2xl overflow-hidden mb-12 shadow-2xl">
                <Image 
                    src={article.imageCouvertureUrl} 
                    alt="Cover" fill className="object-cover" 
                    priority unoptimized={true} 
                />
            </div>
        )}

        {/* Corps des blocs */}
        <article className="max-w-3xl mx-auto">
            {sortedBlocks.map((b, i) => renderBlock(b, i))}
        </article>

      </main>
      <Footer />
    </div>
  );
}
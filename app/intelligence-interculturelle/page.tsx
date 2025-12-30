"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Globe, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import ArticleCard from "@/components/ui/ArticleCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicService } from "@/services/public";
import { ArticleReadDto } from "@/types/article";
import { PageResponse } from "@/types/dashboard";

const SkeletonCard = () => (
  <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden p-4 space-y-4 animate-pulse">
    <div className="h-48 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
    <div className="space-y-2">
      <div className="h-4 w-1/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-6 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
    </div>
  </div>
);

export default function IntelligenceInterculturelle() {
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAdminArticles = async () => {
      setLoading(true);
      try {
        const response: PageResponse<ArticleReadDto> = await PublicService.getAdminArticles(currentPage, 12);
        setArticles(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Erreur lors du chargement des articles admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminArticles();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#2563EB] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-8 md:p-16 rounded-3xl border border-blue-100 dark:border-zinc-700 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                <Brain size={48} />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Introduction à la Théorie de 
              <span className="text-blue-600 dark:text-blue-400 block">l'Intelligence Interculturelle</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez les analyses approfondies et les perspectives uniques de notre équipe éditoriale sur les enjeux interculturels qui façonnent l'Afrique moderne.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-800/50 px-6 py-3 rounded-full">
                <Users className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Analyses Expertes</span>
              </div>
              <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-800/50 px-6 py-3 rounded-full">
                <Globe className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Vision Continentale</span>
              </div>
              <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-800/50 px-6 py-3 rounded-full">
                <BookOpen className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Recherche Approfondie</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section Articles */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-sm uppercase">Publications Spécialisées</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Articles de Recherche et d'Analyse
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Une collection d'articles approfondis explorant les dimensions culturelles, sociales et économiques de l'Afrique contemporaine.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    className="h-full hover:shadow-xl transition-shadow duration-300"
                    imageHeight="h-48"
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-6"
                  >
                    Précédent
                  </Button>
                  
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Page {currentPage + 1} sur {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-6"
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="bg-gray-100 dark:bg-zinc-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <BookOpen size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                Aucun article disponible pour le moment
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Les publications spécialisées seront bientôt disponibles.
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-black">
              Approfondissez vos connaissances
            </h3>
            <p className="text-blue-100 text-lg">
              Rejoignez notre communauté de lecteurs passionnés par l'intelligence interculturelle et les enjeux africains.
            </p>
            <div className="pt-4">
              <Link href="/">
                <Button className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-xl">
                  Retour à l'accueil
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
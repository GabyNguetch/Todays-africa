"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle, Calendar, User, ArrowLeft, Loader2, XCircle, Send, Archive } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArticleReadDto } from "@/types/article"; // ou import depuis @/services/article selon ton setup
import { Button } from "@/components/ui/Button";

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleReadDto | null;
  // Actions
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onPublish?: (id: number) => void;
  onArchive?: (id: number) => void;
  isLoading?: boolean;
}

export default function ArticlePreviewModal({ 
    isOpen, onClose, article, isLoading, 
    onApprove, onReject, onPublish, onArchive 
}: PreviewProps) {
  
  // Bloque le scroll body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  if (!article || isLoading) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl flex flex-col items-center gap-3 border dark:border-zinc-800">
                <Loader2 className="animate-spin text-[#3E7B52]" size={32}/>
                <span className="text-sm font-medium dark:text-white">Chargement aperçu...</span>
            </div>
        </div>
      );
  }

  // Sécurisation blocs
  const safeBlocs = (article.blocsContenu || []).sort((a: any,b: any) => a.ordre - b.ordre);

  const renderBlock = (bloc: any, idx: number) => {
      // Image
      if(bloc.type === 'IMAGE') {
          return (
            <figure key={idx} className="my-8 relative">
                <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <Image src={bloc.url || bloc.contenu || ""} alt={bloc.altText || ""} fill className="object-cover" unoptimized={true} />
                </div>
                {(bloc.legende) && <figcaption className="text-center text-xs text-gray-500 mt-2 italic">{bloc.legende}</figcaption>}
            </figure>
          );
      }
      // Citation
      if(bloc.type === 'CITATION') {
          return (
            <blockquote key={idx} className="border-l-4 border-[#3E7B52] pl-6 my-8 italic text-xl text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-800/50 py-6 rounded-r">
                "{bloc.contenu}"
            </blockquote>
          );
      }
      // Texte HTML (Riche)
      return (
          <div key={idx} 
               className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed my-4" 
               dangerouslySetInnerHTML={{ __html: bloc.contenu }} 
          />
      );
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Container Fullscreen Adaptatif */}
      <div className="relative w-full h-full md:w-[90vw] md:h-[95vh] md:mt-[2.5vh] bg-white dark:bg-[#0a0a0a] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* HEADER MODAL : Status + Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shrink-0 z-10">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <ArrowLeft className="md:hidden text-black dark:text-white"/>
                    <X className="hidden md:block text-black dark:text-white"/>
                </button>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wide flex items-center gap-2">
                        Aperçu Modération 
                        <span className={`px-2 py-0.5 text-[10px] rounded border ${article.statut === 'PENDING_REVIEW' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                            {article.statut}
                        </span>
                    </h3>
                </div>
            </div>
        </div>

        {/* CONTENU SCROLLABLE */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-black scroll-smooth">
            <main className="max-w-[900px] mx-auto px-6 py-12">
                 
                 {/* Titraille */}
                 <div className="text-center max-w-3xl mx-auto mb-10">
                     <span className="text-[#3E7B52] dark:text-[#13EC13] text-xs font-black uppercase tracking-widest mb-4 inline-block">
                         {article.rubriqueNom || "Rubrique"}
                     </span>
                     <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.15] mb-6">{article.titre}</h1>
                     <p className="text-lg md:text-xl text-gray-500 dark:text-zinc-400 font-serif leading-relaxed">{article.description}</p>
                     
                     <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-400 font-bold uppercase tracking-wide">
                        <span className="flex items-center gap-2 text-black dark:text-white">
                             <User size={14}/> {article.auteurNom || "Rédaction"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-2"><Calendar size={14}/> {article.dateCreation ? new Date(article.dateCreation).toLocaleDateString() : "Date inconnue"}</span>
                        {article.region && <span className="text-[#3E7B52] ml-2 border border-green-800/30 px-2 py-0.5 rounded">{article.region}</span>}
                     </div>
                 </div>

                 {/* Cover Image */}
                 {article.imageCouvertureUrl && (
                     <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-2xl border border-gray-100 dark:border-zinc-800">
                         <Image src={article.imageCouvertureUrl} alt={article.titre} fill className="object-cover" priority unoptimized={true} />
                     </div>
                 )}

                 {/* Contenu Blocks */}
                 <div className="max-w-[700px] mx-auto text-lg leading-loose">
                    {safeBlocs.length > 0 ? safeBlocs.map((b: any, i: number) => renderBlock(b, i)) : <p className="text-center text-gray-400 italic py-10">Aucun contenu textuel.</p>}
                 </div>
            </main>
        </div>

        {/* BARRE D'ACTIONS ADMIN (Sticky Bottom) */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl shrink-0 flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono hidden sm:block">ID: {article.id}</span>
            
            <div className="flex gap-3 w-full sm:w-auto justify-end">
                {/* 1. Cas : En attente -> Valider ou Rejeter */}
                {article.statut === 'PENDING_REVIEW' && onReject && onApprove && (
                    <>
                        <Button 
                            onClick={() => onReject(article.id)}
                            className="w-auto h-11 px-6 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-none dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30"
                        >
                            <XCircle size={18} className="mr-2"/> Rejeter
                        </Button>
                        <Button 
                            onClick={() => onApprove(article.id)} 
                            className="w-auto h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                            <CheckCircle size={18} className="mr-2"/> Valider
                        </Button>
                    </>
                )}

                {/* 2. Cas : Approuvé -> Publier */}
                {article.statut === 'PENDING_REVIEW' && onPublish && (
                    <Button 
                        onClick={() => onPublish(article.id)}
                        className="w-full sm:w-auto h-11 px-8 bg-green-600 hover:bg-green-700 text-white font-bold animate-pulse shadow-lg shadow-green-900/20"
                    >
                        <Send size={18} className="mr-2"/> Mettre en Ligne
                    </Button>
                )}

                {/* 3. Cas : Publié -> Archiver (Retrait) */}
                {article.statut === 'PUBLISHED' && onArchive && (
                    <Button 
                        onClick={() => onArchive(article.id)}
                        className="w-auto h-11 px-6 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                    >
                        <Archive size={18} className="mr-2"/> Retirer / Archiver
                    </Button>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  MessageSquare, Send, Lock, User, ThumbsUp, 
  MessageCircle, CornerDownRight, Loader2 
} from "lucide-react";
import { PublicService } from "@/services/public";
import { useAuth } from "@/context/AuthContext";
import { CommentaireDto } from "@/types/article";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CommentSystemProps {
  articleId: number;
}

// Fonction pour générer une couleur d'avatar basée sur le nom
const getAvatarColor = (name: string = "") => {
  const colors = [
    "from-blue-400 to-indigo-500",
    "from-emerald-400 to-green-500",
    "from-orange-400 to-red-500",
    "from-purple-400 to-pink-500",
    "from-cyan-400 to-blue-500",
  ];
  const index = name.length % colors.length;
  return colors[index];
};

export default function CommentSystem({ articleId }: CommentSystemProps) {
  const { user } = useAuth();
  
  const [comments, setComments] = useState<CommentaireDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputContent, setInputContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Charger les commentaires au montage
  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      // On récupère "Tous" les commentaires (ou approved selon config API)
      // Note: Si l'API filtre encore les PENDING, assurez-vous que le backend renvoie tout pour ce contexte
      const data = await PublicService.getCommentsByArticle(articleId);
      
      // Tri : Les plus récents en premier
      const sorted = (data || []).sort((a, b) => 
        new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      );
      setComments(sorted);
    } catch (e) {
      console.error("Erreur chargement commentaires", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inputContent.trim()) return;

    setIsSubmitting(true);
    
    // 1. Optimistic Update (On crée un faux commentaire temporaire pour l'UI instantanée)
    const tempId = Date.now();
    const optimisticComment: CommentaireDto = {
        id: tempId,
        contenu: inputContent,
        articleId: articleId,
        auteurId: user.id,
        auteurNom: user.fullName || `${user.prenom} ${user.nom}`,
        dateCreation: new Date().toISOString(),
        status: 'APPROVED', // On considère que c'est direct visible
        likes: 0
    };

    // On l'ajoute tout de suite en haut de la liste
    setComments((prev) => [optimisticComment, ...prev]);
    const prevInput = inputContent;
    setInputContent(""); // Reset input

    try {
      // 2. Appel Réseau réel
      await PublicService.postComment({
        articleId,
        auteurId: user.id,
        contenu: prevInput,
        parentId: null 
      });

      // Optionnel : Recharger proprement pour avoir le vrai ID et date serveur
      // Ou garder l'optimistic si on veut économiser un call. 
      // Ici on reload silencieusement pour synchroniser les IDs pour la suppression/édition future
      const refreshedList = await PublicService.getCommentsByArticle(articleId);
      setComments(refreshedList.sort((a, b) => 
        new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      ));

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi.");
      // Rollback en cas d'erreur
      setComments((prev) => prev.filter(c => c.id !== tempId));
      setInputContent(prevInput);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
      return (
        <div className="flex flex-col gap-4 p-6 bg-gray-50/50 dark:bg-zinc-900/20 rounded-2xl animate-pulse h-full border border-gray-100 dark:border-zinc-800">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="space-y-4 mt-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      );
  }

  return (
    <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-0 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/30">
        <div className="flex items-center gap-2">
            <div className="bg-[#3E7B52]/10 dark:bg-[#13EC13]/10 p-1.5 rounded-lg text-[#3E7B52] dark:text-[#13EC13]">
                <MessageSquare size={16} strokeWidth={2.5}/>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                Discussions
            </h3>
        </div>
        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-gray-100 dark:border-zinc-700 shadow-sm">
            {comments.length} Réactions
        </span>
      </div>

      {/* --- LISTE DES COMMENTAIRES --- */}
      <div 
        ref={listRef} 
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
      >
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-70">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <MessageCircle size={28} className="text-gray-300 dark:text-zinc-600" />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-zinc-300">Aucun commentaire</p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 max-w-[180px] leading-snug mt-1">
                Soyez le premier à partager votre avis sur cet article.
            </p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const isMe = user?.id === comment.auteurId;
            return (
                <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2 flex gap-4 items-start" style={{ animationDelay: `${index * 50}ms` }}>
                  
                  {/* AVATAR */}
                  <div className={cn(
                      "w-9 h-9 rounded-2xl flex items-center justify-center text-white text-[10px] font-black shadow-md bg-gradient-to-br shrink-0 select-none",
                      getAvatarColor(comment.auteurNom)
                  )}>
                      {comment.auteurNom?.charAt(0).toUpperCase() || <User size={12}/>}
                  </div>
                  
                  {/* CONTENU */}
                  <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                          <span className="text-[12px] font-bold text-gray-900 dark:text-gray-200">
                              {comment.auteurNom || "Utilisateur Inconnu"}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">
                              {formatDistanceToNow(new Date(comment.dateCreation), { addSuffix: true, locale: fr })}
                          </span>
                      </div>
                      
                      <div className={cn(
                          "text-sm text-gray-600 dark:text-zinc-300 leading-relaxed bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-2xl rounded-tl-none whitespace-pre-wrap",
                          isMe ? "border border-[#3E7B52]/20 dark:border-[#13EC13]/20 bg-[#3E7B52]/5 dark:bg-[#13EC13]/5" : ""
                      )}>
                          {comment.contenu}
                      </div>

                      {/* INTERACTIONS LÉGÈRES */}
                      <div className="flex gap-4 mt-1.5 ml-2">
                          <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                              <ThumbsUp size={10} strokeWidth={2.5} /> {comment.likes || 0}
                          </button>
                          <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                              <CornerDownRight size={10} strokeWidth={2.5} /> Répondre
                          </button>
                      </div>
                  </div>
                </div>
            );
          })
        )}
      </div>

      {/* --- ZONE DE SAISIE --- */}
      <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] z-10 relative">
        {user ? (
            <form 
                onSubmit={handleSubmit} 
                className={cn(
                    "relative group transition-all duration-300 rounded-2xl border bg-gray-50 dark:bg-zinc-900",
                    inputContent.length > 0 
                        ? "border-[#3E7B52] shadow-sm ring-1 ring-[#3E7B52]/20 dark:border-[#3E7B52]/50" 
                        : "border-gray-200 dark:border-zinc-800"
                )}
            >
                <textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="Écrivez votre commentaire..."
                    className="w-full h-12 py-3 px-4 text-sm bg-transparent resize-none outline-none text-gray-800 dark:text-white placeholder:text-gray-400 focus:h-24 transition-[height] ease-in-out duration-200 rounded-2xl"
                    style={{ minHeight: "3rem" }}
                    maxLength={2000}
                />
                
                {/* Footer Input */}
                <div className="flex justify-between items-center px-2 pb-2">
                    <span className={cn("text-[9px] font-medium transition-opacity px-2", inputContent.length > 1800 ? "text-red-500" : "text-gray-400 opacity-50 group-focus-within:opacity-100")}>
                        {inputContent.length > 0 && `${inputContent.length}/2000`}
                    </span>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting || inputContent.trim().length === 0}
                        className={cn(
                            "p-2 rounded-xl transition-all shadow-sm flex items-center justify-center",
                            inputContent.trim().length > 0 
                                ? "bg-[#3E7B52] hover:bg-[#2d5f3e] text-white scale-100 opacity-100 cursor-pointer" 
                                : "bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
                        )}
                        title="Envoyer"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} strokeWidth={2.5} className={inputContent.length > 0 ? "ml-0.5" : ""} />}
                    </button>
                </div>
            </form>
        ) : (
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-4 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-3">
                 <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                     <Lock size={12} /> Connectez-vous pour rejoindre la discussion
                 </p>
                 <Link href="/login">
                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 uppercase tracking-wide px-6">
                        Se connecter
                    </Button>
                 </Link>
            </div>
        )}
      </div>

    </div>
  );
}
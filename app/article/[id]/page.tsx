"use client";

import React, { useEffect, useState, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticleReadDto } from "@/types/article";
import { PublicService } from "@/services/public";
import { useAuth } from "@/context/AuthContext";
import { 
  Share2, Heart, Copy, Facebook, Twitter, CheckCircle
} from "lucide-react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { cn, getImageUrl } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import CommentSystem from "@/components/article/CommentSystem";
import SimilarArticles from "@/components/article/SimilarArticles";

// ==========================================
// UTILITIES
// ==========================================
const compactNumber = (num?: number) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isValid(d) ? format(d, "d MMMM yyyy", { locale: fr }) : "";
};

// ==========================================
// SKELETON COMPONENT
// ==========================================
const ArticleSkeleton = () => (
  <div className="bg-[#FDFDFD] dark:bg-black min-h-screen animate-pulse">
    <Navbar /> 
    <div className="max-w-[1100px] mx-auto w-full px-6 md:px-12 py-12">
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-10 mb-12">
        <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded-full mb-8"></div>
        <div className="space-y-4 mb-8">
          <div className="h-12 w-[90%] bg-gray-300 dark:bg-zinc-800 rounded-lg"></div>
          <div className="h-12 w-[70%] bg-gray-300 dark:bg-zinc-800 rounded-lg"></div>
        </div>
        <div className="h-4 w-[85%] bg-gray-100 dark:bg-zinc-900 rounded"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="w-full aspect-[16/10] bg-gray-200 dark:bg-zinc-800 rounded-xl mb-12"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded"></div>)}
          </div>
        </div>
        <aside className="lg:col-span-4 h-64 bg-gray-50 dark:bg-zinc-900 rounded-xl"></aside>
      </div>
    </div>
  </div>
);

// ==========================================
// CONTENT BLOCK RENDERER
// ==========================================
function ContentBlock({ bloc }: { bloc: any }) {
  switch(bloc.type) {
    case 'IMAGE': 
      return (
        <figure className="my-10 w-full group">
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <Image src={getImageUrl(bloc.url || bloc.contenu)} alt={bloc.altText || "Illustration"} fill className="object-cover" unoptimized/>
          </div>
          {bloc.legende && <figcaption className="mt-3 text-xs text-gray-500 dark:text-zinc-500 font-mono tracking-wide text-center">▲ {bloc.legende}</figcaption>}
        </figure>
      );
    case 'CITATION':
      return (
        <div className="my-10 pl-6 border-l-4 border-[#3E7B52] py-2">
          <blockquote className="font-serif text-2xl text-gray-800 dark:text-white italic leading-relaxed">
            "{bloc.contenu}"
          </blockquote>
        </div>
      );
    case 'VIDEO':
      return (
        <div className="my-10 w-full aspect-video bg-black rounded-lg overflow-hidden">
          <iframe src={bloc.url || bloc.contenu} className="w-full h-full border-0" allowFullScreen></iframe>
        </div>
      );
    case 'TEXTE':
    default:
      return <div dangerouslySetInnerHTML={{__html: bloc.contenu}} />;
  }
}

// ==========================================
// SHARE MENU COMPONENT
// ==========================================
function ShareMenu({ 
  article, 
  showShare, 
  onClose, 
  onCopy 
}: { 
  article: ArticleReadDto;
  showShare: boolean;
  onClose: () => void;
  onCopy: () => void;
}) {
  if (!showShare) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 rounded-xl p-1 z-30 flex flex-col gap-1 animate-in fade-in zoom-in-95 origin-top-right">
      <button onClick={onCopy} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-xs font-bold transition-colors">
        <Copy size={14} /> Copier le lien
      </button>
      <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1"/>
      <a 
        href={`https://twitter.com/intent/tweet?text=${article.titre}&url=${typeof window !== 'undefined' ? window.location.href : ''}`} 
        target="_blank" 
        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 rounded-lg text-xs font-medium transition-colors"
      >
        <Twitter size={14}/> Twitter
      </a>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} 
        target="_blank" 
        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 rounded-lg text-xs font-medium transition-colors"
      >
        <Facebook size={14}/> Facebook
      </a>
    </div>
  );
}

// ==========================================
// ARTICLE HEADER COMPONENT
// ==========================================
function ArticleHeader({ 
  article, 
  isLiked, 
  onToggleLike,
  showShare,
  onToggleShare 
}: {
  article: ArticleReadDto;
  isLiked: boolean;
  onToggleLike: () => void;
  showShare: boolean;
  onToggleShare: () => void;
}) {
  return (
    <header className="mb-12 border-b border-gray-200 dark:border-zinc-800 pb-10">
      {/* Meta Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3E7B52] dark:text-[#13EC13] px-3 py-1 bg-[#3E7B52]/5 rounded-md border border-[#3E7B52]/10">
            {article.rubriqueNom || "Actualité"}
          </span>
          <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
          <span className="text-gray-400 dark:text-zinc-500 text-xs font-mono">
            {formatDate(article.datePublication)}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleLike} 
            className={cn("p-2.5 rounded-full border transition-all duration-300 active:scale-95 group", 
              isLiked ? "bg-red-50 border-red-200 text-red-500 shadow-inner" : "border-gray-100 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500 bg-white dark:bg-zinc-900 dark:border-zinc-800"
            )}
            title="Favori"
          >
            <Heart size={20} className={cn("transition-transform", isLiked && "fill-current scale-110")} />
          </button>

          <div className="relative">
            <button 
              onClick={onToggleShare} 
              className="p-2.5 rounded-full border border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-95"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-[900] text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-8">
        {article.titre}
      </h1>

      <p className="text-xl md:text-2xl text-gray-600 dark:text-zinc-300 leading-relaxed font-serif font-light max-w-4xl border-l-[3px] border-[#3E7B52] pl-6 md:pl-8 py-2">
        {article.description}
      </p>

      {/* Author Info */}
      <div className="mt-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full flex items-center justify-center font-bold text-lg text-gray-500 overflow-hidden ring-2 ring-white dark:ring-black">
          {article.auteurNom ? article.auteurNom.substring(0,1).toUpperCase() : "R"}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {article.auteurNom || "La Rédaction"} 
            {article.region && <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-[10px] font-medium text-gray-500 uppercase tracking-wide border border-gray-200 dark:border-zinc-700">Bureau {article.region}</span>}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">Journaliste TODAY'S AFRICA</span>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// SIDEBAR STATS COMPONENT
// ==========================================
function SidebarStats({ 
  views, 
  likes 
}: { 
  views?: number;
  likes: number;
}) {
  return (
    <div className="flex gap-4 items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="text-center">
        <span className="block font-black text-2xl text-gray-900 dark:text-white">{compactNumber(views)}</span>
        <span className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">Lectures</span>
      </div>
      <div className="h-8 w-px bg-gray-200 dark:bg-zinc-700"></div>
      <div className="text-center">
        <span className="block font-black text-2xl text-[#3E7B52] dark:text-[#13EC13] transition-all">{compactNumber(likes)}</span>
        <span className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">Favoris</span>
      </div>
    </div>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const articleId = parseInt(id);
  const router = useRouter();
  const { user } = useAuth();

  // --- STATE ---
  const [article, setArticle] = useState<ArticleReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showShare, setShowShare] = useState(false);

  // --- TRACKING REFS ---
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);

  // --- DATA LOADING ---
  useEffect(() => {
    if (isNaN(articleId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const initPage = async () => {
      setLoading(true);
      try {
        const [fetchedArticle, fetchedLikeStatus] = await Promise.all([
          PublicService.getById(articleId),
          user ? PublicService.checkIfLiked(articleId) : Promise.resolve(false)
        ]);

        if (!fetchedArticle) {
          setNotFound(true);
        } else {
          setArticle(fetchedArticle);
          setIsLiked(fetchedLikeStatus);
          setLikesCount(fetchedArticle.partages || 0);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [articleId, user]);

  // --- ANALYTICS TRACKING ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = Math.round((scrollTop / docHeight) * 100);
      if (percentage > maxScroll.current) maxScroll.current = percentage;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      
      if (articleId && !loading && !notFound) {
        const durationSeconds = Math.round((Date.now() - startTime.current) / 1000);
        const finalScroll = Math.min(100, Math.max(0, maxScroll.current));
        
        if (durationSeconds > 5) {
          PublicService.recordView(articleId, {
            dureeVue: durationSeconds,
            scrollDepth: finalScroll,
            userId: user?.id
          });
        }
      }
    };
  }, [articleId, user?.id, loading, notFound]);

  // --- HANDLERS ---
  const handleToggleLike = async () => {
    if (!user) { 
      router.push("/login"); 
      return; 
    }
    
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      await PublicService.toggleLike(articleId, isLiked);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShare(false);
    alert("Lien copié !");
  };

  // --- RENDER STATES ---
  if (loading) return <ArticleSkeleton />;
  
  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center">
        <Navbar/>
        <div className="text-center space-y-4 mt-20">
          <h1 className="text-4xl font-black">404</h1>
          <p>Article introuvable.</p>
          <Button onClick={() => router.push('/')} className="w-auto px-6">Retour accueil</Button>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="bg-[#FDFDFD] dark:bg-black min-h-screen font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1100px] mx-auto w-full px-6 md:px-12 py-12 relative flex-1 animate-in fade-in duration-500">
        
        {/* Article Header */}
        <ArticleHeader 
          article={article}
          isLiked={isLiked}
          onToggleLike={handleToggleLike}
          showShare={showShare}
          onToggleShare={() => setShowShare(!showShare)}
        />

        {/* Share Menu (positioned absolutely) */}
        <div className="relative">
          <ShareMenu 
            article={article}
            showShare={showShare}
            onClose={() => setShowShare(false)}
            onCopy={copyToClipboard}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Article Content */}
          <div className="lg:col-span-8">
            
            {/* Cover Image */}
            {article.imageCouvertureUrl && (
              <figure className="mb-12 group cursor-zoom-in">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 bg-gray-50">
                  <Image 
                    src={getImageUrl(article.imageCouvertureUrl)} 
                    alt={article.titre} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    unoptimized 
                    priority
                  />
                </div>
                <figcaption className="mt-3 text-[11px] text-gray-400 text-right font-mono uppercase tracking-wider flex items-center justify-end gap-2">
                  Crédit: Tody Africa ©
                </figcaption>
              </figure>
            )}

            {/* Article Body */}
            <div className="article-body font-serif text-[18px] md:text-[20px] leading-[1.8] text-[#1a1a1a] dark:text-[#d4d4d8]">
              {article.blocsContenu && article.blocsContenu
                .sort((a,b) => a.ordre - b.ordre)
                .map((bloc, i) => (
                  <ContentBlock key={i} bloc={bloc} />
                ))
              }
            </div>
            
            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-dashed border-gray-200 dark:border-zinc-800">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Mots-clés</p>
              <div className="flex flex-wrap gap-2">
                {article.tags && article.tags.map(t => (
                  <span key={t} className="px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-full uppercase tracking-wide hover:bg-[#3E7B52] hover:text-white transition-all cursor-default">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              
              {/* Stats */}
              <SidebarStats views={article.vues} likes={likesCount} />
              
              {/* Similar Articles */}
              <SimilarArticles currentArticleId={articleId} />
              
              {/* Comments */}
              <div className="min-h-[500px]">
                <CommentSystem articleId={articleId} />
              </div>
              
            </div>
          </aside>

        </div>
      </main>

      <Footer />
      
      {/* Article Body Styles */}
      <style jsx global>{`
        .article-body p { margin-bottom: 1.5em; }
        .article-body h2 { font-weight: 900; margin-top: 2em; margin-bottom: 0.5em; font-size: 1.75em; line-height: 1.1; letter-spacing: -0.02em; font-family: var(--font-sans); }
        .article-body h3 { font-weight: 800; margin-top: 1.5em; margin-bottom: 0.5em; font-size: 1.5em; font-family: var(--font-sans); }
        .article-body a { color: #3E7B52; text-decoration: underline; text-underline-offset: 4px; font-weight: 600; }
        .article-body ul, .article-body ol { margin-bottom: 1.5em; padding-left: 1.5em; }
        .article-body li { margin-bottom: 0.5em; position: relative; }
        .dark .article-body p { color: #d4d4d8; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
      `}</style>
    </div>
  );
}
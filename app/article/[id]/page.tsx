"use client";

import React, { useEffect, useState, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticleReadDto } from "@/types/article";
import { PublicService } from "@/services/public";
import { useAuth } from "@/context/AuthContext";
import { 
  Share2, Heart, Copy, Facebook, Twitter, CheckCircle, 
  Eye, TrendingUp, Clock, User, Tag, Calendar
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
  <div className="bg-white dark:bg-black min-h-screen">
    <Navbar /> 
    <div className="max-w-[1200px] mx-auto w-full px-6 md:px-12 py-12">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-12 mb-12">
        <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 mb-8 animate-pulse"></div>
        <div className="space-y-4 mb-8">
          <div className="h-12 w-[90%] bg-gray-300 dark:bg-zinc-800 animate-pulse"></div>
          <div className="h-12 w-[70%] bg-gray-300 dark:bg-zinc-800 animate-pulse"></div>
        </div>
        <div className="h-4 w-[85%] bg-gray-100 dark:bg-zinc-900 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="w-full aspect-[16/10] bg-gray-200 dark:bg-zinc-800 mb-12 animate-pulse"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-4 w-full bg-gray-100 dark:bg-zinc-900 animate-pulse"></div>)}
          </div>
        </div>
        <aside className="lg:col-span-4 h-64 bg-gray-50 dark:bg-zinc-900 animate-pulse"></aside>
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
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-gray-100 dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 transition-all duration-500 hover:border-[#3E7B52] dark:hover:border-[#3E7B52]">
            <Image 
              src={getImageUrl(bloc.url || bloc.contenu)} 
              alt={bloc.altText || "Illustration"} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              unoptimized
            />
          </div>
          {bloc.legende && (
            <figcaption className="mt-4 text-xs text-gray-500 dark:text-zinc-500 font-mono tracking-wide uppercase flex items-center gap-2">
              <div className="w-8 h-px bg-[#3E7B52]"></div>
              {bloc.legende}
            </figcaption>
          )}
        </figure>
      );
    case 'CITATION':
      return (
        <div className="my-12 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3E7B52]"></div>
          <blockquote className="pl-8 py-4 font-serif text-2xl md:text-3xl text-gray-800 dark:text-white italic leading-relaxed">
            "{bloc.contenu}"
          </blockquote>
        </div>
      );
    case 'VIDEO':
      return (
        <div className="my-10 w-full aspect-video bg-black overflow-hidden border-2 border-gray-200 dark:border-zinc-800">
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
    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 shadow-2xl border-2 border-gray-200 dark:border-zinc-800 p-2 z-30 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
      <button 
        onClick={onCopy} 
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-bold transition-all duration-200 group"
      >
        <Copy size={16} className="transition-transform group-hover:scale-110" /> 
        <span>Copier le lien</span>
      </button>
      <div className="h-px bg-gray-200 dark:bg-zinc-800"/>
      <a 
        href={`https://twitter.com/intent/tweet?text=${article.titre}&url=${typeof window !== 'undefined' ? window.location.href : ''}`} 
        target="_blank" 
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-medium transition-all duration-200 group"
      >
        <Twitter size={16} className="transition-transform group-hover:scale-110"/> 
        <span>Partager sur Twitter</span>
      </a>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} 
        target="_blank" 
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-medium transition-all duration-200 group"
      >
        <Facebook size={16} className="transition-transform group-hover:scale-110"/> 
        <span>Partager sur Facebook</span>
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
    <header className="mb-12 border-b-2 border-gray-200 dark:border-zinc-800 pb-12">
      {/* Meta Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white bg-[#3E7B52] dark:bg-[#3E7B52] px-4 py-2 border-2 border-[#3E7B52]">
            {article.rubriqueNom || "Actualité"}
          </span>
          <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-500">
            <Calendar size={14} />
            <span className="text-xs font-mono uppercase tracking-wider">
              {formatDate(article.datePublication)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleLike} 
            className={cn(
              "p-3 border-2 transition-all duration-300 active:scale-95 group relative overflow-hidden",
              isLiked 
                ? "bg-[#3E7B52] border-[#3E7B52] text-white" 
                : "border-gray-300 dark:border-zinc-700 hover:border-[#3E7B52] dark:hover:border-[#3E7B52] text-gray-500 hover:text-[#3E7B52] bg-white dark:bg-zinc-900"
            )}
            title="Favori"
          >
            <Heart 
              size={20} 
              className={cn(
                "transition-all duration-300",
                isLiked && "fill-current scale-110"
              )} 
            />
          </button>

          <div className="relative">
            <button 
              onClick={onToggleShare} 
              className="p-3 border-2 border-gray-300 dark:border-zinc-700 hover:border-[#3E7B52] dark:hover:border-[#3E7B52] text-gray-500 hover:text-[#3E7B52] dark:text-zinc-400 dark:hover:text-[#3E7B52] transition-all duration-300 active:scale-95 bg-white dark:bg-zinc-900"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {article.titre}
      </h1>

      <div className="relative pl-8 py-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3E7B52]"></div>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-zinc-300 leading-relaxed font-serif font-light max-w-4xl">
          {article.description}
        </p>
      </div>

      {/* Author Info */}
      <div className="mt-10 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center font-black text-xl text-gray-600 dark:text-zinc-400 overflow-hidden border-2 border-gray-300 dark:border-zinc-700">
          {article.auteurNom ? article.auteurNom.substring(0,1).toUpperCase() : "R"}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <User size={14} />
              {article.auteurNom || "La Rédaction"}
            </span>
            {article.region && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-[9px] font-black text-gray-600 dark:text-zinc-400 uppercase tracking-wider border border-gray-300 dark:border-zinc-700">
                Bureau {article.region}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide">Journaliste TODAY'S AFRICA</span>
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
    <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 p-6 transition-all duration-300 hover:border-[#3E7B52] dark:hover:border-[#3E7B52] group">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
        <TrendingUp size={14} />
        Statistiques
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 transition-all duration-300 group-hover:border-[#3E7B52]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700">
              <Eye size={18} className="text-gray-600 dark:text-zinc-400" />
            </div>
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">Lectures</span>
          </div>
          <span className="font-black text-2xl text-gray-900 dark:text-white">{compactNumber(views)}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#3E7B52]/5 dark:bg-[#3E7B52]/10 border border-[#3E7B52]/20 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-900 border border-[#3E7B52]">
              <Heart size={18} className="text-[#3E7B52]" />
            </div>
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">Favoris</span>
          </div>
          <span className="font-black text-2xl text-[#3E7B52]">{compactNumber(likes)}</span>
        </div>
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
    <div className="bg-white dark:bg-black min-h-screen font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1200px] mx-auto w-full px-6 md:px-12 py-12 relative flex-1">
        
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
              <figure className="mb-12 group cursor-zoom-in animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative w-full aspect-[16/10] overflow-hidden border-2 border-gray-200 dark:border-zinc-800 bg-gray-50 transition-all duration-500 hover:border-[#3E7B52] dark:hover:border-[#3E7B52]">
                  <Image 
                    src={getImageUrl(article.imageCouvertureUrl)} 
                    alt={article.titre} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    unoptimized 
                    priority
                  />
                </div>
                <figcaption className="mt-4 text-[10px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <div className="w-8 h-px bg-[#3E7B52]"></div>
                  Crédit: Today Africa ©
                </figcaption>
              </figure>
            )}

            {/* Article Body */}
            <div className="article-body text-justify font-serif text-[18px] md:text-[20px] leading-[1.8] text-gray-900 dark:text-zinc-100 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              {article.blocsContenu && article.blocsContenu
                .sort((a,b) => a.ordre - b.ordre)
                .map((bloc, i) => (
                  <ContentBlock key={i} bloc={bloc} />
                ))
              }
            </div>
            
            {/* Tags */}
            <div className="mt-16 pt-8 border-t-2 border-gray-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Tag size={14} />
                Mots-clés
              </p>
              <div className="flex flex-wrap gap-3">
                {article.tags && article.tags.map((t, idx) => (
                  <span 
                    key={t} 
                    className="px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wide hover:bg-[#3E7B52] hover:text-white hover:border-[#3E7B52] dark:hover:border-[#3E7B52] transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
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
              <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                <SidebarStats views={article.vues} likes={likesCount} />
              </div>
              
              {/* Similar Articles */}
              <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                <SimilarArticles currentArticleId={articleId} />
              </div>
              
              {/* Comments */}
              <div className="min-h-[500px] animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                <CommentSystem articleId={articleId} />
              </div>
              
            </div>
          </aside>

        </div>
      </main>

      <Footer />
      
      {/* Article Body Styles */}
      <style jsx global>{`
        .article-body p { 
          margin-bottom: 1.5em; 
          animation: fadeIn 0.7s ease-in-out;
          text-align: justify; /* Ajout ici aussi pour plus de spécificité */
        }
        .article-body h2 { 
          font-weight: 900; 
          margin-top: 2em; 
          margin-bottom: 0.5em; 
          font-size: 1.75em; 
          line-height: 1.1; 
          letter-spacing: -0.02em; 
          font-family: var(--font-sans);
          border-left: 4px solid #3E7B52;
          padding-left: 1rem;
        }
        .article-body h3 { 
          font-weight: 800; 
          margin-top: 1.5em; 
          margin-bottom: 0.5em; 
          font-size: 1.5em; 
          font-family: var(--font-sans);
          border-left: 3px solid #3E7B52;
          padding-left: 0.75rem;
        }
        .article-body a { 
          color: #3E7B52; 
          text-decoration: none;
          font-weight: 600;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s ease;
        }
        .article-body a:hover {
          border-bottom-color: #3E7B52;
        }
        .article-body ul, .article-body ol { 
          margin-bottom: 1.5em; 
          padding-left: 1.5em; 
        }
        .article-body li { 
          margin-bottom: 0.5em; 
          position: relative; 
        }
        .article-body ul li::before {
          content: "";
          position: absolute;
          left: -1.5em;
          top: 0.7em;
          width: 6px;
          height: 6px;
          background: #3E7B52;
        }
        .dark .article-body p { 
          color: #e4e4e7; 
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .custom-scrollbar::-webkit-scrollbar { 
          width: 6px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #3E7B52;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2d5c3d;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #18181b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #3E7B52; 
        }
      `}</style>
    </div>
  );
}
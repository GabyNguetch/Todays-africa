"use client";

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, AlertTriangle, Archive, Calendar, 
  FileText, Loader2, ArrowUpRight, Shield, 
  Eye, LayoutGrid, RotateCcw, Trash2, Lock, Rocket
} from 'lucide-react';
import { ArticleService } from '@/services/article';
import { ArticleReadDto } from '@/types/article';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ArticlePreviewModal from './ArticlePreviewModal';
import AdvancedPublishModal from './AdvancedPublishModal'; 

const StatCard = ({ label, value, icon: Icon, colorClass, borderClass }: any) => (
    <div className={cn("p-5 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between animate-in fade-in zoom-in-95 duration-500 hover:shadow-md transition-all group cursor-pointer", borderClass)}>
        <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className={cn("text-3xl font-black transition-all group-hover:scale-110", colorClass)}>{value !== null ? value : "-"}</p>
        </div>
        <div className={cn("p-3 rounded-xl opacity-20 group-hover:opacity-30 transition-all", colorClass.replace('text-', 'bg-'))}>
            <Icon size={24} className={colorClass} style={{ opacity: 1 }}/>
        </div>
    </div>
);

export default function AdminArticles() {
  
  const [activeTab, setActiveTab] = useState<'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'>('PENDING_REVIEW');
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<ArticleReadDto | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [articleToPublish, setArticleToPublish] = useState<number | null>(null);
  
  const [stats, setStats] = useState({ 
      total: 0,
      pending: 0, 
      approved: 0, 
      published: 0,
      archived: 0
  });

  useEffect(() => {
    loadArticles();
    updateStats(); 
  }, [activeTab]);

  const loadArticles = async () => {
    setLoading(true);
    try {
        console.log(`📡 ADMIN LOAD LIST [${activeTab}]...`);
        const res = await ArticleService.getArticlesByStatus(activeTab, 0, 100);
        const list = Array.isArray(res) ? res : (res.content || []);
        setArticles(list);
    } catch (e) {
        console.error("❌ ERROR LIST:", e);
        setArticles([]);
    } finally {
        setLoading(false);
    }
  };

  const updateStats = async () => {
      try {
          const [p, a, pub, arc] = await Promise.all([
              ArticleService.getArticlesByStatus('PENDING_REVIEW', 0, 1),
              ArticleService.getArticlesByStatus('APPROVED', 0, 1),
              ArticleService.getArticlesByStatus('PUBLISHED', 0, 1),
              ArticleService.getArticlesByStatus('ARCHIVED', 0, 1)
          ]);

          const countPending = p.totalElements ?? p.length ?? 0;
          const countApproved = a.totalElements ?? a.length ?? 0;
          const countPublished = pub.totalElements ?? pub.length ?? 0;
          const countArchived = arc.totalElements ?? arc.length ?? 0;

          setStats({
              pending: countPending,
              approved: countApproved,
              published: countPublished,
              archived: countArchived,
              total: countPending + countApproved + countPublished + countArchived
          });
      } catch (e) { console.error("Stats Error", e); }
  };

  const openPreview = (article: ArticleReadDto) => {
      setPreviewArticle(article);
      setIsPreviewOpen(true);
  };

  const handleApprove = async (id: number) => {
    try {
        await ArticleService.approve(id);
        closeModalAndRefresh("✅ Article approuvé avec succès !");
    } catch (e: any) { alert(`Erreur: ${e.message}`); }
  };

  const initiatePublish = (id: number) => {
    setIsPreviewOpen(false); // Fermer le preview
    setArticleToPublish(id);
    setIsPublishModalOpen(true);
  };

  const handleReject = async (id: number) => {
      const motif = prompt("Motif du rejet :", "Non conforme à la ligne éditoriale.");
      if (motif === null) return;
      if (!motif.trim()) return alert("Motif requis.");

      try {
          await ArticleService.reject(id, motif);
          closeModalAndRefresh("Article rejeté.");
      } catch (e) { alert("Erreur lors du rejet."); }
  };

  const handleArchive = async (id: number) => {
      if(!confirm("⚠️ Confirmer l'archivage ? L'article ne sera plus visible publiquement.")) return;
      try {
          await ArticleService.archive(id);
          closeModalAndRefresh("Article archivé.");
      } catch (e) { alert("Erreur archivage."); }
  };

  const handleRepublish = async (id: number) => {
      if(!confirm("📢 Voulez-vous remettre cet article en ligne immédiatement ?")) return;
      setActionLoadingId(id);
      try {
          await ArticleService.publish(id); 
          
          setArticles(prev => prev.filter(a => a.id !== id));
          updateStats();
          alert("L'article est de nouveau en ligne !");
      } catch(e: any) {
          alert(`Impossible de republier: ${e.message}`);
      } finally {
          setActionLoadingId(null);
      }
  };

  const handleDeletePermanently = async (id: number) => {
      if(!confirm("⛔ DANGER : Suppression DÉFINITIVE.\n\nCette action est irréversible. Voulez-vous vraiment supprimer cet article de la base de données ?")) return;
      
      setActionLoadingId(id);
      try {
          await ArticleService.delete(id);
          setArticles(prev => prev.filter(a => a.id !== id));
          updateStats();
          alert("Article supprimé définitivement.");
      } catch(e) {
          alert("Erreur lors de la suppression.");
      } finally {
          setActionLoadingId(null);
      }
  };

  const handleSetPreview = async (id: number) => {
      const dateEnd = prompt("Date de fin de l'avant-première (format: YYYY-MM-DDTHH:MM:SS):", 
          new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,19));
      
      if(!dateEnd) return;

      try {
          await ArticleService.setPreviewMode(id, { 
              dateFinAvantPremiere: dateEnd,
              accessRestreint: true 
          });
          closeModalAndRefresh("Mode avant-première activé !");
      } catch(e: any) {
          alert("Erreur: " + e.message);
      }
  };

  const closeModalAndRefresh = (msg?: string) => {
      if(msg) alert(msg);
      setIsPreviewOpen(false);
      setPreviewArticle(null);
      setIsPublishModalOpen(false);
      setArticleToPublish(null);
      
      if (previewArticle) {
          setArticles(prev => prev.filter(a => a.id !== previewArticle.id));
      }
      updateStats();
      loadArticles();
  };

  const tabs = [
      { id: 'PENDING_REVIEW', label: 'En attente', icon: AlertTriangle, color: "text-orange-500" },
      { id: 'APPROVED', label: 'Validés', icon: CheckCircle, color: "text-blue-500" },
      { id: 'PUBLISHED', label: 'En Ligne', icon: ArrowUpRight, color: "text-green-600" },
      { id: 'ARCHIVED', label: 'Archivés', icon: Archive, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-32">
        
        {/* MODALS */}
        <ArticlePreviewModal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
            article={previewArticle}
            isLoading={false} 
            onApprove={handleApprove}
            onReject={handleReject}
            onPublish={() => previewArticle && initiatePublish(previewArticle.id)}
            onArchive={handleArchive}
            onRepublish={handleRepublish}
            onDelete={handleDeletePermanently}
            onSetPreview={handleSetPreview}
        />

        {articleToPublish && (
            <AdvancedPublishModal 
                isOpen={isPublishModalOpen}
                onClose={() => { setIsPublishModalOpen(false); setArticleToPublish(null); }}
                articleId={articleToPublish}
                onSuccess={() => { closeModalAndRefresh("🎉 Publication configurée avec succès !"); }}
            />
        )}

        {/* HEADER */}
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#3E7B52] to-[#2e623f] dark:from-[#13EC13] dark:to-[#0dbd0d] rounded-xl">
                        <Shield className="text-white dark:text-black h-6 w-6"/>
                    </div>
                    Administration
                </h2>
                <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium">Pilotage du flux éditorial, validation et gestion des archives.</p>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={() => { updateStats(); loadArticles(); }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
                    title="Actualiser"
                >
                    <RotateCcw size={18}/>
                </button>
            </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard 
                label="Total Articles" 
                value={stats.total} 
                icon={LayoutGrid} 
                colorClass="text-indigo-600 dark:text-indigo-400" 
                borderClass="border-transparent bg-indigo-50/50 dark:bg-indigo-900/10"
            />
            <StatCard 
                label="À Valider" 
                value={stats.pending} 
                icon={AlertTriangle} 
                colorClass="text-orange-600" 
                borderClass={activeTab === 'PENDING_REVIEW' ? "border-orange-500 ring-2 ring-orange-500/20" : "border-transparent"}
            />
            <StatCard 
                label="Prêts" 
                value={stats.approved} 
                icon={CheckCircle} 
                colorClass="text-blue-600 dark:text-blue-400" 
                borderClass={activeTab === 'APPROVED' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent"}
            />
            <StatCard 
                label="En Ligne" 
                value={stats.published} 
                icon={ArrowUpRight} 
                colorClass="text-green-600 dark:text-green-400" 
                borderClass={activeTab === 'PUBLISHED' ? "border-green-500 ring-2 ring-green-500/20" : "border-transparent"}
            />
            <StatCard 
                label="Archivés" 
                value={stats.archived} 
                icon={Archive} 
                colorClass="text-gray-500 dark:text-zinc-400" 
                borderClass={activeTab === 'ARCHIVED' ? "border-gray-400 ring-2 ring-gray-400/20" : "border-transparent"}
            />
        </div>

        {/* TABS */}
        <div className="border-b border-gray-100 dark:border-zinc-800 pb-1 flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-2 pb-3 px-1 text-xs font-bold uppercase tracking-widest transition-all border-b-2 shrink-0 relative group",
                        activeTab === tab.id 
                            ? `border-[#3E7B52] dark:border-[#13EC13] text-black dark:text-white` 
                            : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    )}
                >
                    <tab.icon size={16} className={activeTab === tab.id ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-300"} />
                    {tab.label}
                    {activeTab === tab.id && (
                        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3E7B52] to-[#2e623f] dark:from-[#13EC13] dark:to-[#0dbd0d] rounded-full"></span>
                    )}
                </button>
            ))}
        </div>

        {/* TABLEAU */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 min-h-[400px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="relative">
                        <Loader2 className="animate-spin text-[#3E7B52] dark:text-[#13EC13]" size={40}/>
                        <div className="absolute inset-0 animate-ping">
                            <Loader2 className="text-[#3E7B52]/20 dark:text-[#13EC13]/20" size={40}/>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider animate-pulse">Synchronisation en cours...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 dark:bg-zinc-950/30 text-gray-400 uppercase text-[10px] font-extrabold border-b border-gray-100 dark:border-zinc-800 tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Article</th>
                                <th className="px-6 py-5">Auteur</th>
                                <th className="px-6 py-5">Dates</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                            {articles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full">
                                                <FileText size={32} className="text-gray-400 dark:text-zinc-500"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600 dark:text-zinc-400">Aucun article ici pour le moment.</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {activeTab === 'PENDING_REVIEW' && "Les articles soumis apparaîtront ici"}
                                                    {activeTab === 'APPROVED' && "Les articles validés apparaîtront ici"}
                                                    {activeTab === 'PUBLISHED' && "Les articles publiés apparaîtront ici"}
                                                    {activeTab === 'ARCHIVED' && "Les articles archivés apparaîtront ici"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {articles.map((art) => (
                                <tr key={art.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                                    
                                    <td className="px-8 py-5 max-w-xs md:max-w-md cursor-pointer" onClick={() => openPreview(art)}>
                                        <div className="flex items-start gap-3">
                                            {art.imageCouvertureUrl && (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 ring-1 ring-gray-200 dark:ring-zinc-700">
                                                    <img src={art.imageCouvertureUrl} alt="" className="w-full h-full object-cover"/>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors line-clamp-2 mb-2">
                                                    {art.titre || "Sans titre"}
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                                                        {art.rubriqueNom || "Général"}
                                                    </span>
                                                    {art.enAvantPremiere && (
                                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                                            <Lock size={8}/> Premium
                                                        </span>
                                                    )}
                                                    {art.id && <span className="text-[10px] font-mono text-gray-300">#{art.id}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-zinc-300 shadow-sm shrink-0">
                                                {art.auteurNom ? art.auteurNom.substring(0,2).toUpperCase() : "U"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs text-gray-900 dark:text-gray-200 whitespace-nowrap">{art.auteurNom || "Rédacteur Inconnu"}</span>
                                                <span className="text-[10px] text-gray-400 hidden sm:inline">Rédacteur</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5 text-xs">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-500 whitespace-nowrap">
                                                <Calendar size={12}/>
                                                <span>{art.dateCreation ? format(new Date(art.dateCreation), "d MMM yyyy", { locale: fr }) : "-"}</span>
                                            </div>
                                            {art.statut === 'PUBLISHED' && art.datePublication && (
                                                <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold text-[10px] whitespace-nowrap flex items-center gap-1">
                                                    <Rocket size={10}/> {format(new Date(art.datePublication), "dd/MM à HH:mm")}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            
                                            {activeTab === 'ARCHIVED' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleRepublish(art.id)}
                                                        disabled={actionLoadingId === art.id}
                                                        className="h-9 px-3 flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-xs font-bold disabled:opacity-50"
                                                        title="Republier"
                                                    >
                                                        {actionLoadingId === art.id ? <Loader2 className="animate-spin" size={14}/> : <RotateCcw size={14}/>}
                                                        <span className="hidden md:inline">Republier</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeletePermanently(art.id)}
                                                        disabled={actionLoadingId === art.id}
                                                        className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Supprimer définitivement"
                                                    >
                                                        <Trash2 size={16}/>
                                                    </button>
                                                    <span className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1"></span>
                                                </>
                                            )}

                                            <button 
                                                onClick={() => openPreview(art)}
                                                className={cn(
                                                    "h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm whitespace-nowrap",
                                                    activeTab === 'PENDING_REVIEW' 
                                                        ? "bg-gradient-to-r from-[#3E7B52] to-[#2e623f] hover:from-[#2e623f] hover:to-[#1e4a2f] text-white hover:shadow-md dark:from-[#13EC13] dark:to-[#0dbd0d] dark:text-black dark:hover:from-[#0dbd0d] dark:hover:to-[#0a9d0a]" 
                                                        : "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
                                                )}
                                            >
                                                {activeTab === 'PENDING_REVIEW' ? <CheckCircle size={14}/> : <Eye size={14}/>}
                                                <span className="hidden md:inline">{activeTab === 'PENDING_REVIEW' ? "Décider" : "Aperçu"}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
  );
}
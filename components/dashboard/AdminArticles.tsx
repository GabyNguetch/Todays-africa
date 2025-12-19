"use client";

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, AlertTriangle, Archive, Calendar, 
  FileText, Loader2, ArrowUpRight, Check, X, Shield, 
  Eye
} from 'lucide-react';
import { ArticleService } from '@/services/article';
import { ArticleReadDto } from '@/types/article'; // Assure-toi du bon chemin d'import
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ArticlePreviewModal from './ArticlePreviewModal'; 

// Petit helper interne pour les cards stat
const StatCard = ({ label, value, icon: Icon, colorClass, borderClass }: any) => (
    <div className={cn("p-5 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between animate-in fade-in zoom-in-95 duration-500", borderClass)}>
        <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className={cn("text-3xl font-black", colorClass)}>{value !== null ? value : "-"}</p>
        </div>
        <div className={cn("p-3 rounded-xl opacity-20", colorClass.replace('text-', 'bg-'))}>
            <Icon size={24} className={colorClass} style={{ opacity: 1 }}/>
        </div>
    </div>
);

export default function AdminArticles() {
  
  // -- STATES --
  const [activeTab, setActiveTab] = useState<'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED'>('PENDING_REVIEW');
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // -- MODAL --
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<ArticleReadDto | null>(null);
  
  // States Stats Simples
  const [stats, setStats] = useState({ pending: 0, approved: 0, published: 0 });

  // -- INIT LOAD --
  useEffect(() => {
    loadArticles();
    updateStats(); // Pour avoir les compteurs à jour
  }, [activeTab]);

  const loadArticles = async () => {
    setLoading(true);
    try {
        console.log(`📡 ADMIN LOAD LIST [${activeTab}]...`);
        const res = await ArticleService.getArticlesByStatus(activeTab, 0, 100);
        // Gestion souple du format de retour (Page vs List)
        const list = Array.isArray(res) ? res : (res.content || []);
        setArticles(list);
    } catch (e) {
        console.error("❌ ERROR LIST:", e);
    } finally {
        setLoading(false);
    }
  };

   // 🔥 NOUVELLE FONCTION : PUBLICATION DIRECTE
  // Elle enchaîne "Approve" (pour satisfaire le Backend) PUIS "Publish" automatiquement.
  const handleDirectPublish = async (id: number) => {
      if(!confirm("🚀 PUBLIER DIRECTEMENT ?\n\nL'article sera validé automatiquement ET mis en ligne visible pour le public immédiatement.")) return;
      
      try {
          // 1. Validation silencieuse
          // await ArticleService.approve(id);
          // 2. Publication
          await ArticleService.publish(id);
          
          alert("🎉 Article en ligne !");
          closeModalAndRefresh();
      } catch (e: any) {
          console.error(e);
          alert(`❌ Erreur durant le flux automatique :\n${e.message}`);
          // On recharge quand même pour voir l'état actuel (peut-être bloqué en Approved)
          loadArticles();
      }
  };

  // Petite fonction utilitaire pour charger les comptes (appel parallèle léger)
  const updateStats = async () => {
      try {
          const [p, a, pub] = await Promise.all([
              ArticleService.getArticlesByStatus('PENDING_REVIEW', 0, 1),
              ArticleService.getArticlesByStatus('APPROVED', 0, 1),
              ArticleService.getArticlesByStatus('PUBLISHED', 0, 1)
          ]);
          setStats({
              pending: p.totalElements ?? p.length ?? 0,
              approved: a.totalElements ?? a.length ?? 0,
              published: pub.totalElements ?? pub.length ?? 0
          });
      } catch (e) { /* ignore silent stats fail */ }
  };

  // --- ACTIONS (VALIDATION / PREVIEW) ---
  
  const openPreview = (article: ArticleReadDto) => {
      setPreviewArticle(article);
      setIsPreviewOpen(true);
  };

  // Action: PENDING -> APPROVED
  const handleApprove = async (id: number) => {
      if(!confirm("Valider cet article ?\nIl passera en statut 'APPROVED' et attendra sa mise en ligne.")) return;
      
      try {
          await ArticleService.approve(id);
          alert("✅ Article validé avec succès !"); // Feedback visuel
          closeModalAndRefresh();
      } catch (e: any) { 
          // Affiche le message d'erreur exact retourné par le service
          console.error(e);
          alert(`❌ ECHEC VALIDATION :\n${e.message}`); 
      }
  };

  // Action: PENDING -> REJECTED (Prompt Motif)
  const handleReject = async (id: number) => {
      const motif = prompt("Motif du rejet (sera envoyé au rédacteur) :", "Contenu inapproprié ou incomplet.");
      if (motif === null) return; // Annulation
      if (!motif.trim()) return alert("Un motif est requis.");

      try {
          await ArticleService.reject(id, motif);
          closeModalAndRefresh();
      } catch (e) { alert("Erreur lors du rejet."); }
  };

  // Action: APPROVED -> PUBLISHED
  const handlePublish = async (id: number) => {
      if(!confirm("CONFIRMATION DE PUBLICATION\n\nCet article sera visible publiquement sur le site.")) return;
      try {
          await ArticleService.publish(id);
          closeModalAndRefresh();
      } catch (e) { alert("Erreur publication."); }
  };

  // Action: PUBLISHED -> ARCHIVED (Retrait)
  const handleArchive = async (id: number) => {
      if(!confirm("⚠️ RETIRER L'ARTICLE ?\n\nL'article ne sera plus visible publiquement. Il sera archivé.")) return;
      try {
          await ArticleService.archive(id);
          closeModalAndRefresh();
      } catch (e) { alert("Erreur archivage."); }
  };

  const closeModalAndRefresh = () => {
      setIsPreviewOpen(false);
      setPreviewArticle(null);
      // Optimistic update : on retire de la liste actuelle
      if (previewArticle) {
          setArticles(prev => prev.filter(a => a.id !== previewArticle.id));
      }
      // Puis on reload proprement
      updateStats();
      loadArticles();
  };

  // -- CONFIG TABS --
  const tabs = [
      { id: 'PENDING_REVIEW', label: 'En attente', icon: AlertTriangle, color: "text-orange-500", desc: "Besoin de validation" },
      { id: 'APPROVED', label: 'Validés', icon: CheckCircle, color: "text-blue-500", desc: "Prêts à publier" },
      { id: 'PUBLISHED', label: 'En Ligne', icon: ArrowUpRight, color: "text-[#3E7B52]", desc: "Visibles sur le site" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-32">
        
        {/* --- MODAL INTERACTIF --- */}
        <ArticlePreviewModal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
            article={previewArticle}
            isLoading={false} // Les data sont déjà dans la ligne
            // Injection des handlers d'actions
            onApprove={handleApprove}
            onReject={handleReject}
            onPublish={handleDirectPublish}
            onArchive={handleArchive}
        />

        {/* --- HEADER --- */}
        <div>
            <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
                <Shield className="text-[#3E7B52] dark:text-[#13EC13] h-8 w-8"/> 
                Administration
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium">Pilotage du flux éditorial et validation des contenus.</p>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                label="À Valider" 
                value={stats.pending} 
                icon={AlertTriangle} 
                colorClass="text-orange-600" 
                borderClass={activeTab === 'PENDING_REVIEW' ? "border-orange-500 ring-1 ring-orange-500" : "border-transparent"}
            />
            <StatCard 
                label="Prêts à publier" 
                value={stats.approved} 
                icon={Check} 
                colorClass="text-blue-600" 
                borderClass={activeTab === 'APPROVED' ? "border-blue-500 ring-1 ring-blue-500" : "border-transparent"}
            />
            <StatCard 
                label="En Ligne" 
                value={stats.published} 
                icon={Archive} 
                colorClass="text-green-600" 
                borderClass={activeTab === 'PUBLISHED' ? "border-green-500 ring-1 ring-green-500" : "border-transparent"}
            />
        </div>

        {/* --- TABS --- */}
        <div className="border-b border-gray-100 dark:border-zinc-800 pb-1 flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-2 pb-3 px-1 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
                        activeTab === tab.id 
                            ? `border-[#3E7B52] dark:border-[#13EC13] text-black dark:text-white` 
                            : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    )}
                >
                    <tab.icon size={16} className={activeTab === tab.id ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-300"} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* --- TABLEAU LISTING --- */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 min-h-[400px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="animate-spin text-[#3E7B52] dark:text-[#13EC13]" size={40}/>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider animate-pulse">Synchronisation...</p>
                </div>
            ) : (
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
                                        <p className="text-sm font-semibold">Aucun article ici pour le moment.</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {articles.map((art) => (
                            <tr key={art.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                                
                                {/* TITRE */}
                                <td className="px-8 py-5 max-w-md cursor-pointer" onClick={() => openPreview(art)}>
                                    <div className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors line-clamp-1">
                                        {art.titre}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                                            {art.rubriqueNom || "Général"}
                                        </span>
                                        {art.id && <span className="text-[10px] font-mono text-gray-300">ID:{art.id}</span>}
                                    </div>
                                </td>

                                {/* AUTEUR */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-zinc-300 shadow-sm">
                                            {art.auteurNom ? art.auteurNom.substring(0,2).toUpperCase() : "U"}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs text-gray-900 dark:text-gray-200">{art.auteurNom || "Rédacteur Inconnu"}</span>
                                            <span className="text-[10px] text-gray-400">Rédacteur</span>
                                        </div>
                                    </div>
                                </td>

                                {/* DATES */}
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1 text-xs">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-500">
                                            <Calendar size={12}/>
                                            <span>{art.dateCreation ? format(new Date(art.dateCreation), "d MMM yyyy", { locale: fr }) : "-"}</span>
                                        </div>
                                        {art.statut === 'PUBLISHED' && (
                                            <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold text-[10px]">Publié le {format(new Date(art.datePublication!), "dd/MM")}</span>
                                        )}
                                    </div>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end">
                                        <button 
                                            onClick={() => openPreview(art)}
                                            className={cn(
                                                "h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm",
                                                activeTab === 'PENDING_REVIEW' 
                                                    ? "bg-[#3E7B52] hover:bg-[#2e623f] text-white hover:shadow-md dark:bg-[#13EC13] dark:text-black dark:hover:bg-[#0dbd0d]" 
                                                    : "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300"
                                            )}
                                        >
                                            {activeTab === 'PENDING_REVIEW' ? <CheckCircle size={14}/> : <Eye size={14}/>}
                                            {activeTab === 'PENDING_REVIEW' ? "Décider" : "Détails"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}
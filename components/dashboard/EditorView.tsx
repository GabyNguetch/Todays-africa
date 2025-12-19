// FICHIER: components/dashboard/EditorView.tsx
"use client";

import React, { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard";
import { ArticleBackend, StatsDashboard } from "@/types/dashboard";
import { Eye, FileText, MessageSquare, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditorView() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsDashboard | null>(null);
  const [recentArticles, setRecentArticles] = useState<ArticleBackend[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Chargement Parallèle pour la vitesse
      const [statsData, articlesData] = await Promise.all([
        dashboardService.getMyStats(),
        dashboardService.getMyArticles()
      ]);

      setStats(statsData);
      setRecentArticles(articlesData.slice(0, 5)); // Les 5 derniers
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#3E7B52]" size={40} /></div>;
  }

  // Cards Data
  const statsDisplay = [
    { label: 'Articles Publiés', value: stats?.totalArticles || 0, icon: FileText, color: 'text-blue-600' },
    { label: 'Vues Totales', value: stats?.totalVues || 0, icon: Eye, color: 'text-green-600' },
    { label: 'Commentaires', value: stats?.totalCommentaires || 0, icon: MessageSquare, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de Bord Rédacteur</h2>
        <p className="text-gray-500 text-sm">Aperçu de vos performances et contenus récents.</p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsDisplay.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{item.label}</p>
              <p className={cn("text-3xl font-extrabold mt-1", item.color)}>{item.value}</p>
            </div>
            <div className={cn("p-3 rounded-full bg-gray-50 dark:bg-zinc-800", item.color)}>
              <item.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* --- TABLEAU RÉCENT --- */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="font-bold text-gray-900 dark:text-white">Vos derniers articles</h3>
        </div>
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500">
                <tr>
                    <th className="px-6 py-3 font-bold">Titre</th>
                    <th className="px-6 py-3 font-bold">Date</th>
                    <th className="px-6 py-3 font-bold">Statut</th>
                    <th className="px-6 py-3 font-bold text-right">Vues</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                {recentArticles.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Aucun article trouvé. Commencez à rédiger !</td></tr>
                ) : (
                    recentArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{article.titre}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs flex items-center gap-1">
                                <Calendar size={12}/> 
                                {article.datePublication ? new Date(article.datePublication).toLocaleDateString() : "Non publié"}
                            </td>
                            <td className="px-6 py-4">
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                    article.statut === "PUBLIE" ? "bg-green-100 text-green-700" : 
                                    article.statut === "REJETE" ? "bg-red-100 text-red-700" : 
                                    "bg-yellow-100 text-yellow-700"
                                )}>
                                    {article.statut}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono">{article.vues || 0}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from 'react';
import { ArticleService } from '@/services/article';
import { Users, User, ShieldCheck, UserPlus, X, Search, Loader2, Mail, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth';

// Structure User pour typer un minimum
interface UserData {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    dateCreation?: string;
    actif?: boolean;
    stats?: {
        totalArticles: number;
        vues: number;
    };
}

export default function AdminRedacteurs() {
  
  const [activeTab, setActiveTab] = useState<'TEAM' | 'USERS'>('TEAM');
  const [dataList, setDataList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Au changement d'onglet, on charge les données correspondantes
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setDataList([]);
    
    try {
        if (activeTab === 'TEAM') {
            console.log("📥 Chargement Équipe...");
            const users = await ArticleService.getAllRedacteurs();
            
            // Enrichissement Safe avec Promise.all
            // On vérifie que u existe bien pour éviter le crash
            const enriched = await Promise.all(users.map(async (u: any) => {
                if(!u) return null; // Sécurité objet vide
                
                try {
                    const stats = await ArticleService.getAuthorStats(u.id);
                    return { 
                        ...u, 
                        stats: stats || { totalArticles: 0, vues: 0, commentaires: 0 } 
                    };
                } catch {
                    // Fallback si l'API stats échoue pour un user précis
                    return { ...u, stats: { totalArticles: 0, vues: 0 } };
                }
            }));
            
            // Filtrer les nulls éventuels générés par le Promise.all
            setDataList(enriched.filter((u): u is UserData => u !== null));

        } else {
            console.log("📥 Chargement Liste Globale Utilisateurs...");
            const users = await ArticleService.getAllUsers();
            setDataList(users.filter(u => u !== null)); // Simple sécurité null check
        }
    } catch(e) {
        console.error("❌ Erreur chargement données:", e);
    } finally {
        setLoading(false);
    }
  };

  const handleSuccessCreate = () => {
      setIsModalOpen(false);
      setActiveTab('TEAM'); // Force le retour sur l'équipe
      loadData(); 
  };

  // Filtrage insensible à la casse
  const filteredList = dataList.filter(u => 
      (u.nom || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (u.prenom || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-zinc-800 pb-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <Users className="text-blue-600"/> Annuaire Utilisateurs
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Gestion des accès et vue d'ensemble.</p>
                </div>
                
                {/* Onglets */}
                <div className="flex p-1 bg-gray-100 dark:bg-zinc-900 rounded-lg w-fit">
                    <button
                        onClick={() => { setActiveTab('TEAM'); setSearchQuery(""); }}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                            activeTab === 'TEAM' 
                                ? "bg-white dark:bg-zinc-800 text-blue-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        )}
                    >
                        <ShieldCheck size={14}/> Équipe Rédaction
                    </button>
                    <button
                        onClick={() => { setActiveTab('USERS'); setSearchQuery(""); }}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                            activeTab === 'USERS' 
                                ? "bg-white dark:bg-zinc-800 text-blue-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        )}
                    >
                        <User size={14}/> Tous les Inscrits
                    </button>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto items-center">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={16}/>
                    <input 
                        type="text" 
                        placeholder={activeTab === 'TEAM' ? "Chercher rédacteur..." : "Chercher utilisateur..."} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 h-10 w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-auto h-10 px-4 font-bold bg-[#3E7B52] hover:bg-[#2e623f] text-white shadow-lg flex items-center gap-2 shrink-0"
                >
                    <UserPlus size={16}/> <span className="hidden sm:inline">Rédacteur</span>
                </Button>
            </div>
        </div>

        {/* --- LISTING --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32}/>
                <p className="text-xs font-bold text-gray-400">Chargement...</p>
            </div>
        ) : filteredList.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed dark:border-zinc-800">
                <Users size={40} className="mx-auto text-gray-300 mb-4"/>
                <p className="text-gray-500 text-sm">Aucun résultat trouvé.</p>
            </div>
        ) : (
            <>
            {/* VUE REDACTEURS (Cards) */}
            {activeTab === 'TEAM' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredList.map((r, idx) => (
                        // 🔥 FIX KEY HERE: On utilise r.id s'il existe, sinon l'index de map
                        <div key={r.id || `red-${idx}`} className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                            <div className="flex items-start gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md uppercase">
                                    {r.prenom?.[0]}{r.nom?.[0]}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{r.prenom} {r.nom}</h3>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{r.role}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-0 border-t border-gray-100 dark:border-zinc-800 pt-4">
                                <div className="text-center border-r border-gray-100 dark:border-zinc-800">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">{compactNumber(r.stats?.totalArticles)}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Articles</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-[#3E7B52]">{compactNumber(r.stats?.vues)}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Vues</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VUE UTILISATEURS (Table) */}
            {activeTab === 'USERS' && (
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Nom complet</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4 text-right">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {filteredList.map((u, idx) => (
                                // 🔥 FIX KEY HERE EGALEMENT
                                <tr key={u.id || `user-${idx}`} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-gray-500">
                                            {u.prenom?.[0]}{u.nom?.[0]}
                                        </div>
                                        {u.prenom} {u.nom}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs font-mono">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                            u.role === 'ADMIN' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                            u.role === 'REDACTEUR' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                            "bg-gray-100 text-gray-600 border-gray-200"
                                        )}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-gray-400 font-mono">
                                        #{u.id}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </>
        )}

        {/* --- MODAL --- */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}/>
                <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                    <div className="px-6 py-4 border-b dark:border-zinc-800 flex justify-between bg-gray-50 dark:bg-zinc-950">
                        <h3 className="font-bold text-gray-900 dark:text-white">Créer Rédacteur</h3>
                        <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button>
                    </div>
                    <WrapperCreateRedacteur onSuccess={handleSuccessCreate}/>
                </div>
            </div>
        )}
    </div>
  );
}

// Helpers Locaux
function compactNumber(num?: number) {
    if (!num) return '0';
    return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

// Wrapper simple pour le form
const WrapperCreateRedacteur = ({ onSuccess }: { onSuccess: () => void }) => {
    const [form, setForm] = useState({ prenom:"", nom:"", email:"", motDePasse:"" });
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.createRedacteur(form);
            onSuccess();
        } catch(e) { alert("Erreur."); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Prénom</label>
                    <input className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                           required value={form.prenom} onChange={e=>setForm({...form, prenom:e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Nom</label>
                    <input className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                           required value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} />
                </div>
            </div>
            <div>
                 <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Email</label>
                 <input type="email" className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            </div>
            <div>
                 <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Mot de passe</label>
                 <input type="password" className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        required value={form.motDePasse} onChange={e=>setForm({...form, motDePasse:e.target.value})} />
            </div>
            <div className="flex justify-end mt-4">
                <Button disabled={loading} className="w-auto h-9 px-6 bg-[#3E7B52] text-xs font-bold">
                    {loading ? "..." : "Créer le compte"}
                </Button>
            </div>
        </form>
    );
};
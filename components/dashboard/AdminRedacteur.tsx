"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { AdminService } from '@/services/admin';
import { 
  Users, User, ShieldCheck, UserPlus, X, Search, Loader2, 
  Mail, Hash, ShieldAlert, Copy, Check, TrendingUp, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth';

interface UserData {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    stats?: { totalArticles: number; vues: number; };
}

export default function AdminRedacteurs() {
  const [activeTab, setActiveTab] = useState<'TEAM' | 'USERS'>('TEAM');
  const [dataList, setDataList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copyStatus, setCopyStatus] = useState<number | null>(null);

  // === CHARGEMENT DES DONNÉES ===
  const loadData = async () => {
    setLoading(true);
    try {
        if (activeTab === 'TEAM') {
            const raw = await AdminService.getAllRedacteurs();
            
            // Filtrer les données invalides et enrichir avec stats
            const validUsers = raw.filter(u => u && u.id != null && u.nom && u.prenom && u.email);
            
            const enriched = await Promise.all(validUsers.map(async (u: any) => {
                const s = await AdminService.getAuthorStats(u.id);
                return { 
                    ...u, 
                    stats: { 
                        totalArticles: s?.totalArticles || 0, 
                        vues: s?.totalVues || s?.vues || 0 
                    }
                };
            }));
            setDataList(enriched);
        } else {
            const all = await AdminService.getAllUsers();
            // Filtrer les données invalides
            const validUsers = all.filter(u => u && u.id != null && u.nom && u.prenom && u.email);
            setDataList(validUsers);
        }
    } catch (e) {
        console.error("❌ Crash Dashboard Admin Users:", e);
        setDataList([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [activeTab]);

  // === FILTRAGE INTELLIGENT ===
  const filteredList = useMemo(() => {
      console.log(`🔎 [LOG] Filtrage pour: "${searchQuery}"`);
      return dataList.filter(u => 
        u && u.nom && u.prenom && u.email &&
        `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [dataList, searchQuery]);

// === CRÉATION RÉDACTEUR ===
const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // ✅ Capturer la référence du formulaire AVANT l'async
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const prenom = (formData.get('prenom') as string).trim();
    const nom = (formData.get('nom') as string).trim();
    const email = (formData.get('email') as string).trim().toLowerCase();
    const motDePasse = (formData.get('password') as string);

    // Validation côté client
    if (!email || !motDePasse) {
        alert("L'email et le mot de passe sont requis.");
        return;
    }

    if (motDePasse.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Format d'email invalide.");
        return;
    }

    const payload = {
        prenom,
        nom,
        email,
        motDePasse,
    };

    console.group("%c🚀 [POST] Création de Rédacteur", "color: #ff9900; font-weight: bold;");
    console.log("Payload:", payload);
    
    setIsCreating(true);
    try {
        await authService.createRedacteur(payload);
        console.log("✅ Création réussie");
        
        // ✅ Utiliser la référence capturée AVANT l'async
        form.reset();
        setIsModalOpen(false);
        
        // Recharger la liste
        await loadData();
        
        // Message de succès
        alert(`✅ Rédacteur créé avec succès !\n\n👤 ${prenom} ${nom}\n📧 ${email}\n🔑 ${motDePasse}\n\n⚠️ Communiquez ces identifiants de manière sécurisée.`);
    } catch (err) {
        console.error("❌ Échec de la création:", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors de la création du compte.";
        alert(`❌ ÉCHEC DE LA CRÉATION\n\n${errorMessage}`);
    } finally {
        setIsCreating(false);
        console.groupEnd();
    }
};


  const handleCopy = (email: string, id: number) => {
      navigator.clipboard.writeText(email);
      setCopyStatus(id);
      setTimeout(() => setCopyStatus(null), 2000);
  };

  // Fonction helper pour obtenir les initiales de manière sécurisée
  const getInitials = (prenom: string, nom: string) => {
      const firstInitial = prenom && prenom.length > 0 ? prenom[0].toUpperCase() : '?';
      const lastInitial = nom && nom.length > 0 ? nom[0].toUpperCase() : '?';
      return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="pb-32 space-y-8 animate-in fade-in duration-700">
        
        {/* --- NAVBAR DE GESTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-[#3E7B52] rounded-2xl shadow-lg shadow-green-900/20 text-white">
                    <Users size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Annuaire Global</h2>
                    <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Contrôle des privilèges</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                 {/* Tabs switcher */}
                 <div className="bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex gap-1">
                    {[
                        { id: 'TEAM', label: 'Équipe', icon: ShieldCheck },
                        { id: 'USERS', label: 'Membres', icon: User }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                                activeTab === tab.id 
                                    ? "bg-white dark:bg-zinc-700 text-[#3E7B52] dark:text-[#13EC13] shadow-md scale-105" 
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            )}>
                            <tab.icon size={16}/> {tab.label}
                        </button>
                    ))}
                 </div>
                 
                 <Button onClick={() => setIsModalOpen(true)} className="w-auto h-12 bg-[#3E7B52] dark:bg-white dark:text-black font-black uppercase text-xs rounded-2xl border-none">
                     <UserPlus size={18} className="mr-2" /> Nouveau Rédacteur
                 </Button>
            </div>
        </div>

        {/* --- FILTRES --- */}
        <div className="relative group max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E7B52] transition-colors" size={20}/>
            <input 
                type="text" 
                placeholder="Chercher un nom, prénom ou email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-sm outline-none focus:ring-4 focus:ring-[#3E7B52]/10 transition-all shadow-sm"
            />
            {searchQuery && (
                 <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                    <X size={18}/>
                 </button>
            )}
        </div>

        {/* --- LISTING --- */}
        {loading ? (
            <div className="py-32 flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-[#3E7B52]" size={48} strokeWidth={3}/>
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">Chargement sécurisé...</span>
            </div>
        ) : filteredList.length === 0 ? (
            <div className="py-24 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-800 animate-in zoom-in-95">
                <Filter className="mx-auto text-gray-200 dark:text-zinc-700 mb-4" size={64}/>
                <h3 className="text-gray-500 font-black">Aucun résultat trouvé</h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-1000">
                {filteredList.map((item, idx) => (
                    <div key={item.id} 
                        className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Déco & Rôle */}
                        <div className="absolute top-4 right-6 flex items-center gap-2">
                             <span className={cn(
                                 "text-[8px] font-black tracking-widest px-3 py-1 rounded-full uppercase",
                                 item.role === 'REDACTEUR' ? "bg-green-50 text-[#3E7B52] dark:bg-green-900/30 dark:text-[#13EC13]" : "bg-purple-50 text-purple-600 dark:bg-purple-900/30"
                             )}>
                                 {item.role || 'USER'}
                             </span>
                        </div>

                        <div className="flex flex-col gap-6 relative z-10">
                            {/* User Info Section */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#3E7B52] to-[#2d5c3d] rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-green-900/20 ring-4 ring-white dark:ring-zinc-900">
                                    {getInitials(item.prenom, item.nom)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-black dark:text-white leading-tight flex items-center gap-2">
                                        {item.prenom} {item.nom}
                                        {item.role === 'ADMIN' && <ShieldAlert size={14} className="text-amber-500"/>}
                                    </h3>
                                    <p className="text-[11px] font-mono text-gray-400 mt-0.5 flex items-center gap-1">
                                        <Hash size={12}/> ID {item.id}
                                    </p>
                                </div>
                            </div>

                            {/* Info Card Body */}
                            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-zinc-300">
                                    <div className="flex items-center gap-2 truncate">
                                        <Mail size={14} className="text-[#3E7B52] shrink-0" />
                                        <span className="truncate">{item.email}</span>
                                    </div>
                                    <button onClick={() => handleCopy(item.email, item.id)} className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-gray-400 transition-all active:scale-90">
                                        {copyStatus === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Stats Line (If available) */}
                            {activeTab === 'TEAM' && item.stats && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50/50 dark:bg-green-900/10 p-3 rounded-2xl border border-green-100/50 dark:border-green-800/30 text-center">
                                        <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{compactNumber(item.stats.totalArticles)}</p>
                                        <p className="text-[9px] font-bold text-[#3E7B52] uppercase">Articles</p>
                                    </div>
                                    <div className="bg-[#13EC13]/5 dark:bg-blue-900/10 p-3 rounded-2xl border border-gray-100 dark:border-zinc-700 text-center">
                                        <p className="text-xl font-black text-[#3E7B52] dark:text-[#13EC13] tracking-tighter">{compactNumber(item.stats.vues)}</p>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Lectures</p>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Interactions au survol */}
                        <div className="mt-6 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                             <Button variant="ghost" className="h-8 text-[9px] font-bold w-auto">Modifier</Button>
                             <button className="text-xs text-red-500 font-bold hover:underline px-3">Suspendre</button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* --- MODAL CRÉATION --- */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="absolute inset-0" onClick={() => !isCreating && setIsModalOpen(false)}/>
                <div className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4">
                    <div className="p-8 pb-4 flex justify-between items-center">
                        <div>
                             <h3 className="text-xl font-black dark:text-white tracking-tighter">AJOUT STAFF</h3>
                             <p className="text-xs text-gray-400 font-medium">Invitation de l'équipe éditoriale</p>
                        </div>
                        <button disabled={isCreating} onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-500 hover:rotate-90 transition-all duration-300">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase ml-1 text-gray-400">Prénom</label>
                                <input name="prenom" required placeholder="John" className="w-full h-12 bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52] dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase ml-1 text-gray-400">Nom</label>
                                <input name="nom" required placeholder="Doe" className="w-full h-12 bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52] dark:text-white" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase ml-1 text-gray-400">Email Professionnel</label>
                            <input name="email" type="email" required placeholder="staff@todaysafrica.com" className="w-full h-12 bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52] dark:text-white" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase ml-1 text-gray-400">Mot de passe temporaire</label>
                            <input name="password" type="password" required className="w-full h-12 bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52] dark:text-white" />
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button type="submit" disabled={isCreating} className="h-14 bg-[#3E7B52] font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-green-900/30 transition-transform active:scale-95">
                                {isCreating ? <Loader2 className="animate-spin" /> : "Générer les accès"}
                            </Button>
                            <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
                                Un e-mail contenant les instructions sera envoyé au collaborateur après validation.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}

function compactNumber(num?: number) {
    if (!num) return '0';
    return Intl.NumberFormat('en-US', { 
        notation: "compact", 
        maximumFractionDigits: 1 
    }).format(num);
}
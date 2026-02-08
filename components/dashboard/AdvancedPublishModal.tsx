"use client";

import React, { useState } from 'react';
import { X, Calendar, Globe, Bell, Share2, Rocket, Lock, Clock, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ArticleService } from '@/services/article';
import { ArticlePublicationDto } from '@/types/article';
import { cn } from '@/lib/utils';

interface AdvancedPublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    articleId: number;
    onSuccess: () => void;
}

const REGIONS = [
    { id: 'AFRIQUE_OUEST', label: '🌍 Afrique de l Ouest', color: 'bg-blue-100 text-blue-700' },
    { id: 'AFRIQUE_CENTRALE', label: '🌍 Afrique Centrale', color: 'bg-green-100 text-green-700' },
    { id: 'AFRIQUE_EST', label: '🌍 Afrique de l Est', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'AFRIQUE_NORD', label: '🌍 Afrique du Nord', color: 'bg-orange-100 text-orange-700' },
    { id: 'AFRIQUE_SUD', label: '🌍 Afrique Australe', color: 'bg-purple-100 text-purple-700' },
    { id: 'GLOBAL', label: '🌐 Mondiale', color: 'bg-indigo-100 text-indigo-700' },
];

export default function AdvancedPublishModal({ isOpen, onClose, articleId, onSuccess }: AdvancedPublishModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'scheduling' | 'premium' | 'distribution'>('scheduling');
    
    // Form States
    const [scheduleDate, setScheduleDate] = useState("");
    const [isPremium, setIsPremium] = useState(false);
    const [previewEndDate, setPreviewEndDate] = useState("");
    const [regions, setRegions] = useState<string[]>([]);
    const [notify, setNotify] = useState(true);
    const [socials, setSocials] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const payload: ArticlePublicationDto = {
                datePublication: scheduleDate ? new Date(scheduleDate).toISOString() : null,
                enAvantPremiere: isPremium,
                dateFinAvantPremiere: previewEndDate ? new Date(previewEndDate).toISOString() : null,
                regionsTargetees: regions.length > 0 ? regions : undefined,
                notifierAbonnes: notify,
                publierReseauxSociaux: socials,
                plateformesSociales: socials ? ["FACEBOOK", "TWITTER"] : [],
                forcerVisibilite: true
            };

            await ArticleService.publishAdvanced(articleId, payload);
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || "Erreur de publication");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRegion = (reg: string) => {
        setRegions(prev => prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg]);
    };

    const tabs = [
        { id: 'scheduling', label: 'Programmation', icon: Clock },
        { id: 'premium', label: 'Avant-Première', icon: Lock },
        { id: 'distribution', label: 'Diffusion', icon: Settings },
    ];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header avec gradient */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-[#3E7B52] to-[#2e623f] dark:from-[#13EC13] dark:to-[#0dbd0d]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Rocket className="text-white" size={24}/>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Publication Avancée</h3>
                                <p className="text-white/80 text-xs">Configurez la visibilité de votre article</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                            <X size={20}/>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                    activeTab === tab.id
                                        ? "bg-white text-[#3E7B52] dark:bg-black dark:text-[#13EC13] shadow-md"
                                        : "bg-white/10 text-white/80 hover:bg-white/20"
                                )}
                            >
                                <tab.icon size={14}/>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body Scrollable */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    
                    {/* TAB 1: PROGRAMMATION */}
                    {activeTab === 'scheduling' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                <Calendar className="text-blue-600 dark:text-blue-400" size={20}/>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Date de Publication</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Publiez maintenant ou programmez pour plus tard</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setScheduleDate("")}
                                    className={cn(
                                        "p-6 rounded-xl border-2 transition-all text-center group",
                                        !scheduleDate 
                                            ? 'border-[#3E7B52] bg-green-50 dark:bg-green-900/20 dark:border-[#13EC13]' 
                                            : 'border-gray-200 dark:border-zinc-700 hover:border-[#3E7B52]/50'
                                    )}
                                >
                                    <Zap size={32} className={cn(
                                        "mx-auto mb-3",
                                        !scheduleDate ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-400 group-hover:text-[#3E7B52]"
                                    )}/>
                                    <h5 className={cn(
                                        "font-bold text-sm mb-1",
                                        !scheduleDate ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-600 dark:text-gray-400"
                                    )}>
                                        Publication Immédiate
                                    </h5>
                                    <p className="text-xs text-gray-500">Mise en ligne instantanée</p>
                                </button>

                                <div className={cn(
                                    "p-6 rounded-xl border-2 transition-all",
                                    scheduleDate 
                                        ? 'border-[#3E7B52] bg-green-50 dark:bg-green-900/20 dark:border-[#13EC13]' 
                                        : 'border-gray-200 dark:border-zinc-700'
                                )}>
                                    <Clock size={32} className={cn(
                                        "mx-auto mb-3",
                                        scheduleDate ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-400"
                                    )}/>
                                    <h5 className={cn(
                                        "font-bold text-sm mb-3 text-center",
                                        scheduleDate ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-600 dark:text-gray-400"
                                    )}>
                                        Programmée
                                    </h5>
                                    <input 
                                        type="datetime-local" 
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        className="w-full p-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs dark:bg-black dark:text-white outline-none focus:border-[#3E7B52]"
                                    />
                                </div>
                            </div>

                            {scheduleDate && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                                        <Clock size={16}/>
                                        L'article sera publié le {new Date(scheduleDate).toLocaleDateString('fr-FR', { 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: AVANT-PREMIÈRE */}
                    {activeTab === 'premium' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                                <Lock className="text-purple-600 dark:text-purple-400" size={20}/>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Mode Avant-Première</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Réservé aux abonnés premium</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-3 rounded-lg",
                                        isPremium ? "bg-purple-100 dark:bg-purple-900/30" : "bg-gray-100 dark:bg-zinc-700"
                                    )}>
                                        <Lock size={20} className={isPremium ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}/>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-gray-900 dark:text-white">Activer l'avant-première</h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Accès anticipé pour les abonnés</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isPremium} 
                                        onChange={(e) => setIsPremium(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3E7B52]/20 dark:peer-focus:ring-[#13EC13]/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#3E7B52] dark:peer-checked:bg-[#13EC13]"></div>
                                </label>
                            </div>

                            {isPremium && (
                                <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                        <Bell size={16}/>
                                        <p className="text-sm font-bold">Configuration de l'avant-première</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            Fin de la période exclusive
                                        </label>
                                        <input 
                                            type="datetime-local" 
                                            value={previewEndDate}
                                            onChange={(e) => setPreviewEndDate(e.target.value)}
                                            className="w-full p-3 bg-white dark:bg-black border border-amber-200 dark:border-amber-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-300"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Après cette date, l'article sera accessible à tous
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: DIFFUSION */}
                    {activeTab === 'distribution' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                            {/* Ciblage Régional */}
                            <div>
                                <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-4">
                                    <Globe className="text-indigo-600 dark:text-indigo-400" size={20}/>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Ciblage Géographique</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Sélectionnez les régions cibles</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {REGIONS.map(region => (
                                        <button
                                            key={region.id}
                                            onClick={() => toggleRegion(region.id)}
                                            className={cn(
                                                "p-3 rounded-lg border-2 transition-all text-left",
                                                regions.includes(region.id)
                                                    ? `${region.color} border-current font-bold`
                                                    : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">{region.label}</span>
                                                {regions.includes(region.id) && (
                                                    <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options de diffusion */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700 has-[:checked]:border-[#3E7B52] dark:has-[:checked]:border-[#13EC13] has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/10">
                                    <input 
                                        type="checkbox" 
                                        checked={notify} 
                                        onChange={(e) => setNotify(e.target.checked)} 
                                        className="w-5 h-5 text-[#3E7B52] dark:text-[#13EC13] rounded focus:ring-2 focus:ring-[#3E7B52]/20"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Bell size={16} className="text-[#3E7B52] dark:text-[#13EC13]"/>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">Notifier les abonnés</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Envoyer une notification push aux abonnés</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700 has-[:checked]:border-[#3E7B52] dark:has-[:checked]:border-[#13EC13] has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/10">
                                    <input 
                                        type="checkbox" 
                                        checked={socials} 
                                        onChange={(e) => setSocials(e.target.checked)} 
                                        className="w-5 h-5 text-[#3E7B52] dark:text-[#13EC13] rounded focus:ring-2 focus:ring-[#3E7B52]/20"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Share2 size={16} className="text-[#3E7B52] dark:text-[#13EC13]"/>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">Partage automatique</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Publier sur Facebook et X (Twitter)</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:dark:bg-zinc-900/50">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 h-11 rounded-lg border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Annuler
                        </button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isLoading}
                            className="flex-[2] bg-[#3E7B52] hover:bg-[#326342] dark:bg-[#13EC13] dark:hover:bg-[#0dbd0d] text-white dark:text-black font-bold h-11 shadow-lg shadow-[#3E7B52]/20 dark:shadow-[#13EC13]/20 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Configuration...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Rocket size={18}/>
                                    {scheduleDate ? "Programmer la publication" : "Publier Maintenant"}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
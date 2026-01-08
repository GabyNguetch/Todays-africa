"use client";

import React, { useState } from 'react';
import { X, Calendar, Globe, Bell, Share2, Rocket, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ArticleService } from '@/services/article';
import { ArticlePublicationDto } from '@/types/article';

interface AdvancedPublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    articleId: number;
    onSuccess: () => void;
}

export default function AdvancedPublishModal({ isOpen, onClose, articleId, onSuccess }: AdvancedPublishModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [scheduleDate, setScheduleDate] = useState("");
    const [isPremium, setIsPremium] = useState(false); // Avant-première
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
                plateformesSociales: socials ? ["FACEBOOK", "TWITTER"] : [], // Par défaut si coché
                forcerVisibilite: true // On veut que ça soit visible
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

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Rocket className="text-[#3E7B52]" size={20}/>
                        Publication Avancée
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition"><X size={20}/></button>
                </div>

                {/* Body Scrollable */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    
                    {/* 1. Programmation */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                            <Calendar size={14}/> Date de publication
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                             <div 
                                className={`p-3 border rounded-xl text-center cursor-pointer transition-all ${!scheduleDate ? 'border-[#3E7B52] bg-green-50 text-[#3E7B52] font-bold' : 'border-gray-200 dark:border-zinc-700'}`}
                                onClick={() => setScheduleDate("")}
                             >
                                Immédiate
                             </div>
                             <input 
                                type="datetime-local" 
                                className="p-2 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs dark:bg-black dark:text-white outline-none focus:border-[#3E7B52]"
                                onChange={(e) => setScheduleDate(e.target.value)}
                             />
                        </div>
                    </div>

                    {/* 2. Avant-Première */}
                    <div className="space-y-3 pt-4 border-t border-dashed dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                             <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                <Lock size={14}/> Mode Avant-Première
                             </label>
                             <input type="checkbox" className="toggle-checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} />
                        </div>
                        {isPremium && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 text-xs">
                                <p className="text-amber-800 dark:text-amber-200 mb-2">Accessible uniquement aux abonnés jusqu'au :</p>
                                <input 
                                    type="datetime-local" 
                                    className="w-full p-2 bg-white dark:bg-black border rounded-lg"
                                    onChange={(e) => setPreviewEndDate(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* 3. Ciblage Régional */}
                    <div className="space-y-3 pt-4 border-t border-dashed dark:border-zinc-800">
                         <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                            <Globe size={14}/> Ciblage Régional
                         </label>
                         <div className="flex flex-wrap gap-2">
                             {['FR', 'UK', 'US', 'CM', 'NG', 'ZA'].map(geo => (
                                 <button
                                    key={geo}
                                    onClick={() => toggleRegion(geo)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${regions.includes(geo) ? 'bg-[#3E7B52] text-white border-[#3E7B52]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                 >
                                     {geo}
                                 </button>
                             ))}
                         </div>
                    </div>

                    {/* 4. Diffusion */}
                    <div className="space-y-3 pt-4 border-t border-dashed dark:border-zinc-800">
                         <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} className="accent-[#3E7B52]"/>
                            <div className="flex-1">
                                <p className="font-bold text-sm dark:text-white flex items-center gap-2"><Bell size={14}/> Notifier les abonnés</p>
                            </div>
                         </label>

                         <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                            <input type="checkbox" checked={socials} onChange={e => setSocials(e.target.checked)} className="accent-[#3E7B52]"/>
                            <div className="flex-1">
                                <p className="font-bold text-sm dark:text-white flex items-center gap-2"><Share2 size={14}/> Partager sur Réseaux Sociaux</p>
                                <p className="text-[10px] text-gray-400">Facebook, Twitter (X)</p>
                            </div>
                         </label>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                        className="w-full bg-[#3E7B52] hover:bg-[#326342] text-white font-bold h-12 shadow-lg shadow-[#3E7B52]/20"
                    >
                        {isLoading ? "Configuration..." : (scheduleDate ? "Programmer la publication" : "Publier Maintenant")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
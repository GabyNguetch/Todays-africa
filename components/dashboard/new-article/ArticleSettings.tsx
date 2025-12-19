"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  UploadCloud, ImageIcon, Loader2, AlertCircle, Plus, 
  ChevronDown, Check, Search, X, RefreshCw, 
  CornerDownRight, Globe 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleService } from "@/services/article";
import { Rubrique } from "@/types/article";

interface ArticleSettingsProps {
  titre: string;
  setTitre: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  rubriqueId: number | null;
  setRubriqueId: (v: number) => void;
  
  // Peut être string UUID ou Number.
  coverImageId: string | number | null; 
  setCoverImageId: (v: string | number | null) => void; 
  
  coverImageUrl: string | null;
  setCoverImageUrl: (v: string | null) => void;

  region: string;
  setRegion: (v: string) => void;
}

export default function ArticleSettings(props: ArticleSettingsProps) {
  
  const [flatRubriques, setFlatRubriques] = useState<Rubrique[]>([]);
  const [isRubriqueLoading, setIsRubriqueLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Liste régions statique
  const REGIONS = [
      { id: "GLOBAL", label: "Global / Afrique" },
      { id: "AFRIQUE_OUEST", label: "Afrique de l'Ouest" },
      { id: "AFRIQUE_CENTRALE", label: "Afrique Centrale" },
      { id: "AFRIQUE_EST", label: "Afrique de l'Est" },
      { id: "AFRIQUE_NORD", label: "Afrique du Nord" },
      { id: "AFRIQUE_AUSTRALE", label: "Afrique Australe" },
  ];

  useEffect(() => {
    loadRubriques();
  }, []);

  const loadRubriques = async () => {
    setIsRubriqueLoading(true);
    try {
        const tree = await ArticleService.getRubriquesTree();
        if(!Array.isArray(tree)) return;

        const flat: Rubrique[] = [];
        const flatten = (nodes: Rubrique[]) => {
            nodes.forEach(node => {
                if(node) {
                    flat.push(node);
                    if (node.enfants) flatten(node.enfants);
                }
            });
        };
        flatten(tree);
        setFlatRubriques(flat);
    } catch(e) { 
        console.error("Err rubriques", e);
    } finally { 
        setIsRubriqueLoading(false); 
    }
  };

  const handleCreateRubrique = async () => {
      if(!newName.trim()) return;
      setIsRubriqueLoading(true);
      try {
          const res = await ArticleService.createRubrique(newName);
          if(res && res.id) {
            props.setRubriqueId(res.id);
            setNewName("");
            setIsCreating(false);
            setIsDropdownOpen(false);
            loadRubriques();
          }
      } catch(e) { alert("Erreur création"); }
      finally { setIsRubriqueLoading(false); }
  }

  // --- LOGIQUE UPLOAD QUI REMONTE LES DEUX (ID et URL) ---
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
        // Le service retourne { id: "uuid-ou-int", urlAcces: "..." }
        const response = await ArticleService.uploadMedia(file);
        
        console.log("📸 UPLOAD SUCCESS in Settings:", response);

        // Stocker pour prévisu
        props.setCoverImageUrl(response.urlAcces);
        // Stocker l'ID (peu importe le type)
        props.setCoverImageId(response.id); 

    } catch (err: any) {
        setUploadError("Échec upload.");
        console.error(err);
    } finally {
        setIsUploading(false);
    }
  };

  const filteredRubriques = flatRubriques.filter(r => 
    (r.nom || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const currentRubriqueName = flatRubriques.find(r => r.id === props.rubriqueId)?.nom || "Sélectionner une rubrique";

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* TITRE & DESC */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 block">Titre</label>
                <input 
                    type="text" 
                    value={props.titre}
                    onChange={e => props.setTitre(e.target.value)}
                    className="w-full p-2.5 rounded border border-gray-200 dark:border-zinc-700 bg-transparent text-sm font-bold dark:text-white focus:ring-1 focus:ring-green-600 outline-none"
                    placeholder="Titre principal..."
                />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 block">Résumé</label>
                <textarea 
                    rows={3} 
                    value={props.description}
                    onChange={e => props.setDescription(e.target.value)}
                    className="w-full p-2.5 rounded border border-gray-200 dark:border-zinc-700 bg-transparent text-sm dark:text-white focus:ring-1 focus:ring-green-600 outline-none resize-none"
                    placeholder="Accroche pour le lecteur..."
                />
            </div>
        </div>

        {/* RUBRIQUE SELECTION */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm z-20 relative">
            <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Rubrique</label>
                <button onClick={loadRubriques} type="button"><RefreshCw size={12} className={isRubriqueLoading ? "animate-spin text-green-600" : "text-gray-400"}/></button>
            </div>

            <div className="relative">
                <button 
                    type="button" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 border dark:border-zinc-700 rounded text-sm text-left dark:bg-zinc-950 dark:text-white hover:border-gray-400 transition-colors"
                >
                    <span className="truncate font-medium">{currentRubriqueName}</span>
                    <ChevronDown size={14} className="text-gray-400"/>
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg shadow-xl max-h-60 flex flex-col mt-2 z-50 overflow-hidden">
                        <div className="p-2 border-b dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900">
                            <div className="flex items-center bg-gray-50 dark:bg-zinc-800 px-2 rounded">
                                <Search size={14} className="text-gray-400 mr-2"/>
                                <input 
                                    className="flex-1 bg-transparent text-xs p-2 outline-none dark:text-white" 
                                    placeholder="Chercher..." 
                                    value={searchTerm} 
                                    onChange={e=>setSearchTerm(e.target.value)}
                                    autoFocus 
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 p-1">
                            {filteredRubriques.map(rub => (
                                <button 
                                    key={rub.id}
                                    type="button"
                                    onClick={() => { props.setRubriqueId(rub.id); setIsDropdownOpen(false); }}
                                    className={cn(
                                        "w-full px-3 py-2 text-xs text-left flex items-center gap-2 rounded transition-colors",
                                        props.rubriqueId === rub.id ? "bg-green-50 text-green-700 dark:bg-green-900/20" : "hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-gray-300"
                                    )}
                                >
                                    {rub.parentId && <CornerDownRight size={10} className="text-gray-300 ml-2" />}
                                    <span className={rub.parentId ? "" : "font-bold uppercase"}>{rub.nom || "Sans nom"}</span>
                                    {props.rubriqueId === rub.id && <Check size={14} className="ml-auto text-green-600"/>}
                                </button>
                            ))}
                        </div>
                        <div className="p-2 border-t dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950">
                           {isCreating ? (
                               <div className="flex gap-1">
                                   <input value={newName} onChange={e=>setNewName(e.target.value)} className="text-xs p-1 border rounded flex-1 dark:bg-black dark:text-white" placeholder="Nom..."/>
                                   <button onClick={handleCreateRubrique}><Check size={14} className="text-green-600"/></button>
                                   <button onClick={() => setIsCreating(false)}><X size={14} className="text-red-500"/></button>
                               </div>
                           ) : (
                               <button onClick={() => setIsCreating(true)} className="text-xs text-blue-600 font-bold flex items-center justify-center w-full"><Plus size={14} className="mr-1"/> Créer</button>
                           )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block flex items-center gap-1">Région <Globe size={10}/></label>
                <select 
                    value={props.region}
                    onChange={(e) => props.setRegion(e.target.value)}
                    className="w-full p-2.5 rounded border border-gray-200 dark:border-zinc-700 bg-transparent text-sm dark:text-white outline-none cursor-pointer"
                >
                    {REGIONS.map(reg => (
                        <option key={reg.id} value={reg.id} className="dark:bg-zinc-900">{reg.label}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* IMAGE COVER */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
             <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 block">Couverture</label>
             {uploadError && <div className="mb-2 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10}/>{uploadError}</div>}
             
             <div className={cn(
                 "relative w-full h-40 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer",
                 props.coverImageUrl && "border-solid border-none"
             )}>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                />

                {isUploading ? (
                    <Loader2 className="animate-spin text-green-600"/>
                ) : props.coverImageUrl ? (
                    <>
                        <Image 
                            src={props.coverImageUrl} 
                            alt="Cover" 
                            fill 
                            className="object-cover" 
                            unoptimized={true} // Obligatoire pour URL Render/Unsplash
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity z-10 pointer-events-none">
                            <UploadCloud className="mr-2" size={14}/> Changer
                        </div>
                    </>
                ) : (
                    <div className="text-center pointer-events-none">
                        <ImageIcon className="mx-auto text-gray-300 mb-2" size={24} />
                        <p className="text-xs text-gray-500">Cliquer pour ajouter une image</p>
                    </div>
                )}
             </div>
             
             {/* INDICATEUR TECHNIQUE SI ID NON ENTIER */}
             {typeof props.coverImageId === 'string' && props.coverImageUrl && (
                <div className="mt-2 px-3 py-1 bg-yellow-50 text-yellow-700 text-[10px] rounded border border-yellow-200">
                    Info: Cette image utilise un ID alphanumérique. Elle sera intégrée au contenu pour compatibilité.
                </div>
             )}
        </div>
    </div>
  );
}
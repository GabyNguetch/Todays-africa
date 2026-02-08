// FICHIER: components/dashboard/new-article/ArticleSettings.tsx - VERSION CORRIGÉE

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  UploadCloud, ImageIcon, Loader2, AlertCircle, Plus, 
  ChevronDown, Check, Search, X, RefreshCw, 
  CornerDownRight, Globe, MapPin, Wand2, Trash2, Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleService } from "@/services/article";
import { Rubrique } from "@/types/article";

const TARGET_REGIONS = [
  { id: "GLOBAL", label: "🌍 Afrique (Global)" },
  { id: "AFRIQUE_OUEST", label: "📍 Afrique de l'Ouest" },
  { id: "AFRIQUE_CENTRALE", label: "📍 Afrique Centrale" },
  { id: "AFRIQUE_EST", label: "📍 Afrique de l'Est" },
  { id: "AFRIQUE_NORD", label: "📍 Afrique du Nord" },
  { id: "AFRIQUE_SUD", label: "📍 Afrique Australe" },
];

interface ArticleSettingsProps {
  titre: string;
  setTitre: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  rubriqueId: number | null;
  setRubriqueId: (v: number) => void;
  coverImageId: string | number | null; 
  setCoverImageId: (v: string | number | null) => void; 
  coverImageUrl: string | null;
  setCoverImageUrl: (v: string | null) => void;
  region: string;
  setRegion: (v: string) => void;
  tags: string[];
  setTags: (t: string[]) => void;
  onAutoTag: () => Promise<void>;
  isAutoTagging: boolean;
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
  const [tagInput, setTagInput] = useState("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadRubriques();
  }, []);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const loadRubriques = async () => {
    setIsRubriqueLoading(true);
    try {
      const tree = await ArticleService.getRubriquesTree();
      if (!Array.isArray(tree)) return;

      const flat: Rubrique[] = [];
      const flatten = (nodes: Rubrique[]) => {
        nodes.forEach(node => {
          if (node) {
            flat.push(node);
            if (node.enfants) flatten(node.enfants);
          }
        });
      };
      flatten(tree);
      setFlatRubriques(flat);
    } catch (e) { 
      console.error("❌ Erreur chargement rubriques", e);
    } finally { 
      setIsRubriqueLoading(false); 
    }
  };

  const handleCreateRubrique = async () => {
    if (!newName.trim()) return;
    setIsRubriqueLoading(true);
    try {
      const res = await ArticleService.createRubrique(newName);
      if (res && res.id) {
        props.setRubriqueId(res.id);
        setNewName("");
        setIsCreating(false);
        setIsDropdownOpen(false);
        loadRubriques();
      }
    } catch (e) { 
      alert("Erreur lors de la création de la rubrique."); 
    } finally { 
      setIsRubriqueLoading(false); 
    }
  };

  /**
   * ✅ CORRECTION: Upload avec preview local immédiat ET stockage de l'ID numérique
   */
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        setUploadError("Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.");
        e.target.value = "";
        return;
    }

    if (file.size > maxSize) {
        setUploadError("Fichier trop volumineux (max 10MB)");
        e.target.value = "";
        return;
    }

    setIsUploading(true);
    setUploadError(null);

    // ✅ PREVIEW LOCAL IMMÉDIAT
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
    props.setCoverImageUrl(previewUrl);

    try {
        console.group("🖼️ [ArticleSettings] Upload Cover Image");
        console.log("Fichier:", file.name, `(${file.size} bytes)`);
        
        const media = await ArticleService.uploadMedia(file);
        
        console.log("✅ Média reçu:", media);
        console.log("🆔 ID numérique:", media.id);
        console.log("🔗 URL serveur:", media.urlAcces);
        
        // ✅ CORRECTION CRITIQUE: Stocker l'ID comme STRING contenant un nombre
        // Le service article.ts le convertira en INTEGER lors de l'envoi au backend
        const numericId = parseInt(media.id);
        if (isNaN(numericId)) {
          throw new Error("Le serveur n'a pas retourné un ID valide");
        }
        
        props.setCoverImageId(media.id); // String représentant un nombre (ex: "123")
        props.setCoverImageUrl(media.urlAcces);
        
        // Remplacer le preview local par l'URL serveur
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl);
        }
        setLocalPreviewUrl(null);
        
        console.log("✅ État mis à jour:");
        console.log("   - coverImageId:", media.id);
        console.log("   - coverImageUrl:", media.urlAcces);
        console.groupEnd();

    } catch (err: any) {
        console.error("❌ Erreur Upload Cover:", err);
        console.groupEnd();
        
        const errorMessage = err.message || "Erreur serveur lors de l'envoi.";
        setUploadError(errorMessage);
        
        if (errorMessage.includes("500") || errorMessage.includes("stocker")) {
            setUploadError("⚠️ Le serveur ne peut pas enregistrer le fichier. Vérifiez les permissions ou contactez l'administrateur.");
        }
        
        // Annuler le preview local en cas d'erreur
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl);
        }
        setLocalPreviewUrl(null);
        props.setCoverImageUrl(null);
        props.setCoverImageId(null);
    } finally {
        setIsUploading(false);
        e.target.value = "";
    }
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl(null);
    props.setCoverImageUrl(null);
    props.setCoverImageId(null);
    setUploadError(null);
    console.log("🗑️ Image de couverture supprimée");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !props.tags.includes(val)) {
        props.setTags([...props.tags, val]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    props.setTags(props.tags.filter(t => t !== tagToRemove));
  };
  
  const currentRubriqueName = flatRubriques.find(r => r.id === props.rubriqueId)?.nom || "Sélectionner une rubrique";

  // ✅ URL de prévisualisation (local ou serveur)
  const displayUrl = localPreviewUrl || props.coverImageUrl;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in overflow-y-auto scrollbar-hide max-h-[calc(100vh-120px)]">
      
      {/* SECTION 1: ESSENTIELS */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
        
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex justify-between">
            Titre Principal 
            <span className={cn(
              "font-mono",
              props.titre.length < 10 ? "text-red-500" :
              props.titre.length > 150 ? "text-orange-500" : "text-green-500"
            )}>
              {props.titre.length} / 200
            </span>
          </label>
          <input 
            type="text" 
            value={props.titre}
            onChange={e => props.setTitre(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#3E7B52]/20 focus:border-[#3E7B52] outline-none transition-all placeholder:text-gray-300"
            placeholder="Titre de l'article (min 10 caractères)..."
          />
          {props.titre.length > 0 && props.titre.length < 10 && (
            <p className="text-xs text-red-500 mt-1">Minimum 10 caractères requis</p>
          )}
        </div>
        
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex justify-between">
            Résumé (Chapeau)
            <span className={cn(
              "font-mono",
              props.description.length < 50 ? "text-red-500" :
              props.description.length > 450 ? "text-orange-500" : "text-green-500"
            )}>
              {props.description.length} / 500
            </span>
          </label>
          <textarea 
            rows={4} 
            value={props.description}
            onChange={e => props.setDescription(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent text-xs leading-relaxed dark:text-gray-300 focus:ring-2 focus:ring-[#3E7B52]/20 focus:border-[#3E7B52] outline-none resize-none placeholder:text-gray-300"
            placeholder="Ce résumé servira pour le référencement (min 50 caractères)..."
          />
          {props.description.length > 0 && props.description.length < 50 && (
            <p className="text-xs text-red-500 mt-1">Minimum 50 caractères requis</p>
          )}
        </div>
      </div>

      {/* SECTION TAGS & IA */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between mb-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
               <Tag size={12} className="text-[#3E7B52]" /> Tags & Mots-clés
             </label>
             <button 
                onClick={props.onAutoTag}
                disabled={props.isAutoTagging}
                type="button"
                className="text-[9px] font-bold uppercase flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-md border border-purple-100 hover:bg-purple-100 transition disabled:opacity-50"
             >
                {props.isAutoTagging ? <Loader2 size={10} className="animate-spin"/> : <Wand2 size={10}/>}
                Générer par IA
             </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
             {props.tags.map((tag, idx) => (
                 <span key={`${tag}-${idx}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1"><X size={12}/></button>
                 </span>
             ))}
          </div>

          <div className="relative">
              <input 
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52]/20"
                placeholder="Ajouter un tag..."
              />
              <button 
                 onClick={addTag}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#3E7B52]"
              >
                  <Plus size={16}/>
              </button>
          </div>
          <p className="text-[9px] text-gray-400 px-1">
             Appuyez sur Entrée pour valider un tag. Ces tags serviront à l'algorithme de recommandation.
          </p>
      </div>

      {/* SECTION 2: IMAGE COUVERTURE */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex justify-between items-center">
            <span className="flex items-center gap-2">
                <ImageIcon size={12} className="text-[#3E7B52]"/>
                Image de Couverture
            </span>
            {isUploading && <Loader2 size={12} className="animate-spin text-[#3E7B52]"/>}
            {props.coverImageId && !isUploading && (
                <span className="text-[9px] text-green-600 dark:text-green-400 font-mono bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                    ✓ Uploadé
                </span>
            )}
        </label>
        
        {uploadError && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5"/>
              <span>{uploadError}</span>
          </div>
        )}

        <div className={cn(
          "relative w-full aspect-video border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center transition-all group",
          displayUrl ? "border-transparent bg-black" : "border-gray-200 dark:border-zinc-700 hover:border-[#3E7B52] cursor-pointer"
        )}>
           <input 
              type="file" 
              accept="image/*"
              onChange={handleCoverUpload}
              className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full"
              disabled={isUploading}
           />
           
           {isUploading ? (
              <div className="flex flex-col items-center text-[#3E7B52]">
                  <Loader2 size={24} className="animate-spin mb-2"/>
                  <span className="text-[10px] font-bold uppercase">Téléchargement...</span>
              </div>
           ) : displayUrl ? (
              <>
                 <Image 
                    src={displayUrl} 
                    alt="Cover" 
                    fill 
                    className="object-cover group-hover:opacity-50 transition-opacity" 
                    unoptimized
                 />
                 <button 
                    onClick={handleRemoveCover} 
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                 >
                     <Trash2 size={14}/>
                 </button>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                     <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm flex gap-2 items-center">
                        <UploadCloud size={12}/> Changer
                     </span>
                 </div>
              </>
           ) : (
               <div className="text-center text-gray-400">
                   <ImageIcon size={24} className="mx-auto mb-2 opacity-50"/>
                   <span className="text-[10px] font-bold uppercase">Cliquez pour ajouter</span>
                   <p className="text-[8px] mt-1 text-gray-400">JPG, PNG, WEBP ou GIF (max 10MB)</p>
               </div>
           )}
        </div>
        
        {process.env.NODE_ENV === 'development' && props.coverImageId && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-zinc-950 rounded text-[9px] font-mono text-gray-500 dark:text-gray-400">
                <div>ID: {props.coverImageId}</div>
                <div className="truncate">URL: {displayUrl}</div>
            </div>
        )}
      </div>

      {/* SECTION 3: CIBLAGE */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-5 z-20 relative">
        
        {/* RUBRIQUE */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Rubrique / Catégorie
            </label>
            <button 
              onClick={loadRubriques} 
              type="button" 
              className="text-gray-400 hover:text-[#3E7B52] transition-colors" 
              title="Rafraîchir"
            >
              <RefreshCw size={12} className={isRubriqueLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="relative">
            <button 
              type="button" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-left bg-gray-50 dark:bg-zinc-950 dark:text-white hover:border-[#3E7B52] transition-colors"
            >
              <span className="truncate font-bold text-gray-700 dark:text-gray-200">
                {currentRubriqueName}
              </span>
              <ChevronDown 
                size={14} 
                className={cn(
                  "text-gray-400 transition-transform", 
                  isDropdownOpen && "rotate-180"
                )} 
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl max-h-64 flex flex-col mt-2 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                
                <div className="p-3 border-b dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 sticky top-0 z-10">
                  <div className="flex items-center bg-white dark:bg-zinc-900 border dark:border-zinc-700 px-3 rounded-lg h-9 focus-within:ring-1 focus-within:ring-[#3E7B52]">
                    <Search size={14} className="text-gray-400 mr-2" />
                    <input 
                      className="flex-1 bg-transparent text-xs p-1 outline-none dark:text-white" 
                      placeholder="Filtrer rubriques..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)}
                      autoFocus 
                    />
                  </div>
                </div>
                
                <div className="overflow-y-auto flex-1 p-1 scrollbar-hide">
                  {flatRubriques.filter(r => 
                    (r.nom || "").toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(rub => (
                    <button 
                      key={rub.id}
                      type="button"
                      onClick={() => { 
                        props.setRubriqueId(rub.id); 
                        setIsDropdownOpen(false); 
                      }}
                      className={cn(
                        "w-full px-3 py-2.5 text-xs text-left flex items-center gap-2 rounded-lg transition-all",
                        props.rubriqueId === rub.id 
                          ? "bg-green-50 text-[#3E7B52] font-bold dark:bg-green-900/20 dark:text-[#13EC13]" 
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                      )}
                    >
                      {rub.parentId && <CornerDownRight size={10} className="text-gray-300 ml-2" />}
                      <span className={!rub.parentId ? "uppercase font-extrabold text-[10px]" : ""}>
                        {rub.nom}
                      </span>
                      {props.rubriqueId === rub.id && <Check size={14} className="ml-auto text-[#3E7B52]" />}
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950">
                  {isCreating ? (
                    <div className="flex gap-2 items-center px-1">
                      <input 
                        value={newName} 
                        onChange={e => setNewName(e.target.value)} 
                        className="text-xs p-2 border rounded-lg flex-1 dark:bg-black dark:text-white focus:border-[#3E7B52] outline-none" 
                        placeholder="Nouvelle..."
                      />
                      <button 
                        onClick={handleCreateRubrique} 
                        className="p-2 bg-[#3E7B52] text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => setIsCreating(false)} 
                        className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsCreating(true)} 
                      className="w-full py-2 text-xs text-[#3E7B52] dark:text-[#13EC13] font-bold flex items-center justify-center gap-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Plus size={14} /> Ajouter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RÉGION */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 block flex items-center gap-1">
            <MapPin size={12} className="text-[#3E7B52]" /> Zone Cible
          </label>
          <div className="relative">
            <select 
              value={props.region}
              onChange={(e) => props.setRegion(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-gray-700 dark:text-white outline-none cursor-pointer hover:border-[#3E7B52] focus:ring-2 focus:ring-[#3E7B52]/20 transition-all appearance-none"
            >
              {TARGET_REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>
                  {reg.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Globe size={14} className="text-gray-300" />
            </div>
          </div>
          <p className="text-[9px] text-gray-400 mt-2 px-1">
            * La diffusion de l'article sera prioritaire dans la région sélectionnée.
          </p>
        </div>
      </div>
    </div>
  );
}
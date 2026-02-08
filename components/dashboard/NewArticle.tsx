// FICHIER: components/dashboard/NewArticle.tsx - VERSION COMPLÈTE CORRIGÉE

"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Send, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button'; 
import { ArticleService } from '@/services/article';
import { useAuth } from '@/context/AuthContext';
import { cn, getImageUrl } from '@/lib/utils';
import ArticleSettings from './new-article/ArticleSettings';
import Toolbar from './new-article/Toolbar';
import EditorContentComp from './new-article/EditorContent';
import { ArticlePayloadDto, BlocContenuDto } from '@/types/article';

interface NewArticleProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editArticleId?: number | null; 
}

// Sous-composant Skeleton pour NewArticle
const ArticleEditorSkeleton = () => (
  <div className="max-w-7xl mx-auto pb-32 animate-pulse space-y-6">
    
    {/* Header Skeleton */}
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
             <div className="space-y-2">
                 <div className="w-32 h-5 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                 <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
             </div>
        </div>
        <div className="flex gap-3">
             <div className="w-24 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800"></div>
             <div className="w-32 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800"></div>
        </div>
    </div>

    {/* Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Colonne Principale (Éditeur) */}
        <div className="lg:col-span-8 space-y-4">
             <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl h-[700px] p-4 flex flex-col gap-4">
                 <div className="w-full h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                 <div className="space-y-4 mt-4 px-4">
                      <div className="w-3/4 h-4 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                      <div className="w-full h-4 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                      <div className="w-5/6 h-4 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                      <div className="w-full h-64 bg-gray-100 dark:bg-zinc-800 rounded-xl mt-8"></div>
                      <div className="w-full h-4 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                 </div>
             </div>
        </div>

        {/* Colonne Sidebar (Paramètres) */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 space-y-6">
                 <div className="space-y-2">
                     <div className="flex justify-between">
                         <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                         <div className="w-8 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                     </div>
                     <div className="w-full h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                 </div>
                 <div className="space-y-2">
                     <div className="flex justify-between">
                         <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                         <div className="w-8 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                     </div>
                     <div className="w-full h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                 </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5">
                 <div className="w-24 h-3 bg-gray-200 dark:bg-zinc-800 rounded mb-3"></div>
                 <div className="w-full aspect-video bg-gray-100 dark:bg-zinc-800 rounded-xl"></div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 space-y-4">
                 <div className="w-full h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                 <div className="w-full h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
            </div>
        </div>
    </div>
  </div>
);

export default function NewArticle({ onSuccess, editArticleId, onCancel }: NewArticleProps) {
  
  const { user } = useAuth();
  
  // === STATE ===
  const [articleId, setArticleId] = useState<number | null>(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [rubriqueId, setRubriqueId] = useState<number | null>(null);
  const [region, setRegion] = useState("GLOBAL");
  const [coverImageId, setCoverImageId] = useState<string | number | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [contentLoaded, setContentLoaded] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isAutoTagging, setIsAutoTagging] = useState(false);

  // UI State
  const [uiState, setUiState] = useState({ 
    loading: false, 
    saving: false, 
    error: null as string | null 
  });

  // =========================================================
  // 1. CHARGEMENT DES DONNÉES (API -> STATE)
  // =========================================================
  useEffect(() => {
    if (editArticleId) {
      setUiState(p => ({ ...p, loading: true }));
      setContentLoaded(false);
      
      console.log(`📡 [NewArticle] Chargement du brouillon #${editArticleId}...`);

      ArticleService.getById(editArticleId)
        .then(async (article) => {
          console.log("📦 Article récupéré:", article);
          
          setArticleId(article.id);
          setTitre(article.titre || "");
          setDescription(article.description || "");
          setRubriqueId(article.rubriqueId || null);
          setRegion(article.region || "GLOBAL");
          
          // ✅ IMAGE COUVERTURE - Correction du mapping
          if (article.imageCouvertureId) {
            setCoverImageId(article.imageCouvertureId);
          }
          
          if (article.imageCouvertureUrl) {
            const fullUrl = getImageUrl(article.imageCouvertureUrl);
            console.log("🖼️ URL Image de couverture:", fullUrl);
            setCoverImageUrl(fullUrl);
          }

          // ✅ RÉCUPÉRATION DES TAGS
          try {
            const articleTags = await ArticleService.getArticleTags(article.id);
            console.log("🏷️ Tags récupérés:", articleTags);
            // Les tags peuvent être des objets {id, nom} ou des strings
            const tagNames = articleTags.map((t: any) => typeof t === 'string' ? t : t.nom);
            setTags(tagNames);
          } catch (e) {
            console.warn("⚠️ Impossible de récupérer les tags:", e);
          }

          // ✅ RECONSTRUCTION DU HTML DEPUIS LES BLOCS
          if (article.blocsContenu && Array.isArray(article.blocsContenu)) {
            const sorted = [...article.blocsContenu].sort((a, b) => a.ordre - b.ordre);
            
            let rebuiltHtml = "";
            
            sorted.forEach(bloc => {
              if (bloc.type === 'IMAGE') {
                const mediaIdAttr = bloc.mediaId ? `data-media-id="${bloc.mediaId}"` : "";
                const rawSrc = bloc.url || bloc.contenu;
                const finalSrc = getImageUrl(rawSrc);

                rebuiltHtml += `<img src="${finalSrc}" alt="${bloc.altText || ''}" title="${bloc.legende || ''}" ${mediaIdAttr} class="article-content-image" />`;
                rebuiltHtml += `<p></p>`; 
              
              } else if (bloc.type === 'CITATION') {
                rebuiltHtml += `<blockquote>${bloc.contenu}</blockquote>`;
              
              } else if (bloc.type === 'VIDEO') {
                  rebuiltHtml += `<p>[VIDEO: ${bloc.url || bloc.contenu}]</p>`;

              } else {
                rebuiltHtml += bloc.contenu;
              }
            });

            console.log("📝 Contenu HTML reconstruit :", rebuiltHtml.substring(0, 100) + "...");
            setHtmlContent(rebuiltHtml);
            setContentLoaded(true);
          } else {
              setHtmlContent("");
              setContentLoaded(true);
          }
        })
        .catch((err) => {
            console.error("❌ Erreur chargement", err);
            setUiState(p => ({ ...p, error: "Impossible de charger l'article." }));
        })
        .finally(() => setUiState(p => ({ ...p, loading: false })));
    } else {
        // Mode Création : on dit que le contenu est chargé (vide)
        setContentLoaded(true);
    }
  }, [editArticleId]);

  // =========================================================
  // 2. SYNCHRONISATION (STATE -> EDITOR)
  // =========================================================
  useEffect(() => {
      if (editorInstance && !editorInstance.isDestroyed && contentLoaded && editArticleId && htmlContent) {
          console.log("🔄 Injection du contenu dans l'éditeur Tiptap");
          editorInstance.commands.setContent(htmlContent);
      }
  }, [editorInstance, contentLoaded, editArticleId]);

  // ✅ FONCTION PARSE: DOM -> BLOC OBJECTS
  const parseEditorContent = (html: string): BlocContenuDto[] => {
     if (typeof window === 'undefined') return [];
     const parser = new DOMParser();
     const doc = parser.parseFromString(html, 'text/html');
     const nodes = Array.from(doc.body.children);
     const blocs: BlocContenuDto[] = [];
     let counter = 0;

     const str = (v: any) => (v ? String(v).trim() : "");

     nodes.forEach((node) => {
         // --- CAS IMAGE ---
         if (node.tagName === 'IMG' || node.querySelector('img')) {
             const img = (node.tagName === 'IMG' ? node : node.querySelector('img')) as HTMLImageElement;
             const src = img.getAttribute('src');
             if(!src) return;

             blocs.push({
                 type: 'IMAGE',
                 ordre: counter++,
                 url: src,
                 contenu: src,
                 altText: str(img.getAttribute('alt')),
                 legende: str(img.getAttribute('title')),
                 mediaId: str(img.getAttribute('data-media-id')) || null, 
                 articleId: 0
             });
             return;
         }

         // --- CAS CITATION ---
         if (node.tagName === 'BLOCKQUOTE') {
             blocs.push({
                 type: 'CITATION',
                 ordre: counter++,
                 contenu: node.innerHTML,
                 url: "", altText: "", legende: "", mediaId: null, articleId: 0
             });
             return;
         }

         // --- CAS TEXTE STANDARD ---
         const txt = node.textContent?.trim();
         if (txt || node.innerHTML.includes('<')) {
            blocs.push({
                type: 'TEXTE',
                ordre: counter++,
                contenu: node.outerHTML,
                url: "", altText: "", legende: "", mediaId: null, articleId: 0
            });
         }
     });
     return blocs;
  };

  // ✅ FONCTION IA AUTO-TAGGING
  const handleAutoTag = async () => {
      if (!articleId && !confirm("L'article doit être sauvegardé en brouillon pour l'analyse IA. Sauvegarder maintenant ?")) {
          return;
      }
      
      try {
          setIsAutoTagging(true);
          
          let currentId = articleId;
          if (!currentId) {
             const savedId = await handleSave(false);
             if (!savedId) {
                 alert("Erreur lors de la sauvegarde. Réessayez.");
                 return;
             }
             currentId = savedId;
          }

          const generatedTags = await ArticleService.generateAutoTags(currentId);
          setTags(prev => [...new Set([...prev, ...generatedTags])]);

      } catch (e) {
          alert("Erreur génération tags");
      } finally {
          setIsAutoTagging(false);
      }
  };

  // === SAUVEGARDE ===
  const handleSave = async (isSubmission: boolean): Promise<number | null> => {
    // Validations
    if (!titre.trim()) {
        setUiState(p => ({ ...p, error: "Titre requis (min 10 caractères)" }));
        return null;
    }
    if (titre.length < 10) {
        setUiState(p => ({ ...p, error: "Titre trop court (min 10 caractères)" }));
        return null;
    }
    if (!description.trim()) {
        setUiState(p => ({ ...p, error: "Description requise (min 50 caractères)" }));
        return null;
    }
    if (description.length < 50) {
        setUiState(p => ({ ...p, error: "Description trop courte (min 50 caractères)" }));
        return null;
    }
    if (!rubriqueId) {
        setUiState(p => ({ ...p, error: "Rubrique requise" }));
        return null;
    }
    if (!user?.id) {
        setUiState(p => ({ ...p, error: "Session expirée" }));
        return null;
    }

    setUiState(p => ({ ...p, saving: true, error: null }));

    try {
      // 1. Récupération HTML Editor actuel
      const currentHtml = editorInstance ? editorInstance.getHTML() : htmlContent;
      const blocksPayload = parseEditorContent(currentHtml);
      
      // Sécurité pour ne pas effacer un article par erreur
      if (blocksPayload.length === 0 && !confirm("L'article semble vide. Continuer la sauvegarde ?")) {
          setUiState(p => ({ ...p, saving: false }));
          return null;
      }

      // ✅ ID Cover Image - Gestion correcte Int vs UUID
      let finalCoverId: number | null = null;
      if (coverImageId) {
         // Si c'est un UUID (string), on essaie de le convertir en Int (si backend attend Int)
         // Sinon on garde tel quel si backend attend UUID
         if (typeof coverImageId === 'string') {
             // Si votre backend attend un Int, utilisez parseInt
             // Si votre backend attend un UUID, gardez la string
             // D'après vos logs, le backend renvoie des UUIDs, donc on garde string
             finalCoverId = coverImageId as any; // Cast pour éviter erreur TS
         } else {
             finalCoverId = coverImageId;
         }
      }

      const payload: ArticlePayloadDto = {
        titre: titre.trim(),
        description: description.trim(),
        rubriqueId: rubriqueId,
        auteurId: user.id,
        imageCouvertureId: finalCoverId, 
        region: region,
        visible: false,
        statut: 'DRAFT', // Toujours DRAFT jusqu'à soumission
        tagIds: [],
        blocsContenu: blocksPayload
      };

      console.log("💾 Payload de sauvegarde:", payload);

      let targetId = articleId;

      if (articleId) {
        console.log("🔄 Mise à jour article #", articleId);
        await ArticleService.update(articleId, payload);
      } else {
        console.log("✨ Création nouvel article");
        const created = await ArticleService.create(payload);
        targetId = created.id;
        setArticleId(created.id);
      }

      // ✅ SAUVEGARDE DES TAGS (Appel séparé)
      if (targetId && tags.length > 0) {
         console.log("🏷️ Assignation des tags:", tags);
         await ArticleService.assignTags(targetId, tags);
      }

      // ✅ SOUMISSION SI DEMANDÉE
      if (isSubmission && targetId) {
          console.log("📤 Soumission de l'article pour validation");
          await ArticleService.submitForReview(targetId, user.id);
          alert("✅ Article soumis pour validation !");
      } else {
          alert("✅ Brouillon sauvegardé !");
      }
      
      if (onSuccess) onSuccess();
      return targetId;

    } catch (e: any) {
      console.error("❌ Erreur sauvegarde:", e);
      setUiState(p => ({ ...p, error: e.message }));
      return null;
    } finally {
      setUiState(p => ({ ...p, saving: false }));
    }
  };

  if (uiState.loading) {
      return <ArticleEditorSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-in fade-in">
      
      {/* BARRE DU HAUT */}
      <div className="sticky top-0 z-40 bg-[#FBFBFB] dark:bg-black py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold dark:text-white">
              {articleId ? `Édition: ${titre.substring(0, 20)}...` : "Nouvel Article"}
            </h2>
            {uiState.error && (
              <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertTriangle size={12} /> {uiState.error}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            disabled={uiState.saving}
            onClick={() => handleSave(false)}
            className="h-10 bg-white dark:bg-zinc-900 p-3 border-gray-300"
          >
            {uiState.saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Brouillon
          </Button>
          <Button 
            disabled={uiState.saving}
            onClick={() => {
              if (confirm("Confirmer la soumission pour validation ?\n\nVous ne pourrez plus modifier l'article après cet envoi.")) {
                handleSave(true);
              }
            }}
            className="h-10 bg-[#3E7B52] p-3 text-white hover:bg-[#2d5a3c]"
          >
            <Send size={16} className="mr-2" /> Soumettre
          </Button>
        </div>
      </div>

      {/* CONTENU */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ÉDITEUR CENTRAL */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[80vh]">
            <Toolbar editor={editorInstance} />
            <EditorContentComp 
              setEditorRef={setEditorInstance} 
              onChange={setHtmlContent} 
              initialContent={htmlContent}
            />
          </div>
        </div>

        {/* SIDEBAR RÉGLAGES */}
        <div className="lg:col-span-1">
          <ArticleSettings 
            titre={titre} 
            setTitre={setTitre}
            description={description} 
            setDescription={setDescription}
            rubriqueId={rubriqueId} 
            setRubriqueId={setRubriqueId}
            coverImageId={coverImageId} 
            setCoverImageId={setCoverImageId}
            coverImageUrl={coverImageUrl} 
            setCoverImageUrl={setCoverImageUrl}
            region={region} 
            setRegion={setRegion}
            tags={tags}
            setTags={setTags}
            onAutoTag={handleAutoTag}
            isAutoTagging={isAutoTagging}
          />
          
          {/* Bloc info */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
            <p className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle size={12} /> Note Importante
            </p>
            Sauvegardez régulièrement votre brouillon. L'IA peut générer des tags automatiquement basés sur votre contenu.
          </div>
        </div>
      </div>
    </div>
  );
}
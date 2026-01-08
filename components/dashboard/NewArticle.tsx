// FICHIER: components/dashboard/NewArticle.tsx - VERSION CORRIGÉE

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
             {/* Back Button */}
             <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
             <div className="space-y-2">
                 {/* Title */}
                 <div className="w-32 h-5 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                 {/* Subtitle */}
                 <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
             </div>
        </div>
        <div className="flex gap-3">
             {/* Action Buttons */}
             <div className="w-24 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800"></div>
             <div className="w-32 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800"></div>
        </div>
    </div>

    {/* Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Colonne Principale (Éditeur) */}
        <div className="lg:col-span-8 space-y-4">
             <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl h-[700px] p-4 flex flex-col gap-4">
                 {/* Toolbar fake */}
                 <div className="w-full h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                 {/* Text fake */}
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
            
            {/* Box 1: Infos */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 space-y-6">
                 {/* Input Titre */}
                 <div className="space-y-2">
                     <div className="flex justify-between">
                         <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                         <div className="w-8 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                     </div>
                     <div className="w-full h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                 </div>
                 {/* Input Description */}
                 <div className="space-y-2">
                     <div className="flex justify-between">
                         <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                         <div className="w-8 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                     </div>
                     <div className="w-full h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                 </div>
            </div>

            {/* Box 2: Image */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5">
                 <div className="w-24 h-3 bg-gray-200 dark:bg-zinc-800 rounded mb-3"></div>
                 <div className="w-full aspect-video bg-gray-100 dark:bg-zinc-800 rounded-xl"></div>
            </div>

             {/* Box 3: Targeting */}
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
  const [contentLoaded, setContentLoaded] = useState(false); // Flag pour savoir si le HTML est prêt
    // ✅ STATE TAGS
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
        .then(article => {
          setArticleId(article.id);
          setTitre(article.titre || "");
          setDescription(article.description || "");
          setRubriqueId(article.rubriqueId || null);
          setRegion(article.region || "GLOBAL");
          
          // Image Couverture
          setCoverImageUrl(getImageUrl(article.imageCouvertureUrl) || null);
          setCoverImageId(article.imageCouvertureId || null);

          // RECONSTRUCTION DU HTML DEPUIS LES BLOCS
          if (article.blocsContenu && Array.isArray(article.blocsContenu)) {
            const sorted = [...article.blocsContenu].sort((a, b) => a.ordre - b.ordre);
            
            let rebuiltHtml = "";
            
            sorted.forEach(bloc => {
              if (bloc.type === 'IMAGE') {
                // IMPORTANT: On reconstruit l'image avec data-media-id pour le parsing futur
                const mediaIdAttr = bloc.mediaId ? `data-media-id="${bloc.mediaId}"` : "";
                // Utiliser bloc.url s'il existe (url absolue), sinon bloc.contenu (path relatif)
                const rawSrc = bloc.url || bloc.contenu;
                const finalSrc = getImageUrl(rawSrc);

                rebuiltHtml += `<img src="${finalSrc}" alt="${bloc.altText || ''}" title="${bloc.legende || ''}" ${mediaIdAttr} class="article-content-image" />`;
                // Ajout d'un saut de ligne après image pour éditeur plus propre
                rebuiltHtml += `<p></p>`; 
              
              } else if (bloc.type === 'CITATION') {
                rebuiltHtml += `<blockquote>${bloc.contenu}</blockquote>`;
              
              } else if (bloc.type === 'VIDEO') {
                  // Reconstruction vidéo basique pour preview
                  rebuiltHtml += `<p>[VIDEO: ${bloc.url || bloc.contenu}]</p>`;

              } else {
                // Type TEXTE (C'est du HTML brut sauvegardé)
                rebuiltHtml += bloc.contenu;
              }
            });

            console.log("📝 Contenu HTML reconstruit :", rebuiltHtml.substring(0, 50) + "...");
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
  // On attend que l'éditeur soit monté ET que le contenu soit fetché
  useEffect(() => {
      if (editorInstance && !editorInstance.isDestroyed && contentLoaded && editArticleId) {
          // On vérifie si l'éditeur est vide pour éviter d'écraser si l'utilisateur a commencé à taper pendant un re-render
          // (Optionnel: forcer l'overwrite pour être sûr d'avoir le brouillon exact)
          console.log("🔄 Injection du contenu dans l'éditeur Tiptap");
          editorInstance.commands.setContent(htmlContent);
      }
  }, [editorInstance, contentLoaded, editArticleId]); // Retrait de htmlContent des dépendances pour éviter boucle infinie

// ✅ FONCTION PARSE: DOM -> BLOC OBJECTS
  const parseEditorContent = (html: string): BlocContenuDto[] => {
     if (typeof window === 'undefined') return [];
     const parser = new DOMParser();
     const doc = parser.parseFromString(html, 'text/html');
     const nodes = Array.from(doc.body.children);
     const blocs: BlocContenuDto[] = [];
     let counter = 0;

     // Fonction locale de nettoyage string
     const str = (v: any) => (v ? String(v).trim() : "");

     nodes.forEach((node) => {
         // --- CAS IMAGE ---
         if (node.tagName === 'IMG' || node.querySelector('img')) {
             const img = (node.tagName === 'IMG' ? node : node.querySelector('img')) as HTMLImageElement;
             const src = img.getAttribute('src');
             // Si pas de source, on ignore
             if(!src) return;

             blocs.push({
                 type: 'IMAGE',
                 ordre: counter++,
                 url: src,
                 contenu: src,
                 altText: str(img.getAttribute('alt')),
                 legende: str(img.getAttribute('title')),
                 // Récupération sécurisée du UUID stocké
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
         // On sauvegarde le bloc s'il a du texte ou du contenu HTML significatif
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
      // Pour auto-tagger, l'article doit être sauvegardé ou on envoie le contenu texte ?
      // L'endpoint est POST /articles/{id}/auto-tag. Il faut donc un ID.
      // Si pas d'ID (nouvel article), on doit d'abord faire un "brouillon auto".
      
      if (!articleId && !confirm("L'article doit être sauvegardé en brouillon pour l'analyse IA. Sauvegarder maintenant ?")) {
          return;
      }
      
      try {
          setIsAutoTagging(true);
          
          // 1. Si pas d'ID, on sauvegarde
          let currentId = articleId;
          if (!currentId) {
             await handleSave(false); // Cela va setArticleId
             // Attention: setState est asynchrone, dans ce scope articleId peut être null
             // Hack: handleSave met à jour l'UI, on force l'utilisateur à re-cliquer ou on attend le re-render.
             // Mieux: retourner l'ID dans handleSave. Pour ce correctif, supposons qu'il est sauvegardé.
             alert("Brouillon créé. Cliquez à nouveau sur 'Générer' pour lancer l'IA.");
             return;
          }

          // 2. Appel Service
          const generatedTags = await ArticleService.generateAutoTags(currentId!);
          
          // 3. Merge avec existants
          setTags(prev => [...new Set([...prev, ...generatedTags])]);

      } catch (e) {
          alert("Erreur génération tags");
      } finally {
          setIsAutoTagging(false);
      }
  };


 // === SAUVEGARDE ===
  const handleSave = async (isSubmission: boolean) => {
    // Validations (inchangées)
    if (!titre.trim()) return setUiState(p => ({ ...p, error: "Titre requis" }));
    if (!description.trim()) return setUiState(p => ({ ...p, error: "Description requise" }));
    if (!rubriqueId) return setUiState(p => ({ ...p, error: "Rubrique requise" }));
    if (!user?.id) return setUiState(p => ({ ...p, error: "Session expirée" }));

    setUiState(p => ({ ...p, saving: true, error: null }));

    try {
            // 1. Récupération HTML Editor actuel
      // Si l'éditeur n'est pas chargé, on prend le htmlContent initial (cas modification métadonnées seule)
      const currentHtml = editorInstance ? editorInstance.getHTML() : htmlContent;

      const blocksPayload = parseEditorContent(htmlContent);
            // Sécurité pour ne pas effacer un article par erreur
      if (blocksPayload.length === 0 && !confirm("L'article semble vide. Continuer la sauvegarde ?")) {
          setUiState(p => ({ ...p, saving: false }));
          return;
      }

      // ID Cover Image (Int32 pour article, attention)
      // Si l'article prend un Int pour cover, on garde parseInt. Si c'est UUID, on change.
      // D'après swagger "ArticleCreateDto", imageCouvertureId est Int32. On garde ça comme avant.
      let finalCoverId: number | null = null;
      if (coverImageId) {
         if (typeof coverImageId === 'string') finalCoverId = parseInt(coverImageId);
         else finalCoverId = coverImageId;
      }

      const payload: ArticlePayloadDto = {
        titre: titre.trim(),
        description: description.trim(),
        rubriqueId: rubriqueId,
        auteurId: user.id,
        imageCouvertureId: finalCoverId, 
        region: region,
        visible: false,
        statut: isSubmission ? 'PENDING_REVIEW' : (articleId ? 'DRAFT' : 'DRAFT'), // Si modification on garde le statut ou force Draft
        tagIds: [],
        blocsContenu: blocksPayload // Contient des UUID strings dans mediaId
      };

      let targetId = articleId;

        if (articleId) {
             await ArticleService.update(articleId, payload);
        } else {
             const created = await ArticleService.create(payload);
             targetId = created.id;
             setArticleId(created.id);
        }

        // ✅ SAUVEGARDE DES TAGS (Appel séparé)
        // On ne le fait que si l'article est créé avec succès
        if (targetId && tags.length > 0) {
             await ArticleService.assignTags(targetId, tags);
        }

      if (articleId) {
        await ArticleService.update(articleId, payload);
        if(isSubmission) await ArticleService.submit(articleId, user.id);
      } else {
        const created = await ArticleService.create(payload);
        setArticleId(created.id);
        if(isSubmission) await ArticleService.submit(created.id, user.id);
      }
      
      alert(isSubmission ? "Envoyé pour validation !" : "Brouillon sauvegardé !");
      if (onSuccess) onSuccess();

    } catch (e: any) {
      setUiState(p => ({ ...p, error: e.message }));
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
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
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
              if (confirm("Confirmer la soumission pour validation ?")) {
                handleSave(true);
              }
            }}
            className="h-10 bg-[#3E7B52] p-3 text-white hover:bg-[#2d5a3c]"
          >
            <Send size={16} className="mr-2" /> Soumettre
          </Button>
        </div>
      </div>

      {/* CHARGEMENT */}
      {uiState.loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#3E7B52]" size={40} />
        </div>
      ) : (
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
              tags={tags}           // 👈 PASS
              setTags={setTags}     // 👈 PASS
              onAutoTag={handleAutoTag}  // 👈 PASS
              isAutoTagging={isAutoTagging} // 👈 PASS
            />
            
            {/* Bloc info */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
              <p className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle size={12} /> Note Importante
              </p>
              L'IA générera automatiquement des mots-clés lors de la soumission basés sur votre contenu riche.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
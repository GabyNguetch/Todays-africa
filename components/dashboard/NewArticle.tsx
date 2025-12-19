"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button'; 
import { ArticleService } from '@/services/article';
import { useAuth } from '@/context/AuthContext';
import ArticleSettings from './new-article/ArticleSettings';
import Toolbar from './new-article/Toolbar';
import EditorContentComp from './new-article/EditorContent';
import { ArticlePayloadDto, BlocContenuDto } from '@/types/article';

interface NewArticleProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editArticleId?: number | null; 
}

export default function NewArticle({ onSuccess, editArticleId, onCancel }: NewArticleProps) {
  
  const [articleId, setArticleId] = useState<number | null>(null);
  const { user } = useAuth();
  
  // Forms State
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [rubriqueId, setRubriqueId] = useState<number | null>(null);
  const [coverImageId, setCoverImageId] = useState<string | number | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [region, setRegion] = useState("GLOBAL");
  
  // Editor
  const [htmlContent, setHtmlContent] = useState("");
  const [editorInstance, setEditorInstance] = useState<any>(null);
  
  // UI
  const [uiState, setUiState] = useState({ loading: false, error: null as string | null });

  // 1️⃣ CHARGEMENT MODE EDITION
  useEffect(() => {
    if (editArticleId) {
        setUiState({ loading: true, error: null });
        ArticleService.getById(editArticleId).then(article => {
            console.log("📝 Edit Article Loaded:", article);
            setArticleId(article.id);
            setTitre(article.titre || "");
            setDescription(article.description || "");
            setRubriqueId(article.rubriqueId);
            setRegion(article.region || "GLOBAL");
            
            // Image Logic
            setCoverImageUrl(article.imageCouvertureUrl || null);
            setCoverImageId(article.imageCouvertureId || null);

            // Reconstruct content
            if(article.blocsContenu) {
                const sorted = [...article.blocsContenu].sort((a,b) => a.ordre - b.ordre);
                let contentHtml = "";
                sorted.forEach(bloc => {
                    if (bloc.type === 'IMAGE') {
                         contentHtml += `<img src="${bloc.contenu || bloc.url}" alt="${bloc.altText||''}" class="rounded my-4 w-full object-cover" />`;
                    } else if (bloc.type === 'CITATION') {
                        contentHtml += `<blockquote>${bloc.contenu}</blockquote>`;
                    } else {
                        contentHtml += bloc.contenu;
                    }
                });
                
                // Inject in editor
                if(editorInstance && !editorInstance.isDestroyed) {
                    editorInstance.commands.setContent(contentHtml);
                } else {
                    setHtmlContent(contentHtml);
                }
            }
        }).catch(err => {
            console.error(err);
            setUiState({ loading: false, error: "Impossible de charger l'article" });
        }).finally(() => {
            setUiState(prev => ({ ...prev, loading: false }));
        });
    }
  }, [editArticleId, editorInstance]);

  // 2️⃣ PARSER ET NETTOYEUR (CORRIGÉ POUR SQL GRAMMAR)
  const parseBlocks = (html: string): BlocContenuDto[] => {
    if(typeof window === 'undefined') return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks: BlocContenuDto[] = [];
    let idx = 1;

    // Helper: Si la chaîne est vide/nulle, on renvoie une chaine vide "" pour éviter SQL Error sur NOT NULL
    const safeString = (str: string | undefined | null) => str ? str.trim() : "";
    const cleanUrl = (url: string) => (url && url.length < 2000 ? url : "");

    Array.from(doc.body.children).forEach(el => {
        const tag = el.tagName.toLowerCase();
        
        // --- BLOC IMAGE ---
        if(tag === 'img') {
            const imgEl = el as HTMLImageElement;
            const src = cleanUrl(imgEl.src);
            if (!src) return; // Ignore image invalide
            
            blocks.push({
                type: 'IMAGE',
                contenu: src,
                url: src,
                altText: safeString(imgEl.alt),
                legende: safeString(imgEl.title), // Mapping Title -> Légende
                ordre: idx++
                // Pas de champ 'titre'
            });
            return;
        }
        
        // --- BLOC CITATION ---
        if(tag === 'blockquote') {
            blocks.push({ 
                type: 'CITATION', 
                contenu: safeString((el as HTMLElement).innerText),
                url: "",      // Safe SQL
                altText: "",  // Safe SQL
                legende: "",  // Safe SQL
                ordre: idx++ 
            });
            return;
        }

        // --- BLOC TEXTE ---
        // On prend le HTML complet de l'élément pour garder le formatage (gras, liens...)
        const innerText = (el as HTMLElement).innerText.trim();
        // Si vide, on ignore (sauf si c'est pour l'espacement structurel, à voir)
        if(innerText !== "" || tag === 'p' || tag.startsWith('h') || tag === 'ul') {
             blocks.push({ 
                type: 'TEXTE', 
                contenu: el.outerHTML, // Important: on envoie le HTML partiel
                url: "", 
                altText: "",
                legende: "",
                ordre: idx++ 
            });
        }
    });
    
    return blocks;
  };

  // 3️⃣ HANDLE SAVE (VERSION SÉCURISÉE)
  const handleSave = async (shouldSubmit: boolean) => {
      setUiState({ loading: true, error: null });

      // Validation Frontend simple
      if(!titre.trim()) { setUiState({loading: false, error: "Le titre est requis"}); return; }
      if(!rubriqueId) { setUiState({loading: false, error: "Choisissez une rubrique"}); return; }
      if(!description.trim()) { setUiState({loading: false, error: "Le résumé est requis"}); return; }

      try {
          // --- 1. Parsing Blocs ---
          const blocs = parseBlocks(htmlContent);
          
          if(blocs.length === 0) {
              setUiState({loading: false, error: "L'article doit avoir du contenu."});
              return;
          }

          // --- 2. ID Image Safe ---
          // Le backend veut un Int32 ou null. UUID String -> null.
          let safeCoverId: number | null = null;
          if (coverImageId) {
             const parsed = parseInt(String(coverImageId), 10);
             if (!isNaN(parsed) && parsed > 0) safeCoverId = parsed;
          }

          // Cas UUID Image : Injecter dans le corps si ID backend refusé
          if (!safeCoverId && coverImageUrl) {
              // Vérifier si pas déjà dans le texte
              const exists = blocs.some(b => b.url === coverImageUrl);
              if(!exists) {
                  blocs.unshift({
                      type: 'IMAGE',
                      contenu: coverImageUrl,
                      url: coverImageUrl,
                      altText: "Image principale",
                      legende: "",
                      ordre: 0
                  });
              }
          }

          // Réindexer l'ordre proprement 1, 2, 3...
          const finalBlocs = blocs.map((b, i) => ({ ...b, ordre: i + 1 }));

          // --- 3. Construction Payload (STRUCTURE STRICTE BASE DE DONNÉES) ---
          const payload: ArticlePayloadDto = {
              titre: titre.trim(),
              description: description.trim(),
              rubriqueId: rubriqueId,
              auteurId: user?.id || 0,
              imageCouvertureId: safeCoverId, 
              region: region || "GLOBAL",
              visible: false,
              statut: "DRAFT",
              tagIds: [],
              datePublication: null, // Ou chaine ISO si besoin, mais null par défaut pr draft
              blocsContenu: finalBlocs
          };
          
          console.log("📤 Sending SAFE Payload:", payload);

          let result;
          if (articleId) {
             result = await ArticleService.update(articleId, payload);
          } else {
             result = await ArticleService.create(payload);
             setArticleId(result.id);
          }

          if (shouldSubmit && result.id && user?.id) {
              await ArticleService.submit(result.id, user.id);
              if(onSuccess) onSuccess();
          } else {
              alert("Article brouillon sauvegardé !");
          }

      } catch (err: any) {
          console.error("Save failed:", err);
          let msg = err.message || "Erreur inconnue";
          // User friendly SQL msg
          if(msg.includes("SQL")) msg = "Erreur format. Vérifiez qu'aucun texte n'est trop long.";
          setUiState({ loading: false, error: msg });
      } finally {
          setUiState(prev => ({ ...prev, loading: false }));
      }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-in fade-in">
        <div className="sticky top-0 z-40 bg-[#FBFBFB] dark:bg-black py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                   <h2 className="text-xl font-bold dark:text-white">
                      {articleId ? `Édition` : "Nouveau Article"}
                   </h2>
                   {uiState.error && (
                       <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded block mt-1 animate-pulse">
                           ⚠️ {uiState.error}
                       </span>
                   )}
                </div>
            </div>
            
            <div className="flex gap-3">
                <Button 
                    variant="outline"
                    disabled={uiState.loading}
                    onClick={() => handleSave(false)}
                    className="h-10 px-4 bg-white dark:bg-zinc-900 border-gray-200"
                >
                    {uiState.loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} className="mr-2"/>}
                    Brouillon
                </Button>
                <Button 
                    disabled={uiState.loading}
                    onClick={() => { if(confirm("Voulez-vous soumettre cet article pour validation ? Il passera en statut 'EN REVUE'.")) handleSave(true); }}
                    className="h-10 px-6 bg-[#3E7B52] hover:bg-[#326342] text-white font-bold"
                >
                    <Send size={16} className="mr-2"/> Soumettre
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[700px]">
                    <Toolbar editor={editorInstance} />
                    <EditorContentComp 
                        setEditorRef={setEditorInstance} 
                        onChange={setHtmlContent} 
                        initialContent={htmlContent} 
                    />
                </div>
            </div>
            <div className="lg:col-span-1">
                <ArticleSettings 
                    titre={titre} setTitre={setTitre}
                    description={description} setDescription={setDescription}
                    rubriqueId={rubriqueId} setRubriqueId={setRubriqueId}
                    
                    coverImageId={coverImageId} setCoverImageId={setCoverImageId}
                    coverImageUrl={coverImageUrl} setCoverImageUrl={setCoverImageUrl}
                    
                    region={region} setRegion={setRegion}
                />
            </div>
        </div>
    </div>
  );
}
// FICHIER: services/article.ts - VERSION AVEC CACHE

import { APP_CONFIG } from "@/lib/constant";
import { authService } from "@/services/auth";
import { CacheService } from "@/lib/cache";
import { 
  ArticlePayloadDto, 
  ArticleReadDto, 
  MediaResponseDto, 
  Rubrique,
  validateArticlePayload,
  ArticlePublicationDto
} from "@/types/article";

const API_PROXY = APP_CONFIG.apiUrl; 

export const ArticleService = {
  
  // ==========================================
  // MÉDIAS (UPLOAD & GET)
  // ==========================================
  
  /**
   * ✅ CORRECTION: Récupération d'un média par ID (UUID ou Integer)
   */
  getMedia: async (id: string | number): Promise<MediaResponseDto> => {
    const token = authService.getToken();
    try {
        console.log(`🔎 [getMedia] Requête pour ID: ${id}`);
        const res = await fetch(`${API_PROXY}/media/info/${id}`, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });

        if (!res.ok) throw new Error("Média introuvable");
        const data = await res.json();
        
        console.log("📥 [getMedia] Réponse:", data);

        return ArticleService._formatMediaResponse(data);
    } catch (error) {
        console.error("❌ Erreur getMedia:", error);
        throw error;
    }
  },

 /**
   * ✅ CORRECTION: Upload média avec retour de l'ID numérique
   */
  uploadMedia: async (file: File): Promise<MediaResponseDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");

    const cleanFileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w.-]/g, '_')
      .replace(/_{2,}/g, '_');
    
    const safeName = encodeURIComponent(cleanFileName);
    
    const endpoint = `${API_PROXY}/media/upload?altText=${safeName}&legende=${safeName}`;
    
    const fd = new FormData();
    fd.append("file", file);

    console.log(`📤 [uploadMedia] Upload: ${file.name} (${file.size} bytes)`);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) {
      let errorText = "";
      let errorJson: any = null;
      
      try {
        errorText = await res.text();
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText };
      }
      
      console.error("❌ Echec Upload:", errorJson);
      
      const errorMsg = errorJson?.message || errorJson?.error || "Erreur inconnue";
      
      if (res.status === 413) {
        throw new Error("Fichier trop volumineux (max 10MB)");
      } else if (res.status === 415) {
        throw new Error("Format de fichier non supporté");
      } else if (res.status === 500 && errorMsg.includes("stocker")) {
        throw new Error("Erreur serveur : impossible d'enregistrer le fichier.");
      }
      
      throw new Error(`Erreur serveur (${res.status}): ${errorMsg}`);
    }
    
    const data = await res.json();
    
    console.group("✅ UPLOAD RÉUSSI");
    console.log("📦 Réponse Backend:", data);
    const formatted = ArticleService._formatMediaResponse(data);
    console.log("🆔 ID numérique:", formatted.id);
    console.log("🔗 URL Complète:", formatted.urlAcces);
    console.groupEnd();

    return formatted;
  },

  /**
   * ✅ CORRECTION MAJEURE: Formatage de la réponse média
   * Le backend doit retourner un ID NUMÉRIQUE, pas un UUID
   * Remplace automatiquement localhost par l'URL de production
   */
  _formatMediaResponse: (data: any): MediaResponseDto => {
    console.log("🛠️ [_formatMediaResponse] Formatting:", data);

    // Le backend renvoie l'URL complète dans le champ 'url'
    let finalUrl = data.url || "/images/placeholder.jpg";

    // ✅ CORRECTION: Remplacer localhost par l'URL de production
    if (finalUrl.includes('localhost:8080') || finalUrl.includes('localhost:8081')) {
      finalUrl = finalUrl
        .replace('http://localhost:8080', 'https://totayafrica.onrender.com')
        .replace('http://localhost:8081', 'https://totayafrica.onrender.com');
      
      console.log("🔄 URL localhost remplacée par production");
    }

    console.log("🔗 URL finale:", finalUrl);

    // ✅ CRITIQUE: L'ID doit être un nombre pour le backend Java
    // Si le backend renvoie un UUID, il faut un autre endpoint pour obtenir l'ID numérique
    const numericId = typeof data.id === 'number' ? data.id : parseInt(String(data.id));
    
    if (isNaN(numericId)) {
      console.error("❌ ID média invalide:", data.id);
      throw new Error("Le serveur n'a pas retourné un ID valide pour le média");
    }

    return {
      id: String(numericId), // Stocké en string côté frontend pour compatibilité
      urlAcces: finalUrl,
      nomOriginal: data.nom || data.nomOriginal || "Fichier",
      typeMime: data.typeMime || "image/jpeg"
    };
  },

   /**
   * ✅ NOUVELLE FONCTION: Nettoyer les URLs dans les articles récupérés
   * Utilisée pour corriger les URLs des images dans les articles existants
   */
  cleanArticleUrls: (article: ArticleReadDto): ArticleReadDto => {
    const cleanUrl = (url: string | null | undefined): string | null => {
      if (!url) return null;
      
      if (url.includes('localhost:8080') || url.includes('localhost:8081')) {
        return url
          .replace('http://localhost:8080', 'https://totayafrica.onrender.com')
          .replace('http://localhost:8081', 'https://totayafrica.onrender.com');
      }
      
      return url;
    };

    return {
      ...article,
      imageCouvertureUrl: cleanUrl(article.imageCouvertureUrl),
      blocsContenu: article.blocsContenu?.map(bloc => ({
        ...bloc,
        contenu: bloc.type === 'IMAGE' ? cleanUrl(bloc.contenu) || bloc.contenu : bloc.contenu,
        url: cleanUrl(bloc.url),
        mediaUrl: cleanUrl(bloc.mediaUrl)
      }))
    };
  },


  // ==========================================
  // CRÉATION ARTICLE - CORRECTION CRITIQUE
  // ==========================================
  
  /**
   * ✅ CORRECTION: Création d'article avec gestion correcte des médias
   */
  create: async (payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Non authentifié");

    const errors = validateArticlePayload(payload);
    if (errors.length > 0) throw new Error(errors[0]);

    console.group("📝 [create] Préparation payload article");
    console.log("Payload brut:", payload);

    // ✅ CORRECTION CRITIQUE: Image de couverture - Le backend attend un INTEGER
    let coverImageIdToSend: number | null = null;
    
    if (payload.imageCouvertureId) {
      const idValue = payload.imageCouvertureId;
      
      // Si c'est déjà un nombre, on l'utilise directement
      if (typeof idValue === 'number') {
        coverImageIdToSend = idValue;
        console.log("✅ Image couverture ID (Integer):", coverImageIdToSend);
      } 
      // Si c'est une string, on la convertit en nombre
      else if (typeof idValue === 'string') {
        const parsed = parseInt(idValue);
        if (!isNaN(parsed) && parsed > 0) {
          coverImageIdToSend = parsed;
          console.log("✅ Image couverture ID converti:", coverImageIdToSend);
        } else {
          console.warn("⚠️ imageCouvertureId invalide:", idValue);
        }
      }
    }

    // ✅ CORRECTION 2: Blocs de contenu avec médias
    const blocsContenuToSend = payload.blocsContenu.map((b, idx) => {
      const bloc: any = {
        type: b.type,
        contenu: b.contenu || "",
        ordre: idx,
        legende: b.legende || "",
        altText: b.altText || "",
        url: b.url || "",
        articleId: 0
      };

      // ✅ Gestion du mediaId pour les blocs IMAGE - Doit être un INTEGER
      if (b.type === 'IMAGE' && b.mediaId) {
        const mediaIdStr = String(b.mediaId);
        const parsed = parseInt(mediaIdStr);
        
        if (!isNaN(parsed) && parsed > 0) {
          bloc.mediaId = parsed;
          console.log(`✅ Bloc ${idx} (IMAGE) - mediaId (Integer):`, parsed);
        } else {
          bloc.mediaId = null;
          console.warn(`⚠️ Bloc ${idx} - mediaId invalide:`, mediaIdStr);
        }
      } else {
        bloc.mediaId = null;
      }

      return bloc;
    });

    const cleanPayload = {
      titre: payload.titre,
      description: payload.description,
      rubriqueId: payload.rubriqueId,
      auteurId: payload.auteurId,
      imageCouvertureId: coverImageIdToSend, // ✅ INTEGER ou null
      region: payload.region,
      visible: false,
      statut: payload.statut,
      tagIds: payload.tagIds || [],
      datePublication: payload.datePublication || null,
      blocsContenu: blocsContenuToSend
    };

    console.log("📤 Payload nettoyé:", JSON.stringify(cleanPayload, null, 2));
    console.groupEnd();

    const res = await fetch(`${APP_CONFIG.apiUrl}/articles`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(cleanPayload)
    });

    if (!res.ok) {
        const txt = await res.text();
        console.error("❌ Backend Refusal:", txt);
        
        try {
          const errorJson = JSON.parse(txt);
          throw new Error(errorJson.message || errorJson.error || `Erreur ${res.status}`);
        } catch (e) {
          throw new Error(`Erreur Création (${res.status}): ${txt.substring(0, 200)}`);
        }
    }
    
    const result = await res.json();
    console.log("✅ Article créé:", result);
    
    // Invalider les caches pertinents
    CacheService.invalidateRubrique(payload.rubriqueId);
    CacheService.remove("trending_articles");
    
    return result;
  },

/**
   * ✅ CORRECTION: Modification d'article avec gestion correcte des médias
   */
  update: async (id: number, payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    
    console.group(`📝 [update] Modification article #${id}`);
    
    // ✅ Même logique de nettoyage que pour create
    let coverImageIdToSend: number | null = null;
    
    if (payload.imageCouvertureId) {
      const idValue = payload.imageCouvertureId;
      
      if (typeof idValue === 'number') {
        coverImageIdToSend = idValue;
      } else if (typeof idValue === 'string') {
        const parsed = parseInt(idValue);
        if (!isNaN(parsed) && parsed > 0) {
          coverImageIdToSend = parsed;
        }
      }
    }

    const blocsContenuToSend = payload.blocsContenu.map((b, idx) => {
      const bloc: any = {
        type: b.type,
        contenu: b.contenu || "",
        ordre: idx,
        legende: b.legende || "",
        altText: b.altText || "",
        url: b.url || "",
        articleId: id
      };

      if (b.type === 'IMAGE' && b.mediaId) {
        const parsed = parseInt(String(b.mediaId));
        if (!isNaN(parsed) && parsed > 0) {
          bloc.mediaId = parsed;
        } else {
          bloc.mediaId = null;
        }
      } else {
        bloc.mediaId = null;
      }

      return bloc;
    });
    
    const cleanPayload = {
      ...payload,
      imageCouvertureId: coverImageIdToSend,
      blocsContenu: blocsContenuToSend
    };

    console.log("📤 Payload update:", cleanPayload);
    console.groupEnd();
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(cleanPayload)
    });

    if (res.status === 204) {
      const article = await ArticleService.getById(id);
      
      // Invalider les caches
      CacheService.invalidateArticle(id);
      if (payload.rubriqueId) {
        CacheService.invalidateRubrique(payload.rubriqueId);
      }
      CacheService.remove("trending_articles");
      
      return ArticleService.cleanArticleUrls(article);
    }
    
    if (!res.ok) {
      const txt = await res.text();
      console.error("❌ Erreur modification:", txt);
      throw new Error("Erreur modification");
    }
    
    const result = await res.json();
    
    // Invalider les caches
    CacheService.invalidateArticle(id);
    if (payload.rubriqueId) {
      CacheService.invalidateRubrique(payload.rubriqueId);
    }
    CacheService.remove("trending_articles");
    
    return ArticleService.cleanArticleUrls(result);
  },

 /**
   * ✅ CORRECTION: Récupération d'article avec nettoyage des URLs
   */
  getById: async (id: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/public/articles/${id}`, { headers });
    
    if (!res.ok) {
      throw new Error(`Article ${id} introuvable`);
    }
    
    const article = await res.json();
    
    // ✅ Nettoyer les URLs avant de retourner
    const cleaned = ArticleService.cleanArticleUrls(article);
    
    // Mettre à jour le cache
    CacheService.setArticle(id, cleaned);
    
    return cleaned;
  },

  // ==========================================
  // WORKFLOW - SOUMISSION
  // ==========================================
  
  submitForReview: async (articleId: number, redacteurId: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Non authentifié");
    
    console.group(`📤 Soumission Article #${articleId}`);
    console.log("Auteur:", redacteurId);
    console.log("Endpoint:", `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/${articleId}/submit`);
    
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/${articleId}/submit`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      }
    );
    
    if (!res.ok) {
      const error = await res.text();
      console.error("Erreur:", error);
      console.groupEnd();
      throw new Error("Échec soumission pour validation");
    }
    
    const data = await res.json();
    console.log("✅ Statut:", data.statut);
    console.groupEnd();
    
    return data;
  },

  submit: async (articleId: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Non authentifié");
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${articleId}/submit`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Échec soumission");
    }
    
    return await res.json();
  },

  // ==========================================
  // WORKFLOW - VALIDATION ADMIN
  // ==========================================
  
  approve: async (id: number): Promise<void> => {
    const token = authService.getToken();
    
    console.group(`✅ Approbation Article #${id}`);
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/approve`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({})
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("Erreur:", error);
      console.groupEnd();
      throw new Error(error.message || `Erreur approbation ${id}`);
    }
    
    console.log("✅ Article approuvé");
    console.groupEnd();
  },

  reject: async (id: number, motif: string): Promise<void> => {
    const token = authService.getToken();
    const endpoint = `${APP_CONFIG.apiUrl}/articles/${id}/reject?motif=${encodeURIComponent(motif)}`;
    
    console.group(`❌ Rejet Article #${id}`);
    console.log("Motif:", motif);
    
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      console.groupEnd();
      throw new Error("Échec du rejet");
    }
    
    console.log("✅ Article rejeté");
    console.groupEnd();
  },

  // ==========================================
  // PUBLICATION
  // ==========================================
  
  publish: async (id: number): Promise<void> => {
    const token = authService.getToken();
    
    console.group(`🚀 Publication Article #${id}`);
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/publish`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({})
    });
    
    if (!res.ok) {
      console.groupEnd();
      throw new Error("Erreur publication");
    }
    
    console.log("✅ Article publié");
    console.groupEnd();
  },

  publishAdvanced: async (id: number, config: ArticlePublicationDto): Promise<void> => {
    const token = authService.getToken();
    
    console.group(`🚀 Publication Avancée Article #${id}`);
    console.log("Configuration:", config);
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/publish-advanced`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(config)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Erreur:", err);
        console.groupEnd();
        throw new Error(err.message || "Erreur lors de la publication avancée");
    }
    
    console.log("✅ Publication avancée effectuée");
    console.groupEnd();
  },

  // ==========================================
  // AVANT-PREMIÈRE
  // ==========================================
  
  setPreviewMode: async (id: number, config: { dateFinAvantPremiere?: string, accessRestreint?: boolean }) => {
      const token = authService.getToken();
      
      console.group(`🔒 Mode Avant-Première Article #${id}`);
      console.log("Config:", config);
      
      const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/set-preview`, {
          method: "PATCH",
          headers: { 
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(config)
      });
      
      if (!res.ok) {
        console.groupEnd();
        throw new Error("Erreur mode avant-première");
      }
      
      console.log("✅ Avant-première activée");
      console.groupEnd();
      
      return await res.json();
  },

  // ==========================================
  // ARCHIVAGE
  // ==========================================
  
  archive: async (id: number): Promise<void> => {
    const token = authService.getToken();
    
    console.group(`📦 Archivage Article #${id}`);
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/archive`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      console.groupEnd();
      throw new Error("Échec archivage");
    }
    
    console.log("✅ Article archivé");
    console.groupEnd();
  },

  delete: async (id: number): Promise<void> => {
    const token = authService.getToken();
    
    console.group(`🗑️ Suppression Article #${id}`);
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      console.groupEnd();
      throw new Error("Suppression impossible");
    }
    
    // Invalider tous les caches liés
    CacheService.invalidateArticle(id);
    CacheService.clear(); // Nettoyage complet pour éviter les incohérences
    
    console.log("✅ Article supprimé");
    console.groupEnd();
  },

  // ==========================================
  // VUES & ANALYTICS
  // ==========================================
  
  recordView: async (id: number, dureeVue: number = 0, scrollDepth: number = 0): Promise<any> => {
    const token = authService.getToken();
    try {
      const res = await fetch(
        `${APP_CONFIG.apiUrl}/articles/${id}/view?dureeVue=${dureeVue}&scrollDepth=${scrollDepth}`, 
        {
          method: "POST",
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        }
      );
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  },

  // ==========================================
  // MISE EN AVANT (FEATURED)
  // ==========================================
  
  feature: async (id: number, config: {
    section: string;
    ordre: number;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<void> => {
    const token = authService.getToken();
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/feature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(config)
    });
    
    if (!res.ok) {
      throw new Error("Erreur mise en avant");
    }
  },

  // ==========================================
  // TAGS
  // ==========================================
  
  assignTags: async (articleId: number, tags: string[]): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/tags/article/${articleId}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(tags)
    });
    if (!res.ok) throw new Error("Erreur assignation tags");
  },

  generateAutoTags: async (articleId: number): Promise<string[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${articleId}/auto-tag`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur génération auto-tags");
    return await res.json();
  },

  getArticleTags: async (articleId: number): Promise<any[]> => {
     try {
         const token = authService.getToken();
         const res = await fetch(`${APP_CONFIG.apiUrl}/tags/article/${articleId}`, {
             headers: { "Authorization": `Bearer ${token}` }
         });
         return res.ok ? await res.json() : [];
     } catch { return []; }
  },

  // ==========================================
  // RUBRIQUES
  // ==========================================
  
  getRubriquesTree: async (): Promise<Rubrique[]> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`);
      return res.ok ? await res.json() : [];
    } catch {
      return [];
    }
  },
  
  createRubrique: async (nom: string) => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ nom, visible: true })
    });
    
    return res.ok ? await res.json() : null;
  },

  // ==========================================
  // LISTES RÉDACTEUR
  // ==========================================
  
  getRedacteurBrouillons: async (redacteurId: number): Promise<ArticleReadDto[]> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");

    try {
        const response = await fetch(
            `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/brouillons`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            console.warn(`Erreur récupération brouillons: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
        
    } catch (error) {
        console.error("❌ Erreur réseau brouillons:", error);
        return [];
    }
  },

  getRedacteurPublies: async (redacteurId: number): Promise<ArticleReadDto[]> => {
    const token = authService.getToken();
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/publies`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
    
    return res.ok ? await res.json() : [];
  },

  getRedacteurTousArticles: async (redacteurId: number, page = 0, size = 50): Promise<any> => {
    const token = authService.getToken();
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles?page=${page}&size=${size}&sort=updatedAt,desc`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
    
    return res.ok ? await res.json() : { content: [] };
  },

  // ==========================================
  // LISTES ADMIN
  // ==========================================
  
  getArticlesByStatus: async (status: string, page = 0, size = 20): Promise<any> => {
    const token = authService.getToken();
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/articles/by-status/${status}?page=${page}&size=${size}&sort=updatedAt,desc`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
    
    if (!res.ok) {
      throw new Error("Erreur chargement liste admin");
    }
    
    return await res.json();
  },

  getAllRedacteurs: async (): Promise<any[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/utilisateurs/redacteurs`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    return res.ok ? await res.json() : [];
  },

  getAllUsers: async (): Promise<any[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/utilisateurs/all`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    return res.ok ? await res.json() : [];
  },

  getAuthorStats: async (authorId: number): Promise<any> => {
    const token = authService.getToken();
    try {
      const res = await fetch(
        `${APP_CONFIG.apiUrl}/articles/author/${authorId}/stats`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  },

  // ==========================================
  // FAST-TRACK PUBLICATION
  // ==========================================
  
  quickPublish: async (articleId: number, authorId: number): Promise<void> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");

    try {
      console.group(`🚀 Fast-Track Publishing pour #${articleId}`);
      
      console.log("⏳ Étape 1: Soumission...");
      await ArticleService.submitForReview(articleId, authorId);

      console.log("⏳ Étape 2: Approbation...");
      await ArticleService.approve(articleId);

      console.log("⏳ Étape 3: Mise en ligne...");
      await ArticleService.publish(articleId);

      console.log("✅ Article publié avec succès !");
      console.groupEnd();
    } catch (error: any) {
      console.error("❌ Échec du Fast-Track:", error);
      console.groupEnd();
      throw new Error(error.message || "Erreur lors du cycle de publication rapide");
    }
  },
};
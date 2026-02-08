// FICHIER: services/article.ts - VERSION CORRIGÉE

import { APP_CONFIG } from "@/lib/constant";
import { authService } from "@/services/auth";
import { 
  ArticlePayloadDto, 
  ArticleReadDto, 
  MediaResponseDto, 
  Rubrique,
  validateArticlePayload,
  ArticlePublicationDto  // <--- AJOUTEZ CETTE LIGNE ICI
} from "@/types/article";

const API_PROXY = APP_CONFIG.apiUrl; 

export const ArticleService = {
  
  // ==========================================
  // MÉDIAS (UPLOAD & GET)
  // ==========================================
  
/**
   * 1. RECUPÉRER VIA ID
   */
  getMedia: async (id: string | number): Promise<MediaResponseDto> => {
    const token = authService.getToken();
    try {
        console.log(`🔎 [ArticleService] getMedia demandé pour ID: ${id}`);
        const res = await fetch(`${API_PROXY}/media/info/${id}`, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });

        if (!res.ok) throw new Error("Média introuvable via l'API");
        const data = await res.json();
        
        console.log("📥 [ArticleService] Données média brutes:", data);

        return ArticleService._formatMediaResponse(data);
    } catch (error) {
        console.error("❌ Erreur getMedia:", error);
        throw error;
    }
  },

  /**
   * 2. UPLOAD FICHIER - VERSION AMÉLIORÉE
   */
  uploadMedia: async (file: File): Promise<MediaResponseDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");

    // ✅ Nettoyage du nom de fichier pour éviter les problèmes d'encodage
    const cleanFileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^\w.-]/g, '_') // Remplacer caractères spéciaux par underscore
      .replace(/_{2,}/g, '_'); // Éviter les underscores multiples
    
    const safeName = encodeURIComponent(cleanFileName);
    
    // Utilisation des query params pour Swagger
    const endpoint = `${API_PROXY}/media/upload?altText=${safeName}&legende=${safeName}`;
    
    const fd = new FormData();
    fd.append("file", file); // Clé 'file' selon swagger

    console.log(`📤 [ArticleService] Début Upload: ${file.name} → ${cleanFileName} (${file.size} bytes)`);

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
      
      // Message d'erreur plus explicite pour l'utilisateur
      const errorMsg = errorJson?.message || errorJson?.error || "Erreur inconnue";
      
      // Cas spécifiques
      if (res.status === 413) {
        throw new Error("Fichier trop volumineux (max 10MB)");
      } else if (res.status === 415) {
        throw new Error("Format de fichier non supporté");
      } else if (res.status === 500 && errorMsg.includes("stocker")) {
        throw new Error("Erreur serveur : impossible d'enregistrer le fichier. Veuillez réessayer ou contacter l'administrateur.");
      }
      
      throw new Error(`Erreur serveur (${res.status}): ${errorMsg}`);
    }
    
    const data = await res.json();
    
    // --- ✅ DEBUG CRUCIAL ---
    console.group("✅ UPLOAD REUSSI");
    console.log("📦 Réponse Backend:", data);
    const formatted = ArticleService._formatMediaResponse(data);
    console.log("🔗 URL RECONSTRUITE POUR LE FRONT:", formatted.urlAcces);
    console.groupEnd();

    return formatted;
  },

  /**
   * HELPER CORRIGÉ : Extrait l'URL de preview du backend
   */
_formatMediaResponse: (data: any): MediaResponseDto => {
  console.log("🛠️ Formating media data:", data);

  // ✅ Le backend renvoie 'url' directement
  const finalUrl = data.url || (data.fileName ? `${APP_CONFIG.mediaBaseUrl}${data.fileName}` : "/images/image4.jpeg");

  console.log("🔗 URL finale extraite:", finalUrl);

  return {
    id: String(data.id),
    urlAcces: finalUrl, // ✅ On mappe 'url' backend vers 'urlAcces' frontend
    nomOriginal: data.nom || data.nomOriginal || "Fichier",
    typeMime: data.typeMime || "image/jpeg"
  };
},
  

  // === CRÉATION ARTICLE ===
  create: async (payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Non authentifié");

    // Validation
    const errors = validateArticlePayload(payload);
    if (errors.length > 0) throw new Error(errors[0]);

    // ✅ NETTOYAGE CRITIQUE DU PAYLOAD
    // Pour éviter les erreurs 400 Bad Request JSON
    const cleanPayload = {
      titre: payload.titre,
      description: payload.description,
      rubriqueId: payload.rubriqueId,
      auteurId: payload.auteurId,
      // Pour l'instant on force null si pas défini (évite mismatch Int/UUID)
      // Si votre Swagger dit Int pour coverImageId mais que le media est UUID, 
      // il faut soit mettre null, soit le backend doit être corrigé. On met null pour que ça passe.
      imageCouvertureId: payload.imageCouvertureId || null, 
      region: payload.region,
      visible: false,
      statut: payload.statut,
      tagIds: payload.tagIds || [],
      datePublication: payload.datePublication || null, // null pour DRAFT

      // MAPPING BLOCS
      blocsContenu: payload.blocsContenu.map((b, idx) => ({
        type: b.type,
        contenu: b.contenu || "",
        ordre: idx, // Force l'ordre séquentiel
        legende: b.legende || "",
        altText: b.altText || "",
        url: b.url || "",
        // 🔴 Correction Majeure : "0" -> null pour les UUID
        mediaId: (b.mediaId && b.mediaId !== "0") ? b.mediaId : null,
        articleId: 0 // Requis par certaines Logiques DTO
      }))
    };

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
        console.error("Backend Refusal:", txt);
        throw new Error(`Erreur Création (${res.status}): ${txt}`);
    }
    
    return await res.json();
  },

  // === MODIFICATION ===
  update: async (id: number, payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    
    // Payload cleaning similaire au Create
    const cleanPayload = {
      ...payload,
      imageCouvertureId: payload.imageCouvertureId ? Number(payload.imageCouvertureId) : null,
      blocsContenu: payload.blocsContenu.map((b, idx) => ({
        ...b,
        ordre: idx,
        mediaId: (b.mediaId && b.mediaId !== "0") ? String(b.mediaId) : null,
        articleId: id 
      }))
    };
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(cleanPayload)
    });

    if (res.status === 204) return ArticleService.getById(id);
    if (!res.ok) throw new Error("Erreur modification");
    return await res.json();
  },

  // ==========================================
  // LECTURE ARTICLE
  // ==========================================
  
  getById: async (id: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, { headers });
    
    if (!res.ok) {
      throw new Error(`Article ${id} introuvable`);
    }
    
    return await res.json();
  },

  // ==========================================
  // SOUMISSION POUR VALIDATION
  // ==========================================
  
  submit: async (articleId: number, redacteurId: number): Promise<ArticleReadDto> => {
    return ArticleService.submitForReview(articleId, redacteurId);
    console.log(`🚀 Soumission de l'article ${articleId} pour validation par le rédacteur ${redacteurId}`);
    console.log("🔐 Token utilisé:", authService.getToken());
    console.log("📡 Endpoint appelé:", `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/${articleId}/submit`) ;
  },

  submitForReview: async (articleId: number, redacteurId: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Non authentifié");
    
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/${articleId}/submit`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      }
    );
    
    if (!res.ok) {
      throw new Error("Échec soumission pour validation");
    }
    
    return await res.json();
  },

  // ==========================================
  // ACTIONS ADMIN
  // ==========================================
  
  approve: async (id: number): Promise<void> => {
    const token = authService.getToken();
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
      throw new Error(error.message || `Erreur approbation ${id}`);
    }
  },

  publish: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/publish`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({})
    });
    
    if (!res.ok) {
      throw new Error("Erreur publication");
    }
  },

  reject: async (id: number, motif: string): Promise<void> => {
    const token = authService.getToken();
    const endpoint = `${APP_CONFIG.apiUrl}/articles/${id}/reject?motif=${encodeURIComponent(motif)}`;
    
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Échec du rejet");
    }
  },

  archive: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/archive`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Échec archivage");
    }
  },

  delete: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Suppression impossible");
    }
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
  
// DANS : services/article.ts

getRedacteurBrouillons: async (redacteurId: number): Promise<ArticleReadDto[]> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise pour voir les brouillons");

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
            // On peut loguer l'erreur mais on ne throw pas forcément pour ne pas casser l'UI
            console.warn(`Erreur récupération brouillons: ${response.status}`);
            return [];
        }

        const data = await response.json();
        
        // Sécurité : S'assurer que c'est bien un tableau
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
    /**
   * ✅ PUBLICATION AVANCÉE
   */
  publishAdvanced: async (id: number, config: ArticlePublicationDto): Promise<void> => {
    const token = authService.getToken();
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
        throw new Error(err.message || "Erreur lors de la publication avancée");
    }
  },

  /**
   * ✅ MODE AVANT-PREMIÈRE
   */
  setPreviewMode: async (id: number, config: { dateFinAvantPremiere?: string, accessRestreint?: boolean }) => {
      const token = authService.getToken();
      await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/set-preview`, {
          method: "PATCH",
          headers: { 
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(config)
      });
  },
    /**
   * ✅ GESTION DES TAGS (NEW)
   */
  
  // Assigner des tags (string[]) à un article
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

  // Déclencher l'Auto-Tagging par l'IA
  generateAutoTags: async (articleId: number): Promise<string[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${articleId}/auto-tag`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur génération auto-tags");
    return await res.json();
  },

  // Récupérer les tags d'un article (utile pour recharger en mode édition)
  getArticleTags: async (articleId: number): Promise<any[]> => {
     try {
         const token = authService.getToken();
         const res = await fetch(`${APP_CONFIG.apiUrl}/tags/article/${articleId}`, {
             headers: { "Authorization": `Bearer ${token}` }
         });
         return res.ok ? await res.json() : [];
     } catch { return []; }
  },
    /**
   * ✅ FAST-TRACK : Soumettre, Approuver et Publier en une seule action
   * Réservé aux Admins ou Rédacteurs avec privilèges
   */
  quickPublish: async (articleId: number, authorId: number): Promise<void> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");

    try {
      console.group(`🚀 Fast-Track Publishing pour #${articleId}`);
      
      // 1. Soumission
      console.log(" étape 1: Soumission...");
      await ArticleService.submitForReview(articleId, authorId);

      // 2. Approbation (directe car l'auteur est Admin)
      console.log(" étape 2: Approbation...");
      await ArticleService.approve(articleId);

      // 3. Publication finale
      console.log(" étape 3: Mise en ligne...");
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
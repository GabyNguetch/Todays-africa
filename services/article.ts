// FICHIER: services/article.ts
import { APP_CONFIG } from "@/lib/constant";
import { authService } from "@/services/auth";
import { ArticlePayloadDto, ArticleReadDto, MediaResponseDto, Rubrique } from "@/types/article";

// --- Logger Helper ---
const logAPI = (method: string, url: string, status: 'REQ' | 'RES' | 'ERR') => {
    const color = status === 'REQ' ? '#3b82f6' : status === 'RES' ? '#10b981' : '#ef4444';
    console.log(`%c[${status}] ${method} ${url}`, `color: ${color}; font-weight: bold;`);
};

export const ArticleService = {

  // --- ACTIONS GLOBALES (CRUDS) ---

  uploadMedia: async (file: File): Promise<MediaResponseDto> => {
    const token = authService.getToken();
    const endpoint = `/media/upload?altText=${encodeURIComponent(file.name)}&legende=${encodeURIComponent(file.name)}`;
    const res = await fetch(`${APP_CONFIG.apiUrl}${endpoint}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: (() => { const fd = new FormData(); fd.append("file", file); return fd; })(),
    });
    if (!res.ok) throw new Error("Upload échoué");
    return await res.json();
  },

  create: async (payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur création article");
    }
    return await res.json();
  },

  update: async (id: number, payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    // Gestion du 204 No Content ou 200 OK
    if (res.status === 204) return ArticleService.getById(id);
    if (!res.ok) throw new Error("Erreur mise à jour");
    return await res.json();
  },

  delete: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Suppression impossible (peut-être protégé)");
  },

  getById: async (id: number): Promise<ArticleReadDto> => {
      const token = authService.getToken();
      const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
      const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, { headers });
      if(!res.ok) throw new Error("Article introuvable");
      return await res.json();
  },

  // --- FLOW RÉDACTEUR SPÉCIFIQUE (NOUVEAU) ---

  // GET /api/v1/redacteur/{redacteurId}/articles/brouillons
  getRedacteurBrouillons: async (redacteurId: number): Promise<ArticleReadDto[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/brouillons`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if(!res.ok) return [];
    return await res.json();
  },

  // GET /api/v1/redacteur/{redacteurId}/articles/publies
  getRedacteurPublies: async (redacteurId: number): Promise<ArticleReadDto[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/publies`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if(!res.ok) return [];
    return await res.json();
  },

  // GET /api/v1/redacteur/{redacteurId}/articles (Global pour l'historique et Pending)
  getRedacteurTousArticles: async (redacteurId: number, page=0, size=50): Promise<any> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles?page=${page}&size=${size}&sort=updatedAt,desc`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if(!res.ok) return { content: [] };
    return await res.json();
  },

  // Alias pour assurer la compatibilité avec NewArticle.tsx
  submit: async (articleId: number, redacteurId: number): Promise<ArticleReadDto> => {
      return ArticleService.submitForReview(articleId, redacteurId);
  },

  submitForReview: async (articleId: number, redacteurId: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    // Route exacte selon Swagger: POST /api/v1/redacteur/{redacteurId}/articles/{articleId}/submit
    const res = await fetch(`${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/${articleId}/submit`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if(!res.ok) throw new Error("Erreur lors de la soumission pour validation.");
    return await res.json();
  },


  // --- UTILITAIRES ADMIN / GENERAL ---
  getRubriquesTree: async (): Promise<Rubrique[]> => {
    try {
        const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`);
        return res.ok ? await res.json() : [];
    } catch { return []; }
  },
  
  createRubrique: async (nom: string) => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ nom, visible: true })
    });
    return res.ok ? await res.json() : null;
  },
    getArticlesByStatus: async (status: string, page = 0, size = 20): Promise<any> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/by-status/${status}?page=${page}&size=${size}&sort=updatedAt,desc`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Impossible de charger la liste admin");
    return await res.json();
  },

  // ✅ Validation (Passage de PENDING -> APPROVED) [VERSION DEBUG]
  approve: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const endpoint = `${APP_CONFIG.apiUrl}/articles/${id}/approve`;

    // 1. LOG DE LA REQUÊTE
    console.group(`🕵️‍♂️ DEBUG: Approve Article #${id}`);
    console.log(`🔗 URL: ${endpoint}`);
    console.log(`🔑 Token (Extrait): ${token ? token.substring(0, 15) + '...' : 'AUCUN TOKEN'}`);
    console.log(`📤 Method: PATCH`);
    
    try {
        const res = await fetch(endpoint, {
            method: "PATCH",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" // Parfois nécessaire même sans body sur certains serveurs
            }
        });

        // 2. LECTURE DE LA RÉPONSE (Format Texte pour tout capturer)
        const responseText = await res.text();
        
        console.log(`📥 Status: ${res.status} ${res.statusText}`);
        console.log(`📦 Response Body Raw:`, responseText);

        // Essai de parsing JSON pour voir le message d'erreur s'il y en a un
        let errorJson: any = {};
        try {
            errorJson = JSON.parse(responseText);
            console.log("📊 Parsed JSON:", errorJson);
        } catch (e) {
            console.warn("⚠️ La réponse n'est pas du JSON valide");
        }

        console.groupEnd();

        if (!res.ok) {
            // On renvoie le message précis du backend pour l'alerte
            throw new Error(errorJson.message || `Erreur serveur (${res.status}): ${responseText.substring(0, 50)}...`);
        }

    } catch (err: any) {
        console.error("❌ CRITICAL ERROR dans ArticleService.approve:", err);
        console.groupEnd();
        throw err; // Relance pour le composant
    }
  },

  // ❌ Rejet (Passage de PENDING -> REJECTED avec motif)
  reject: async (id: number, motif: string): Promise<void> => {
    const token = authService.getToken();
    // Le motif passe en Query Param selon ton Swagger
    const endpoint = `${APP_CONFIG.apiUrl}/articles/${id}/reject?motif=${encodeURIComponent(motif)}`;
    
    const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if(!res.ok) throw new Error("Échec du rejet");
  },

  // 🚀 Publication (Passage de APPROVED -> PUBLISHED)
  publish: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/publish`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if(!res.ok) throw new Error("Échec de la publication");
  },

  // 📦 Retrait/Archivage (Retrait de PUBLISHED -> ARCHIVED)
  archive: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/archive`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if(!res.ok) throw new Error("Échec de l'archivage");
  },


  // ==========================================
  // 5. GESTION UTILISATEURS & EQUIPE
  // ==========================================

  getAllRedacteurs: async (): Promise<any[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/utilisateurs/redacteurs`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.ok ? await res.json() : [];
  },

  getAllUsers: async (): Promise<any[]> => {
    const token = authService.getToken();
    // Swagger: /utilisateurs?pageable... ou /utilisateurs/all
    const res = await fetch(`${APP_CONFIG.apiUrl}/utilisateurs/all`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.ok ? await res.json() : [];
  },

  // Statistiques pour AdminRedacteur (Nb vues, Nb articles)
  getAuthorStats: async (authorId: number): Promise<any> => {
    const token = authService.getToken();
    try {
        const res = await fetch(`${APP_CONFIG.apiUrl}/articles/author/${authorId}/stats`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
  },

};
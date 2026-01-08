// FICHIER: services/public.ts
import { APP_CONFIG } from "@/lib/constant";
import { ArticleReadDto, CommentaireDto, Rubrique } from "@/types/article";
import { PageResponse } from "@/types/dashboard";
import { authService } from "./auth";
import { CreateCommentairePayload } from "@/types/article";

const API_PROXY = APP_CONFIG.apiUrl; 

export const PublicService = {
  
  /**
   * Récupère les rubriques (Menus)
   * Route: GET /api/v1/rubriques
   */
  getRubriques: async (): Promise<Rubrique[]> => {
    try {
      // On utilise l'endpoint root pour éviter d'avoir tout l'arbre si on veut juste les parents
      // Sinon /rubriques renvoie tout l'arbre. Le frontend filtre.
      const res = await fetch(`${API_PROXY}/rubriques`);
      if (!res.ok) throw new Error("Erreur fetch rubriques");
      return await res.json();
    } catch (e) {
      console.error("❌ Erreur Rubriques:", e);
      return [];
    }
  },

  /**
   * FLUX ACTUALITÉS (Landing Page & Listes)
   * Route: GET /api/v1/public/articles
   * Note: Retourne uniquement les articles PUBLISHED
   */
  getAllArticles: async (page = 0, size = 6): Promise<PageResponse<ArticleReadDto>> => {
    try {
      const res = await fetch(`${API_PROXY}/public/articles?page=${page}&size=${size}&sort=datePublication,desc`, { 
        cache: 'no-store' 
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Erreur Flux Public:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  /**
   * ARTICLES PAR CATÉGORIE
   * Route: GET /api/v1/rubriques/{id}/articles
   * (Plus précis que le filtrage client)
   */
  getArticlesByRubrique: async (id: number): Promise<ArticleReadDto[]> => {
    try {
        const res = await fetch(`${API_PROXY}/rubriques/${id}/articles`); 
        if (!res.ok) return [];
        return await res.json();
    } catch(e) { return []; }
  },
  /**
   * Récupère un article complet avec ses blocs
   */
  getArticleById: async (id: number): Promise<ArticleReadDto | null> => {
    try {
      // Endpoint public. Note : S'assurer que le backend renvoie bien les "blocsContenu" sur ce endpoint public.
      // Sinon, on pourrait avoir besoin d'un endpoint spécifique sans auth.
      const res = await fetch(`${API_PROXY}/public/articles/${id}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { 
        console.error("❌ Erreur Article Detail:", e);
        return null; 
    }
  },
  // 1. Incrémenter la vue (Route /api/v1/public/articles/{id}/vue)
  incrementView: async (id: number): Promise<void> => {
    try {
        // Envoi simple d'une vue (duree 0, scroll 0 pour marquer le "hit")
        // La méthode POST attend des query params selon votre Swagger
        await fetch(`${API_PROXY}/public/articles/${id}/vue?dureeVue=1&scrollDepth=10`, {
            method: 'POST'
        });
    } catch (e) {
        console.warn("View tracking failed", e);
    }
  },

  getTrendingArticles: async (): Promise<ArticleReadDto[]> => {
    try {
      // Utilisation d'un endpoint featureditems ou fallback
      const res = await fetch(`${API_PROXY}/featureditems?page=0&size=3`);
      if (!res.ok) {
         // Fallback sur public/articles si endpoint spécifique indispo
         const latest = await PublicService.getAllArticles(0, 3);
         return latest.content;
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.content || [];
    } catch (e) {
      return []; 
    }
  },
    /**
   * Tracking Analytics (Vue + Scroll)
   */
  trackView: async (id: number, duration: number, scrollDepth: number) => {
      // Mode "fire and forget" pour ne pas bloquer l'UI
      try {
          fetch(`${API_PROXY}/public/articles/${id}/vue?dureeVue=${duration}&scrollDepth=${scrollDepth}`, { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
          }).catch(err => console.warn("Analytics fail silently", err));
      } catch {}
  },
    /**
   * Gestion Favoris (Like/Bookmark) - Nécessite Auth
   */
  toggleFavori: async (userId: number, articleId: number, isCurrentlyFavori: boolean) => {
      const token = authService.getToken();
      if (!token) throw new Error("Connexion requise");

      const method = isCurrentlyFavori ? "DELETE" : "POST";
      const res = await fetch(`${API_PROXY}/user/${userId}/favoris/${articleId}`, {
          method,
          headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Erreur action favori");
      return !isCurrentlyFavori;
  },

    // 2. Gestion des Commentaires
  getComments: async (articleId: number): Promise<CommentaireDto[]> => {
    try {
        // On récupère tout et on filtre (le backend Java standard)
        // Idéalement : le backend devrait avoir /commentaires/article/{id}
        const res = await fetch(`${API_PROXY}/commentaires/all`);
        if (!res.ok) return [];
        const all: CommentaireDto[] = await res.json();
        // Filtrage client faute d'endpoint dédié visible dans le swagger pour le filtrage
        return all.filter(c => c.articleId === articleId && c.status === 'APPROVED'); 
    } catch {
        return [];
    }
  },

  /**
   * Vérifier statut Favori initial
   */
  checkIsFavori: async (userId: number, articleId: number): Promise<boolean> => {
      const token = authService.getToken();
      if (!token) return false;
      try {
          const res = await fetch(`${API_PROXY}/user/${userId}/favoris`, {
              headers: { "Authorization": `Bearer ${token}` }
          });
          if (!res.ok) return false;
          const favoris: any[] = await res.json();
          return favoris.some(f => f.id === articleId);
      } catch { return false; }
  },

    // 3. Gestion des Likes / Favoris
  toggleLike: async (articleId: number, isCurrentlyLiked: boolean): Promise<void> => {
      const user = authService.getUserFromStorage();
      if (!user) throw new Error("Connectez-vous pour liker");
      const token = authService.getToken();

      if (!isCurrentlyLiked) {
          // Ajouter aux favoris
          await fetch(`${API_PROXY}/user/${user.id}/favoris/${articleId}`, {
              method: 'POST',
              headers: { "Authorization": `Bearer ${token}` }
          });
      } else {
          // Retirer
          await fetch(`${API_PROXY}/user/${user.id}/favoris/${articleId}`, {
              method: 'DELETE',
              headers: { "Authorization": `Bearer ${token}` }
          });
      }
  },

  checkIfLiked: async (articleId: number): Promise<boolean> => {
      const user = authService.getUserFromStorage();
      if (!user) return false;
      const token = authService.getToken();

      try {
          const res = await fetch(`${API_PROXY}/user/${user.id}/favoris`, {
              headers: { "Authorization": `Bearer ${token}` }
          });
          if (!res.ok) return false;
          const favoris: any[] = await res.json();
          // Vérifie si l'article est dans la liste
          return favoris.some((f: any) => f.id === articleId);
      } catch {
          return false;
      }
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

  // === ARTICLES ADMIN ===
  getAdminArticles: async (page = 0, size = 10): Promise<PageResponse<ArticleReadDto>> => {
    try {
      const res = await fetch(`${API_PROXY}/articles/by-admin?page=${page}&size=${size}&sort=datePublication,desc`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      
      const data = await res.json();
      
      // Si l'API renvoie un tableau simple
      if (Array.isArray(data)) {
         return {
            content: data.slice(0, size),
            totalElements: data.length,
            totalPages: Math.ceil(data.length / size)
         };
      }
      
      return data;
    } catch (e) {
      console.error("❌ Erreur Fetch Admin Articles:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

    /**
   * ✅ TRACKING VUE SOPHISTIQUÉ
   * Enregistre durée + scroll + user
   */
  recordView: async (articleId: number, metrics: { dureeVue: number; scrollDepth: number; userId?: number }) => {
    try {
      const queryParams = new URLSearchParams({
        dureeVue: metrics.dureeVue.toString(),
        scrollDepth: metrics.scrollDepth.toString()
      });
      
      if (metrics.userId) queryParams.append("userId", metrics.userId.toString());

      // Fire and forget (on n'attend pas forcément le résultat pour ne pas bloquer l'UI)
      fetch(`${API_PROXY}/articles/${articleId}/view?${queryParams.toString()}`, {
        method: 'POST'
      }).catch(e => console.warn("Analytics Error", e));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * ✅ COMMENTAIRES
   */
  getCommentsByArticle: async (articleId: number): Promise<any[]> => {
    try {
      const res = await fetch(`${API_PROXY}/commentaires/article/${articleId}`);
      if (!res.ok) return [];
      const comments = await res.json();
      // On ne retourne que les approuvés pour le public, sauf logique contraire
      return Array.isArray(comments) ? comments.filter((c: any) => c.status === 'APPROVED') : [];
    } catch { return []; }
  },
   /**
   * ✅ Récupère UNIQUEMENT les commentaires approuvés pour l'article
   * GET /api/v1/commentaires/article/{id}/approved
   */
  getApprovedComments: async (articleId: number): Promise<CommentaireDto[]> => {
    try {
      // Si la route "approved" n'existe pas encore, on peut filtrer côté client temporairement
      // mais le document spécifie /approved, donc on l'utilise :
      const res = await fetch(`${API_PROXY}/commentaires/article/${articleId}/approved`);
      
      if (!res.ok) {
         // Fallback sur tous les commentaires si endpoint spécifique manque
         const fallbackRes = await fetch(`${API_PROXY}/commentaires/article/${articleId}`);
         if(!fallbackRes.ok) return [];
         const all: CommentaireDto[] = await fallbackRes.json();
         return all.filter(c => c.status === 'APPROVED');
      }

      return await res.json();
    } catch (e) {
      console.error("Comment fetch error:", e);
      return [];
    }
  },

  /**
   * ✅ Poste un commentaire (crée en statut PENDING)
   * POST /api/v1/commentaires
   */
  postComment: async (payload: CreateCommentairePayload): Promise<CommentaireDto> => {
    const token = authService.getToken();
    // Note: Bien que le backend demande auteurId dans le body, 
    // passer le token est crucial pour que le backend valide l'identité.
    
    const res = await fetch(`${API_PROXY}/commentaires`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Erreur lors de l'envoi du commentaire");
    }

    return await res.json();
  },
    /**
   * ✅ ARTICLES SIMILAIRES (NEW)
   * GET /api/v1/articles/{id}/similar
   */
  getSimilarArticles: async (articleId: number, limit = 4): Promise<ArticleReadDto[]> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${articleId}/similar?limit=${limit}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Similar fetch error", e);
      return [];
    }
  }

};
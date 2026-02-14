// FICHIER: services/public.ts - VERSION CORRIGÉE AVEC NETTOYAGE URLs
import { APP_CONFIG } from "@/lib/constant";
import { ArticleReadDto, CommentaireDto, Rubrique } from "@/types/article";
import { PageResponse } from "@/types/dashboard";
import { authService } from "./auth";
import { CreateCommentairePayload } from "@/types/article";
import { cleanArticleUrls, cleanArticlesArray, cleanUrl } from "./article";

const API_PROXY = APP_CONFIG.apiUrl; 

export const PublicService = {
  
  /**
   * Récupère les rubriques (Menus)
   * Route: GET /api/v1/rubriques
   */
  getRubriques: async (): Promise<Rubrique[]> => {
    try {
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
   * ✅ CORRECTION: Nettoie les URLs localhost
   */
  getAllArticles: async (page = 0, size = 6): Promise<PageResponse<ArticleReadDto>> => {
    try {
      const res = await fetch(`${API_PROXY}/public/articles?page=${page}&size=${size}&sort=datePublication,desc`, { 
        cache: 'no-store' 
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      
      const data = await res.json();
      
      // ✅ Nettoyer les URLs
      if (data.content && Array.isArray(data.content)) {
        data.content = cleanArticlesArray(data.content);
      }
      
      return data;
    } catch (e) {
      console.error("❌ Erreur Flux Public:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  /**
   * ARTICLES PAR CATÉGORIE
   * ✅ CORRECTION: Nettoie les URLs localhost
   */
  getArticlesByRubrique: async (id: number): Promise<ArticleReadDto[]> => {
    try {
        const res = await fetch(`${API_PROXY}/rubriques/${id}/articles`); 
        if (!res.ok) return [];
        
        const articles = await res.json();
        
        // ✅ Nettoyer les URLs
        return cleanArticlesArray(articles);
    } catch(e) { return []; }
  },

  /**
   * Récupère un article complet avec ses blocs
   * ✅ CORRECTION: Nettoie les URLs localhost
   */
  getArticleById: async (id: number): Promise<ArticleReadDto | null> => {
    try {
      const res = await fetch(`${API_PROXY}/public/articles/${id}`, { cache: 'no-store' });
      if (!res.ok) return null;
      
      const article = await res.json();
      
      // ✅ Nettoyer les URLs
      return cleanArticleUrls(article);
    } catch (e) { 
        console.error("❌ Erreur Article Detail:", e);
        return null; 
    }
  },

  // Incrémenter la vue
  incrementView: async (id: number): Promise<void> => {
    try {
        await fetch(`${API_PROXY}/public/articles/${id}/vue?dureeVue=1&scrollDepth=10`, {
            method: 'POST'
        });
    } catch (e) {
        console.warn("View tracking failed", e);
    }
  },

  /**
   * Articles tendance
   * ✅ CORRECTION: Nettoie les URLs localhost
   */
  getTrendingArticles: async (): Promise<ArticleReadDto[]> => {
    try {
      const res = await fetch(`${API_PROXY}/featureditems?page=0&size=3`);
      if (!res.ok) {
         const latest = await PublicService.getAllArticles(0, 3);
         return latest.content;
      }
      const data = await res.json();
      const articles = Array.isArray(data) ? data : data.content || [];
      
      // ✅ Nettoyer les URLs
      return cleanArticlesArray(articles);
    } catch (e) {
      return []; 
    }
  },

  /**
   * Tracking Analytics (Vue + Scroll)
   */
  trackView: async (id: number, duration: number, scrollDepth: number) => {
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

  /**
   * Gestion des Commentaires
   */
  getComments: async (articleId: number): Promise<CommentaireDto[]> => {
    try {
        const res = await fetch(`${API_PROXY}/commentaires/all`);
        if (!res.ok) return [];
        const all: CommentaireDto[] = await res.json();
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

  /**
   * Gestion des Likes / Favoris
   */
  toggleLike: async (articleId: number, isCurrentlyLiked: boolean): Promise<void> => {
      const user = authService.getUserFromStorage();
      if (!user) throw new Error("Connectez-vous pour liker");
      const token = authService.getToken();

      if (!isCurrentlyLiked) {
          await fetch(`${API_PROXY}/user/${user.id}/favoris/${articleId}`, {
              method: 'POST',
              headers: { "Authorization": `Bearer ${token}` }
          });
      } else {
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
          return favoris.some((f: any) => f.id === articleId);
      } catch {
          return false;
      }
  },

  /**
   * LECTURE ARTICLE
   * ✅ CORRECTION: Nettoie les URLs localhost
   */
  getById: async (id: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, { headers });
    
    if (!res.ok) {
      throw new Error(`Article ${id} introuvable`);
    }
    
    const article = await res.json();
    
    // ✅ Nettoyer les URLs
    return cleanArticleUrls(article);
  },

  /**
   * ARTICLES ADMIN
   * ✅ CORRECTION: Nettoie les URLs localhost
   */
  getAdminArticles: async (page = 0, size = 10): Promise<PageResponse<ArticleReadDto>> => {
    try {
      const res = await fetch(`${API_PROXY}/articles/by-admin?page=${page}&size=${size}&sort=datePublication,desc`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      
      const data = await res.json();
      
      // Si l'API renvoie un tableau simple
      if (Array.isArray(data)) {
         return {
            content: cleanArticlesArray(data.slice(0, size)),
            totalElements: data.length,
            totalPages: Math.ceil(data.length / size)
         };
      }
      
      // ✅ Nettoyer les URLs
      if (data.content && Array.isArray(data.content)) {
        data.content = cleanArticlesArray(data.content);
      }
      
      return data;
    } catch (e) {
      console.error("❌ Erreur Fetch Admin Articles:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  /**
   * ✅ TRACKING VUE SOPHISTIQUÉ
   */
  recordView: async (articleId: number, metrics: { dureeVue: number; scrollDepth: number; userId?: number }) => {
    try {
      const queryParams = new URLSearchParams({
        dureeVue: metrics.dureeVue.toString(),
        scrollDepth: metrics.scrollDepth.toString()
      });
      
      if (metrics.userId) queryParams.append("userId", metrics.userId.toString());

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
      return Array.isArray(comments) ? comments.filter((c: any) => c.status === 'APPROVED') : [];
    } catch { return []; }
  },

  /**
   * ✅ Récupère UNIQUEMENT les commentaires approuvés pour l'article
   */
  getApprovedComments: async (articleId: number): Promise<CommentaireDto[]> => {
    try {
      const res = await fetch(`${API_PROXY}/commentaires/article/${articleId}/approved`);
      
      if (!res.ok) {
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
   */
  postComment: async (payload: CreateCommentairePayload): Promise<CommentaireDto> => {
    const token = authService.getToken();
    
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
   * ✅ ARTICLES SIMILAIRES
   * ✅ CORRECTION: Nettoie les URLs localhost
   */
  getSimilarArticles: async (articleId: number, limit = 4): Promise<ArticleReadDto[]> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${articleId}/similar?limit=${limit}`);
      if (!res.ok) return [];
      const data = await res.json();
      const articles = Array.isArray(data) ? data : [];
      
      // ✅ Nettoyer les URLs
      return cleanArticlesArray(articles);
    } catch (e) {
      console.error("Similar fetch error", e);
      return [];
    }
  }

};
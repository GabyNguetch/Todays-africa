// FICHIER: services/public.ts - VERSION AVEC CACHE OPTIMISÉ
import { APP_CONFIG } from "@/lib/constant";
import { ArticleReadDto, CommentaireDto, Rubrique } from "@/types/article";
import { PageResponse } from "@/types/dashboard";
import { authService } from "./auth";
import { CreateCommentairePayload } from "@/types/article";
import { cleanArticleUrls, cleanArticlesArray, cleanUrl } from "@/lib/urlCleaner";
import { CacheService } from "@/lib/cache";

const API_PROXY = APP_CONFIG.apiUrl; 

export const PublicService = {
  
  /**
   * ✅ Récupère les rubriques (Navigation) - AVEC CACHE
   */
  getRubriques: async (): Promise<Rubrique[]> => {
    try {
      // Vérifier le cache d'abord
      const cached = CacheService.getRubriques();
      if (cached) {
        console.log("💾 [getRubriques] Chargé depuis cache");
        return cached;
      }

      console.log("📡 [getRubriques] Fetching depuis API...");
      const res = await fetch(`${API_PROXY}/rubriques`, { cache: 'no-store' });
      
      if (!res.ok) {
        console.error(`❌ Erreur HTTP ${res.status}`);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ ${data.length} rubriques chargées`);
      
      // Sauvegarder dans le cache
      CacheService.setRubriques(data);
      
      return data;
    } catch (e) {
      console.error("❌ Erreur Rubriques:", e);
      return [];
    }
  },

  /**
   * ✅ FLUX ACTUALITÉS (Landing Page) - AVEC CACHE
   */
  getAllArticles: async (page = 0, size = 6): Promise<PageResponse<ArticleReadDto>> => {
    try {
      // Vérifier le cache d'abord
      const cached = CacheService.getArticlesPage(page, size);
      if (cached) {
        console.log(`💾 [getAllArticles] Page ${page} chargée depuis cache`);
        return cached;
      }

      console.log(`📡 [getAllArticles] Page ${page}, Size ${size}`);
      
      const res = await fetch(
        `${API_PROXY}/public/articles?page=${page}&size=${size}&sort=datePublication,desc`, 
        { cache: 'no-store' }
      );
      
      if (!res.ok) {
        console.error(`❌ Erreur HTTP ${res.status}`);
        return { content: [], totalElements: 0, totalPages: 0 };
      }
      
      const data = await res.json();
      
      // ✅ Nettoyer les URLs
      if (data.content && Array.isArray(data.content)) {
        console.log(`🧹 Nettoyage de ${data.content.length} articles`);
        data.content = cleanArticlesArray(data.content);
      }
      
      console.log(`✅ ${data.content?.length || 0} articles chargés`);
      
      // Sauvegarder dans le cache
      CacheService.setArticlesPage(page, size, data);
      
      return data;
    } catch (e) {
      console.error("❌ Erreur Flux Public:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  /**
   * ✅ ARTICLES PAR CATÉGORIE (Page catégorie) - AVEC CACHE
   */
  getArticlesByRubrique: async (rubriqueId: number): Promise<ArticleReadDto[]> => {
    try {
      // Vérifier le cache d'abord
      const cached = CacheService.getArticlesByRubrique(rubriqueId);
      if (cached) {
        console.log(`💾 [getArticlesByRubrique] Rubrique ${rubriqueId} chargée depuis cache`);
        return cached;
      }

      console.log(`📡 [getArticlesByRubrique] ID: ${rubriqueId}`);
      
      const res = await fetch(`${API_PROXY}/rubriques/${rubriqueId}/articles`, {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        console.error(`❌ Erreur HTTP ${res.status} pour rubrique ${rubriqueId}`);
        return [];
      }
      
      const articles = await res.json();
      
      if (!Array.isArray(articles)) {
        console.warn("⚠️ Réponse inattendue (pas un tableau)");
        return [];
      }
      
      // ✅ Nettoyer les URLs
      console.log(`🧹 Nettoyage de ${articles.length} articles de la rubrique`);
      const cleaned = cleanArticlesArray(articles);
      
      console.log(`✅ ${cleaned.length} articles de la rubrique chargés`);
      
      // Sauvegarder dans le cache
      CacheService.setArticlesByRubrique(rubriqueId, cleaned);
      
      return cleaned;
      
    } catch(e) {
      console.error("❌ Erreur Articles par Rubrique:", e);
      return [];
    }
  },

  /**
   * ✅ ARTICLE COMPLET (Page article/[id]) - AVEC CACHE
   */
  getById: async (id: number): Promise<ArticleReadDto> => {
    // Vérifier le cache d'abord
    const cached = CacheService.getArticle(id);
    if (cached) {
      console.log(`💾 [getById] Article ${id} chargé depuis cache`);
      return cached;
    }

    console.log(`📡 [getById] Article ID: ${id}`);
    
    const token = authService.getToken();
    const headers: HeadersInit = token 
      ? { "Authorization": `Bearer ${token}` } 
      : {};
    
    try {
      const res = await fetch(`${API_PROXY}/public/articles/${id}`, { 
        headers,
        cache: 'no-store'
      });
      
      if (!res.ok) {
        console.error(`❌ Article ${id} - HTTP ${res.status}`);
        throw new Error(`Article ${id} introuvable`);
      }
      
      const article = await res.json();
      
      // ✅ Nettoyer les URLs
      console.log(`🧹 Nettoyage article ${id}`);
      const cleaned = cleanArticleUrls(article);
      
      console.log(`✅ Article ${id} chargé avec succès`);
      console.log(`   - Image couverture: ${cleaned.imageCouvertureUrl?.substring(0, 50)}...`);
      console.log(`   - Blocs contenu: ${cleaned.blocsContenu?.length || 0}`);
      
      // Sauvegarder dans le cache
      CacheService.setArticle(id, cleaned);
      
      return cleaned;
      
    } catch (error) {
      console.error(`❌ Erreur fatale Article ${id}:`, error);
      throw error;
    }
  },

  /**
   * ✅ ARTICLES TENDANCE - AVEC CACHE
   */
  getTrendingArticles: async (limit = 3): Promise<ArticleReadDto[]> => {
    try {
      // Vérifier le cache d'abord
      const cached = CacheService.getTrendingArticles();
      if (cached && cached.length >= limit) {
        console.log(`💾 [getTrendingArticles] Chargé depuis cache`);
        return cached.slice(0, limit);
      }

      console.log(`📡 [getTrendingArticles] Limit: ${limit}`);
      
      // Tenter d'abord l'endpoint featured
      let res = await fetch(`${API_PROXY}/articles/featured?limit=${limit}`);
      
      if (!res.ok) {
        console.warn("⚠️ Featured endpoint indisponible, fallback sur articles récents");
        const latestPage = await PublicService.getAllArticles(0, limit);
        return latestPage.content;
      }
      
      const data = await res.json();
      const articles = Array.isArray(data) ? data : data.content || [];
      
      // ✅ Nettoyer les URLs
      const cleaned = cleanArticlesArray(articles.slice(0, limit));
      
      console.log(`✅ ${cleaned.length} articles tendance chargés`);
      
      // Sauvegarder dans le cache
      CacheService.setTrendingArticles(cleaned);
      
      return cleaned;
      
    } catch (e) {
      console.error("❌ Erreur Articles Tendance:", e);
      return [];
    }
  },

  /**
   * ✅ ARTICLES SIMILAIRES
   */
  getSimilarArticles: async (articleId: number, limit = 4): Promise<ArticleReadDto[]> => {
    try {
      console.log(`📡 [getSimilarArticles] Article ${articleId}, Limit: ${limit}`);
      
      const res = await fetch(`${API_PROXY}/articles/${articleId}/similar?limit=${limit}`);
      
      if (!res.ok) {
        console.warn("⚠️ Similar endpoint indisponible");
        return [];
      }
      
      const data = await res.json();
      const articles = Array.isArray(data) ? data : [];
      
      // ✅ Nettoyer les URLs
      const cleaned = cleanArticlesArray(articles);
      
      console.log(`✅ ${cleaned.length} articles similaires chargés`);
      return cleaned;
      
    } catch (e) {
      console.error("❌ Erreur Articles Similaires:", e);
      return [];
    }
  },

  /**
   * ✅ TRACKING VUE
   */
  recordView: async (
    articleId: number, 
    metrics: { dureeVue: number; scrollDepth: number; userId?: number }
  ): Promise<void> => {
    try {
      const queryParams = new URLSearchParams({
        dureeVue: metrics.dureeVue.toString(),
        scrollDepth: metrics.scrollDepth.toString()
      });
      
      if (metrics.userId) {
        queryParams.append("userId", metrics.userId.toString());
      }

      fetch(`${API_PROXY}/articles/${articleId}/view?${queryParams.toString()}`, {
        method: 'POST'
      }).catch(() => {
        // Silent fail pour analytics
      });
    } catch (e) {
      // Silent fail
    }
  },

  /**
   * ✅ GESTION FAVORIS/LIKES
   */
  toggleLike: async (articleId: number, isCurrentlyLiked: boolean): Promise<void> => {
    const user = authService.getUserFromStorage();
    if (!user) throw new Error("Connectez-vous pour liker");
    
    const token = authService.getToken();
    if (!token) throw new Error("Token manquant");

    const method = isCurrentlyLiked ? 'DELETE' : 'POST';
    const endpoint = `${API_PROXY}/user/${user.id}/favoris/${articleId}`;

    const res = await fetch(endpoint, {
      method,
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error("Erreur toggle like");
    }
  },

  checkIfLiked: async (articleId: number): Promise<boolean> => {
    const user = authService.getUserFromStorage();
    if (!user) return false;
    
    const token = authService.getToken();
    if (!token) return false;

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
   * ✅ ARTICLES ADMIN (Intelligence Interculturelle)
   */
  getAdminArticles: async (page = 0, size = 12): Promise<PageResponse<ArticleReadDto>> => {
    try {
      console.log(`📡 [getAdminArticles] Page ${page}, Size ${size}`);
      
      const res = await fetch(
        `${API_PROXY}/public/articles?page=${page}&size=${size}&sort=datePublication,desc`, 
        { cache: 'no-store' }
      );
      
      if (!res.ok) {
        console.error(`❌ Erreur HTTP ${res.status}`);
        return { content: [], totalElements: 0, totalPages: 0 };
      }
      
      const data = await res.json();
      
      if (data.content && Array.isArray(data.content)) {
        console.log(`🧹 Nettoyage de ${data.content.length} articles admin`);
        data.content = cleanArticlesArray(data.content);
      }
      
      console.log(`✅ ${data.content?.length || 0} articles admin chargés`);
      return data;
    } catch (e) {
      console.error("❌ Erreur Articles Admin:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  /**
   * ✅ COMMENTAIRES
   */
  getApprovedComments: async (articleId: number): Promise<CommentaireDto[]> => {
    try {
      // Tenter d'abord l'endpoint spécifique aux commentaires approuvés
      let res = await fetch(`${API_PROXY}/commentaires/article/${articleId}/approved`);
      
      if (!res.ok) {
        // Fallback sur tous les commentaires avec filtrage côté client
        res = await fetch(`${API_PROXY}/commentaires/article/${articleId}`);
        if (!res.ok) return [];
        
        const all: CommentaireDto[] = await res.json();
        return all.filter(c => c.status === 'APPROVED');
      }

      return await res.json();
    } catch (e) {
      console.error("❌ Erreur Commentaires:", e);
      return [];
    }
  },

  postComment: async (payload: CreateCommentairePayload): Promise<CommentaireDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");
    
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
  }
};
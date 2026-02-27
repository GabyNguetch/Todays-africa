// lib/cache.ts - Service de cache localStorage optimisé
import { ArticleReadDto, Rubrique } from "@/types/article";
import { PageResponse } from "@/types/dashboard";

const CACHE_PREFIX = "todays_africa_";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export const CacheService = {
  /**
   * Sauvegarde des données dans le cache
   */
  set<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
    if (typeof window === "undefined") return;
    
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration,
      };
      
      localStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn("❌ Erreur sauvegarde cache:", error);
    }
  },

  /**
   * Récupération des données du cache
   */
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    
    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Vérifier si le cache est expiré
      if (Date.now() > cacheItem.expiresAt) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn("❌ Erreur lecture cache:", error);
      return null;
    }
  },

  /**
   * Suppression d'une entrée du cache
   */
  remove(key: string): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn("❌ Erreur suppression cache:", error);
    }
  },

  /**
   * Nettoyage complet du cache
   */
  clear(): void {
    if (typeof window === "undefined") return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("❌ Erreur nettoyage cache:", error);
    }
  },

  /**
   * Nettoyage des entrées expirées
   */
  cleanExpired(): void {
    if (typeof window === "undefined") return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheItem: CacheItem<any> = JSON.parse(cached);
            if (Date.now() > cacheItem.expiresAt) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn("❌ Erreur nettoyage cache expiré:", error);
    }
  },

  // --- MÉTHODES SPÉCIFIQUES ---

  /**
   * Cache des rubriques
   */
  getRubriques(): Rubrique[] | null {
    return this.get<Rubrique[]>("rubriques");
  },

  setRubriques(rubriques: Rubrique[]): void {
    this.set("rubriques", rubriques, 10 * 60 * 1000); // 10 minutes
  },

  /**
   * Cache des articles par rubrique
   */
  getArticlesByRubrique(rubriqueId: number): ArticleReadDto[] | null {
    return this.get<ArticleReadDto[]>(`articles_rubrique_${rubriqueId}`);
  },

  setArticlesByRubrique(rubriqueId: number, articles: ArticleReadDto[]): void {
    this.set(`articles_rubrique_${rubriqueId}`, articles);
  },

  /**
   * Cache des articles tendance
   */
  getTrendingArticles(): ArticleReadDto[] | null {
    return this.get<ArticleReadDto[]>("trending_articles");
  },

  setTrendingArticles(articles: ArticleReadDto[]): void {
    this.set("trending_articles", articles, 3 * 60 * 1000); // 3 minutes
  },

  /**
   * Cache de la page d'articles
   */
  getArticlesPage(page: number, size: number): PageResponse<ArticleReadDto> | null {
    return this.get<PageResponse<ArticleReadDto>>(`articles_page_${page}_${size}`);
  },

  setArticlesPage(page: number, size: number, data: PageResponse<ArticleReadDto>): void {
    this.set(`articles_page_${page}_${size}`, data);
  },

  /**
   * Cache d'un article individuel
   */
  getArticle(id: number): ArticleReadDto | null {
    return this.get<ArticleReadDto>(`article_${id}`);
  },

  setArticle(id: number, article: ArticleReadDto): void {
    this.set(`article_${id}`, article, 10 * 60 * 1000); // 10 minutes
  },

  /**
   * Invalidation du cache d'un article (après modification)
   */
  invalidateArticle(id: number): void {
    this.remove(`article_${id}`);
  },

  /**
   * Invalidation du cache d'une rubrique
   */
  invalidateRubrique(rubriqueId: number): void {
    this.remove(`articles_rubrique_${rubriqueId}`);
  },
};

// Nettoyage automatique au chargement
if (typeof window !== "undefined") {
  CacheService.cleanExpired();
}

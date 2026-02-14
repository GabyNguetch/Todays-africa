// FICHIER: lib/urlCleaner.ts
// Utilitaire pour remplacer les URLs localhost par l'URL de production

import { ArticleReadDto } from "@/types/article";

const PROD_URL = 'https://totayafrica.onrender.com';
const LOCALHOST_PATTERNS = [
  'http://localhost:8080',
  'http://localhost:8081',
  'localhost:8080',
  'localhost:8081'
];

/**
 * ✅ Remplace localhost par l'URL de production
 */
export const cleanUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  let cleaned = url;
  let wasModified = false;
  
  LOCALHOST_PATTERNS.forEach(pattern => {
    if (cleaned.includes(pattern)) {
      cleaned = cleaned.replace(pattern, PROD_URL);
      wasModified = true;
    }
  });
  
  if (wasModified) {
    console.log(`🔄 URL nettoyée: ${url} -> ${cleaned}`);
  }
  
  return cleaned;
};

/**
 * ✅ Nettoie toutes les URLs d'un article
 */
export const cleanArticleUrls = (article: ArticleReadDto): ArticleReadDto => {
  if (!article) return article;
  
  return {
    ...article,
    imageCouvertureUrl: cleanUrl(article.imageCouvertureUrl),
    blocsContenu: article.blocsContenu?.map(bloc => ({
      ...bloc,
      contenu: bloc.type === 'IMAGE' ? (cleanUrl(bloc.contenu) || bloc.contenu) : bloc.contenu,
      url: cleanUrl(bloc.url),
      mediaUrl: cleanUrl(bloc.mediaUrl)
    })) || []
  };
};

/**
 * ✅ Nettoie un tableau d'articles
 */
export const cleanArticlesArray = (articles: ArticleReadDto[]): ArticleReadDto[] => {
  if (!Array.isArray(articles)) return [];
  return articles.map(article => cleanArticleUrls(article));
};
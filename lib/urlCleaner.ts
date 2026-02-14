// FICHIER: lib/urlCleaner.ts
// Utilitaire pour remplacer les URLs localhost par l'URL de production

import { ArticleReadDto } from "@/types/article";

/**
 * ✅ Remplace localhost par l'URL de production
 */
export const cleanUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  if (url.includes('localhost:8080') || url.includes('localhost:8081')) {
    const cleaned = url
      .replace('http://localhost:8080', 'https://totayafrica.onrender.com')
      .replace('http://localhost:8081', 'https://totayafrica.onrender.com');
    
    console.log(`🔄 URL nettoyée: ${url} -> ${cleaned}`);
    return cleaned;
  }
  
  return url;
};

/**
 * ✅ Nettoie toutes les URLs d'un article
 */
export const cleanArticleUrls = (article: ArticleReadDto): ArticleReadDto => {
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
};

/**
 * ✅ Nettoie un tableau d'articles
 */
export const cleanArticlesArray = (articles: ArticleReadDto[]): ArticleReadDto[] => {
  return articles.map(article => cleanArticleUrls(article));
};
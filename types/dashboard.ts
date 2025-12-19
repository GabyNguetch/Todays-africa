// FICHIER: types/dashboard.ts

export interface ArticleBackend {
  id: number; // Swagger dit int32
  titre: string;
  slug?: string;
  description: string;
  imageCouvertureUrl?: string;
  statut: "BROUILLON" | "EN_ATTENTE" | "PUBLIE" | "REJETE";
  datePublication?: string;
  auteurNom?: string;
  vues: number;
  commentaires: number;
  rubriqueNom?: string;
  tags?: string[];
}

export interface StatsDashboard {
  totalArticles: number;
  totalVues: number;
  totalCommentaires: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}
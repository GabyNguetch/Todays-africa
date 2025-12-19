// FICHIER: types/article.ts

// --- MÉDIAS ---
export interface MediaResponseDto {
  id: string | number; 
  urlAcces: string;
  nomOriginal: string;
  typeMime: string;
}

// --- BLOCS ---
export type BlockType = 'TEXTE' | 'IMAGE' | 'VIDEO' | 'CITATION';

// Note: Titre a été retiré conformément à la structure SQL Grammar Exception reçue
export interface BlocContenuDto {
  id?: number; 
  type: BlockType; 
  contenu: string; 
  ordre: number;
  legende: string;  // Auparavant optionnel, maintenant strict string
  altText: string;  // Auparavant optionnel, maintenant strict string
  url: string;      // Auparavant optionnel, maintenant strict string
}

// --- ARTICLE ---
export interface ArticlePayloadDto {
  titre: string;
  description: string;
  rubriqueId: number;
  auteurId: number;
  imageCouvertureId: number | null; 
  region: string;
  blocsContenu: BlocContenuDto[];
  tagIds: number[];
  statut: string; 
  visible: boolean;
  datePublication?: string | null;
}

export interface ArticleReadDto {
  id: number;
  titre: string;
  slug?: string;
  description: string;
  rubriqueId: number;
  rubriqueNom?: string;
  imageCouvertureId?: string | number | null; 
  imageCouvertureUrl?: string | null;
  statut: string;
  datePublication?: string;
  dateCreation: string;
  auteurNom?: string;
  blocsContenu: BlocContenuDto[];
  vues?: number;
  commentaires?: number;
  region?: string;
  visible?: boolean;
}

export interface Rubrique {
  id: number;
  nom: string;
  parentId?: number | null;
  slug?: string;
  enfants?: Rubrique[];
}
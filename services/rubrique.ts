// FICHIER: services/rubrique.ts
// Service de gestion des rubriques (catégories) d'articles

import { APP_CONFIG } from "@/lib/constant";
import { authService } from "@/services/auth";
import { Rubrique } from "@/types/article";

/**
 * Interface pour la création/modification d'une rubrique
 */
export interface RubriquePayload {
  nom: string;
  description?: string;
  slug?: string;
  parentId?: number | null;
  icone?: string;
  couleur?: string;
  visible?: boolean;
  ordre?: number;
}

/**
 * Configuration pour la visibilité d'une rubrique
 */
export interface VisibilityConfig {
  visible: boolean;
}

/**
 * Service de gestion des rubriques
 */
export const RubriqueService = {
  
  // ==========================================
  // RÉCUPÉRATION DES RUBRIQUES
  // ==========================================
  
  /**
   * Récupère toutes les rubriques (arborescence complète)
   * Retourne un tableau plat que le frontend peut transformer en arbre
   */
  getAll: async (): Promise<Rubrique[]> => {
    try {
      console.log("🔎 [RubriqueService] Récupération de toutes les rubriques");
      
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erreur récupération rubriques:", errorText);
        throw new Error(`Erreur lors de la récupération des rubriques (${res.status})`);
      }

      const data = await res.json();
      console.log(`✅ ${data.length} rubriques récupérées`);
      
      return Array.isArray(data) ? data : [];
      
    } catch (error: any) {
      console.error("❌ Exception getAll:", error);
      throw new Error(error.message || "Impossible de charger les rubriques");
    }
  },

  /**
   * Récupère une rubrique spécifique par son ID
   */
  getById: async (id: number): Promise<Rubrique> => {
    try {
      console.log(`🔎 [RubriqueService] Récupération rubrique #${id}`);
      
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`Rubrique #${id} introuvable`);
      }

      const data = await res.json();
      console.log("✅ Rubrique récupérée:", data);
      
      return data;
      
    } catch (error: any) {
      console.error(`❌ Erreur getById(${id}):`, error);
      throw new Error(error.message || "Rubrique introuvable");
    }
  },

  /**
   * Récupère uniquement les rubriques visibles (pour le frontend public)
   */
  getVisible: async (): Promise<Rubrique[]> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/visible`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        console.warn("Impossible de récupérer les rubriques visibles");
        return [];
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error("❌ Erreur getVisible:", error);
      return [];
    }
  },

  /**
   * Récupère les rubriques racines (sans parent)
   */
  getRoots: async (): Promise<Rubrique[]> => {
    try {
      const allRubriques = await RubriqueService.getAll();
      return allRubriques.filter(r => !r.parentId);
    } catch (error) {
      console.error("❌ Erreur getRoots:", error);
      return [];
    }
  },

  /**
   * Récupère les enfants d'une rubrique
   */
  getChildren: async (parentId: number): Promise<Rubrique[]> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/${parentId}/children`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error(`❌ Erreur getChildren(${parentId}):`, error);
      return [];
    }
  },

  // ==========================================
  // CRÉATION DE RUBRIQUE
  // ==========================================
  
  /**
   * Crée une nouvelle rubrique
   * Nécessite une authentification admin
   */
  create: async (payload: RubriquePayload): Promise<Rubrique> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    try {
      console.group("📝 [RubriqueService] Création rubrique");
      console.log("Payload:", payload);

      // Validation côté client
      if (!payload.nom || payload.nom.trim().length === 0) {
        throw new Error("Le nom de la rubrique est requis");
      }

      // Nettoyage du payload
      const cleanPayload: any = {
        nom: payload.nom.trim(),
        description: payload.description?.trim() || null,
        slug: payload.slug?.trim() || null,
        parentId: payload.parentId || null,
        icone: payload.icone?.trim() || "📁",
        couleur: payload.couleur || "#3E7B52",
        visible: payload.visible !== undefined ? payload.visible : true,
        ordre: payload.ordre || 0
      };

      console.log("Payload nettoyé:", cleanPayload);

      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cleanPayload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erreur backend:", errorText);
        
        let errorMessage = `Erreur lors de la création (${res.status})`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText.substring(0, 200);
        }
        
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log("✅ Rubrique créée:", result);
      console.groupEnd();
      
      return result;
      
    } catch (error: any) {
      console.error("❌ Exception create:", error);
      console.groupEnd();
      throw new Error(error.message || "Impossible de créer la rubrique");
    }
  },

  // ==========================================
  // MODIFICATION DE RUBRIQUE
  // ==========================================
  
  /**
   * Modifie une rubrique existante
   * Nécessite une authentification admin
   */
  update: async (id: number, payload: RubriquePayload): Promise<void> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    try {
      console.group(`📝 [RubriqueService] Modification rubrique #${id}`);
      console.log("Payload:", payload);

      // Validation
      if (!payload.nom || payload.nom.trim().length === 0) {
        throw new Error("Le nom de la rubrique est requis");
      }

      // Empêcher qu'une rubrique soit son propre parent
      if (payload.parentId === id) {
        throw new Error("Une rubrique ne peut pas être son propre parent");
      }

      // Nettoyage du payload
      const cleanPayload: any = {
        nom: payload.nom.trim(),
        description: payload.description?.trim() || null,
        slug: payload.slug?.trim() || null,
        parentId: payload.parentId || null,
        icone: payload.icone?.trim() || "📁",
        couleur: payload.couleur || "#3E7B52",
        visible: payload.visible !== undefined ? payload.visible : true,
        ordre: payload.ordre || 0
      };

      console.log("Payload nettoyé:", cleanPayload);

      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cleanPayload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erreur backend:", errorText);
        
        let errorMessage = `Erreur lors de la modification (${res.status})`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText.substring(0, 200);
        }
        
        throw new Error(errorMessage);
      }

      // Si le backend retourne 204 No Content, c'est OK
      if (res.status === 204) {
        console.log("✅ Rubrique modifiée (204 No Content)");
        console.groupEnd();
        return;
      }

      // Sinon on peut avoir un JSON de retour
      const result = await res.json();
      console.log("✅ Rubrique modifiée:", result);
      console.groupEnd();
      
    } catch (error: any) {
      console.error(`❌ Exception update(${id}):`, error);
      console.groupEnd();
      throw new Error(error.message || "Impossible de modifier la rubrique");
    }
  },

  // ==========================================
  // SUPPRESSION DE RUBRIQUE
  // ==========================================
  
  /**
   * Supprime une rubrique
   * Attention: peut supprimer aussi les sous-rubriques selon la configuration backend
   * Nécessite une authentification admin
   */
  delete: async (id: number): Promise<void> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    try {
      console.group(`🗑️ [RubriqueService] Suppression rubrique #${id}`);

      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erreur backend:", errorText);
        
        let errorMessage = `Erreur lors de la suppression (${res.status})`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          if (res.status === 409) {
            errorMessage = "Impossible de supprimer : la rubrique contient des articles ou des sous-rubriques";
          } else if (res.status === 404) {
            errorMessage = "Rubrique introuvable";
          } else {
            errorMessage = errorText.substring(0, 200);
          }
        }
        
        throw new Error(errorMessage);
      }

      console.log("✅ Rubrique supprimée");
      console.groupEnd();
      
    } catch (error: any) {
      console.error(`❌ Exception delete(${id}):`, error);
      console.groupEnd();
      throw new Error(error.message || "Impossible de supprimer la rubrique");
    }
  },

  // ==========================================
  // GESTION DE LA VISIBILITÉ
  // ==========================================
  
  /**
   * Toggle la visibilité d'une rubrique
   * Nécessite une authentification admin
   */
  toggleVisibility: async (id: number, visible: boolean): Promise<void> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    try {
      console.group(`👁️ [RubriqueService] Toggle visibilité #${id}`);
      console.log("Nouvelle valeur:", visible);

      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/${id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ visible })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erreur backend:", errorText);
        throw new Error(`Erreur lors de la modification de la visibilité (${res.status})`);
      }

      // 204 No Content est acceptable
      if (res.status !== 204) {
        const result = await res.json();
        console.log("✅ Visibilité modifiée:", result);
      } else {
        console.log("✅ Visibilité modifiée (204 No Content)");
      }
      
      console.groupEnd();
      
    } catch (error: any) {
      console.error(`❌ Exception toggleVisibility(${id}):`, error);
      console.groupEnd();
      throw new Error(error.message || "Impossible de modifier la visibilité");
    }
  },

  /**
   * Masque une rubrique (raccourci)
   */
  hide: async (id: number): Promise<void> => {
    return RubriqueService.toggleVisibility(id, false);
  },

  /**
   * Affiche une rubrique (raccourci)
   */
  show: async (id: number): Promise<void> => {
    return RubriqueService.toggleVisibility(id, true);
  },

  // ==========================================
  // RÉORGANISATION
  // ==========================================
  
  /**
   * Modifie l'ordre d'affichage d'une rubrique
   */
  updateOrder: async (id: number, ordre: number): Promise<void> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    try {
      console.log(`🔄 [RubriqueService] Modification ordre #${id} -> ${ordre}`);

      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/${id}/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ordre })
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la modification de l'ordre");
      }

      console.log("✅ Ordre modifié");
      
    } catch (error: any) {
      console.error(`❌ Exception updateOrder(${id}):`, error);
      throw new Error(error.message || "Impossible de modifier l'ordre");
    }
  },

  /**
   * Réorganise plusieurs rubriques en une seule requête
   * Utile pour le drag & drop
   */
  reorder: async (orderedIds: number[]): Promise<void> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    try {
      console.group("🔄 [RubriqueService] Réorganisation multiple");
      console.log("Nouvel ordre:", orderedIds);

      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderedIds)
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la réorganisation");
      }

      console.log("✅ Réorganisation effectuée");
      console.groupEnd();
      
    } catch (error: any) {
      console.error("❌ Exception reorder:", error);
      console.groupEnd();
      throw new Error(error.message || "Impossible de réorganiser les rubriques");
    }
  },

  // ==========================================
  // STATISTIQUES
  // ==========================================
  
  /**
   * Récupère les statistiques d'une rubrique
   * (nombre d'articles, vues, etc.)
   */
  getStats: async (id: number): Promise<any> => {
    const token = authService.getToken();
    
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/${id}/stats`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.warn(`Impossible de récupérer les stats de la rubrique #${id}`);
        return null;
      }

      const data = await res.json();
      return data;
      
    } catch (error) {
      console.error(`❌ Erreur getStats(${id}):`, error);
      return null;
    }
  },

  /**
   * Récupère le nombre d'articles par rubrique
   */
  getArticleCounts: async (): Promise<Record<number, number>> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/article-counts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        return {};
      }

      const data = await res.json();
      return data || {};
      
    } catch (error) {
      console.error("❌ Erreur getArticleCounts:", error);
      return {};
    }
  },

  // ==========================================
  // UTILITAIRES
  // ==========================================
  
  /**
   * Construit l'arbre hiérarchique à partir d'un tableau plat
   * Utile pour l'affichage en frontend
   */
  buildTree: (rubriques: Rubrique[]): Rubrique[] => {
    const map = new Map<number, Rubrique>();
    const roots: Rubrique[] = [];

    // Créer une copie avec enfants vides
    rubriques.forEach(rubrique => {
      map.set(rubrique.id, { ...rubrique, enfants: [] });
    });

    // Construire l'arbre
    rubriques.forEach(rubrique => {
      const node = map.get(rubrique.id)!;
      
      if (rubrique.parentId && map.has(rubrique.parentId)) {
        // Ajouter comme enfant
        map.get(rubrique.parentId)!.enfants!.push(node);
      } else {
        // C'est une racine
        roots.push(node);
      }
    });

    // Trier par ordre
    const sortByOrder = (items: Rubrique[]) => {
      items.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
      items.forEach(item => {
        if (item.enfants && item.enfants.length > 0) {
          sortByOrder(item.enfants);
        }
      });
    };

    sortByOrder(roots);

    return roots;
  },

  /**
   * Trouve une rubrique par son slug
   */
  findBySlug: async (slug: string): Promise<Rubrique | null> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques/slug/${encodeURIComponent(slug)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      return data;
      
    } catch (error) {
      console.error(`❌ Erreur findBySlug(${slug}):`, error);
      return null;
    }
  },

  /**
   * Vérifie si un slug est disponible
   */
  isSlugAvailable: async (slug: string, excludeId?: number): Promise<boolean> => {
    try {
      const allRubriques = await RubriqueService.getAll();
      
      return !allRubriques.some(r => 
        r.slug === slug && r.id !== excludeId
      );
      
    } catch (error) {
      console.error("❌ Erreur isSlugAvailable:", error);
      return false;
    }
  },

  /**
   * Génère un slug à partir d'un nom
   */
  generateSlug: (nom: string): string => {
    return nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
      .replace(/[^a-z0-9]+/g, '-')     // Remplacer caractères spéciaux par tirets
      .replace(/^-+|-+$/g, '');        // Retirer tirets au début/fin
  },

  /**
   * Récupère le chemin complet d'une rubrique (breadcrumb)
   * Ex: ["Actualités", "Afrique", "Politique"]
   */
  getBreadcrumb: async (id: number): Promise<Rubrique[]> => {
    try {
      const allRubriques = await RubriqueService.getAll();
      const breadcrumb: Rubrique[] = [];
      
      let currentId: number | null | undefined = id;
      
      while (currentId) {
        const rubrique = allRubriques.find(r => r.id === currentId);
        
        if (!rubrique) break;
        
        breadcrumb.unshift(rubrique);
        currentId = rubrique.parentId;
      }
      
      return breadcrumb;
      
    } catch (error) {
      console.error(`❌ Erreur getBreadcrumb(${id}):`, error);
      return [];
    }
  },

  // ==========================================
  // VALIDATION
  // ==========================================
  
  /**
   * Valide un payload de rubrique avant envoi
   */
  validate: (payload: RubriquePayload): string[] => {
    const errors: string[] = [];

    // Nom requis
    if (!payload.nom || payload.nom.trim().length === 0) {
      errors.push("Le nom de la rubrique est requis");
    }

    // Longueur du nom
    if (payload.nom && payload.nom.length > 100) {
      errors.push("Le nom ne peut pas dépasser 100 caractères");
    }

    // Description
    if (payload.description && payload.description.length > 500) {
      errors.push("La description ne peut pas dépasser 500 caractères");
    }

    // Slug
    if (payload.slug && payload.slug.length > 100) {
      errors.push("Le slug ne peut pas dépasser 100 caractères");
    }

    // Icône
    if (payload.icone && payload.icone.length > 10) {
      errors.push("L'icône ne peut pas dépasser 10 caractères");
    }

    // Couleur (format hex)
    if (payload.couleur && !/^#[0-9A-Fa-f]{6}$/.test(payload.couleur)) {
      errors.push("La couleur doit être au format hexadécimal (#RRGGBB)");
    }

    // Ordre
    if (payload.ordre !== undefined && payload.ordre < 0) {
      errors.push("L'ordre doit être un nombre positif");
    }

    return errors;
  }
};

// ==========================================
// EXPORT PAR DÉFAUT
// ==========================================

export default RubriqueService;
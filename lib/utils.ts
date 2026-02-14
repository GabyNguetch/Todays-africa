// FICHIER: lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_CONFIG } from "@/lib/constant";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AJOUT : Fonction pour décoder le JWT
export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erreur parsing JWT", e);
    return null;
  }
}

// Ajoutez ou remplacez cette fonction dans votre fichier lib/utils.ts existant

import { cleanUrl } from './urlCleaner';

/**
 * ✅ AMÉLIORATION: Récupération d'URL d'image avec nettoyage automatique
 */
export function getImageUrl(url: string | null | undefined): string {
  const FALLBACK_IMAGE = "/images/placeholder.jpg";
  
  if (!url) return FALLBACK_IMAGE;
  
  // Nettoyer l'URL si elle contient localhost
  const cleanedUrl = cleanUrl(url);
  
  // Si l'URL est déjà absolue (commence par http/https), la retourner telle quelle
  if (cleanedUrl?.startsWith('http')) {
    return cleanedUrl;
  }
  
  // Si l'URL est relative, la retourner telle quelle
  if (cleanedUrl?.startsWith('/')) {
    return cleanedUrl;
  }
  
  // Fallback
  return cleanedUrl || FALLBACK_IMAGE;
}
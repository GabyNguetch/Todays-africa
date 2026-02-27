"use client";

import { useEffect } from "react";
import { CacheService } from "@/lib/cache";
import { logCacheStats } from "@/lib/cacheStats";

/**
 * Composant pour gérer le cache au niveau de l'application
 * - Nettoie les entrées expirées au montage
 * - Nettoie le cache avant le démontage de la page
 */
export function CacheManager() {
  useEffect(() => {
    // Nettoyage initial des entrées expirées
    CacheService.cleanExpired();
    console.log("🧹 Cache nettoyé au démarrage");

    // Afficher les stats en mode développement
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        logCacheStats();
        console.log("💡 Tapez 'cacheStats()' dans la console pour voir les statistiques");
      }, 2000);
    }

    // Nettoyage périodique toutes les 5 minutes
    const interval = setInterval(() => {
      CacheService.cleanExpired();
      console.log("🧹 Nettoyage périodique du cache");
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}

// lib/cacheStats.ts - Utilitaire pour les statistiques du cache

const CACHE_PREFIX = "todays_africa_";

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  entries: Array<{
    key: string;
    size: number;
    age: number;
    expiresIn: number;
  }>;
}

/**
 * Récupère les statistiques du cache
 */
export function getCacheStats(): CacheStats {
  if (typeof window === "undefined") {
    return { totalEntries: 0, totalSize: 0, entries: [] };
  }

  const entries: CacheStats["entries"] = [];
  let totalSize = 0;

  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        const size = new Blob([value]).size;
        totalSize += size;

        try {
          const parsed = JSON.parse(value);
          const now = Date.now();
          const age = now - parsed.timestamp;
          const expiresIn = parsed.expiresAt - now;

          entries.push({
            key: key.replace(CACHE_PREFIX, ""),
            size,
            age,
            expiresIn,
          });
        } catch (e) {
          // Ignorer les entrées invalides
        }
      }
    }
  });

  return {
    totalEntries: entries.length,
    totalSize,
    entries: entries.sort((a, b) => b.size - a.size),
  };
}

/**
 * Affiche les statistiques du cache dans la console
 */
export function logCacheStats(): void {
  const stats = getCacheStats();
  
  console.group("📊 Statistiques du Cache");
  console.log(`Total d'entrées: ${stats.totalEntries}`);
  console.log(`Taille totale: ${formatBytes(stats.totalSize)}`);
  
  if (stats.entries.length > 0) {
    console.table(
      stats.entries.map(entry => ({
        Clé: entry.key,
        Taille: formatBytes(entry.size),
        Âge: formatDuration(entry.age),
        "Expire dans": entry.expiresIn > 0 ? formatDuration(entry.expiresIn) : "Expiré",
      }))
    );
  }
  
  console.groupEnd();
}

/**
 * Formate les octets en format lisible
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Formate une durée en millisecondes
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Expose les fonctions dans la console pour le développement
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).cacheStats = logCacheStats;
  (window as any).getCacheStats = getCacheStats;
}

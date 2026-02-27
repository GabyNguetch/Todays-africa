// lib/hooks/useCache.ts - Hook personnalisé pour le cache
import { useState, useEffect, useCallback } from "react";
import { CacheService } from "@/lib/cache";

interface UseCacheOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  duration?: number;
  enabled?: boolean;
}

interface UseCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export function useCache<T>({
  key,
  fetcher,
  duration,
  enabled = true,
}: UseCacheOptions<T>): UseCacheReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cached = CacheService.get<T>(key);
      if (cached) {
        console.log(`💾 [useCache] "${key}" chargé depuis cache`);
        setData(cached);
        setLoading(false);
        return;
      }

      console.log(`📡 [useCache] "${key}" chargement depuis API...`);
      const result = await fetcher();
      
      CacheService.set(key, result, duration);
      
      setData(result);
    } catch (err) {
      console.error(`❌ [useCache] Erreur "${key}":`, err);
      setError(err instanceof Error ? err : new Error("Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, duration, enabled]);

  const clearCache = useCallback(() => {
    CacheService.remove(key);
    setData(null);
  }, [key]);

  const refetch = useCallback(async () => {
    clearCache();
    await fetchData();
  }, [clearCache, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}

export function usePrefetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration?: number
) {
  useEffect(() => {
    const prefetch = async () => {
      const cached = CacheService.get<T>(key);
      if (!cached) {
        try {
          const data = await fetcher();
          CacheService.set(key, data, duration);
          console.log(`✅ [usePrefetch] "${key}" préchargé`);
        } catch (error) {
          console.error(`❌ [usePrefetch] Erreur "${key}":`, error);
        }
      }
    };

    prefetch();
  }, [key, fetcher, duration]);
}

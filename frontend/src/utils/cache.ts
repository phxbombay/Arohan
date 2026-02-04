/**
 * Simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class CacheManager {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    /**
     * Set item in cache
     * @param key - Cache key
     * @param data - Data to cache
     * @param ttl - Time to live in milliseconds (default: 5 minutes)
     */
    set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
        });
    }

    /**
     * Get item from cache
     * @param key - Cache key
     * @returns Cached data or null if not found or expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        const isExpired = Date.now() - entry.timestamp > entry.ttl;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Check if key exists and is not expired
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Delete item from cache
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Clear expired entries
     */
    clearExpired(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get cache size
     */
    size(): number {
        return this.cache.size;
    }
}

// Export singleton instance
export const cache = new CacheManager();

// Auto-cleanup expired entries every minute
if (typeof window !== 'undefined') {
    setInterval(() => {
        cache.clearExpired();
    }, 60 * 1000);
}

/**
 * React hook for cached API calls
 */
import { useState, useEffect } from 'react';

export function useCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
) {
    const [data, setData] = useState<T | null>(cache.get<T>(key));
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Check cache first
            const cached = cache.get<T>(key);
            if (cached) {
                setData(cached);
                setLoading(false);
                return;
            }

            // Fetch if not cached
            try {
                setLoading(true);
                const result = await fetcher();
                cache.set(key, result, ttl);
                setData(result);
                setError(null);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [key, ttl]);

    const refetch = async () => {
        cache.delete(key);
        setLoading(true);
        try {
            const result = await fetcher();
            cache.set(key, result, ttl);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch };
}

export default cache;

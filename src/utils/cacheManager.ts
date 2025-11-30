
type CacheItem<T> = {
    value: T;
    expiry: number;
};

class CacheManager {
    private cache: Map<string, CacheItem<any>> = new Map();
    private gcInterval: number | null = null;
    private readonly GC_INTERVAL_MS = 60000; // 1 minute

    constructor() {
        this.startGarbageCollection();
    }

    /**
     * Store data in cache
     * @param key Unique key
     * @param value Data to store
     * @param ttl Time to live in milliseconds (default 5 minutes)
     */
    set<T>(key: string, value: T, ttl: number = 300000): void {
        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
        this.log(`[Cache] Set: ${key} (TTL: ${ttl}ms)`, value);
    }

    /**
     * Retrieve data from cache
     * @param key Unique key
     * @returns Data or null if not found/expired
     */
    get<T>(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) {
            this.log(`[Cache] Miss: ${key}`);
            return null;
        }

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            this.log(`[Cache] Expired: ${key}`);
            return null;
        }

        this.log(`[Cache] Hit: ${key}`, item.value);
        return item.value as T;
    }

    /**
     * Clear specific item or all cache
     * @param key Optional key to remove
     */
    clear(key?: string): void {
        if (key) {
            this.cache.delete(key);
            this.log(`[Cache] Cleared: ${key}`);
        } else {
            this.cache.clear();
            this.log(`[Cache] Cleared All`);
        }
    }

    /**
     * Remove expired items
     */
    garbageCollect(): void {
        const now = Date.now();
        const removedKeys: string[] = [];

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
                removedKeys.push(key);
            }
        }

        if (removedKeys.length > 0) {
            this.log(`[Cache] Garbage Collection: Removed ${removedKeys.length} expired items`, removedKeys);
        }
    }

    private startGarbageCollection(): void {
        if (this.gcInterval) return;

        this.gcInterval = setInterval(() => {
            this.garbageCollect();
        }, this.GC_INTERVAL_MS) as unknown as number;

        this.log(`[Cache] Garbage Collector started`);
    }

    private log(message: string, data?: any): void {
        const style = 'color: #00d2ff; font-weight: bold;';
        if (data !== undefined) {
            console.log(`%c${message}`, style, data);
        } else {
            console.log(`%c${message}`, style);
        }
    }
}

export const cacheManager = new CacheManager();

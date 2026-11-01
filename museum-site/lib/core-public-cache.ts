// Ephemeral, bounded public-read projection cache. No identities, orders,
// prices, product records or mutations are stored here. CORE remains authoritative.
export class CorePublicBusy extends Error { code = "CORE_RATE_LIMITED"; status = 429; }
export function createCorePublicCache(now = Date.now, maxEntries = 16, maxInflight = 12, maxBytes = 2 * 1024 * 1024) {
  const cache = new Map<string, { value: unknown; expires: number; bytes: number }>();
  const pending = new Map<string, Promise<unknown>>(); let bytes = 0;
  function remove(key: string) { const hit = cache.get(key); if (hit) bytes -= hit.bytes; cache.delete(key); }
  return {
    async read<T>(key: string, load: () => Promise<T>, ttl: number): Promise<T> {
      if (!/^(catalog|prices|collection:[a-zA-Z0-9_-]{1,120})$/.test(key)) throw new Error("PUBLIC_CACHE_KEY_REJECTED");
      for (const [k, v] of cache) if (v.expires <= now()) remove(k);
      const hit = cache.get(key);
      if (hit) { cache.delete(key); cache.set(key, hit); return hit.value as T; }
      const running = pending.get(key); if (running) return running as Promise<T>;
      if (pending.size >= maxInflight) throw new CorePublicBusy();
      // Cache only already validated successful projections; no stale/error fallback.
      const task = Promise.resolve().then(load).then(value => {
        const size = new TextEncoder().encode(JSON.stringify(value)).byteLength;
        if (ttl > 0 && key !== "prices" && size <= maxBytes) {
          while (cache.size >= maxEntries || bytes + size > maxBytes) {
            const oldest = cache.keys().next().value; if (!oldest) break; remove(oldest);
          }
          cache.set(key, { value, expires: now() + ttl, bytes: size }); bytes += size;
        }
        return value;
      }).finally(() => pending.delete(key));
      pending.set(key, task); return task;
    },
    stats: () => ({ entries: cache.size, inflight: pending.size, bytes }),
  };
}
export const corePublicReads = createCorePublicCache();

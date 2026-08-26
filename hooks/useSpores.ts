'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Spore } from '../types/spore';

export interface UseSporesOptions {
  /**
   * Optional polling interval in milliseconds.
   * When omitted, the hook fetches once on mount and when refetch is called.
   */
  autoRefreshMs?: number;
}

export interface UseSporesResult {
  spores: Spore[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  refetch: () => Promise<void>;
}

const SPORES_ENDPOINT = '/api/spores';

function normalizeSpores(payload: unknown): Spore[] {
  if (Array.isArray(payload)) {
    return payload as Spore[];
  }

  if (payload && typeof payload === 'object') {
    const maybeSpores = (payload as { spores?: unknown }).spores;
    if (Array.isArray(maybeSpores)) {
      return maybeSpores as Spore[];
    }
  }

  return [];
}

export function useSpores(options: UseSporesOptions = {}): UseSporesResult {
  const [spores, setSpores] = useState<Spore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const autoRefreshMs = options.autoRefreshMs;

  const refetch = useCallback(async () => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(SPORES_ENDPOINT, {
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Spores request failed with status ${response.status}`);
      }

      const data: unknown = await response.json();
      setSpores(normalizeSpores(data));
      setLastFetched(Date.now());
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      setError(err instanceof Error ? err.message : 'Failed to load spores.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refetch();

    return () => {
      abortRef.current?.abort();
    };
  }, [refetch]);

  useEffect(() => {
    if (!autoRefreshMs || autoRefreshMs <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      void refetch();
    }, autoRefreshMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoRefreshMs, refetch]);

  return {
    spores,
    loading,
    error,
    lastFetched,
    refetch,
  };
}
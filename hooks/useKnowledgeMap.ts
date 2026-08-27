"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getKnowledgeMap } from "@/services/knowledgeMapService";
import type { KnowledgeMap } from "@/types/knowledgeMap";

export function useKnowledgeMap() {
  const { user, loading: authLoading } = useAuth();
  const [map, setMap] = useState<KnowledgeMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    if (!user?.uid) {
      return Promise.resolve().then(() => {
        setMap(null);
        setError("");
        setLoading(false);
      });
    }

    const userId = user.uid;

    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getKnowledgeMap(userId);
      })
      .then((loadedMap) => {
        setMap(loadedMap);
      })
      .catch((caughtError) => {
        console.error("Knowledge map error:", caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The knowledge map could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void refresh();
  }, [authLoading, refresh]);

  return {
    map,
    loading: authLoading || loading,
    error,
    refresh,
  };
}

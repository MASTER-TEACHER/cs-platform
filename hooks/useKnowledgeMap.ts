"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getKnowledgeMap } from "@/services/knowledgeMapService";
import type { KnowledgeMap } from "@/types/knowledgeMap";

export function useKnowledgeMap() {
  const { user, loading: authLoading } = useAuth();
  const [map, setMap] = useState<KnowledgeMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    if (!user?.uid) {
      setMap(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      setMap(await getKnowledgeMap(user.uid));
    } catch (caughtError) {
      console.error("Knowledge map error:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The knowledge map could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void refresh();
  }, [authLoading, user?.uid]);

  return {
    map,
    loading: authLoading || loading,
    error,
    refresh,
  };
}

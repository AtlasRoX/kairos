"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/lib/types";

export function useChecklist(projectId?: string) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChecklist = useCallback(async () => {
    try {
      setLoading(true);
      const url = projectId ? `/api/projects/${projectId}/results` : "/api/checklist";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  return { items, loading, refetch: fetchChecklist };
}

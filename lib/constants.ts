/**
 * System-Wide Kairos Constants
 */
export const APP_NAME = "Kairos";
export const APP_DESCRIPTION = "Production Readiness Evaluation System";

export const PROJECT_TIERS = [
  { id: "tier-1", label: "Tier 1: Mission-Critical", minScore: 95 },
  { id: "tier-2", label: "Tier 2: Core Platform", minScore: 85 },
  { id: "tier-3", label: "Tier 3: Internal Tools", minScore: 70 },
] as const;

export const CHECKLIST_STATUSES = [
  { id: "not_started", label: "Not Started", scoreWeight: 0 },
  { id: "in_progress", label: "In Progress", scoreWeight: 0.5 },
  { id: "completed", label: "Completed", scoreWeight: 1.0 },
  { id: "not_applicable", label: "N/A", scoreWeight: null },
] as const;

export const DEFAULT_PAGE_SIZE = 20;

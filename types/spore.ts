/**
 * Shared domain types for decision spores, ingestion, rot, and audit output.
 */

export type SourceKind = "notes" | "transcript" | "recording" | "calendar";

export interface IngestInput {
  sourceKind: SourceKind;
  title?: string;
  sourceUrl?: string;
  calendarEventId?: string;
  participants?: string[];
  text: string;
  occurredAt?: string;
}

export interface SporeDraft {
  text: string;
  owner: string | null;
  deadline: string | null;
  context: string;
  confidence: number;
}

export interface Spore extends SporeDraft {
  id: string;
  sourceKind: SourceKind;
  sourceTitle: string;
  sourceUrl: string | null;
  calendarEventId: string | null;
  participants: string[];
  occurredAt: string | null;
  createdAt: string;
}

export type RotStatus = "healthy" | "unassigned" | "overdue" | "rotten";

export interface SporeWithRot extends Spore {
  rot: RotStatus;
  rotReasons: string[];
}

export type AuditPriority = "high" | "medium" | "low";

export interface AuditTotals {
  total: number;
  healthy: number;
  rotten: number;
  unassigned: number;
  overdue: number;
  averageConfidence: number;
}

export interface NextStep {
  sporeId: string;
  action: string;
  owner: string | null;
  deadline: string | null;
  priority: AuditPriority;
}

export interface AuditReport {
  generatedAt: string;
  totals: AuditTotals;
  rottenPromises: SporeWithRot[];
  healthyCommitments: SporeWithRot[];
  nextSteps: NextStep[];
}

export interface IngestResponse {
  spores: Spore[];
  count: number;
}
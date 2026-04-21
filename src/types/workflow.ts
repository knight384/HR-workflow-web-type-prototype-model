import type { Node, Edge } from '@xyflow/react';
import type { HRNode, HREdge } from './nodes';

/**
 * ─── Workflow State ────────────────────────────────────────────────────────────
 */

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: HRNode[];
  edges: HREdge[];
  selectedNodeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ─── Workflow Validation ──────────────────────────────────────────────────────
 */

export interface ValidationError {
  type: 'error' | 'warning' | 'info';
  nodeId?: string;
  message: string;
}

export interface WorkflowValidation {
  isValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  issues: ValidationError[];
}

/**
 * ─── Workflow Statistics ──────────────────────────────────────────────────────
 */

export interface WorkflowStats {
  nodeCount: number;
  edgeCount: number;
  nodesByKind: Record<string, number>;
  hasStart: boolean;
  hasEnd: boolean;
  isConnected: boolean;
}

/**
 * ─── Workflow Export/Import ───────────────────────────────────────────────────
 */

export interface WorkflowSnapshot {
  version: string;
  workflow: Workflow;
  exportedAt: Date;
}

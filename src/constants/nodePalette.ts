import type { NodeData } from '../types/nodes';

/**
 * ─── Node Palette ────────────────────────────────────────────────────────────
 *
 * Defines the available node types that can be added to the workflow canvas.
 * This is used by the Node Library/Palette in the UI.
 */

export interface PaletteNodeType {
  kind: NodeData['kind'];
  label: string;
  description: string;
  icon: string;
  category: 'flow' | 'action' | 'control';
  color: string;
  canHaveMultiple: boolean;
}

/**
 * ─── Node Types ───────────────────────────────────────────────────────────────
 */

export const START_NODE: PaletteNodeType = {
  kind: 'start',
  label: 'Start',
  description: 'Entry point for the workflow',
  icon: '▶',
  category: 'flow',
  color: '#22c55e',
  canHaveMultiple: true,
};

export const TASK_NODE: PaletteNodeType = {
  kind: 'task',
  label: 'Task',
  description: 'Assign a task to a person',
  icon: '✦',
  category: 'action',
  color: '#3b82f6',
  canHaveMultiple: true,
};

export const APPROVAL_NODE: PaletteNodeType = {
  kind: 'approval',
  label: 'Approval',
  description: 'Request approval from someone',
  icon: '◈',
  category: 'control',
  color: '#f59e0b',
  canHaveMultiple: true,
};

export const AUTOMATED_STEP_NODE: PaletteNodeType = {
  kind: 'automated_step',
  label: 'Automated',
  description: 'Execute an automated action',
  icon: '⚡',
  category: 'action',
  color: '#a855f7',
  canHaveMultiple: true,
};

export const END_NODE: PaletteNodeType = {
  kind: 'end',
  label: 'End',
  description: 'Workflow completion point',
  icon: '■',
  category: 'flow',
  color: '#ef4444',
  canHaveMultiple: true,
};

/**
 * ─── Node Palette ─────────────────────────────────────────────────────────────
 */

export const NODE_PALETTE: PaletteNodeType[] = [
  START_NODE,
  TASK_NODE,
  APPROVAL_NODE,
  AUTOMATED_STEP_NODE,
  END_NODE,
];

/**
 * ─── Grouped by Category ──────────────────────────────────────────────────────
 */

export const NODE_PALETTE_BY_CATEGORY = {
  flow: NODE_PALETTE.filter((n) => n.category === 'flow'),
  action: NODE_PALETTE.filter((n) => n.category === 'action'),
  control: NODE_PALETTE.filter((n) => n.category === 'control'),
};

/**
 * ─── Helper Functions ─────────────────────────────────────────────────────────
 */

/**
 * Get a node type by kind
 */
export function getNodeType(kind: NodeData['kind']): PaletteNodeType | null {
  return NODE_PALETTE.find((n) => n.kind === kind) ?? null;
}

/**
 * Get node color by kind
 */
export function getNodeColor(kind: NodeData['kind']): string {
  return getNodeType(kind)?.color ?? '#475569';
}

/**
 * Get node icon by kind
 */
export function getNodeIcon(kind: NodeData['kind']): string {
  return getNodeType(kind)?.icon ?? '◦';
}

/**
 * Get node label by kind
 */
export function getNodeLabel(kind: NodeData['kind']): string {
  return getNodeType(kind)?.label ?? 'Node';
}

/**
 * Check if multiple nodes of this type can exist in a workflow
 */
export function canHaveMultiple(kind: NodeData['kind']): boolean {
  return getNodeType(kind)?.canHaveMultiple ?? true;
}

/**
 * Get all nodes of a specific category
 */
export function getNodesByCategory(category: 'flow' | 'action' | 'control'): PaletteNodeType[] {
  return NODE_PALETTE_BY_CATEGORY[category];
}

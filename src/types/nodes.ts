import type { Node, Edge } from '@xyflow/react';

/**
 * ─── Base Node Data ────────────────────────────────────────────────────────────
 */

export interface BaseNodeData {
  kind: 'start' | 'task' | 'approval' | 'automated_step' | 'end';
  label: string;
}

/**
 * ─── Start Node ────────────────────────────────────────────────────────────────
 */

export interface StartNodeData extends BaseNodeData {
  kind: 'start';
  triggerLabel: string;
}

/**
 * ─── Task Node ────────────────────────────────────────────────────────────────
 */

export interface TaskNodeData extends BaseNodeData {
  kind: 'task';
  assignee?: string;
  dueInDays?: number;
  description?: string;
}

/**
 * ─── Approval Node ────────────────────────────────────────────────────────────
 */

export interface ApprovalNodeData extends BaseNodeData {
  kind: 'approval';
  approver?: string;
  timeoutDays: number;
  onTimeout: 'escalate' | 'auto_approve' | 'reject';
}

/**
 * ─── Automated Step Node ──────────────────────────────────────────────────────
 */

export interface AutomatedStepNodeData extends BaseNodeData {
  kind: 'automated_step';
  automationId?: string;
  automationLabel?: string;
  parameters?: Record<string, string | number | boolean>;
}

/**
 * ─── End Node ──────────────────────────────────────────────────────────────────
 */

export interface EndNodeData extends BaseNodeData {
  kind: 'end';
  outcomeLabel?: string;
}

/**
 * ─── Union type for all node data ─────────────────────────────────────────────
 */

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

/**
 * ─── HR Workflow Node ─────────────────────────────────────────────────────────
 */

export type HRNode = Node<NodeData>;

/**
 * ─── HR Workflow Edge ─────────────────────────────────────────────────────────
 */

export type HREdge = Edge;

/**
 * ─── Type Guards ──────────────────────────────────────────────────────────────
 */

export function isStartNode(data: unknown): data is StartNodeData {
  return (
    data != null &&
    typeof data === 'object' &&
    (data as Record<string, unknown>).kind === 'start'
  );
}

export function isTaskNode(data: unknown): data is TaskNodeData {
  return (
    data != null &&
    typeof data === 'object' &&
    (data as Record<string, unknown>).kind === 'task'
  );
}

export function isApprovalNode(data: unknown): data is ApprovalNodeData {
  return (
    data != null &&
    typeof data === 'object' &&
    (data as Record<string, unknown>).kind === 'approval'
  );
}

export function isAutomatedStepNode(data: unknown): data is AutomatedStepNodeData {
  return (
    data != null &&
    typeof data === 'object' &&
    (data as Record<string, unknown>).kind === 'automated_step'
  );
}

export function isEndNode(data: unknown): data is EndNodeData {
  return (
    data != null &&
    typeof data === 'object' &&
    (data as Record<string, unknown>).kind === 'end'
  );
}

/**
 * ─── Create node data factories ────────────────────────────────────────────────
 */

export function createStartNodeData(
  label: string = 'Start',
  triggerLabel: string = 'Manual'
): StartNodeData {
  return { kind: 'start', label, triggerLabel };
}

export function createTaskNodeData(
  label: string = 'Task',
  assignee?: string,
  dueInDays?: number,
  description?: string
): TaskNodeData {
  return { kind: 'task', label, assignee, dueInDays, description };
}

export function createApprovalNodeData(
  label: string = 'Approval',
  approver?: string,
  timeoutDays: number = 3,
  onTimeout: 'escalate' | 'auto_approve' | 'reject' = 'escalate'
): ApprovalNodeData {
  return { kind: 'approval', label, approver, timeoutDays, onTimeout };
}

export function createAutomatedStepNodeData(
  label: string = 'Automated Step',
  automationId?: string,
  automationLabel?: string,
  parameters?: Record<string, string | number | boolean>
): AutomatedStepNodeData {
  return {
    kind: 'automated_step',
    label,
    automationId,
    automationLabel,
    parameters,
  };
}

export function createEndNodeData(
  label: string = 'End',
  outcomeLabel?: string
): EndNodeData {
  return { kind: 'end', label, outcomeLabel };
}

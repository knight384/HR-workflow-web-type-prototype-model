import type { HRNode, HREdge } from '../types/nodes';
import type { SimulationResult, SimulationResponse, ValidationIssue } from '../types/api';

/**
 * ─── Simulation API ────────────────────────────────────────────────────────────
 *
 * This module provides workflow simulation/validation logic.
 * It performs a simple traversal of the workflow graph and produces execution traces.
 */

/**
 * Validate workflow structure
 */
function validateWorkflow(nodes: HRNode[], edges: HREdge[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for at least one start node
  const startNodes = nodes.filter((n) => n.data.kind === 'start');
  if (startNodes.length === 0) {
    issues.push({
      type: 'error',
      message: 'Workflow must have at least one Start node',
    });
  }

  // Check for at least one end node
  const endNodes = nodes.filter((n) => n.data.kind === 'end');
  if (endNodes.length === 0) {
    issues.push({
      type: 'error',
      message: 'Workflow must have at least one End node',
    });
  }

  // Check for isolated nodes
  const nodeIds = new Set(nodes.map((n) => n.id));
  nodes.forEach((node) => {
    const isConnected = edges.some(
      (e) => e.source === node.id || e.target === node.id
    );
    const isStartOrEnd = node.data.kind === 'start' || node.data.kind === 'end';

    if (!isConnected && nodes.length > 1 && !isStartOrEnd) {
      issues.push({
        type: 'warning',
        nodeId: node.id,
        nodeName: node.data.label,
        message: 'Node is not connected to the workflow',
      });
    }
  });

  // Check for unconfigured automated steps
  nodes.forEach((node) => {
    if (node.data.kind === 'automated_step' && !node.data.automationId) {
      issues.push({
        type: 'warning',
        nodeId: node.id,
        nodeName: node.data.label,
        message: 'Automated step has no automation selected',
        suggestion: 'Configure the automation for this step',
      });
    }
  });

  return issues;
}

/**
 * Simulate workflow execution with simple DFS traversal
 */
async function simulateWorkflow(
  nodes: HRNode[],
  edges: HREdge[]
): Promise<SimulationResult[]> {
  const results: SimulationResult[] = [];

  // Build adjacency list
  const graph = new Map<string, string[]>();
  nodes.forEach((node) => graph.set(node.id, []));
  edges.forEach((edge) => {
    const targets = graph.get(edge.source) || [];
    targets.push(edge.target);
    graph.set(edge.source, targets);
  });

  // Find start nodes
  const startNodes = nodes.filter((n) => n.data.kind === 'start');

  // Simulate execution from each start node
  const visited = new Set<string>();

  async function traverse(nodeId: string, depth: number = 0) {
    if (visited.has(nodeId) || depth > 20) return; // Prevent infinite loops
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Simulate node execution
    const duration = Math.random() * 500 + 100; // 100-600ms
    await new Promise((resolve) => setTimeout(resolve, Math.min(duration, 50)));

    const result: SimulationResult = {
      id: `exec-${nodeId}-${Date.now()}`,
      status: getSimulationStatus(node),
      nodeId: node.id,
      nodeName: node.data.label,
      nodeKind: node.data.kind,
      duration: Math.round(duration),
      message: getSimulationMessage(node),
      details: getSimulationDetails(node),
    };

    results.push(result);

    // Traverse to next nodes
    const nextNodeIds = graph.get(nodeId) || [];
    for (const nextNodeId of nextNodeIds) {
      await traverse(nextNodeId, depth + 1);
    }
  }

  // Start simulation from all start nodes
  for (const startNode of startNodes) {
    await traverse(startNode.id);
  }

  return results;
}

/**
 * Determine simulation status based on node configuration
 */
function getSimulationStatus(node: HRNode): SimulationResult['status'] {
  if (node.data.kind === 'automated_step' && !node.data.automationId) {
    return 'warning';
  }
  return 'success';
}

/**
 * Generate a simulation message
 */
function getSimulationMessage(node: HRNode): string {
  const kind = node.data.kind;
  const label = node.data.label;

  switch (kind) {
    case 'start':
      return `Workflow triggered: ${label}`;
    case 'task':
      const assignee = (node.data as any).assignee || 'Unassigned';
      return `Task assigned to ${assignee}: ${label}`;
    case 'approval':
      const approver = (node.data as any).approver || 'Awaiting approval';
      return `Approval request sent to ${approver}: ${label}`;
    case 'automated_step':
      if (!(node.data as any).automationId) {
        return `⚠️ Automation not configured: ${label}`;
      }
      return `Executed automation: ${label}`;
    case 'end':
      return `Workflow completed: ${label}`;
    default:
      return `Processed: ${label}`;
  }
}

/**
 * Generate simulation details
 */
function getSimulationDetails(node: HRNode): Record<string, unknown> {
  const details: Record<string, unknown> = {
    kind: node.data.kind,
  };

  switch (node.data.kind) {
    case 'task':
      details.assignee = (node.data as any).assignee;
      details.dueInDays = (node.data as any).dueInDays;
      break;
    case 'approval':
      details.approver = (node.data as any).approver;
      details.timeoutDays = (node.data as any).timeoutDays;
      details.onTimeout = (node.data as any).onTimeout;
      break;
    case 'automated_step':
      details.automationId = (node.data as any).automationId;
      details.paramCount = Object.keys(
        (node.data as any).parameters || {}
      ).length;
      break;
  }

  return details;
}

/**
 * ─── Public API ────────────────────────────────────────────────────────────────
 */

/**
 * Run a complete workflow simulation
 * Simulates: POST /api/simulate
 */
export async function runWorkflowSimulation(
  nodes: HRNode[],
  edges: HREdge[]
): Promise<SimulationResponse> {
  // Validate
  const validationIssues = validateWorkflow(nodes, edges);

  // Simulate
  const startTime = Date.now();
  const executedSteps = await simulateWorkflow(nodes, edges);
  const totalDuration = Date.now() - startTime;

  // Determine overall status
  const hasErrors = validationIssues.some((i) => i.type === 'error');
  const status = hasErrors ? 'failed' : 'completed';

  return {
    workflowId: `wf-${Date.now()}`,
    status,
    totalDuration,
    nodeCount: nodes.length,
    executedSteps,
    validationIssues,
  };
}

/**
 * Validate workflow without execution
 * Simulates: POST /api/validate
 */
export async function validateWorkflowOnly(
  nodes: HRNode[],
  edges: HREdge[]
): Promise<ValidationIssue[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return validateWorkflow(nodes, edges);
}

/**
 * Get workflow health check
 */
export async function getWorkflowHealth(
  nodes: HRNode[],
  edges: HREdge[]
): Promise<{
  isHealthy: boolean;
  errorCount: number;
  warningCount: number;
}> {
  const issues = validateWorkflow(nodes, edges);
  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;

  return {
    isHealthy: errorCount === 0,
    errorCount,
    warningCount,
  };
}

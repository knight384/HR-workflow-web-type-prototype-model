import { useMemo } from 'react';
import type { ValidationIssue } from '../types/api';
import { useWorkflowStore } from '../store/workflowStore';

/**
 * ─── useValidation Hook ────────────────────────────────────────────────────────
 *
 * Validates workflow structure and returns issues.
 * Checks:
 * - Exactly one Start node
 * - At least one End node
 * - Nodes with no outgoing edges (dangling nodes)
 */

export interface UseValidationReturn {
  issues: ValidationIssue[];
  hasErrors: boolean;
  hasWarnings: boolean;
  isValid: boolean;
  issuesByNodeId: Map<string, ValidationIssue[]>;
}

export function useValidation(): UseValidationReturn {
  const { nodes, edges } = useWorkflowStore();

  const { issues, hasErrors, hasWarnings, isValid, issuesByNodeId } = useMemo(
    () => {
      const allIssues: ValidationIssue[] = [];

      // ── Check for Start nodes ──────────────────────────────────────────────

      const startNodes = nodes.filter((n) => n.data.kind === 'start');

      if (startNodes.length === 0) {
        allIssues.push({
          type: 'error',
          message: 'Workflow must have at least one Start node',
          suggestion: 'Add a Start node to begin the workflow',
        });
      } else if (startNodes.length > 1) {
        allIssues.push({
          type: 'warning',
          message: `Multiple Start nodes detected (${startNodes.length})`,
          suggestion: 'Consider using only one Start node',
        });
      }

      // ── Check for End nodes ────────────────────────────────────────────────

      const endNodes = nodes.filter((n) => n.data.kind === 'end');

      if (endNodes.length === 0) {
        allIssues.push({
          type: 'error',
          message: 'Workflow must have at least one End node',
          suggestion: 'Add an End node to complete the workflow',
        });
      }

      // ── Check for dangling nodes (no outgoing edges) ─────────────────────

      const nodeIdToOutgoingEdges = new Map<string, number>();

      // Initialize all nodes with 0 outgoing edges
      nodes.forEach((node) => {
        nodeIdToOutgoingEdges.set(node.id, 0);
      });

      // Count outgoing edges
      edges.forEach((edge) => {
        const count = nodeIdToOutgoingEdges.get(edge.source) ?? 0;
        nodeIdToOutgoingEdges.set(edge.source, count + 1);
      });

      // Check for dangling nodes (except End nodes)
      nodes.forEach((node) => {
        if (node.data.kind === 'end') {
          // End nodes should not have outgoing edges
          return;
        }

        const outgoingCount = nodeIdToOutgoingEdges.get(node.id) ?? 0;

        if (outgoingCount === 0 && nodes.length > 1) {
          allIssues.push({
            type: 'warning',
            nodeId: node.id,
            nodeName: node.data.label,
            message: `Node "${node.data.label}" has no outgoing connections`,
            suggestion: 'Connect this node to the next step or to an End node',
          });
        }
      });

      // ── Check for unconfigured automated steps ──────────────────────────

      nodes.forEach((node) => {
        if (node.data.kind === 'automated_step') {
          const automationId = (node.data as any).automationId;
          if (!automationId) {
            allIssues.push({
              type: 'warning',
              nodeId: node.id,
              nodeName: node.data.label,
              message: `Automated step "${node.data.label}" has no automation selected`,
              suggestion: 'Configure an automation for this step',
            });
          }
        }
      });

      // ── Check for unconfigured approvals ────────────────────────────────

      nodes.forEach((node) => {
        if (node.data.kind === 'approval') {
          const approver = (node.data as any).approver;
          if (!approver) {
            allIssues.push({
              type: 'warning',
              nodeId: node.id,
              nodeName: node.data.label,
              message: `Approval node "${node.data.label}" has no approver set`,
              suggestion: 'Specify who should approve this step',
            });
          }
        }
      });

      // ── Build issues map by node ID ────────────────────────────────────

      const issuesByNodeId = new Map<string, ValidationIssue[]>();
      allIssues.forEach((issue) => {
        if (issue.nodeId) {
          const nodeIssues = issuesByNodeId.get(issue.nodeId) ?? [];
          nodeIssues.push(issue);
          issuesByNodeId.set(issue.nodeId, nodeIssues);
        }
      });

      // ── Compute overall status ─────────────────────────────────────────

      const hasErrors = allIssues.some((i) => i.type === 'error');
      const hasWarnings = allIssues.some((i) => i.type === 'warning');
      const isValid = !hasErrors;

      return {
        issues: allIssues,
        hasErrors,
        hasWarnings,
        isValid,
        issuesByNodeId,
      };
    },
    [nodes, edges]
  );

  return { issues, hasErrors, hasWarnings, isValid, issuesByNodeId };
}

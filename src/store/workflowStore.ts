import { create } from 'zustand';
import type {
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
} from '@xyflow/react';
import { applyNodeChanges as xyflowApplyNodeChanges, applyEdgeChanges as xyflowApplyEdgeChanges } from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { HRNode, HREdge, NodeData } from '../types/nodes';
import {
  createStartNodeData,
  createTaskNodeData,
  createApprovalNodeData,
  createAutomatedStepNodeData,
  createEndNodeData,
} from '../types/nodes';

/**
 * ─── Workflow Store State ──────────────────────────────────────────────────────
 */

interface WorkflowStoreState {
  nodes: HRNode[];
  edges: HREdge[];
  selectedNodeId: string | null;

  // Node operations
  addNode: (nodeType: NodeData['kind'], position?: { x: number; y: number }) => string;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  getSelectedNode: () => HRNode | null;

  // React Flow handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Utility
  reset: () => void;
  getNode: (nodeId: string) => HRNode | null;
}

/**
 * ─── Store Implementation ──────────────────────────────────────────────────────
 */

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  /**
   * Add a new node to the workflow
   */
  addNode: (nodeType, position = { x: 0, y: 0 }) => {
    const nodeId = nanoid();
    let nodeData: NodeData;

    switch (nodeType) {
      case 'start':
        nodeData = createStartNodeData();
        break;
      case 'task':
        nodeData = createTaskNodeData();
        break;
      case 'approval':
        nodeData = createApprovalNodeData();
        break;
      case 'automated_step':
        nodeData = createAutomatedStepNodeData();
        break;
      case 'end':
        nodeData = createEndNodeData();
        break;
      default:
        throw new Error(`Unknown node type: ${nodeType}`);
    }

    const newNode: HRNode = {
      id: nodeId,
      data: nodeData,
      position,
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));

    return nodeId;
  },

  /**
   * Update node data (label, assignee, etc.)
   */
  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as NodeData }
          : node
      ),
    }));
  },

  /**
   * Delete a node and its connected edges
   */
  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId:
        state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  /**
   * Select a node for editing
   */
  selectNode: (nodeId) => {
    set(() => ({ selectedNodeId: nodeId }));
  },

  /**
   * Get the currently selected node
   */
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  },

  /**
   * Get a node by ID
   */
  getNode: (nodeId) => {
    const { nodes } = get();
    return nodes.find((n) => n.id === nodeId) ?? null;
  },

  /**
   * Handle node position/selection changes from React Flow
   */
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: xyflowApplyNodeChanges(
        changes,
        state.nodes as Parameters<typeof xyflowApplyNodeChanges>[1]
      ) as HRNode[],
    }));
  },

  /**
   * Handle edge changes from React Flow
   */
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: xyflowApplyEdgeChanges(
        changes,
        state.edges as Parameters<typeof xyflowApplyEdgeChanges>[1]
      ) as HREdge[],
    }));
  },

  /**
   * Handle new connections between nodes
   */
  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: [
        ...state.edges,
        {
          id: nanoid(),
          source: connection.source!,
          target: connection.target!,
          animated: false,
        },
      ],
    }));
  },

  /**
   * Reset the entire workflow
   */
  reset: () => {
    set(() => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
    }));
  },
}));

/**
 * ─── Selectors ────────────────────────────────────────────────────────────────
 */

/**
 * Memoized selectors to avoid unnecessary re-renders
 */
export const selectNodes = (state: WorkflowStoreState) => state.nodes;
export const selectEdges = (state: WorkflowStoreState) => state.edges;
export const selectSelectedNodeId = (state: WorkflowStoreState) =>
  state.selectedNodeId;

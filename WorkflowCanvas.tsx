import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type OnNodeClick,
  type OnPaneClick,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import { nodeTypes } from './nodes';
import { useDrop } from '../../hooks/useDrop';
import type { HRNode } from '../../types/nodes';

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
  } = useWorkflowStore();

  // ── Drag-and-drop from palette ────────────────────────────────────────────
  const { onDragOver, onDrop } = useDrop();

  // ── Node / pane selection ─────────────────────────────────────────────────

  const handleNodeClick: OnNodeClick = useCallback(
    (_event, node) => {
      selectNode((node as HRNode).id);
    },
    [selectNode]
  );

  const handlePaneClick: OnPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div style={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        style={styles.flow}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2e3650"
        />

        <Controls
          style={styles.controls}
          showInteractive={false}
        />

        <MiniMap
          style={styles.minimap}
          nodeColor={minimapNodeColor}
          maskColor="rgba(15, 18, 30, 0.7)"
          pannable
          zoomable
        />

        <EmptyCanvasHint nodeCount={nodes.length} />
      </ReactFlow>
    </div>
  );
}

// ─── Empty Canvas Hint ────────────────────────────────────────────────────────

function EmptyCanvasHint({ nodeCount }: { nodeCount: number }) {
  if (nodeCount > 0) return null;

  return (
    <div style={styles.emptyHint}>
      <div style={styles.emptyIconWrap}>
        <span style={styles.emptyIcon}>⊕</span>
      </div>
      <div style={styles.emptyTitle}>Start building your workflow</div>
      <div style={styles.emptySubtitle}>
        Drag a node from the <strong style={styles.emptyAccent}>Node Library</strong> on the left
        onto this canvas to begin
      </div>
      <div style={styles.emptySteps}>
        <span style={styles.emptyStep}><span style={styles.emptyStepNum}>1</span> Add a Start node</span>
        <span style={styles.emptyStepArrow}>→</span>
        <span style={styles.emptyStep}><span style={styles.emptyStepNum}>2</span> Add steps</span>
        <span style={styles.emptyStepArrow}>→</span>
        <span style={styles.emptyStep}><span style={styles.emptyStepNum}>3</span> Add an End node</span>
      </div>
    </div>
  );
}

// ─── Minimap color by node kind ───────────────────────────────────────────────

function minimapNodeColor(node: HRNode): string {
  const colorMap: Record<string, string> = {
    start: '#22c55e',
    task: '#3b82f6',
    approval: '#f59e0b',
    automated_step: '#a855f7',
    end: '#ef4444',
  };
  return colorMap[node.data?.kind as string] ?? '#475569';
}

// ─── Edge defaults ────────────────────────────────────────────────────────────

const defaultEdgeOptions = {
  style: {
    stroke: '#475569',
    strokeWidth: 2,
  },
  animated: false,
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    background: '#0f121e',
    position: 'relative',
  },
  flow: {
    background: 'transparent',
  },
  controls: {
    background: '#1e2433',
    border: '1px solid #2e3650',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
  },
  minimap: {
    background: '#141824',
    border: '1px solid #2e3650',
    borderRadius: '8px',
  },
  emptyHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    pointerEvents: 'none',
    fontFamily: "'DM Mono', 'Fira Code', monospace",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    userSelect: 'none',
  },
  emptyIconWrap: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: '#141824',
    border: '1px solid #1e2d45',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  emptyIcon: {
    fontSize: '22px',
    color: '#2e3650',
    lineHeight: 1,
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#334155',
    letterSpacing: '0.02em',
  },
  emptySubtitle: {
    fontSize: '11px',
    color: '#1e2d45',
    letterSpacing: '0.02em',
    lineHeight: 1.6,
    maxWidth: '260px',
  },
  emptyAccent: {
    color: '#2e3a55',
    fontWeight: 700,
  },
  emptySteps: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  emptyStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '9.5px',
    color: '#1e2d45',
    letterSpacing: '0.04em',
  },
  emptyStepNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#1a2236',
    border: '1px solid #1e2d45',
    fontSize: '8px',
    fontWeight: 700,
    color: '#334155',
  },
  emptyStepArrow: {
    fontSize: '10px',
    color: '#1a2236',
  },
};

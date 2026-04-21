import { useWorkflowStore } from '../../store/workflowStore';
import {
  isStartNode,
  isTaskNode,
  isApprovalNode,
  isAutomatedStepNode,
  isEndNode,
} from '../../types/nodes';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
} from '../../types/nodes';

import StartConfig from './StartConfig';
import TaskConfig from './TaskConfig';
import ApprovalConfig from './ApprovalConfig';
import AutomatedStepConfig from './AutomatedStepConfig';
import EndConfig from './EndConfig';

// ─── Accent color per node kind ───────────────────────────────────────────────

const KIND_ACCENT: Record<string, string> = {
  start:          '#22c55e',
  task:           '#3b82f6',
  approval:       '#f59e0b',
  automated_step: '#a855f7',
  end:            '#ef4444',
};

const KIND_LABEL: Record<string, string> = {
  start:          '▶ START',
  task:           '✦ TASK',
  approval:       '◈ APPROVAL',
  automated_step: '⚡ AUTOMATED',
  end:            '■ END',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConfigPanel() {
  const { getSelectedNode, deleteNode, selectNode } = useWorkflowStore();
  const node = getSelectedNode();

  // ── Empty state — no node selected ────────────────────────────────────────

  if (!node) {
    return (
      <aside style={panelStyle}>
        <PanelHeader />
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>◎</div>
          <div style={emptyTitleStyle}>No node selected</div>
          <div style={emptySubStyle}>
            Click any node on the canvas to configure it
          </div>
        </div>
      </aside>
    );
  }

  const { data } = node;
  const accent = KIND_ACCENT[data.kind] ?? '#475569';
  const kindLabel = KIND_LABEL[data.kind] ?? data.kind;

  // ── Delete handler ─────────────────────────────────────────────────────────

  const handleDelete = () => {
    deleteNode(node.id);
    selectNode(null);
  };

  return (
    <aside style={panelStyle}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <PanelHeader />

      {/* ── Node identity strip ─────────────────────────────────────── */}
      <div style={{ ...identityStripStyle, borderLeftColor: accent }}>
        <span style={{ ...kindPillStyle, color: accent }}>
          {kindLabel}
        </span>
        <span style={nodeIdStyle}>{node.id.slice(0, 8)}…</span>
      </div>

      {/* ── Scrollable form body ─────────────────────────────────────── */}
      <div style={formBodyStyle}>
        <FormRouter nodeId={node.id} data={data} />
      </div>

      {/* ── Footer: delete ──────────────────────────────────────────── */}
      <div style={footerStyle}>
        <button style={deleteButtonStyle} onClick={handleDelete}>
          ✕ Remove node
        </button>
      </div>
    </aside>
  );
}

// ─── Form router ─────────────────────────────────────────────────────────────

function FormRouter({ nodeId, data }: { nodeId: string; data: ReturnType<typeof useWorkflowStore.getState>['nodes'][0]['data'] }) {
  if (isStartNode(data))
    return <StartConfig nodeId={nodeId} data={data as StartNodeData} />;
  if (isTaskNode(data))
    return <TaskConfig nodeId={nodeId} data={data as TaskNodeData} />;
  if (isApprovalNode(data))
    return <ApprovalConfig nodeId={nodeId} data={data as ApprovalNodeData} />;
  if (isAutomatedStepNode(data))
    return <AutomatedStepConfig nodeId={nodeId} data={data as AutomatedStepNodeData} />;
  if (isEndNode(data))
    return <EndConfig nodeId={nodeId} data={data as EndNodeData} />;

  return (
    <div style={unknownStyle}>
      Unknown node kind: <code>{(data as { kind: string }).kind}</code>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PanelHeader() {
  return (
    <div style={headerStyle}>
      <span style={headerIconStyle}>⚙</span>
      <span style={headerLabelStyle}>Node Config</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  width: '260px',
  flexShrink: 0,
  background: '#141824',
  borderLeft: '1px solid #1e2d45',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: "'DM Mono', 'Fira Code', monospace",
};

const headerStyle: React.CSSProperties = {
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 14px',
  borderBottom: '1px solid #1e2d45',
  flexShrink: 0,
};

const headerIconStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#3b82f6',
};

const headerLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: '#475569',
  textTransform: 'uppercase',
};

const emptyStateStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 20px',
  gap: '10px',
};

const emptyIconStyle: React.CSSProperties = {
  fontSize: '24px',
  color: '#1e2d45',
};

const emptyTitleStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#334155',
  letterSpacing: '0.04em',
};

const emptySubStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#1e2d45',
  textAlign: 'center',
  lineHeight: 1.6,
  letterSpacing: '0.02em',
};

const identityStripStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderLeft: '3px solid transparent',
  borderBottom: '1px solid #1a2236',
  background: '#0f121e',
  flexShrink: 0,
};

const kindPillStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.1em',
};

const nodeIdStyle: React.CSSProperties = {
  fontSize: '8.5px',
  color: '#1e2d45',
  letterSpacing: '0.04em',
};

const formBodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '18px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
};

const footerStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderTop: '1px solid #1a2236',
  flexShrink: 0,
};

const deleteButtonStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: '1px solid #2a1a1a',
  borderRadius: '5px',
  padding: '7px 12px',
  fontFamily: "'DM Mono', 'Fira Code', monospace",
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  color: '#7f1d1d',
  cursor: 'pointer',
  transition: 'all 0.12s',
};

const unknownStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#475569',
  padding: '12px 0',
};

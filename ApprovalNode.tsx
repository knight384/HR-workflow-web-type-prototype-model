import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ApprovalNodeData } from '../../../types/nodes';

const TIMEOUT_LABEL: Record<ApprovalNodeData['onTimeout'], string> = {
  escalate: 'Escalate',
  auto_approve: 'Auto-approve',
  reject: 'Reject',
};

const ApprovalNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ApprovalNodeData;

  return (
    <div style={{ ...styles.card, ...(selected ? styles.cardSelected : {}), borderLeftColor: '#f59e0b' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={styles.handleTarget}
      />

      <div style={styles.header}>
        <span style={styles.kindBadge}>◈ APPROVAL</span>
      </div>

      <div style={styles.label}>{nodeData.label}</div>

      <div style={styles.grid}>
        <div style={styles.field}>
          <span style={styles.fieldKey}>Approver</span>
          <span style={styles.fieldValue}>{nodeData.approver || '—'}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.fieldKey}>Timeout</span>
          <span style={styles.fieldValue}>{nodeData.timeoutDays}d</span>
        </div>
      </div>

      <div style={styles.timeoutRow}>
        <span style={styles.fieldKey}>On timeout →</span>
        <span style={{ ...styles.timeoutPill }}>
          {TIMEOUT_LABEL[nodeData.onTimeout] ?? '—'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={styles.handleSource}
      />
    </div>
  );
});

ApprovalNode.displayName = 'ApprovalNode';
export default ApprovalNode;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1e2433',
    border: '1px solid #2e3650',
    borderLeft: '4px solid #f59e0b',
    borderRadius: '8px',
    padding: '12px 14px',
    minWidth: '200px',
    maxWidth: '240px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    cursor: 'grab',
    fontFamily: "'DM Mono', 'Fira Code', monospace",
    transition: 'box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease',
  },
  cardSelected: {
    background: '#232b3e',
    boxShadow: '0 0 0 2px #f59e0b, 0 6px 24px rgba(245,158,11,0.25)',
    borderTopColor: '#f59e0b',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  kindBadge: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    padding: '2px 6px',
    borderRadius: '3px',
    textTransform: 'uppercase' as const,
    background: '#fef3c7',
    color: '#b45309',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e2e8f0',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    marginBottom: '8px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1px',
  },
  fieldKey: {
    fontSize: '9px',
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  fieldValue: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  timeoutRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingTop: '6px',
    borderTop: '1px solid #2e3650',
  },
  timeoutPill: {
    fontSize: '10px',
    color: '#f59e0b',
    fontWeight: 600,
  },
  handleTarget: {
    width: 10,
    height: 10,
    background: '#f59e0b',
    border: '2px solid #1e2433',
    top: -6,
  },
  handleSource: {
    width: 10,
    height: 10,
    background: '#f59e0b',
    border: '2px solid #1e2433',
    bottom: -6,
  },
};

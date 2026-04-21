import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { EndNodeData } from '../../../types/nodes';

const EndNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as EndNodeData;

  return (
    <div style={{ ...styles.card, ...(selected ? styles.cardSelected : {}), borderLeftColor: '#ef4444' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={styles.handleTarget}
      />

      <div style={styles.header}>
        <span style={styles.kindBadge}>■ END</span>
      </div>

      <div style={styles.label}>{nodeData.label}</div>

      <div style={styles.outcomeRow}>
        <span style={styles.outcomeKey}>Outcome</span>
        <span style={styles.outcomeValue}>{nodeData.outcomeLabel || '—'}</span>
      </div>

      {/* No source handle — End has no outgoing connections */}
    </div>
  );
});

EndNode.displayName = 'EndNode';
export default EndNode;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1e2433',
    border: '1px solid #2e3650',
    borderLeft: '4px solid #ef4444',
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
    boxShadow: '0 0 0 2px #ef4444, 0 6px 24px rgba(239,68,68,0.25)',
    borderTopColor: '#ef4444',
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
    background: '#fee2e2',
    color: '#b91c1c',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e2e8f0',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  outcomeRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1px',
  },
  outcomeKey: {
    fontSize: '9px',
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  outcomeValue: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  handleTarget: {
    width: 10,
    height: 10,
    background: '#ef4444',
    border: '2px solid #1e2433',
    top: -6,
  },
};

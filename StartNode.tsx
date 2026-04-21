import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { StartNodeData } from '../../../types/nodes';

const StartNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as StartNodeData;

  return (
    <div style={{ ...styles.card, ...(selected ? styles.cardSelected : {}), borderLeftColor: '#22c55e' }}>
      <div style={styles.header}>
        <span style={{ ...styles.kindBadge, background: '#dcfce7', color: '#15803d' }}>
          ▶ START
        </span>
      </div>

      <div style={styles.label}>{nodeData.label}</div>

      <div style={styles.meta}>
        <span style={styles.metaKey}>Trigger</span>
        <span style={styles.metaValue}>{nodeData.triggerLabel || 'Not set'}</span>
      </div>

      {/* Only a source handle — Start has no incoming connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={styles.handleSource}
      />
    </div>
  );
});

StartNode.displayName = 'StartNode';
export default StartNode;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1e2433',
    border: '1px solid #2e3650',
    borderLeft: '4px solid #22c55e',
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
    boxShadow: '0 0 0 2px #22c55e, 0 6px 24px rgba(34,197,94,0.25)',
    borderTopColor: '#22c55e',
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
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e2e8f0',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1px',
  },
  metaKey: {
    fontSize: '9px',
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  metaValue: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  handleSource: {
    width: 10,
    height: 10,
    background: '#22c55e',
    border: '2px solid #1e2433',
    bottom: -6,
  },
};

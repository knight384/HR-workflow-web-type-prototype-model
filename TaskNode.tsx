import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { TaskNodeData } from '../../../types/nodes';

const TaskNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as TaskNodeData;

  return (
    <div style={{ ...styles.card, ...(selected ? styles.cardSelected : {}), borderLeftColor: '#3b82f6' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={styles.handleTarget}
      />

      <div style={styles.header}>
        <span style={{ ...styles.kindBadge, background: '#dbeafe', color: '#1d4ed8' }}>
          ✦ TASK
        </span>
      </div>

      <div style={styles.label}>{nodeData.label}</div>

      <div style={styles.grid}>
        <div style={styles.field}>
          <span style={styles.fieldKey}>Assignee</span>
          <span style={styles.fieldValue}>{nodeData.assignee || '—'}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.fieldKey}>Due in</span>
          <span style={styles.fieldValue}>
            {nodeData.dueInDays != null ? `${nodeData.dueInDays}d` : '—'}
          </span>
        </div>
      </div>

      {nodeData.description && (
        <div style={styles.description}>{nodeData.description}</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={styles.handleSource}
      />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';
export default TaskNode;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1e2433',
    border: '1px solid #2e3650',
    borderLeft: '4px solid #3b82f6',
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
    boxShadow: '0 0 0 2px #3b82f6, 0 6px 24px rgba(59,130,246,0.25)',
    borderTopColor: '#3b82f6',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
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
  description: {
    marginTop: '8px',
    fontSize: '10px',
    color: '#64748b',
    lineHeight: 1.4,
    borderTop: '1px solid #2e3650',
    paddingTop: '6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  handleTarget: {
    width: 10,
    height: 10,
    background: '#3b82f6',
    border: '2px solid #1e2433',
    top: -6,
  },
  handleSource: {
    width: 10,
    height: 10,
    background: '#3b82f6',
    border: '2px solid #1e2433',
    bottom: -6,
  },
};

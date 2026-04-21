import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AutomatedStepNodeData } from '../../../types/nodes';

const AutomatedStepNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as AutomatedStepNodeData;

  const hasAutomation = Boolean(nodeData.automationId);
  const paramCount = Object.keys(nodeData.parameters ?? {}).length;

  return (
    <div style={{ ...styles.card, ...(selected ? styles.cardSelected : {}), borderLeftColor: '#a855f7' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={styles.handleTarget}
      />

      <div style={styles.header}>
        <span style={styles.kindBadge}>⚡ AUTOMATED</span>
      </div>

      <div style={styles.label}>{nodeData.label}</div>

      <div style={styles.automationRow}>
        {hasAutomation ? (
          <>
            <span style={styles.automationIcon}>▣</span>
            <span style={styles.automationLabel}>
              {nodeData.automationLabel || nodeData.automationId}
            </span>
          </>
        ) : (
          <span style={styles.unconfigured}>No automation selected</span>
        )}
      </div>

      {hasAutomation && (
        <div style={styles.paramsBadge}>
          {paramCount} param{paramCount !== 1 ? 's' : ''} configured
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={styles.handleSource}
      />
    </div>
  );
});

AutomatedStepNode.displayName = 'AutomatedStepNode';
export default AutomatedStepNode;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1e2433',
    border: '1px solid #2e3650',
    borderLeft: '4px solid #a855f7',
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
    boxShadow: '0 0 0 2px #a855f7, 0 6px 24px rgba(168,85,247,0.25)',
    borderTopColor: '#a855f7',
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
    background: '#f3e8ff',
    color: '#7e22ce',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e2e8f0',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  automationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  },
  automationIcon: {
    fontSize: '11px',
    color: '#a855f7',
  },
  automationLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  unconfigured: {
    fontSize: '10px',
    color: '#475569',
    fontStyle: 'italic',
  },
  paramsBadge: {
    display: 'inline-block',
    fontSize: '9px',
    color: '#a855f7',
    background: '#2d1f42',
    border: '1px solid #6b21a8',
    borderRadius: '3px',
    padding: '1px 5px',
    letterSpacing: '0.04em',
  },
  handleTarget: {
    width: 10,
    height: 10,
    background: '#a855f7',
    border: '2px solid #1e2433',
    top: -6,
  },
  handleSource: {
    width: 10,
    height: 10,
    background: '#a855f7',
    border: '2px solid #1e2433',
    bottom: -6,
  },
};

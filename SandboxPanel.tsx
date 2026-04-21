import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulate } from '../../hooks/useSimulate';
import { useValidation } from '../../hooks/useValidation';
import SimulateButton from './SimulateButton';
import SimulationResultList from './SimulationResultList';
import ValidationStrip from './ValidationStrip';

export default function SandboxPanel() {
  const { nodes, edges } = useWorkflowStore();
  const { state, result, run, reset } = useSimulate();
  const { issues, hasErrors, isValid } = useValidation();

  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const hasStart = nodes.some((n) => n.data.kind === 'start');
  const hasEnd = nodes.some((n) => n.data.kind === 'end');
  const canRun = nodeCount > 0 && isValid;

  const hasIssues = issues.length > 0;
  const isExpanded = state === 'done' || state === 'error' || state === 'running' || (hasIssues && nodeCount > 0);

  return (
    <div style={{ ...panelStyle, height: isExpanded ? expandedHeight : collapsedHeight }}>

      {/* ── Top toolbar bar ──────────────────────────────────────────────── */}
      <div style={toolbarStyle}>

        {/* Left: label + stats */}
        <div style={toolbarLeftStyle}>
          <span style={panelIconStyle}>▶</span>
          <span style={panelLabelStyle}>Simulation Sandbox</span>
          <div style={dividerStyle} />

          <Stat label="Nodes" value={nodeCount} />
          <Stat label="Edges" value={edgeCount} />

          <div style={dividerStyle} />

          <CheckBadge label="Start" ok={hasStart} />
          <CheckBadge label="End" ok={hasEnd} />
        </div>

        {/* Right: action buttons */}
        <div style={toolbarRightStyle}>
          {isExpanded && state !== 'running' && (
            <button style={clearButtonStyle} onClick={reset}>
              ✕ Clear
            </button>
          )}
          <SimulateButton
            state={canRun ? state : 'idle'}
            disabled={!canRun}
            onRun={run}
            onReset={reset}
          />
        </div>
      </div>

      {/* ── Validation issues ────────────────────────────────────────────── */}
      {nodeCount > 0 && <ValidationStrip issues={issues} />}

      {/* ── Blocked-by-errors notice ─────────────────────────────────────── */}
      {hasErrors && state === 'idle' && nodeCount > 0 && (
        <div style={blockedNoticeStyle}>
          Fix the errors above before running the simulation
        </div>
      )}

      {/* ── Loading state during simulation ──────────────────────────── */}
      {state === 'running' && (
        <div style={loadingWrapStyle}>
          <div style={loadingBarTrackStyle}>
            <div style={loadingBarFillStyle} />
          </div>
          <div style={loadingRowStyle}>
            <span style={runningDotStyle} />
            <span style={runningTextStyle}>Simulating workflow execution…</span>
            <span style={runningStepsStyle}>
              {nodes.length} node{nodes.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* ── Result list ──────────────────────────────────────────────────── */}
      {result && state !== 'running' && (
        <div style={resultAreaStyle}>
          <SimulationResultList result={result} />
        </div>
      )}

      {/* ── Empty canvas warning ─────────────────────────────────────────── */}
      {!canRun && state === 'idle' && (
        <div style={emptyWarningStyle}>
          Add nodes to the canvas before running a simulation
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-200%); } 100% { transform: translateX(350%); } }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={statStyle}>
      <span style={statValueStyle}>{value}</span>
      <span style={statLabelStyle}>{label}</span>
    </div>
  );
}

function CheckBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{
      ...checkBadgeStyle,
      color: ok ? '#22c55e' : '#334155',
      background: ok ? 'rgba(34,197,94,0.08)' : 'transparent',
      border: `1px solid ${ok ? '#166534' : '#1a2236'}`,
    }}>
      <span>{ok ? '✓' : '○'}</span>
      <span>{label}</span>
    </div>
  );
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const collapsedHeight = '52px';
const expandedHeight = '260px';

// ─── Styles ───────────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  flexShrink: 0,
  background: '#0d1018',
  borderTop: '1px solid #1e2d45',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'height 0.2s ease',
  fontFamily: "'DM Mono', 'Fira Code', monospace",
};

const toolbarStyle: React.CSSProperties = {
  height: '52px',
  minHeight: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  gap: '12px',
  borderBottom: '1px solid #141824',
  flexShrink: 0,
};

const toolbarLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
};

const toolbarRightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
};

const panelIconStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#3b82f6',
  flexShrink: 0,
};

const panelLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: '#334155',
  textTransform: 'uppercase',
  flexShrink: 0,
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '16px',
  background: '#1a2236',
  flexShrink: 0,
};

const statStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '4px',
};

const statValueStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#475569',
  letterSpacing: '0',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: '8.5px',
  color: '#1e2d45',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const checkBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 7px',
  borderRadius: '4px',
  fontSize: '9.5px',
  fontWeight: 600,
  letterSpacing: '0.06em',
};

const clearButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #1a2236',
  borderRadius: '5px',
  padding: '6px 10px',
  fontFamily: "'DM Mono', 'Fira Code', monospace",
  fontSize: '9.5px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  color: '#334155',
  cursor: 'pointer',
  transition: 'all 0.12s',
};

const loadingWrapStyle: React.CSSProperties = {
  flexShrink: 0,
  borderBottom: '1px solid #141824',
};

const loadingBarTrackStyle: React.CSSProperties = {
  height: '2px',
  background: '#0a0f1a',
  overflow: 'hidden',
};

const loadingBarFillStyle: React.CSSProperties = {
  height: '100%',
  width: '40%',
  background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
  animation: 'shimmer 1.2s ease-in-out infinite',
};

const loadingRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '7px 16px',
  background: '#0a0f1a',
};

const runningDotStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  border: '1.5px solid #1e2d45',
  borderTopColor: '#3b82f6',
  animation: 'spin 0.7s linear infinite',
  flexShrink: 0,
};

const runningTextStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#334155',
  letterSpacing: '0.04em',
};

const resultAreaStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
};

const runningStepsStyle: React.CSSProperties = {
  marginLeft: 'auto',
  fontSize: '9px',
  color: '#1e2d45',
  letterSpacing: '0.06em',
};

const emptyWarningStyle: React.CSSProperties = {
  padding: '6px 16px',
  fontSize: '9.5px',
  color: '#1e2d45',
  letterSpacing: '0.04em',
};

const blockedNoticeStyle: React.CSSProperties = {
  padding: '5px 16px',
  fontSize: '9.5px',
  color: '#7f1d1d',
  letterSpacing: '0.03em',
  background: 'rgba(239,68,68,0.04)',
  borderBottom: '1px solid #141824',
  fontFamily: "'DM Mono', 'Fira Code', monospace",
};

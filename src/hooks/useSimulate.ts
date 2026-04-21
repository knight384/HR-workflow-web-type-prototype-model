import { useState, useCallback } from 'react';
import type { SimulationResponse } from '../types/api';
import { runWorkflowSimulation } from '../api/simulate';
import { useWorkflowStore } from '../store/workflowStore';

/**
 * ─── useSimulate Hook ──────────────────────────────────────────────────────────
 *
 * Manages workflow simulation state and execution.
 * Calls the simulation API and returns results + loading state.
 */

export type SimulationState = 'idle' | 'running' | 'done' | 'error';

export interface UseSimulateReturn {
  state: SimulationState;
  result: SimulationResponse | null;
  error: string | null;
  run: () => Promise<void>;
  reset: () => void;
}

export function useSimulate(): UseSimulateReturn {
  const { nodes, edges } = useWorkflowStore();
  const [state, setState] = useState<SimulationState>('idle');
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Run workflow simulation
   */
  const run = useCallback(async () => {
    // Reset error state
    setError(null);

    // Check if there are nodes to simulate
    if (nodes.length === 0) {
      setError('No nodes to simulate');
      setState('error');
      return;
    }

    try {
      setState('running');

      // Call simulation API
      const response = await runWorkflowSimulation(nodes, edges);

      // Update state with results
      setResult(response);
      setState(response.status === 'completed' ? 'done' : 'error');

      // Set error message if there are validation issues
      const errors = response.validationIssues.filter((i) => i.type === 'error');
      if (errors.length > 0) {
        setError(errors.map((e) => e.message).join('; '));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to run simulation';
      setError(message);
      setState('error');
      setResult(null);
    }
  }, [nodes, edges]);

  /**
   * Reset simulation state
   */
  const reset = useCallback(() => {
    setState('idle');
    setResult(null);
    setError(null);
  }, []);

  return { state, result, error, run, reset };
}

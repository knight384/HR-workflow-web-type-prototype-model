/**
 * ─── Automation API Types ──────────────────────────────────────────────────────
 */

export interface AutomationAction {
  id: string;
  name: string;
  description: string;
  category: 'email' | 'notification' | 'integration' | 'transformation';
  icon: string;
  parameters: AutomationParameter[];
}

export interface AutomationParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  options?: string[];
}

/**
 * ─── Simulation API Types ──────────────────────────────────────────────────────
 */

export interface SimulationRequest {
  nodeIds: string[];
  edges: Array<{ source: string; target: string }>;
}

export interface SimulationResult {
  id: string;
  status: 'success' | 'error' | 'warning';
  nodeId: string;
  nodeName: string;
  nodeKind: string;
  duration: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface SimulationResponse {
  workflowId: string;
  status: 'completed' | 'failed';
  totalDuration: number;
  nodeCount: number;
  executedSteps: SimulationResult[];
  validationIssues: ValidationIssue[];
}

/**
 * ─── Validation Types ─────────────────────────────────────────────────────────
 */

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  nodeId?: string;
  nodeName?: string;
  message: string;
  suggestion?: string;
}

/**
 * ─── Workflow Configuration Types ─────────────────────────────────────────────
 */

export interface WorkflowConfig {
  name: string;
  description?: string;
  tags?: string[];
  autoSave?: boolean;
}

/**
 * ─── Error Response Type ──────────────────────────────────────────────────────
 */

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

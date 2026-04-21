import type { AutomationAction } from '../types/api';

/**
 * ─── Mock Automations Database ────────────────────────────────────────────────
 *
 * This is a mock/demo implementation. In a real application, these would come
 * from an API endpoint that returns available automation integrations.
 */

const AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: 'send-email',
    name: 'Send Email',
    description: 'Send an email to specified recipients',
    category: 'email',
    icon: '📧',
    parameters: [
      {
        id: 'recipients',
        name: 'Email Recipients',
        type: 'string',
        required: true,
      },
      {
        id: 'subject',
        name: 'Subject',
        type: 'string',
        required: true,
      },
      {
        id: 'template',
        name: 'Email Template',
        type: 'select',
        required: true,
        options: ['Welcome', 'Notification', 'Confirmation', 'Custom'],
      },
    ],
  },

  {
    id: 'slack-notification',
    name: 'Send Slack Message',
    description: 'Send a notification to a Slack channel',
    category: 'notification',
    icon: '💬',
    parameters: [
      {
        id: 'channel',
        name: 'Slack Channel',
        type: 'select',
        required: true,
        options: ['#general', '#engineering', '#hr', '#approvals'],
      },
      {
        id: 'message',
        name: 'Message',
        type: 'string',
        required: true,
      },
      {
        id: 'mention-user',
        name: 'Mention User',
        type: 'string',
        required: false,
      },
    ],
  },

  {
    id: 'create-ticket',
    name: 'Create Support Ticket',
    description: 'Create a ticket in the support system',
    category: 'integration',
    icon: '🎫',
    parameters: [
      {
        id: 'title',
        name: 'Ticket Title',
        type: 'string',
        required: true,
      },
      {
        id: 'priority',
        name: 'Priority',
        type: 'select',
        required: true,
        options: ['Low', 'Medium', 'High', 'Critical'],
      },
      {
        id: 'assignee',
        name: 'Assignee',
        type: 'string',
        required: false,
      },
      {
        id: 'tags',
        name: 'Tags',
        type: 'string',
        required: false,
      },
    ],
  },

  {
    id: 'data-transformation',
    name: 'Transform Data',
    description: 'Apply transformations to workflow data',
    category: 'transformation',
    icon: '⚙️',
    parameters: [
      {
        id: 'operation',
        name: 'Operation',
        type: 'select',
        required: true,
        options: ['Aggregate', 'Filter', 'Map', 'Sort', 'Deduplicate'],
      },
      {
        id: 'input-field',
        name: 'Input Field',
        type: 'string',
        required: true,
      },
      {
        id: 'output-field',
        name: 'Output Field',
        type: 'string',
        required: true,
      },
    ],
  },
];

/**
 * ─── API Functions ────────────────────────────────────────────────────────────
 */

/**
 * Fetch all available automation actions
 * Simulates: GET /api/automations
 */
export async function fetchAutomationActions(): Promise<AutomationAction[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return AUTOMATION_ACTIONS;
}

/**
 * Fetch a single automation action by ID
 * Simulates: GET /api/automations/{id}
 */
export async function fetchAutomationAction(
  id: string
): Promise<AutomationAction | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return AUTOMATION_ACTIONS.find((a) => a.id === id) ?? null;
}

/**
 * Filter automation actions by category
 * Simulates: GET /api/automations?category={category}
 */
export async function fetchAutomationsByCategory(
  category: AutomationAction['category']
): Promise<AutomationAction[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return AUTOMATION_ACTIONS.filter((a) => a.category === category);
}

/**
 * Search automation actions by name
 * Simulates: GET /api/automations/search?q={query}
 */
export async function searchAutomations(query: string): Promise<AutomationAction[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const lowerQuery = query.toLowerCase();
  return AUTOMATION_ACTIONS.filter(
    (a) =>
      a.name.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get categories of available automations
 */
export function getAutomationCategories(): AutomationAction['category'][] {
  const categories = new Set(AUTOMATION_ACTIONS.map((a) => a.category));
  return Array.from(categories);
}

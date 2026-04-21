import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { NodeData } from '../types/nodes';
import { useWorkflowStore } from '../store/workflowStore';

/**
 * ─── useDrop Hook ─────────────────────────────────────────────────────────────
 *
 * Handles drag-and-drop from the node palette sidebar to the React Flow canvas.
 * Converts screen coordinates to flow canvas coordinates and creates new nodes.
 */

export function useDrop() {
  const { screenToFlowPosition } = useReactFlow();
  const { addNode } = useWorkflowStore();

  /**
   * Handle drag over canvas — allow drop by preventing default behavior
   */
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handle drop — extract node kind from drag data and create node at drop position
   */
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // Get the node type from the drag data
      const nodeTypeJson = event.dataTransfer.getData('application/node');

      // Validate we have node type data
      if (!nodeTypeJson) {
        console.warn('No node type data in drop event');
        return;
      }

      // Parse node kind from drag data
      let nodeKind: NodeData['kind'];
      try {
        const nodeData = JSON.parse(nodeTypeJson);
        nodeKind = nodeData.kind;
      } catch (error) {
        console.error('Failed to parse node data:', error);
        return;
      }

      // Convert screen position to flow canvas position
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create new node at the drop position
      try {
        addNode(nodeKind, position);
      } catch (error) {
        console.error('Failed to add node:', error);
      }
    },
    [screenToFlowPosition, addNode]
  );

  return { onDragOver, onDrop };
}

# HR Workflow Web Prototype Model

A professional, high-fidelity web-type prototype for designing and modeling HR workflows. Built with React and TypeScript, leveraging the power of [React Flow (@xyflow/react)](https://reactflow.dev/) for a smooth, interactive canvas experience.

## 🚀 Overview

This prototype serves as a foundational model for complex HR process automation. It allows users to visualize and structure workflows using a library of specialized nodes tailored for HR tasks, approvals, and automated steps.

## ✨ Key Features

- **Interactive Canvas**: High-performance drag-and-drop workspace powered by `@xyflow/react`.
- **Specialized HR Node Library**:
  - 🟢 **Start Node**: Defines the entry point of the process.
  - 🔵 **Task Node**: Represents human-centric tasks or assignments.
  - 🟠 **Approval Node**: Handles decision points and multi-level approvals.
  - 🟣 **Automated Step**: Models system integrations and automated actions.
  - 🔴 **End Node**: Marks process completion.
- **Dynamic Configuration**: Context-aware `ConfigPanel` for editing node properties.
- **Simulation Sandbox**: `SandboxPanel` for validating and testing workflow logic.
- **Professional Aesthetics**: Custom-styled components with a modern, dark-themed UI.
- **Navigation Tools**: Integrated Minimap and Background grids for complex layouts.

## 🛠️ Technology Stack

- **Framework**: React 18+
- **Language**: TypeScript
- **Canvas Engine**: [@xyflow/react](https://www.npmjs.com/package/@xyflow/react)
- **State Management**: Zustand
- **Styling**: CSS-in-JS (React Inline Styles)

## 📁 Project Structure

```text
├── src/
│   ├── api/          # Simulation and automation endpoints logic
│   ├── components/   # UI nodes and panels (extracted to root in this prototype)
│   ├── hooks/        # Custom hooks for drag-and-drop and validation
│   ├── store/        # Zustand workflow state management
│   └── types/        # TypeScript interfaces for nodes and workflows
├── WorkflowCanvas.tsx # Main entry point for the designer
└── ...node-components # Individual React components for each node type
```

## 🧪 Getting Started

This project is a component-level prototype. To integrate it into your application:

1. Install dependencies:
   ```bash
   npm install @xyflow/react zustand lucide-react
   ```
2. Import `WorkflowCanvas.tsx` into your main application layout.
3. Ensure the `workflowStore` is correctly initialized in your project's store directory.

---
Created by **Anish Choudhary** | April 2026

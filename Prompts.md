# TaskMatrix — AI Prompts and Architecture Decisions

## 1. Purpose

This document records the AI-assisted planning questions, architectural considerations, and decisions for the TaskMatrix Agile Project Management capstone.

Sprint 13 is focused on planning and documentation. Functional application development has not started as part of this planning phase.

## 2. Project and Track Selection

- **Project:** TaskMatrix — Agile Project Management
- **Track:** Frontend Specialist
- **Framework:** Next.js with App Router
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Global State:** Zustand

## 3. Planning Prompts

### Prompt 1 — Product Requirements

**Prompt:**

Help define a product requirements document for TaskMatrix, a lightweight Agile project management application. Identify target users, the problem statement, MVP features, feature priorities, non-functional requirements, and features that should remain outside the initial scope.

**Planning outcome:**

The MVP will focus on project overview, Kanban task management, task assignment, priorities, due dates, search, and filtering. Advanced collaboration and AI features will remain future enhancements.

### Prompt 2 — Frontend Architecture

**Prompt:**

Propose a maintainable frontend architecture for TaskMatrix using Next.js App Router, JavaScript, Tailwind CSS, reusable UI components, and Zustand. Explain the responsibilities of pages, components, state, and the data-access layer.

**Planning outcome:**

Pages will organize application routes, reusable components will provide consistent UI, Zustand will manage shared client-side state, and a separate data-access layer will help support future API integration.

### Prompt 3 — Global State Design

**Prompt:**

Design a Zustand state tree for TaskMatrix. Include projects, tasks, team members, filters, activity history, and UI state. Explain which information belongs in global state and how components can access it.

**Planning outcome:**

The proposed store will contain `projects`, `tasks`, `teamMembers`, `filters`, `activity`, and `uiState`. The state tree will be documented in a Mermaid diagram.

### Prompt 4 — Mock API Contracts

**Prompt:**

Define REST-style mock API endpoints for managing projects, project tasks, task records, team members, and task activity. Include HTTP methods and endpoint paths without claiming that the endpoints are implemented.

**Planning outcome:**

The planned endpoints are documented in `README.md`. They will guide future implementation and API integration.

### Prompt 5 — Responsive UI/UX

**Prompt:**

Plan responsive wireframes for a project management dashboard, Kanban board, and task details view. Identify important desktop and mobile layout differences, navigation patterns, task-card information, and common interface states.

**Planning outcome:**

The wireframe plan includes desktop and mobile layouts for the Dashboard, Kanban Board, and Task Details views. Loading, empty, and error states will be considered.

### Prompt 6 — MVP Scope and Roadmap

**Prompt:**

Organize the TaskMatrix feature list into P0, P1, and P2 priorities. Keep Sprint 13 limited to planning deliverables and propose a phased roadmap for MVP implementation, CRUD functionality, integration, polish, and deployment.

**Planning outcome:**

Sprint 13 will produce planning documentation and design artifacts. Functional development and deployment are scheduled for later sprints according to the project roadmap.

### Prompt 7 — Persistence Strategy

**Prompt:**

Compare mock data with LocalStorage against a backend persistence option for an initial frontend-focused project. Recommend a simple starting approach that can be extended later.

**Planning outcome:**

Mock data with LocalStorage is the proposed initial approach for the MVP. The final persistence strategy will be reviewed during implementation.

## 4. Architecture Decisions

| Decision | Planned approach | Reason |
|---|---|---|
| Framework | Next.js App Router | Required frontend framework |
| Language | JavaScript | Keeps the initial implementation approachable |
| Styling | Tailwind CSS | Supports responsive UI development |
| Global state | Zustand | Provides shared state for tasks and projects |
| Initial data | Mock data and LocalStorage | Supports early frontend development |
| API design | Planned REST-style endpoints | Establishes a clear future integration contract |
| Wireframes | Figma | Documents desktop and mobile layouts |
| Diagram | Mermaid | Makes architecture easy to maintain in text form |

## 5. Scope Boundaries

The initial MVP will not include payment processing, video conferencing, enterprise single sign-on, or complex automation.

Real-time updates, notifications, analytics, and AI-powered summaries are considered future enhancements rather than confirmed MVP functionality.

## 6. Status and Next Steps

**Current phase:** Sprint 13 — Planning

- [x] Project and frontend track selected
- [x] Initial PRD drafted in `README.md`
- [ ] Desktop and mobile wireframes created in Figma
- [ ] Public Figma link added to `README.md`
- [ ] State architecture diagram exported and embedded in `README.md`
- [ ] Planning documents reviewed before Sprint 13 submission

This document records planned approaches and AI-assisted planning questions. It does not claim that the application, API endpoints, or diagrams have already been implemented.

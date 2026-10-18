# TaskMatrix — Agile Project Management

## 1. Project Overview

TaskMatrix is a web-based Agile project management application designed to help teams organize projects, assign tasks, track progress, and manage deadlines through a simple and responsive Kanban board.

The project is being developed as part of the Prodesk IT Capstone. This Sprint 13 submission focuses on product planning, UI/UX wireframes, frontend architecture, state management, and technical documentation. Functional application development will begin in the following sprint.

## 2. Problem Statement

Teams often struggle to manage tasks across different projects, understand current work status, track deadlines, and identify pending tasks. TaskMatrix aims to provide a centralized workspace where users can view projects, organize tasks by status, assign team members, and monitor progress.

## 3. Project Goals

- Provide a clear dashboard for project and task overview.
- Organize tasks using a Kanban board.
- Support task creation, editing, assignment, and deletion.
- Allow users to search, filter, and sort tasks.
- Provide a responsive experience on desktop, tablet, and mobile.
- Maintain a clear and scalable frontend architecture.

## 4. Target Users

- Project managers who organize work and monitor progress.
- Developers and designers who manage assigned tasks.
- Small teams following Agile workflows.
- Students coordinating group projects and assignments.

## 5. Project Track

**Selected Project:** TaskMatrix — Agile Project Management  
**Selected Track:** Frontend Specialist

The primary focus is frontend development, reusable components, responsive design, client-side state management, and integration with planned API endpoints.

## 6. Core Features and Priorities

### P0 — Core MVP Features

- Dashboard with project and task summaries.
- Project listing and project details.
- Kanban board with To Do, In Progress, and Done columns.
- Create, view, edit, and delete tasks.
- Assign tasks to team members.
- Task priority and due-date fields.
- Search and filter tasks by status and priority.
- Client-side state management and persistence.

### P1 — Usability Improvements

- Task details panel.
- Responsive mobile navigation and layouts.
- Loading, empty, and error states.
- Deadline indicators.
- Task activity history.
- Sorting and improved filtering controls.

### P2 — Future Enhancements

- Real-time task updates.
- In-app notifications.
- Project analytics.
- Optional AI-powered task summaries.

P2 features are outside the initial MVP scope unless time permits.

## 7. Technology Stack

- **Framework:** Next.js with App Router
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Global State:** Zustand
- **Icons:** Lucide
- **Initial Persistence:** Mock data with LocalStorage
- **Planned API Integration:** Next.js Route Handlers
- **Design and Wireframes:** Figma
- **Architecture Diagrams:** Mermaid
- **Version Control:** Git and GitHub
- **Deployment Target:** Vercel

The final persistence approach will be reviewed during implementation. Mock data and LocalStorage will be used for the initial MVP unless the project requirements require a different solution.

## 8. Planned Application Screens

### 8.1 Dashboard

- Overview of projects and tasks.
- Task counts by status.
- Upcoming

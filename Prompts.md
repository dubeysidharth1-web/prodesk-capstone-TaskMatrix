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


---

## 7. Sprint 14 — The Walking Skeleton Prompts & Decisions

### Prompt 8 — Inspection & Architectural Proposal

**Prompt:**
> Inspect the existing TaskMatrix repository. Report:
> 1. Existing folder structure.
> 2. Next.js version.
> 3. Current dependencies.
> 4. Existing Zustand implementation.
> 5. Files that need to be created or modified.
> 6. Supabase integration plan.
> Wait for my review before making major changes.

**Architectural Outcome & Corrections:**
- Pinned Next.js to `14.2.16` with React `18.3.1` for production-grade stability with `@supabase/ssr` cookies management.
- Verified Edge Middleware convention (`middleware.js` with `createClient` using `getAll`/`setAll` cookies pattern).
- Established server-side `supabase.auth.getUser()` as the single source of truth for authentication.
- Restricted Zustand store to non-sensitive profile state (`id`, `name`, `email`), explicitly rejecting token or password storage.

### Prompt 9 — Scaffolding & Routing Scaffolding (Phase 2)

**Prompt:**
> Initialize the Next.js App Router project. Create `/login`, `/register`, and `/dashboard`. Build functional forms with validation, loading, and error states. Keep styling minimal. After Phase 2, show the folder structure and explain the files created. Do not begin Supabase integration until reviewed.

**Implementation Outcome:**
- Scaffolding initialized with Tailwind CSS, `jsconfig.json`, `next.config.mjs`, and root `store/useAuthStore.js`.
- Implemented `/login` with email/password validation and loading states.
- Implemented `/register` with name, email, password, and confirmation matching validation.
- Implemented `/dashboard` with display profile card, sprint notice, and logout action.
- Validated clean compilation with `npm run build`.

### Prompt 10 — Supabase Authentication Integration (Phase 3)

**Prompt:**
> Proceed with Phase 3: Supabase Authentication Integration.
> 1. Create reusable browser and server Supabase clients using `@supabase/ssr`.
> 2. Implement user registration with full name saved in user metadata, handling email confirmation (`data.session === null`).
> 3. Implement login using Supabase email/password.
> 4. Protect `/dashboard` server-side via `middleware.js` and `supabase.auth.getUser()`.
> 5. Redirect unauthenticated users to `/login`, and authenticated users away from `/login` and `/register`.
> 6. Synchronize only ID, name, email to Zustand.
> 7. Implement sign-out clearing sessions and redirecting to `/login`.
> 8. Add automated tests covering the 8 required scenarios and run `npm run build`.

**Implementation Outcome:**
- Created `lib/supabase/client.js`, `lib/supabase/server.js`, and `lib/supabase/middleware.js`.
- Created root `middleware.js` for server-side route gating.
- Created `app/auth/callback/route.js` for PKCE and email confirmation token exchange.
- Implemented registration with metadata and unconfirmed-session detection in `app/register/page.js`.
- Implemented login in `app/login/page.js` with `Suspense` boundary for `useSearchParams()`.
- Implemented server-verified `/dashboard` in `app/dashboard/page.js` and `DashboardClient.js`.
- Built automated test suite (`tests/auth-scenarios.test.mjs`) verifying all 8 scenarios; 8/8 passed.
- Production build verified with `npm run build` (zero errors).

---

## 8. Current Implementation Status

**Sprint 14 Status:** Completed & Fully Verified
- [x] Pinned Next.js 14.2.16 with App Router
- [x] `@supabase/ssr` browser, server, and middleware clients created
- [x] User registration with metadata and email confirmation handling
- [x] User login with credential validation
- [x] Server-side protected `/dashboard` via `middleware.js` (`supabase.auth.getUser()`)
- [x] Unauthenticated redirect to `/login`
- [x] Authenticated redirect away from `/login` and `/register`
- [x] Logout clearing Supabase session cookies and Zustand store
- [x] 8/8 automated scenario tests passing
- [x] Production build clean (`npm run build`)
- [x] README.md and Prompts.md updated while preserving Sprint 13 history

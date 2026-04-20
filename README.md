# Skemap

A full-stack project management app built with Next.js and Express. Organizes work in a `Project → Epic → Task → Acceptance Criteria` hierarchy with real-time status tracking and optimistic UI.

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router) + React 19
- TypeScript — strict mode
- Tailwind CSS 4
- SWR 2 + Axios — data fetching with optimistic updates
- Easy-peasy 6 — global auth state
- Framer Motion — animations
- React Hook Form 7 + Zod 4 — form validation

**Backend**
- Express 5 + TypeScript
- Prisma 7 ORM + PostgreSQL 16
- JWT authentication + bcrypt
- Zod 4 — request validation at every boundary

**Infrastructure**
- Docker + Docker Compose (full local dev environment with hot-reload via `compose watch`)

---

## Features

- **Authentication** — signup/login with JWT and bcrypt-hashed passwords
- **Project management** — create, edit, delete projects with color coding, tech stack tags, and status (`ACTIVE`, `COMPLETED`, `ARCHIVED`); filter by status and search by name
- **Epic board** — collapsible epics with ordered tasks and progress tracking (`X/Y tasks done`)
- **Task management** — priority levels (`LOW`, `MEDIUM`, `HIGH`), due dates, per-task tech tags, and acceptance criteria checklists
- **Task status cycling** — click a badge to advance through `To Do → In Progress → In Review → Done → To Do`, with instant optimistic updates that revert automatically on failure
- **Real-time counters** — epic and project task counts stay in sync across all components on every status change, without a page refresh
- **Profile page** — user profile view

---

## Architecture highlights

- **Clean separation of concerns** — routes → controllers → services → Prisma. Controllers handle HTTP and validation; services own business logic and ownership checks.
- **Optimistic UI** — task status changes update the SWR cache immediately across all consuming components (badge, epic counter, project counter) and roll back on API errors.
- **Cascade deletes** — deleting a project cleans up all epics, tasks, and acceptance criteria at the database level via Prisma's `onDelete: Cascade`.
- **Ownership validation** — every mutation verifies the authenticated user owns the resource before allowing changes, preventing horizontal privilege escalation.
- **Zod schemas at every boundary** — path params, query params, and request bodies are all validated before touching the database.

---

## Running locally

```bash
git clone https://github.com/diegogp27/skemap.git
cd skemap

# Create a .env file at the root (see variables below)
cp .env .env.local   # or create manually

docker compose watch
```

**Required environment variables (`.env` at root):**

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=skemap
JWT_SECRET=your_secret_here

# Optional — override default external ports
FRONT_PORT=5004
BACK_PORT=4004
```

| Service   | Default URL            |
|-----------|------------------------|
| Frontend  | http://localhost:5004  |
| Backend   | http://localhost:4004  |

---

## Data model

```
User
└── Project  (color, status, technologies[])
    └── Epic  (color, ordered)
        └── Task  (status, priority, dueDate, technologies[])
            └── AcceptanceCriteria  (text, done, ordered)
```

---

## Project structure

```
skemap/
├── front/
│   ├── app/
│   │   ├── auth/           # Login / Signup
│   │   ├── home/           # Project list
│   │   ├── profile/        # User profile
│   │   └── projects/[id]/  # Project board (epics + tasks)
│   └── src/                # Business logic per module
│       ├── auth/           # Auth hooks, services, types
│       ├── home/           # Project list hooks, services, types
│       ├── projects/       # Epic/task hooks, services, types
│       └── shared/         # Shared components and utilities
├── back/
│   └── src/
│       ├── modules/        # Feature modules: auth, projects, epics, tasks
│       ├── middlewares/    # JWT auth middleware
│       ├── errors/         # Custom error hierarchy (consistent API responses)
│       └── lib/            # Prisma client, config
├── docs/                   # Architecture and design notes
└── docker-compose.yml
```

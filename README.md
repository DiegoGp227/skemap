# Skemap

A full-stack project management app built with Next.js and Express. Organizes work in a `Project → Epic → Task` hierarchy with real-time status tracking.

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router) + React 19
- TypeScript — strict mode
- Tailwind CSS 4
- SWR for data fetching with optimistic updates
- Framer Motion for animations
- React Hook Form + Zod validation

**Backend**
- Express 5 + TypeScript
- Prisma ORM + PostgreSQL 16
- JWT authentication + bcrypt
- Zod for request validation

**Infrastructure**
- Docker + Docker Compose (full local dev environment with hot-reload)

---

## Features

- **Authentication** — signup/login with JWT and hashed passwords
- **Project management** — create, edit, delete projects with color coding and tech tags; filter by status and search by name
- **Epic board** — collapsible epics with progress tracking (`X/Y tasks done`)
- **Task status cycling** — click a badge to advance through `To Do → In Progress → In Review → Done → To Do`, with instant optimistic updates that revert automatically on failure
- **Real-time counters** — epic and project task counts update in sync with every status change, no page refresh needed

---

## Architecture highlights

- **Clean separation of concerns** — routes → controllers → services → Prisma. Controllers handle HTTP and validation; services handle business logic and ownership checks.
- **Optimistic UI** — task status changes update the SWR cache immediately across all components (badge, epic counter, project counter) and roll back on API errors.
- **Cascade deletes** — deleting a project cleans up all its epics and tasks at the database level.
- **Ownership validation** — every mutation verifies the authenticated user owns the resource before allowing changes, preventing horizontal privilege escalation.
- **Zod schemas at every boundary** — path params, query params, and request bodies are all validated before touching the database.

---

## Running locally

```bash
git clone https://github.com/your-username/skemap.git
cd skemap
cp .env.example .env
docker compose watch
```

| Service   | URL                   |
|-----------|-----------------------|
| Frontend  | http://localhost:3000 |
| Backend   | http://localhost:8000 |

---

## Project structure

```
skemap/
├── front/                  # Next.js App Router
│   ├── app/                # Pages and components
│   └── src/                # Hooks, services, types (per module)
├── back/
│   ├── src/
│   │   ├── modules/        # Feature modules (controllers + services + schema)
│   │   ├── middlewares/    # JWT auth middleware
│   │   └── errors/         # Custom error hierarchy with consistent API responses
│   └── prisma/
│       └── schema.prisma
└── docker-compose.yml
```

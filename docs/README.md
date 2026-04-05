# Skemap — Documentación general

Gestor de proyectos con jerarquía `User → Project → Epic → Task`.

Cada feature se desarrolla de punta a punta (back + front) antes de pasar al siguiente.

---

## Stack

| Capa        | Tecnología                                          |
|-------------|-----------------------------------------------------|
| Frontend    | Next.js 15, React 19, TypeScript 5, Tailwind CSS 4  |
| Animaciones | Framer Motion 12                                    |
| Formularios | React Hook Form 7                                   |
| Fetching    | SWR 2 + Axios                                       |
| Estado      | Easy-peasy 6 (auth global)                          |
| Backend     | Express 5, TypeScript                               |
| ORM         | Prisma 7 + PostgreSQL 16                            |
| Validación  | Zod 4                                               |
| Auth        | JWT (access token) + bcrypt                         |
| Infra       | Docker + Docker Compose                             |

---

## Levantar el proyecto

```bash
# Desde la raíz
docker compose up --build

# Con hot-reload (Docker Compose Watch)
docker compose watch
```

| Servicio  | Puerto por defecto |
|-----------|--------------------|
| Frontend  | 3000               |
| Backend   | 8000               |
| Postgres  | 5432               |

Variables de entorno en `.env` en la raíz. El compose las inyecta en cada servicio.

---

## Arquitectura

```
skemap/
├── front/                  # Next.js App Router
│   ├── app/                # Páginas y componentes por ruta
│   │   ├── auth/           # Login / Signup
│   │   ├── home/           # Lista de proyectos
│   │   └── projects/[id]/  # Vista de board del proyecto
│   └── src/                # Lógica por módulo (hooks, services, types)
│       ├── auth/
│       ├── home/
│       ├── projects/
│       └── shared/
└── back/
    ├── src/
    │   ├── modules/        # projects/ (controllers + services + schema)
    │   ├── middlewares/    # auth middleware (JWT)
    │   ├── errors/         # Jerarquía de AppError
    │   ├── routes/         # index.routes.ts (único archivo de rutas)
    │   └── db/             # Cliente Prisma
    └── prisma/
        └── schema.prisma
```

### Patrón en backend

```
Request → Route → authMiddleware → Controller → Service → Prisma → DB
```

- **Controller**: valida params/body con Zod, maneja errores HTTP.
- **Service**: lógica de negocio, verifica ownership del recurso antes de mutar.
- **Schema**: definiciones Zod reutilizables por módulo.

### Patrón en frontend

```
Page → hook (useSWR) → service (axios) → API
             ↓
          mutate() con update optimista
```

Los hooks exponen `data`, `loading`, `error` y funciones de mutación. Los servicios solo hacen la llamada HTTP.

---

## Endpoints implementados

### Auth
| Método | Ruta            | Descripción         |
|--------|-----------------|---------------------|
| POST   | `/api/signup`   | Registro de usuario |
| POST   | `/api/login`    | Login               |

### Projects
| Método | Ruta                       | Descripción                              |
|--------|----------------------------|------------------------------------------|
| GET    | `/api/projects`            | Lista proyectos del usuario              |
| POST   | `/api/projects`            | Crear proyecto                           |
| GET    | `/api/projects/:id`        | Obtener proyecto                         |
| PATCH  | `/api/projects/:id`        | Editar proyecto                          |
| DELETE | `/api/projects/:id`        | Eliminar proyecto (cascade)              |
| GET    | `/api/projects/:id/board`  | Board completo (epics + tasks)           |
| GET    | `/api/projects/stats`      | Conteo de proyectos por estado           |

### Tasks
| Método | Ruta                    | Descripción                     |
|--------|-------------------------|---------------------------------|
| PATCH  | `/api/tasks/:id/status` | Cambiar estado de una tarea     |

### Pendientes
```
❌ POST   /api/projects/:id/epics       — crear epic
❌ PATCH  /api/epics/:id                — editar epic
❌ DELETE /api/epics/:id                — eliminar epic
❌ PATCH  /api/epics/:id/order          — reordenar epic
❌ POST   /api/epics/:id/tasks          — crear task
❌ PATCH  /api/tasks/:id                — editar task (título, descripción, prioridad, fecha)
❌ DELETE /api/tasks/:id                — eliminar task
❌ PATCH  /api/tasks/:id/order          — reordenar task
❌ POST   /api/auth/refresh             — refresh token
❌ POST   /api/auth/logout              — logout
```

---

## Estado actual de features

### Feature 1 — Auth ✅ funcional (parcial)
- Signup y login funcionan con bcrypt + JWT.
- **Pendiente**: refresh token, logout, token en memoria en lugar de localStorage.
- El token actualmente vive en localStorage (ver nota de seguridad abajo).

### Feature 2 — Proyectos ✅ completa
- CRUD completo de proyectos.
- Filtros por status, búsqueda por nombre.
- Conteo de tasks y progreso en cada card.

### Feature 3 — Epics ⚠️ solo lectura
- Se visualizan en el board con sus tasks.
- No hay endpoints ni UI para crear, editar ni eliminar epics.

### Feature 4 — Tasks ⚠️ parcial
- Se visualizan dentro de cada epic.
- El status badge es clickeable y cicla: `TODO → IN_PROGRESS → IN_REVIEW → DONE → TODO`.
- Update optimista: el badge cambia al instante y se revierte si el backend falla.
- **Pendiente**: crear, editar, eliminar tasks; panel de detalle; prioridad; fecha.

---

## Ciclo de estados de una tarea

```
TODO → IN_PROGRESS → IN_REVIEW → DONE → TODO (vuelve a empezar)
```

El cambio de estado actualiza también el contador `tasksDone` del epic y del proyecto en el cache de SWR sin re-fetch.

> Plan futuro: cuando existan roles, solo el rol `tester` podrá mover de `IN_REVIEW` a `DONE`. Por ahora cualquier usuario puede ciclar libremente (MVP).

---

## Deuda técnica y problemas conocidos

### Crítico — resolver antes de cualquier deploy real

1. **JWT secret sin validación**
   ```ts
   // back/src/modules/auth/auth.services.ts
   process.env.JWT_SECRET || "default_secret"  // ← firmará tokens con texto plano si falta el .env
   ```
   Debe lanzar error al arrancar si `JWT_SECRET` no está definido.

2. **Token en localStorage**
   El plan original (ver `auth-system.md`) era token en memoria + refresh token en cookie httpOnly. La implementación actual usa localStorage, que es vulnerable a XSS. Pendiente de migrar cuando se implemente el refresh token.

3. **Sin rate limiting**
   Los endpoints `/signup` y `/login` no tienen límite de intentos. Vulnerable a fuerza bruta. Agregar `express-rate-limit` como middleware.

### Importante

4. **Sin tests**
   El script `test` en `package.json` está vacío. No hay cobertura de ningún tipo.

5. **`prisma db push` en lugar de migraciones**
   `db push` es destructivo en producción (puede eliminar columnas). Migrar a `prisma migrate deploy` antes de cualquier entorno con datos reales.

6. **Tipos del frontend desincronizados**
   `front/src/auth/types/auth.types.ts` define campos (`currency`, `cutoffDay`, `role`) que el backend nunca retorna. Probablemente heredados de otro proyecto. Limpiarlos.

7. **Sin logging estructurado**
   Todos los errores van a `console.error` directamente. En producción se pierde contexto. Agregar Pino o Winston.

### Menor

8. **Typo en nombre de archivos**: `*.shema.ts` → debería ser `*.schema.ts` (en auth y projects).
9. **Typo en nombres de componentes**: `ProjectSistem`, `HomeSistem`, `AuthSistem` → `System` con Y.
10. **Sin Helmet.js**: no se configuran security headers (X-Frame-Options, CSP, etc.).
11. **CORS hardcodeado**: los orígenes permitidos están en el código. Debería leerse de variable de entorno en producción.

---

## Modelo de datos

```
User
├── id, name, username, email, password
└── projects[]
    └── Project
        ├── id, name, description, color, status, technologies[]
        └── epics[]
            └── Epic
                ├── id, name, description, color, order
                └── tasks[]
                    └── Task
                        ├── id, title, description, status, priority, order, dueDate
                        └── (status: TODO | IN_PROGRESS | IN_REVIEW | DONE)
```

Cascade delete configurado: eliminar un proyecto elimina sus epics y tasks. Eliminar un epic elimina sus tasks.

---

## Convenciones

- Los servicios siempre verifican ownership (`project.ownerId === req.user.id`) antes de mutar. Nunca confiar solo en el ID del param.
- Los controllers validan con Zod antes de llamar al servicio. El servicio no valida formato, solo lógica de negocio.
- Las respuestas de error siempre tienen la forma `{ status, code, message, details?, timestamp }`.
- En el frontend, las mutaciones usan update optimista: se actualiza el cache de SWR inmediatamente y se revierte con `mutate()` si el backend falla.

---

## Roadmap

```
[x] Auth básico (login + signup)
[x] CRUD de proyectos
[x] Board: visualizar epics y tasks
[x] Cambio de estado de task (ciclo + update optimista)
[ ] CRUD de epics
[ ] CRUD completo de tasks (crear, editar, eliminar, reordenar)
[ ] Panel de detalle de task
[ ] Refresh token + token en memoria
[ ] Rate limiting en auth
[ ] Roles (tester: único que puede mover IN_REVIEW → DONE)
[ ] Tests
[ ] Migraciones de Prisma en lugar de db push
```

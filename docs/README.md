# Skemap — Plan de desarrollo

Gestor de proyectos con jerarquía `User → Project → Epic → Task`.

Cada feature se desarrolla de punta a punta (back + front) antes de pasar al siguiente.

---

## Feature 1 — Auth

**Back**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- Middleware JWT para rutas protegidas

**Front**
- Páginas de login y registro
- Contexto de auth con access token en memoria (no localStorage)
- Axios interceptor con refresh automático al recibir 401
- Rutas protegidas con redirect a login

---

## Feature 2 — Proyectos (Home)

**Back**
- `GET /api/projects` — lista proyectos del usuario con conteo de epics y progreso de tasks
- `POST /api/projects` — crear proyecto (nombre, descripción, color, status)
- `PATCH /api/projects/:id` — editar proyecto
- `DELETE /api/projects/:id` — eliminar proyecto (cascade a epics y tasks)

**Front**
- Home con grid de cards de proyectos
- Filtros por status (Todos, Activos, Completados, Archivados)
- Buscador por nombre/descripción
- Modal "Nuevo proyecto" (nombre, descripción, color)
- Empty state cuando no hay proyectos

---

## Feature 3 — Epicas

**Back**
- `GET /api/projects/:id/epics` — lista epicas del proyecto con conteo de tasks
- `POST /api/projects/:id/epics` — crear epica (nombre, descripción, color, order)
- `PATCH /api/epics/:id` — editar epica
- `DELETE /api/epics/:id` — eliminar epica (cascade a tasks)
- `PATCH /api/epics/:id/order` — reordenar

**Front**
- Vista del proyecto con sidebar (nav de epicas + progreso general)
- Lista de epicas colapsables en el area principal
- Crear / editar / eliminar epica

---

## Feature 4 — Tasks

**Back**
- `GET /api/epics/:id/tasks` — lista tasks de la epica
- `POST /api/epics/:id/tasks` — crear task (titulo, descripcion, status, priority, dueDate, order)
- `PATCH /api/tasks/:id` — editar campos de la task
- `DELETE /api/tasks/:id` — eliminar task
- `PATCH /api/tasks/:id/order` — reordenar

**Front**
- Tasks listadas dentro de cada epica (colapsables)
- Status badge clickeable para cambiar estado
- Panel lateral de detalle al seleccionar una task (titulo, status, prioridad, descripcion, fecha)
- Crear / editar / eliminar task

---

## Orden de desarrollo

```
Feature 1 (Auth) → Feature 2 (Proyectos) → Feature 3 (Epicas) → Feature 4 (Tasks)
```

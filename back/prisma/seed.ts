// =============================================================================
// Skemap — Seed de desarrollo
//
// Ejecutar: pnpm prisma:seed
//
// Crea un usuario demo con dos proyectos completos:
//   1. Skemap          — la propia app (ACTIVE)
//   2. StockFlow ERP   — sistema de inventario estilo SAP (COMPLETED)
//
// El seed es idempotente: elimina los datos del usuario demo antes de recrearlos.
// Credenciales demo: demo@skemap.dev / demo1234
// =============================================================================

import "dotenv/config";
import { PrismaClient, TaskStatus, TaskPriority, ProjectStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEMO_EMAIL = "demo@skemap.dev";

/** Convierte días relativos al día de hoy en un Date. Negativo = pasado. */
const daysFromNow = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

// ---------------------------------------------------------------------------
// Tipos internos del seed
// ---------------------------------------------------------------------------

type ACSeed = { text: string; done: boolean };

type TaskSeed = {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  technologies?: string[];
  dueDate?: Date;
  ac?: ACSeed[];
};

type EpicSeed = {
  name: string;
  description?: string;
  color: string;
  tasks: TaskSeed[];
};

type ProjectSeed = {
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  technologies: string[];
  epics: EpicSeed[];
};

// =============================================================================
// PROYECTO 1 — Skemap (Project Management Tool)
// =============================================================================

const skeMapProject: ProjectSeed = {
  name: "Skemap",
  description:
    "Herramienta de gestión de proyectos orientada a desarrolladores. Organiza el trabajo en proyectos, epics y tasks con criterios de aceptación, prioridades y fechas límite.",
  color: "#6366f1",
  status: "ACTIVE",
  technologies: ["TypeScript", "Next.js", "Express.js", "PostgreSQL", "Prisma", "Docker", "JWT"],
  epics: [
    // -------------------------------------------------------------------------
    // Epic 1 — Auth & Seguridad
    // -------------------------------------------------------------------------
    {
      name: "Auth & Seguridad",
      description: "Registro, login, tokens JWT y protección de endpoints.",
      color: "#f97316",
      tasks: [
        {
          title: "Endpoint de registro de usuario",
          description:
            "Crear POST /auth/register con validación Zod, hash de contraseña con bcrypt y respuesta con JWT.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "Express.js", "bcryptjs", "Zod"],
          dueDate: daysFromNow(-60),
          ac: [
            { text: "Validar que el email no esté registrado previamente", done: true },
            { text: "Hashear contraseña con bcrypt (salt rounds ≥ 10)", done: true },
            { text: "Retornar JWT firmado al registrarse exitosamente", done: true },
            { text: "Retornar errores estructurados por campo (Zod)", done: true },
            { text: "Responder 409 si el email o username ya existen", done: true },
          ],
        },
        {
          title: "Login con JWT",
          description:
            "Crear POST /auth/login que valida credenciales y retorna un token firmado con expiración configurable.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "JWT", "bcryptjs"],
          dueDate: daysFromNow(-58),
          ac: [
            { text: "Validar email y contraseña correctos", done: true },
            { text: "Retornar token JWT firmado con HS256", done: true },
            { text: "Expiración del token configurable via TOKEN_EXPIRATION en .env", done: true },
            { text: "Responder 401 con mensaje genérico si las credenciales son incorrectas", done: true },
          ],
        },
        {
          title: "Middleware de autenticación",
          description:
            "Middleware que valida el JWT en el header Authorization e inyecta el userId en el objeto request.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "JWT", "Express.js"],
          dueDate: daysFromNow(-55),
          ac: [
            { text: "Rechazar requests sin header Authorization con 401", done: true },
            { text: "Rechazar tokens malformados o expirados con 401", done: true },
            { text: "Inyectar req.userId (number) para uso en controllers", done: true },
            { text: "No exponer detalles del error JWT en la respuesta", done: true },
          ],
        },
        {
          title: "Validación con Zod en todos los endpoints de auth",
          description:
            "Aplicar schemas Zod a los DTOs de registro y login para garantizar integridad de datos desde el boundary.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "Zod"],
          dueDate: daysFromNow(-53),
          ac: [
            { text: "Email con formato válido obligatorio", done: true },
            { text: "Contraseña con longitud mínima de 6 caracteres", done: true },
            { text: "Username alfanumérico, sin espacios", done: true },
            { text: "Retornar lista de errores de validación con paths claros", done: true },
          ],
        },
        {
          title: "Refresh token",
          description:
            "Implementar rotación de tokens: access token de corta duración + refresh token de larga duración guardado en cookie httpOnly.",
          status: "TODO",
          priority: "MEDIUM",
          technologies: ["TypeScript", "JWT", "Express.js"],
          dueDate: daysFromNow(14),
          ac: [
            { text: "Endpoint POST /auth/refresh que valida el refresh token", done: false },
            { text: "Access token expira en 15 minutos", done: false },
            { text: "Refresh token expira en 7 días, almacenado en cookie httpOnly", done: false },
            { text: "Rotación: cada uso del refresh token genera uno nuevo", done: false },
            { text: "Endpoint POST /auth/logout invalida el refresh token", done: false },
          ],
        },
        {
          title: "Rate limiting en /auth/login",
          description:
            "Proteger el endpoint de login contra ataques de fuerza bruta bloqueando IPs con múltiples intentos fallidos.",
          status: "TODO",
          priority: "LOW",
          technologies: ["Express.js", "express-rate-limit"],
          dueDate: daysFromNow(21),
          ac: [
            { text: "Bloquear IP tras 5 intentos fallidos en una ventana de 15 minutos", done: false },
            { text: "Retornar 429 con header Retry-After en segundos", done: false },
            { text: "El bloqueo no afecta a otros endpoints", done: false },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 2 — Módulo de Proyectos
    // -------------------------------------------------------------------------
    {
      name: "Módulo de Proyectos",
      description:
        "CRUD completo de proyectos con filtros, stats de progreso y control de estado.",
      color: "#8b5cf6",
      tasks: [
        {
          title: "CRUD completo de proyectos",
          description:
            "Endpoints REST para crear, leer, actualizar y eliminar proyectos, con verificación de ownership en cada operación.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "Prisma", "Express.js"],
          dueDate: daysFromNow(-50),
          ac: [
            { text: "POST /projects crea proyecto con nombre, color, descripción y tecnologías", done: true },
            { text: "GET /projects/:id retorna proyecto solo si pertenece al usuario autenticado", done: true },
            { text: "PATCH /projects/:id actualiza campos parcialmente (sin reemplazar todos)", done: true },
            { text: "DELETE /projects/:id elimina con cascade (epics y tasks)", done: true },
            { text: "Nombre de proyecto único por usuario (index compuesto en BD)", done: true },
          ],
        },
        {
          title: "Listado con filtros y búsqueda",
          description:
            "GET /projects con soporte para filtro por status y búsqueda case-insensitive por nombre.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-48),
          ac: [
            { text: "Query param ?status=ACTIVE|COMPLETED|ARCHIVED filtra correctamente", done: true },
            { text: "Query param ?search= hace búsqueda parcial case-insensitive", done: true },
            { text: "Se pueden combinar ambos filtros en la misma request", done: true },
            { text: "Sin filtros retorna todos los proyectos del usuario ordenados por createdAt desc", done: true },
          ],
        },
        {
          title: "Stats de tareas por proyecto (SQL raw)",
          description:
            "Agregar tasksTotal y tasksDone al listado de proyectos usando una sola query SQL raw para evitar N+1.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "PostgreSQL", "Prisma"],
          dueDate: daysFromNow(-45),
          ac: [
            { text: "Calcular tasksTotal y tasksDone en una sola query con JOIN y COUNT", done: true },
            { text: "Usar $queryRaw de Prisma con parámetros tipados", done: true },
            { text: "Manejar conversión de bigint a number (COUNT devuelve bigint en PostgreSQL)", done: true },
            { text: "Proyectos sin tareas retornan tasksTotal: 0 y tasksDone: 0", done: true },
          ],
        },
        {
          title: "Stats globales del usuario",
          description:
            "Endpoint GET /projects/stats que retorna conteo de proyectos agrupado por estado, usando groupBy de Prisma.",
          status: "DONE",
          priority: "LOW",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-42),
          ac: [
            { text: "Retornar { active, completed, archived } en una sola query", done: true },
            { text: "Usar prisma.project.groupBy (sin SQL raw)", done: true },
            { text: "Estados sin proyectos retornan 0 (no omitirlos)", done: true },
          ],
        },
        {
          title: "Cambio de estado del proyecto",
          description:
            "PATCH /projects/:id que permite cambiar el status entre ACTIVE, COMPLETED y ARCHIVED.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "Prisma", "Zod"],
          dueDate: daysFromNow(-40),
          ac: [
            { text: "Validar que status sea uno de los valores del enum ProjectStatus", done: true },
            { text: "Verificar ownership antes de actualizar", done: true },
            { text: "Retornar el proyecto actualizado", done: true },
          ],
        },
        {
          title: "Archivado masivo de proyectos completados",
          description:
            "Endpoint PATCH /projects/archive-completed que archiva todos los proyectos COMPLETED del usuario de una vez.",
          status: "TODO",
          priority: "LOW",
          dueDate: daysFromNow(30),
          ac: [
            { text: "Solo afecta proyectos del usuario autenticado", done: false },
            { text: "Retornar cantidad de proyectos archivados", done: false },
            { text: "Transacción atómica: o todos o ninguno", done: false },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 3 — Módulo de Epics
    // -------------------------------------------------------------------------
    {
      name: "Módulo de Epics",
      description:
        "Gestión de epics dentro de un proyecto: creación, edición, eliminación y progreso.",
      color: "#06b6d4",
      tasks: [
        {
          title: "Crear epic en proyecto",
          description:
            "POST /projects/:id/epics con verificación de ownership y cálculo automático del campo order.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-38),
          ac: [
            { text: "Verificar que el proyecto pertenece al usuario autenticado", done: true },
            { text: "Calcular order como (max order existente + 1) para el proyecto", done: true },
            { text: "Retornar epic completo con id, name, color, order, projectId", done: true },
            { text: "Responder 404 si el proyecto no existe o no pertenece al usuario", done: true },
          ],
        },
        {
          title: "Eliminar epic con cascade",
          description:
            "DELETE /epics/:id que elimina el epic y todas sus tasks y ACs asociadas vía cascade en Prisma.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-36),
          ac: [
            { text: "Verificar ownership del proyecto padre antes de eliminar", done: true },
            { text: "El cascade elimina tasks y acceptanceCriteria automáticamente (schema)", done: true },
            { text: "Retornar 204 No Content en caso de éxito", done: true },
            { text: "Retornar 404 si el epic no existe o no pertenece al usuario", done: true },
          ],
        },
        {
          title: "Editar epic (nombre, descripción, color)",
          description:
            "PATCH /epics/:id para actualizar nombre, descripción y color del epic con verificación de ownership.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "Prisma", "Zod"],
          dueDate: daysFromNow(-34),
          ac: [
            { text: "Actualización parcial: solo los campos enviados en el body", done: true },
            { text: "Verificar ownership del proyecto padre", done: true },
            { text: "Retornar el epic actualizado", done: true },
          ],
        },
        {
          title: "Progreso por epic (tasksTotal / tasksDone)",
          description:
            "Incluir conteo de tasks totales y completadas por epic en la respuesta del board de proyecto.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-32),
          ac: [
            { text: "Calculado en getProjectBoard sin queries adicionales (groupBy)", done: true },
            { text: "Retornar tasksTotal y tasksDone por epic en la misma respuesta", done: true },
            { text: "Epics sin tasks retornan 0/0", done: true },
          ],
        },
        {
          title: "Soporte Markdown en descripción de epic",
          description:
            "Permitir Markdown en el campo description del epic, con preview en el frontend y sanitización del HTML resultante.",
          status: "TODO",
          priority: "LOW",
          dueDate: daysFromNow(45),
          ac: [
            { text: "Backend almacena el texto Markdown sin procesar", done: false },
            { text: "Frontend renderiza Markdown con react-markdown", done: false },
            { text: "Sanitizar HTML con DOMPurify antes de renderizar", done: false },
            { text: "Toggle entre edición (raw) y preview en el formulario", done: false },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 4 — Módulo de Tasks
    // -------------------------------------------------------------------------
    {
      name: "Módulo de Tasks",
      description:
        "CRUD de tasks con criterios de aceptación, prioridades, fechas y filtros de estado.",
      color: "#10b981",
      tasks: [
        {
          title: "Crear task en epic",
          description:
            "POST /epics/:id/tasks con criterios de aceptación anidados y cálculo automático de order.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-30),
          ac: [
            { text: "Verificar ownership del epic (via proyecto)", done: true },
            { text: "Calcular order automáticamente (max order + 1 dentro del epic)", done: true },
            { text: "Crear acceptanceCriteria anidados en la misma transacción de Prisma", done: true },
            { text: "Retornar task completa con acceptanceCriteria ordenados por order", done: true },
            { text: "dueDate es opcional; si viene, convertir a Date antes de guardar", done: true },
          ],
        },
        {
          title: "Eliminar task con cascade",
          description:
            "DELETE /tasks/:id que elimina la task y sus ACs via cascade, verificando ownership.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-28),
          ac: [
            { text: "Verificar que el usuario es owner del proyecto de la task", done: true },
            { text: "El cascade en schema elimina acceptanceCriteria automáticamente", done: true },
            { text: "Retornar 204 en éxito, 404 si no existe o no pertenece al usuario", done: true },
          ],
        },
        {
          title: "Editar task completa",
          description:
            "PATCH /tasks/:id para actualizar todos los campos incluyendo reemplazo completo de ACs.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["TypeScript", "Prisma", "Zod"],
          dueDate: daysFromNow(-26),
          ac: [
            { text: "Actualizar título, descripción, status, priority, technologies, dueDate", done: true },
            { text: "Si se envía acceptanceCriteria: eliminar los existentes y recrear los nuevos", done: true },
            { text: "Si no se envía acceptanceCriteria: no modificarlos", done: true },
            { text: "Retornar task actualizada con acceptanceCriteria ordenados", done: true },
          ],
        },
        {
          title: "Cambio de estado de task desde el board",
          description:
            "PATCH /projects/:id/tasks/:taskId/status para actualizar solo el status desde el tablero sin abrir el detalle.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-24),
          ac: [
            { text: "Endpoint dedicado (no reutilizar PATCH /tasks/:id) para operación puntual", done: true },
            { text: "Validar que el usuario sea owner del proyecto", done: true },
            { text: "Validar que status sea un valor válido del enum TaskStatus", done: true },
            { text: "Retornar la task actualizada", done: true },
          ],
        },
        {
          title: "Filtro de tasks por status en el board",
          description:
            "Query param ?status= en GET /projects/:id/board para ver solo tasks de ciertos estados, sin afectar los conteos de progreso.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["TypeScript", "Prisma"],
          dueDate: daysFromNow(-22),
          ac: [
            { text: "?status=TODO,IN_PROGRESS filtra tasks en todos los epics del board", done: true },
            { text: "Los conteos tasksTotal y tasksDone NO se ven afectados por el filtro", done: true },
            { text: "Sin query param retorna todas las tasks (comportamiento por defecto)", done: true },
            { text: "Valores inválidos en ?status son ignorados o retornan 400", done: true },
          ],
        },
        {
          title: "Drag & drop para reordenar tasks",
          description:
            "Permitir arrastrar tasks dentro de un epic para cambiar su order, con actualización optimista en UI.",
          status: "TODO",
          priority: "MEDIUM",
          technologies: ["Next.js", "React", "dnd-kit"],
          dueDate: daysFromNow(20),
          ac: [
            { text: "Endpoint PATCH /tasks/:id/order que actualiza el campo order", done: false },
            { text: "Recalcular orders del resto de tasks del epic para mantener consistencia", done: false },
            { text: "Optimistic update en UI: mover la tarjeta antes de confirmar la respuesta", done: false },
            { text: "Revertir el orden si la request falla", done: false },
          ],
        },
        {
          title: "Fecha límite (dueDate) en task",
          description:
            "Campo opcional dueDate en tasks que se muestra en la tarjeta y permite visualizar tareas próximas a vencer.",
          status: "DONE",
          priority: "LOW",
          dueDate: daysFromNow(-20),
          ac: [
            { text: "Campo dueDate opcional en creación y edición de task", done: true },
            { text: "Aceptar formato ISO 8601 y convertir a Date en el backend", done: true },
            { text: "Mostrar fecha formateada (dd/MM/yyyy) en la tarjeta del board", done: true },
            { text: "Mostrar indicador visual (rojo) si la fecha ya pasó y la task no está DONE", done: true },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 5 — Frontend / UI
    // -------------------------------------------------------------------------
    {
      name: "Frontend / UI",
      description:
        "Vistas, componentes y formularios de la aplicación Next.js con TailwindCSS.",
      color: "#f43f5e",
      tasks: [
        {
          title: "Layout base con sidebar de navegación",
          description:
            "Shell de la aplicación con sidebar lateral, links de navegación, avatar de usuario y área de contenido principal.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Next.js", "TailwindCSS", "React"],
          dueDate: daysFromNow(-55),
          ac: [
            { text: "Sidebar visible en pantallas ≥ md, colapsable en mobile", done: true },
            { text: "Links a /projects y /profile con estado activo resaltado", done: true },
            { text: "Nombre e iniciales del usuario en la parte inferior del sidebar", done: true },
            { text: "Botón de cerrar sesión que limpia el token y redirige a /login", done: true },
          ],
        },
        {
          title: "Vista de proyectos con tarjetas y filtros",
          description:
            "Página /projects con grid de tarjetas por proyecto, filtro por estado y búsqueda en tiempo real.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Next.js", "React", "TailwindCSS"],
          dueDate: daysFromNow(-50),
          ac: [
            { text: "Tarjeta muestra nombre, color lateral, descripción truncada, tecnologías y progreso", done: true },
            { text: "Barra de progreso (tasksDone / tasksTotal) visible en cada tarjeta", done: true },
            { text: "Tabs o pills para filtrar por ACTIVE / COMPLETED / ARCHIVED / Todos", done: true },
            { text: "Input de búsqueda con debounce de 300ms que llama a la API", done: true },
            { text: "Estado vacío con CTA para crear el primer proyecto", done: true },
          ],
        },
        {
          title: "Board de epics y tasks",
          description:
            "Vista /projects/:id/board con columnas por epic y tarjetas de task que muestran prioridad, status, fecha y AC.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Next.js", "React", "TailwindCSS"],
          dueDate: daysFromNow(-45),
          ac: [
            { text: "Columnas horizontales por epic con nombre, color e indicador de progreso", done: true },
            { text: "Tarjeta de task con título, prioridad (badge), status y dueDate", done: true },
            { text: "Click en tarjeta abre modal/panel lateral con detalle completo y ACs", done: true },
            { text: "Filtro de status sobre el board (pills: TODO, IN_PROGRESS, IN_REVIEW, DONE)", done: true },
            { text: "Scroll horizontal si hay más epics que el ancho de pantalla", done: true },
          ],
        },
        {
          title: "Formulario de creación y edición de proyecto",
          description:
            "Modal/drawer con formulario controlado para crear o editar proyectos, con color picker y multi-select de tecnologías.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["React", "TailwindCSS", "Zod"],
          dueDate: daysFromNow(-40),
          ac: [
            { text: "Campos: nombre (obligatorio), descripción, color (picker), tecnologías (multi-tag)", done: true },
            { text: "Validación en cliente antes de enviar (nombre obligatorio, color válido)", done: true },
            { text: "En edición, pre-carga los valores actuales del proyecto", done: true },
            { text: "Feedback de errores por campo (no solo toast genérico)", done: true },
            { text: "Deshabilitar botón submit mientras el request está en vuelo", done: true },
          ],
        },
        {
          title: "Formulario de task con criterios de aceptación",
          description:
            "Modal para crear/editar tasks con lista dinámica de ACs, selector de prioridad, status y DatePicker para dueDate.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["React", "TailwindCSS"],
          dueDate: daysFromNow(-35),
          ac: [
            { text: "Lista dinámica de ACs: agregar con Enter o botón +, eliminar con ×", done: true },
            { text: "Selector de prioridad (LOW / MEDIUM / HIGH) con íconos de color", done: true },
            { text: "Selector de status (TODO / IN_PROGRESS / IN_REVIEW / DONE)", done: true },
            { text: "DatePicker nativo (input type=date) para dueDate", done: true },
            { text: "Multi-tag input para technologies de la task", done: true },
          ],
        },
        {
          title: "Cambio de status de task desde la tarjeta",
          description:
            "Dropdown inline en la tarjeta del board para cambiar el status sin abrir el modal de detalle.",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          technologies: ["React", "TailwindCSS"],
          dueDate: daysFromNow(5),
          ac: [
            { text: "Ícono/badge de status clickeable que abre un dropdown", done: true },
            { text: "Opciones del dropdown: TODO, IN_PROGRESS, IN_REVIEW, DONE", done: true },
            { text: "Actualizar UI de forma optimista al seleccionar", done: false },
            { text: "Mostrar spinner en la tarjeta mientras el request está en vuelo", done: false },
            { text: "Revertir el cambio optimista si la API responde con error", done: false },
          ],
        },
        {
          title: "Página de perfil de usuario",
          description:
            "Ruta /profile con datos del usuario autenticado y stats globales de sus proyectos.",
          status: "DONE",
          priority: "LOW",
          technologies: ["Next.js", "React"],
          dueDate: daysFromNow(-15),
          ac: [
            { text: "Mostrar nombre, email y fecha de registro formateada", done: true },
            { text: "Stats: proyectos activos, completados y archivados", done: true },
            { text: "Redirigir a /login si el token es inválido o expiró", done: true },
          ],
        },
        {
          title: "Modo oscuro / claro",
          description:
            "Implementar toggle de tema en el sidebar que persiste la preferencia del usuario en localStorage.",
          status: "TODO",
          priority: "LOW",
          technologies: ["Next.js", "TailwindCSS"],
          dueDate: daysFromNow(30),
          ac: [
            { text: "Toggle en la barra de navegación (ícono sol/luna)", done: false },
            { text: "Persistir preferencia en localStorage bajo la key 'theme'", done: false },
            { text: "Respetar prefers-color-scheme del sistema operativo en la primera visita", done: false },
            { text: "Todos los componentes deben verse correctos en ambos temas", done: false },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 6 — DevOps & Infraestructura
    // -------------------------------------------------------------------------
    {
      name: "DevOps & Infraestructura",
      description:
        "Dockerización, CI/CD y despliegue de los servicios en producción.",
      color: "#eab308",
      tasks: [
        {
          title: "Dockerfile del backend",
          description:
            "Imagen Docker multi-stage para el backend Express con build de TypeScript y ejecución del bundle compilado.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Docker", "Node.js", "TypeScript"],
          dueDate: daysFromNow(-25),
          ac: [
            { text: "Stage builder: instala deps y compila TypeScript con tsc", done: true },
            { text: "Stage runner: copia solo el dist/ y node_modules de producción", done: true },
            { text: "Puerto configurable via variable de entorno PORT", done: true },
            { text: "Imagen base node:22-alpine para minimizar tamaño", done: true },
          ],
        },
        {
          title: "Dockerfile del frontend",
          description:
            "Imagen Docker para la app Next.js con build estático optimizado y soporte de variables de entorno en build-time.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Docker", "Next.js"],
          dueDate: daysFromNow(-23),
          ac: [
            { text: "Build del proyecto Next.js dentro de la imagen", done: true },
            { text: "NEXT_PUBLIC_API_URL configurable como ARG en el build", done: true },
            { text: "Output standalone de Next.js para imagen mínima", done: true },
            { text: "Puerto 3000 expuesto", done: true },
          ],
        },
        {
          title: "docker-compose para desarrollo local",
          description:
            "Orquestar los servicios de back, front y PostgreSQL en un solo comando con hot-reload activado.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Docker", "docker-compose", "PostgreSQL"],
          dueDate: daysFromNow(-20),
          ac: [
            { text: "Servicios: back (Express), front (Next.js), db (PostgreSQL 16)", done: true },
            { text: "Volumen persistente para datos de PostgreSQL", done: true },
            { text: "Variables de entorno centralizadas en archivo .env en la raíz", done: true },
            { text: "Back usa tsx watch para hot-reload sin reconstruir imagen", done: true },
          ],
        },
        {
          title: "CI/CD con GitHub Actions",
          description:
            "Pipeline que valida el código en cada PR y despliega automáticamente a Railway cuando se mergea a main.",
          status: "IN_PROGRESS",
          priority: "HIGH",
          technologies: ["GitHub Actions", "Docker"],
          dueDate: daysFromNow(7),
          ac: [
            { text: "Job de lint y type-check en cada PR (tsc --noEmit)", done: true },
            { text: "Job de build de Docker para verificar que la imagen compila", done: true },
            { text: "Deploy automático a Railway en push a main", done: false },
            { text: "Secrets de Railway configurados en el repositorio de GitHub", done: false },
            { text: "Notificación en PR cuando el pipeline falla", done: false },
          ],
        },
        {
          title: "Deploy en Railway",
          description:
            "Configurar el despliegue de back y front en Railway con PostgreSQL gestionado y variables de entorno.",
          status: "IN_PROGRESS",
          priority: "HIGH",
          technologies: ["Railway", "Docker", "PostgreSQL"],
          dueDate: daysFromNow(10),
          ac: [
            { text: "Servicio de PostgreSQL gestionado en Railway (no self-hosted)", done: true },
            { text: "Variables de entorno DATABASE_URL, JWT_SECRET y TOKEN_EXPIRATION configuradas", done: true },
            { text: "NEXT_PUBLIC_API_URL apuntando al back desplegado", done: false },
            { text: "Health check endpoint GET /health en el back para que Railway detecte el start", done: false },
            { text: "Dominio personalizado configurado para el front", done: false },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// PROYECTO 2 — StockFlow ERP (Gestión de Inventario)
// =============================================================================

const stockFlowProject: ProjectSeed = {
  name: "StockFlow ERP",
  description:
    "Sistema ERP de gestión de inventario para medianas empresas. Cubre el ciclo completo: catálogo de productos, control de stock multi-almacén, órdenes de compra con flujo de aprobación, módulo de proveedores y reportes operativos en tiempo real.",
  color: "#0ea5e9",
  status: "COMPLETED",
  technologies: ["Java", "Spring Boot", "React", "PostgreSQL", "Redis", "Docker", "REST API", "Liquibase"],
  epics: [
    // -------------------------------------------------------------------------
    // Epic 1 — Catálogo de Productos
    // -------------------------------------------------------------------------
    {
      name: "Catálogo de Productos",
      description:
        "Gestión del maestro de productos: SKU, categorías, precios y fotos.",
      color: "#f97316",
      tasks: [
        {
          title: "Modelo de datos de producto",
          description:
            "Diseñar y migrar la entidad Product con Liquibase: SKU único, categoría, precio unitario, costo y estado activo/inactivo.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot", "PostgreSQL", "Liquibase"],
          dueDate: daysFromNow(-180),
          ac: [
            { text: "Entidad Product con campos: sku, name, description, categoryId, unitPrice, cost, active", done: true },
            { text: "SKU único a nivel de base de datos (unique constraint)", done: true },
            { text: "Migración gestionada con Liquibase (no Flyway)", done: true },
            { text: "Índice en categoryId para queries de catálogo por categoría", done: true },
            { text: "Auditoría automática: createdAt, updatedAt, createdBy via Spring Data Auditing", done: true },
          ],
        },
        {
          title: "CRUD de productos via REST",
          description:
            "Endpoints REST para el catálogo de productos con paginación, búsqueda y validación con Bean Validation.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot", "REST API"],
          dueDate: daysFromNow(-175),
          ac: [
            { text: "GET /api/products paginado (page, size, sort) con Spring Data Pageable", done: true },
            { text: "Búsqueda por nombre (ILIKE) y por SKU exacto en el mismo endpoint", done: true },
            { text: "POST /api/products con validación @NotBlank, @Positive en precio y costo", done: true },
            { text: "PUT /api/products/:id actualiza el producto completo", done: true },
            { text: "DELETE /api/products/:id hace soft delete (active = false)", done: true },
          ],
        },
        {
          title: "Gestión de categorías jerárquicas",
          description:
            "CRUD de categorías con soporte de padre/hijo (ej. Electrónica > Computadoras > Laptops).",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot", "PostgreSQL"],
          dueDate: daysFromNow(-170),
          ac: [
            { text: "Tabla categories con campo parentId nullable (self-reference)", done: true },
            { text: "GET /api/categories retorna árbol completo de categorías", done: true },
            { text: "No se puede eliminar una categoría que tiene productos asociados", done: true },
            { text: "Profundidad máxima de 3 niveles validada en backend", done: true },
          ],
        },
        {
          title: "Importación masiva de productos desde CSV",
          description:
            "Endpoint POST /api/products/import para cargar hasta 5000 productos desde un archivo CSV con reporte de errores por fila.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot", "Apache POI"],
          dueDate: daysFromNow(-160),
          ac: [
            { text: "Aceptar multipart/form-data con el CSV", done: true },
            { text: "Validar columnas obligatorias: sku, name, unitPrice, categoryId", done: true },
            { text: "Procesar en batches de 500 registros para no saturar la BD", done: true },
            { text: "Retornar reporte: filas importadas, filas con error y detalle de cada error", done: true },
            { text: "Límite de 5000 filas; rechazar si el archivo es mayor", done: true },
          ],
        },
        {
          title: "Gestión de fotos de producto",
          description:
            "Subir y gestionar múltiples fotos por producto usando S3 con presigned URLs para acceso seguro.",
          status: "DONE",
          priority: "LOW",
          technologies: ["Java", "Spring Boot", "AWS S3"],
          dueDate: daysFromNow(-150),
          ac: [
            { text: "Endpoint POST /api/products/:id/photos retorna presigned URL para subir a S3", done: true },
            { text: "Máximo 5 fotos por producto", done: true },
            { text: "Campo isMain para marcar la foto principal", done: true },
            { text: "Eliminar foto de S3 al borrarla del producto", done: true },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 2 — Gestión de Inventario
    // -------------------------------------------------------------------------
    {
      name: "Gestión de Inventario",
      description:
        "Control de stock multi-almacén, movimientos, alertas y conteos físicos.",
      color: "#8b5cf6",
      tasks: [
        {
          title: "Modelo de stock por almacén",
          description:
            "Tabla inventory_stock que relaciona producto × almacén con quantity y registro de movimientos para trazabilidad.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "PostgreSQL", "Liquibase"],
          dueDate: daysFromNow(-145),
          ac: [
            { text: "Tabla inventory_stock: productId, warehouseId, quantity (non-negative check)", done: true },
            { text: "Tabla stock_movement: tipo (IN/OUT/ADJUSTMENT), quantity, reason, timestamp, userId", done: true },
            { text: "Toda modificación de stock crea un registro en stock_movement (trigger o lógica de servicio)", done: true },
            { text: "Índice compuesto (productId, warehouseId) para queries de disponibilidad", done: true },
          ],
        },
        {
          title: "Entrada de mercancía",
          description:
            "Registrar la recepción física de productos, vinculada a una orden de compra, y actualizar el stock del almacén correspondiente.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot"],
          dueDate: daysFromNow(-140),
          ac: [
            { text: "POST /api/receipts vinculado a una purchaseOrderId", done: true },
            { text: "Actualizar inventory_stock en transacción atómica junto con el movimiento", done: true },
            { text: "Generar número de comprobante de entrada (folio autoincremental)", done: true },
            { text: "Actualizar estado de la OC a RECEIVED o PARTIALLY_RECEIVED según cantidades", done: true },
          ],
        },
        {
          title: "Salida y ajuste de inventario",
          description:
            "Endpoint para registrar salidas manuales y ajustes con motivo. Ajustes mayores al 10% del stock requieren aprobación.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot"],
          dueDate: daysFromNow(-135),
          ac: [
            { text: "POST /api/stock/adjustment con tipo OUT o ADJUSTMENT y campo reason obligatorio", done: true },
            { text: "Validar que la cantidad de salida no supere el stock disponible", done: true },
            { text: "Si ajuste > 10% del stock actual, crear solicitud pendiente de aprobación", done: true },
            { text: "Solo ALMACENISTA y ADMIN pueden registrar salidas", done: true },
          ],
        },
        {
          title: "Alertas de stock mínimo",
          description:
            "Job nocturno que detecta productos por debajo de su stock mínimo configurado y notifica al responsable del almacén.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Scheduler", "Redis", "Spring Mail"],
          dueDate: daysFromNow(-125),
          ac: [
            { text: "Campo minStock en inventory_stock configurable por producto y almacén", done: true },
            { text: "@Scheduled job a las 06:00 todos los días detecta bajo stock", done: true },
            { text: "Cachear resultado del último análisis en Redis por 12h para evitar spam", done: true },
            { text: "Enviar email con lista de productos bajo mínimo al responsable del almacén", done: true },
          ],
        },
        {
          title: "Inventario físico (conteo cíclico)",
          description:
            "Flujo de sesión de conteo físico por almacén: iniciar sesión, registrar conteos por producto, calcular diferencias y cerrar ajustando el stock.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot", "PostgreSQL"],
          dueDate: daysFromNow(-115),
          ac: [
            { text: "POST /api/physical-count/start inicia sesión bloqueando movimientos del almacén", done: true },
            { text: "PATCH /api/physical-count/:id/items registra conteo real por producto", done: true },
            { text: "GET /api/physical-count/:id/diff muestra diferencias vs stock teórico antes de cerrar", done: true },
            { text: "POST /api/physical-count/:id/close cierra la sesión y genera ajustes automáticos", done: true },
            { text: "Solo ADMIN puede cerrar una sesión de conteo", done: true },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 3 — Órdenes de Compra
    // -------------------------------------------------------------------------
    {
      name: "Órdenes de Compra",
      description:
        "Flujo completo de OC: creación, aprobación, recepción parcial y cancelación.",
      color: "#06b6d4",
      tasks: [
        {
          title: "Creación de orden de compra",
          description:
            "Formulario React + endpoint para crear OC con proveedor, líneas de productos y fecha estimada de entrega. Genera PDF automáticamente.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot", "React", "iText PDF"],
          dueDate: daysFromNow(-110),
          ac: [
            { text: "Seleccionar proveedor y sus productos con precio pactado pre-cargado", done: true },
            { text: "Múltiples líneas (producto, cantidad, precio unitario, subtotal)", done: true },
            { text: "Fecha estimada de entrega obligatoria", done: true },
            { text: "PDF de OC generado automáticamente con logo, datos del proveedor y líneas", done: true },
            { text: "OC inicia en estado DRAFT", done: true },
          ],
        },
        {
          title: "Flujo de aprobación de OC",
          description:
            "Máquina de estados para la OC: DRAFT → SENT → APPROVED → RECEIVED. OC mayores a $50,000 requieren aprobación explícita.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot"],
          dueDate: daysFromNow(-105),
          ac: [
            { text: "Endpoint PATCH /api/purchase-orders/:id/status valida transición de estado", done: true },
            { text: "OC > $50,000 MXN requieren aprobación de un ADMIN antes de pasar a SENT", done: true },
            { text: "Notificación por email al aprobador cuando se solicita aprobación", done: true },
            { text: "Notificación al COMPRADOR cuando la OC es aprobada o rechazada", done: true },
            { text: "Historial de cambios de estado en tabla po_status_history", done: true },
          ],
        },
        {
          title: "Recepción parcial de OC",
          description:
            "Permitir recibir solo una parte de los productos de una OC, actualizando las cantidades pendientes y generando la entrada parcial de stock.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot", "PostgreSQL"],
          dueDate: daysFromNow(-100),
          ac: [
            { text: "Registrar qué se recibió (cantidad por línea) vs lo ordenado", done: true },
            { text: "Si todo recibido → OC pasa a RECEIVED", done: true },
            { text: "Si recepción parcial → OC pasa a PARTIALLY_RECEIVED y queda abierta", done: true },
            { text: "Generar movimiento de entrada en inventory_stock por lo recibido", done: true },
          ],
        },
        {
          title: "Historial de OC por proveedor",
          description:
            "Vista de historial de órdenes de compra filtrable por proveedor, estado y rango de fechas, con exportación a Excel.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "React", "Apache POI"],
          dueDate: daysFromNow(-90),
          ac: [
            { text: "Filtros: proveedor, estado, fechaDesde, fechaHasta combinables", done: true },
            { text: "Tabla paginada con columnas: folio, proveedor, montoTotal, estado, fechaEstimada", done: true },
            { text: "Botón Exportar Excel genera archivo con todos los registros del filtro activo", done: true },
            { text: "Mostrar monto total y monto pendiente de recibir por OC", done: true },
          ],
        },
        {
          title: "Cancelación de orden de compra",
          description:
            "Permitir cancelar OC en estado DRAFT o SENT con motivo obligatorio y notificación al proveedor.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot"],
          dueDate: daysFromNow(-85),
          ac: [
            { text: "Solo cancelable en estado DRAFT o SENT (no si ya está APPROVED o RECEIVED)", done: true },
            { text: "Campo cancellationReason obligatorio (mínimo 10 caracteres)", done: true },
            { text: "OC cancelada pasa a estado CANCELLED y ya no es editable", done: true },
            { text: "Notificación por email al proveedor informando la cancelación", done: true },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 4 — Módulo de Proveedores
    // -------------------------------------------------------------------------
    {
      name: "Módulo de Proveedores",
      description:
        "Gestión de proveedores, evaluación de desempeño y catálogo de productos por proveedor.",
      color: "#10b981",
      tasks: [
        {
          title: "CRUD de proveedores",
          description:
            "Alta, consulta, edición y baja lógica de proveedores con validación de RFC y datos de contacto.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Boot", "PostgreSQL"],
          dueDate: daysFromNow(-80),
          ac: [
            { text: "Campos obligatorios: nombre, RFC, dirección fiscal, email de contacto", done: true },
            { text: "RFC único a nivel de base de datos", done: true },
            { text: "Campos opcionales: teléfono, diasCredito, limiteCredito, condicionesPago", done: true },
            { text: "Soft delete: campo active = false (no se elimina físicamente)", done: true },
            { text: "Proveedor inactivo no aparece en el selector de OC", done: true },
          ],
        },
        {
          title: "Evaluación de desempeño de proveedores",
          description:
            "Sistema de calificación por orden de compra recibida (puntualidad y calidad) con promedio acumulado visible en la ficha del proveedor.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot", "React"],
          dueDate: daysFromNow(-75),
          ac: [
            { text: "Al cerrar recepción de OC, habilitar formulario de evaluación (1-5 estrellas c/u)", done: true },
            { text: "Criterios: puntualidad en entrega y calidad del producto recibido", done: true },
            { text: "Promedio ponderado de todas las evaluaciones visible en la ficha del proveedor", done: true },
            { text: "Historial de evaluaciones paginado por proveedor", done: true },
          ],
        },
        {
          title: "Catálogo de productos por proveedor",
          description:
            "Asociar productos del catálogo a cada proveedor con precio pactado propio (puede diferir del precio maestro).",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot"],
          dueDate: daysFromNow(-70),
          ac: [
            { text: "Tabla supplier_products: supplierId, productId, agreedPrice, leadTimeDays", done: true },
            { text: "agreedPrice independiente del unitPrice del catálogo maestro", done: true },
            { text: "Al crear una OC con un proveedor, pre-cargar agreedPrice como precio sugerido", done: true },
            { text: "CRUD de asociaciones desde la ficha del proveedor", done: true },
          ],
        },
        {
          title: "Control de crédito y alertas",
          description:
            "Validar que el monto de una OC no supere el crédito disponible del proveedor antes de enviarla.",
          status: "DONE",
          priority: "LOW",
          technologies: ["Java", "Spring Boot"],
          dueDate: daysFromNow(-65),
          ac: [
            { text: "Campo creditLimit y diasCredito en el proveedor", done: true },
            { text: "Calcular crédito usado: suma de OC APPROVED o PARTIALLY_RECEIVED no vencidas", done: true },
            { text: "Advertencia (no bloqueo) si la nueva OC supera el crédito disponible", done: true },
            { text: "Visible en la ficha del proveedor: crédito total, usado y disponible", done: true },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 5 — Reportes y Analytics
    // -------------------------------------------------------------------------
    {
      name: "Reportes y Analytics",
      description:
        "Dashboard en tiempo real, reportes de movimientos, OC y KPIs de rotación de inventario.",
      color: "#f43f5e",
      tasks: [
        {
          title: "Dashboard de inventario en tiempo real",
          description:
            "Página principal con KPIs clave del inventario: total de productos, valor del stock, productos bajo mínimo y actividad reciente.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["React", "Redis", "PostgreSQL"],
          dueDate: daysFromNow(-60),
          ac: [
            { text: "KPIs: total productos activos, valor total del inventario (qty × costo)", done: true },
            { text: "Card de productos bajo stock mínimo con link a detalle", done: true },
            { text: "Últimos 10 movimientos de stock en tabla reciente", done: true },
            { text: "KPIs cacheados en Redis 60s; actualización automática con polling", done: true },
          ],
        },
        {
          title: "Reporte de movimientos de stock",
          description:
            "Reporte filtrable de todos los movimientos de inventario con exportación a Excel y gráfica de evolución.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "React", "PostgreSQL", "Apache POI"],
          dueDate: daysFromNow(-55),
          ac: [
            { text: "Filtros: producto, almacén, tipo (IN/OUT/ADJUSTMENT), rango de fechas", done: true },
            { text: "Tabla paginada con columnas: fecha, producto, tipo, cantidad, responsable, motivo", done: true },
            { text: "Exportar a Excel con todos los registros del filtro activo (sin paginación)", done: true },
            { text: "Gráfica de línea con evolución del stock del producto seleccionado", done: true },
          ],
        },
        {
          title: "Reporte de órdenes de compra",
          description:
            "Reporte ejecutivo de OC por período: monto total comprado, top proveedores y OC abiertas.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "React", "PostgreSQL"],
          dueDate: daysFromNow(-50),
          ac: [
            { text: "Monto total comprado por mes en el período seleccionado (barra chart)", done: true },
            { text: "Top 5 proveedores por monto en el período", done: true },
            { text: "Tabla de OC abiertas (SENT o APPROVED) con días en espera", done: true },
          ],
        },
        {
          title: "KPIs de rotación de inventario",
          description:
            "Calcular días de inventario disponible y rotación por categoría, con comparativa vs el período anterior.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "PostgreSQL"],
          dueDate: daysFromNow(-45),
          ac: [
            { text: "Días de inventario = (stock promedio / costo de salidas) × días del período", done: true },
            { text: "Rotación por categoría: top 5 más rotadas y bottom 5 más estancadas", done: true },
            { text: "Comparativa vs mismo período del mes/año anterior con variación %", done: true },
            { text: "Calculado con SQL sobre stock_movement, sin datos en Redis", done: true },
          ],
        },
        {
          title: "Exportación programada de reportes por email",
          description:
            "Configurar envío automático de reportes por email en frecuencias diaria, semanal o mensual, en formato PDF o Excel.",
          status: "DONE",
          priority: "LOW",
          technologies: ["Java", "Spring Scheduler", "AWS SES", "iText PDF"],
          dueDate: daysFromNow(-35),
          ac: [
            { text: "CRUD de configuraciones de reporte programado por usuario", done: true },
            { text: "Frecuencias soportadas: DAILY, WEEKLY (lunes), MONTHLY (día 1)", done: true },
            { text: "Formatos: PDF o Excel, seleccionable por configuración", done: true },
            { text: "Envío via AWS SES con template HTML de email corporativo", done: true },
            { text: "Log de envíos con estado (SUCCESS/FAILED) y timestamp", done: true },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Epic 6 — Auth y Control de Acceso (RBAC)
    // -------------------------------------------------------------------------
    {
      name: "Auth y Control de Acceso",
      description:
        "Autenticación JWT, roles RBAC, gestión de usuarios del sistema y auditoría de operaciones.",
      color: "#eab308",
      tasks: [
        {
          title: "Autenticación con Spring Security + JWT",
          description:
            "Login con usuario y contraseña, token JWT de 8 horas y refresh token de 7 días con rotación.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Security", "JWT"],
          dueDate: daysFromNow(-170),
          ac: [
            { text: "POST /api/auth/login valida credenciales y retorna accessToken + refreshToken", done: true },
            { text: "accessToken expira en 8h, refreshToken en 7 días", done: true },
            { text: "POST /api/auth/refresh rota el refreshToken y emite nuevo accessToken", done: true },
            { text: "POST /api/auth/logout invalida el refreshToken en base de datos", done: true },
          ],
        },
        {
          title: "Roles y permisos granulares (RBAC)",
          description:
            "Implementar cuatro roles con permisos específicos por módulo: ADMIN, COMPRADOR, ALMACENISTA y AUDITOR.",
          status: "DONE",
          priority: "HIGH",
          technologies: ["Java", "Spring Security"],
          dueDate: daysFromNow(-165),
          ac: [
            { text: "Roles: ADMIN (todo), COMPRADOR (OC + proveedores), ALMACENISTA (stock), AUDITOR (solo lectura)", done: true },
            { text: "@PreAuthorize con SpEL en cada endpoint según el rol requerido", done: true },
            { text: "Un usuario puede tener múltiples roles (relación N:M)", done: true },
            { text: "Retornar 403 con mensaje descriptivo si el rol no tiene el permiso", done: true },
          ],
        },
        {
          title: "Gestión de usuarios del sistema",
          description:
            "CRUD de usuarios administrativos con asignación de roles, reset de contraseña y bloqueo de cuentas.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot", "Spring Mail"],
          dueDate: daysFromNow(-158),
          ac: [
            { text: "Solo ADMIN puede crear, editar y eliminar usuarios", done: true },
            { text: "Reset de contraseña envía email con link de un solo uso (expira en 1h)", done: true },
            { text: "Bloqueo automático tras 5 intentos fallidos de login", done: true },
            { text: "ADMIN puede desbloquear cuentas manualmente", done: true },
          ],
        },
        {
          title: "Auditoría inmutable de operaciones",
          description:
            "Registrar todas las escrituras del sistema (quién, qué entidad, qué cambió, cuándo) en una tabla de auditoría de solo inserción.",
          status: "DONE",
          priority: "MEDIUM",
          technologies: ["Java", "Spring Boot", "PostgreSQL"],
          dueDate: daysFromNow(-150),
          ac: [
            { text: "Tabla audit_log: userId, action (CREATE/UPDATE/DELETE), entity, entityId, changes (JSON), timestamp", done: true },
            { text: "Implementado via Spring AOP (@AfterReturning en servicios de escritura)", done: true },
            { text: "La tabla audit_log no tiene UPDATE ni DELETE concedidos al app user de BD", done: true },
            { text: "AUDITOR puede exportar el log filtrado por entidad, usuario y rango de fechas", done: true },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// Función principal
// =============================================================================

async function main() {
  console.log("🌱 Iniciando seed de Skemap...\n");

  // ---------------------------------------------------------------------------
  // 1. Crear (o recuperar) el usuario demo
  // ---------------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      username: "diegogp",
      name: "Diego GP",
      email: DEMO_EMAIL,
      password: passwordHash,
    },
  });

  console.log(`✅ Usuario demo: ${user.email} (id: ${user.id})`);

  // ---------------------------------------------------------------------------
  // 2. Limpiar proyectos existentes del usuario demo para re-seed idempotente
  // ---------------------------------------------------------------------------
  const existingProjects = await prisma.project.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true },
  });

  if (existingProjects.length > 0) {
    await prisma.project.deleteMany({ where: { ownerId: user.id } });
    console.log(
      `🗑️  Eliminados ${existingProjects.length} proyectos anteriores del usuario demo\n`,
    );
  }

  // ---------------------------------------------------------------------------
  // 3. Crear proyectos
  // ---------------------------------------------------------------------------
  for (const projectSeed of [skeMapProject, stockFlowProject]) {
    const project = await prisma.project.create({
      data: {
        name: projectSeed.name,
        description: projectSeed.description,
        color: projectSeed.color,
        status: projectSeed.status,
        technologies: projectSeed.technologies,
        ownerId: user.id,
      },
    });

    console.log(`📁 Proyecto: ${project.name} [${project.status}]`);

    let epicOrder = 1;
    let totalTasks = 0;

    for (const epicSeed of projectSeed.epics) {
      const epic = await prisma.epic.create({
        data: {
          name: epicSeed.name,
          description: epicSeed.description,
          color: epicSeed.color,
          order: epicOrder++,
          projectId: project.id,
        },
      });

      let taskOrder = 1;

      for (const taskSeed of epicSeed.tasks) {
        await prisma.task.create({
          data: {
            title: taskSeed.title,
            description: taskSeed.description,
            status: taskSeed.status,
            priority: taskSeed.priority,
            technologies: taskSeed.technologies ?? [],
            order: taskOrder++,
            dueDate: taskSeed.dueDate,
            epicId: epic.id,
            acceptanceCriteria: taskSeed.ac
              ? {
                  create: taskSeed.ac.map((a, i) => ({
                    text: a.text,
                    done: a.done,
                    order: i + 1,
                  })),
                }
              : undefined,
          },
        });

        totalTasks++;
      }

      console.log(
        `  └─ Epic: ${epic.name} (${epicSeed.tasks.length} tasks)`,
      );
    }

    console.log(
      `     → ${projectSeed.epics.length} epics, ${totalTasks} tasks en total\n`,
    );
  }

  // ---------------------------------------------------------------------------
  // 4. Resumen final
  // ---------------------------------------------------------------------------
  console.log("━".repeat(50));
  console.log("✅ Seed completado exitosamente\n");
  console.log("🔑 Credenciales del usuario demo:");
  console.log("   Email:      demo@skemap.dev");
  console.log("   Contraseña: demo1234");
  console.log("━".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

"use client"
import { useState } from "react";

const EPICS = [
  {
    id: "E1",
    title: "Configuración base del proyecto",
    color: "#4a9eff",
    description: "Setup inicial del monorepo, estructura de carpetas, tooling y configuración de entorno de desarrollo.",
    stories: [
      {
        id: "E1-S1",
        title: "Inicializar repositorio y estructura de carpetas",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "Crear repo en GitHub. Estructura: /client (React+Vite+Tailwind), /server (Node+Express), /docker. Configurar .gitignore, README base y scripts npm en raíz.",
        acceptance: [
          "Repo creado con rama main protegida",
          "Estructura de carpetas definida",
          "npm install funciona en raíz",
        ],
        stack: ["Git", "npm workspaces"],
      },
      {
        id: "E1-S2",
        title: "Configurar Vite + React + Tailwind en /client",
        status: "todo",
        priority: "high",
        estimate: "0.5d",
        description: "Vite como bundler, React 18, Tailwind CSS v3. Configurar tailwind.config.js con colores custom de la app. Eliminar boilerplate de Vite.",
        acceptance: [
          "npm run dev levanta en localhost:5173",
          "Tailwind aplica estilos correctamente",
          "Build de producción genera /dist sin errores",
        ],
        stack: ["Vite", "React 18", "Tailwind CSS"],
      },
      {
        id: "E1-S3",
        title: "Configurar Express + PostgreSQL en /server",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "Express con estructura MVC: /routes, /controllers, /models, /middleware. Conexión a PostgreSQL con pg (node-postgres). Variables de entorno con dotenv. Script de arranque con nodemon.",
        acceptance: [
          "npm run dev levanta en localhost:3001",
          "Conexión a DB confirmada con query de prueba",
          ".env.example documentado",
        ],
        stack: ["Node.js", "Express", "pg", "dotenv", "nodemon"],
      },
      {
        id: "E1-S4",
        title: "Dockerizar la aplicación completa",
        status: "todo",
        priority: "medium",
        estimate: "1d",
        description: "Dockerfile para client (nginx sirve /dist) y server (node). docker-compose.yml con tres servicios: client, server, postgres. Volumen persistente para datos de PostgreSQL. Variables de entorno por servicio.",
        acceptance: [
          "docker-compose up levanta los tres servicios",
          "Client accesible en puerto 80",
          "Server accesible en puerto 3001",
          "DB persiste datos entre reinicios",
        ],
        stack: ["Docker", "docker-compose", "nginx"],
      },
    ],
  },
  {
    id: "E2",
    title: "Base de datos y modelos",
    color: "#f59e0b",
    description: "Diseño del schema de PostgreSQL, migraciones y seeders. Es el cimiento de toda la lógica de negocio.",
    stories: [
      {
        id: "E2-S1",
        title: "Diseñar y crear schema de PostgreSQL",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "Tablas: users (id, email, password_hash, created_at), blocks (id, user_id, name, time, active), daily_logs (id, user_id, date, block_id, completed), streaks (id, user_id, current_streak, longest_streak, updated_at). Relaciones con FK y constraints.",
        acceptance: [
          "Schema aplicado en DB de desarrollo",
          "Diagrama ER documentado en /docs",
          "Constraints de integridad referencial funcionando",
        ],
        stack: ["PostgreSQL", "SQL"],
      },
      {
        id: "E2-S2",
        title: "Sistema de migraciones con node-pg-migrate",
        status: "todo",
        priority: "high",
        estimate: "0.5d",
        description: "Configurar node-pg-migrate para versionar cambios al schema. Scripts npm: db:migrate, db:rollback, db:migrate:test. Las migraciones corren automáticamente al iniciar el server en producción.",
        acceptance: [
          "npm run db:migrate aplica todas las migraciones",
          "npm run db:rollback revierte la última",
          "Migraciones son idempotentes",
        ],
        stack: ["node-pg-migrate"],
      },
      {
        id: "E2-S3",
        title: "Crear modelos de acceso a datos",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "Capa de models con funciones puras que encapsulan queries SQL. UserModel: findById, findByEmail, create. BlockModel: findByUser, create, update, delete. LogModel: findByUserAndDate, upsert. StreakModel: get, update.",
        acceptance: [
          "Cada modelo tiene funciones documentadas",
          "No hay SQL crudo fuera de /models",
          "Queries usan parámetros preparados (sin SQL injection)",
        ],
        stack: ["pg", "SQL"],
      },
    ],
  },
  {
    id: "E3",
    title: "Autenticación JWT",
    color: "#10b981",
    description: "Sistema completo de autenticación: registro, login, tokens de acceso y refresh, middleware de protección de rutas.",
    stories: [
      {
        id: "E3-S1",
        title: "Endpoint POST /api/auth/register",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "Recibe email y password. Valida formato con express-validator. Hashea password con bcrypt (salt rounds: 12). Inserta usuario en DB. Retorna access token (15min) y refresh token (7d). El refresh token se guarda en httpOnly cookie, el access token en el body de la respuesta.",
        acceptance: [
          "Registra usuario con email único",
          "Retorna 400 si email ya existe",
          "Password nunca se guarda en texto plano",
          "Retorna JWT válido",
        ],
        stack: ["bcrypt", "jsonwebtoken", "express-validator"],
      },
      {
        id: "E3-S2",
        title: "Endpoint POST /api/auth/login",
        status: "todo",
        priority: "high",
        estimate: "0.5d",
        description: "Recibe email y password. Busca usuario por email. Compara password con bcrypt.compare(). Si es correcto, genera nuevos access y refresh tokens con la misma estrategia que register. Retorna 401 con mensaje genérico si falla (no revelar si el email existe).",
        acceptance: [
          "Login correcto retorna tokens",
          "Login incorrecto retorna 401",
          "Mensaje de error no diferencia email vs password incorrectos",
        ],
        stack: ["bcrypt", "jsonwebtoken"],
      },
      {
        id: "E3-S3",
        title: "Endpoint POST /api/auth/refresh",
        status: "todo",
        priority: "high",
        estimate: "0.5d",
        description: "Lee el refresh token de la httpOnly cookie. Lo verifica con JWT_REFRESH_SECRET. Si es válido, genera un nuevo access token y lo retorna. Implementa rotación de refresh tokens: invalida el anterior y emite uno nuevo. Tabla refresh_tokens en DB para blacklisting.",
        acceptance: [
          "Token de acceso expirado + refresh válido = nuevo access token",
          "Refresh token usado solo puede usarse una vez (rotación)",
          "Refresh expirado o inválido retorna 401",
        ],
        stack: ["jsonwebtoken", "pg"],
      },
      {
        id: "E3-S4",
        title: "Middleware de autenticación",
        status: "todo",
        priority: "high",
        estimate: "0.5d",
        description: "Middleware authMiddleware que extrae el Bearer token del header Authorization. Lo verifica con JWT_ACCESS_SECRET. Si es válido, adjunta user.id al objeto req para que los controllers lo usen. Si es inválido o ausente, retorna 401.",
        acceptance: [
          "Rutas protegidas retornan 401 sin token",
          "req.user.id disponible en controllers protegidos",
          "Token expirado retorna 401 con mensaje específico",
        ],
        stack: ["jsonwebtoken", "Express middleware"],
      },
      {
        id: "E3-S5",
        title: "Flujo de auth en el cliente (React)",
        status: "todo",
        priority: "high",
        estimate: "1.5d",
        description: "Context de Auth con useState para el access token (en memoria, no localStorage). Formularios de login y registro con validación client-side. Axios interceptor que adjunta el token a cada request y ejecuta refresh automático si recibe 401. Rutas protegidas con ProtectedRoute component.",
        acceptance: [
          "Login persiste sesión entre recargas (via refresh cookie)",
          "Access token nunca toca localStorage",
          "Refresh automático transparente al usuario",
          "Logout limpia cookie y estado",
        ],
        stack: ["React Context", "Axios", "React Router"],
      },
    ],
  },
  {
    id: "E4",
    title: "API de bloques y registros diarios",
    color: "#8b5cf6",
    description: "CRUD de bloques personales y el sistema de logging diario. El núcleo funcional de la app.",
    stories: [
      {
        id: "E4-S1",
        title: "CRUD endpoints para bloques",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "GET /api/blocks — lista bloques del usuario autenticado. POST /api/blocks — crea bloque (name, time). PUT /api/blocks/:id — edita name o time. DELETE /api/blocks/:id — elimina (solo si no tiene logs asociados, o soft delete). Máximo 6 bloques por usuario validado en server.",
        acceptance: [
          "Todas las rutas requieren auth",
          "Usuario solo ve y modifica sus propios bloques",
          "Límite de 6 bloques retorna 400",
        ],
        stack: ["Express", "pg"],
      },
      {
        id: "E4-S2",
        title: "Endpoints de registro diario",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "GET /api/logs?date=YYYY-MM-DD — retorna bloques del usuario con su estado completado para esa fecha. POST /api/logs — body: {block_id, date, completed}. Hace upsert en daily_logs. Al completar/descompletar un bloque recalcula el streak y actualiza la tabla streaks.",
        acceptance: [
          "Upsert funciona correctamente (no duplica registros)",
          "Streak se recalcula en cada toggle",
          "Date siempre se guarda en UTC",
        ],
        stack: ["Express", "pg"],
      },
      {
        id: "E4-S3",
        title: "Endpoint de resumen semanal",
        status: "todo",
        priority: "medium",
        estimate: "1d",
        description: "GET /api/stats/week?date=YYYY-MM-DD — retorna para la semana que contiene esa fecha: array de 7 días con estado (completo/parcial/vacío), conteo de días 100% completados, y por cada bloque cuántos días fue completado en la semana.",
        acceptance: [
          "Respuesta incluye los 7 días de lunes a domingo",
          "Días futuros retornan estado 'pending'",
          "Query es eficiente (no N+1)",
        ],
        stack: ["Express", "pg", "SQL agregaciones"],
      },
    ],
  },
  {
    id: "E5",
    title: "Frontend — Vistas principales",
    color: "#ef4444",
    description: "Implementación de las tres vistas de la app: Hoy, Semana y Configuración de bloques. Consume la API construida en E4.",
    stories: [
      {
        id: "E5-S1",
        title: "Vista Hoy — listado y toggle de bloques",
        status: "todo",
        priority: "high",
        estimate: "1.5d",
        description: "Fetch de GET /api/logs?date=hoy al cargar. Lista bloques ordenados por hora. Click en bloque llama POST /api/logs con optimistic update (toggle inmediato en UI, revert si falla). Muestra streak actual y contador X/Y completados. Diseño acorde al prototipo minimalista.",
        acceptance: [
          "Toggle es instantáneo (optimistic update)",
          "Streak se actualiza tras completar todos los bloques",
          "Estado persiste al recargar la página",
        ],
        stack: ["React", "Axios", "Tailwind"],
      },
      {
        id: "E5-S2",
        title: "Vista Semana — grid y progreso por bloque",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "Fetch de GET /api/stats/week. Grid de 7 días con estado visual (dorado=completo, gris=parcial, oscuro=vacío). Contador de días perfectos en la semana. Barra de progreso por bloque mostrando X/7 días completado.",
        acceptance: [
          "Grid refleja datos reales de DB",
          "Semana actual mostrada por defecto",
          "Estados visuales diferenciados claramente",
        ],
        stack: ["React", "Axios", "Tailwind"],
      },
      {
        id: "E5-S3",
        title: "Vista Bloques — gestión de bloques personales",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "Lista bloques existentes del usuario. Formulario de creación (nombre + hora). Eliminar bloque con confirmación. Límite de 6 bloques reforzado visualmente (ocultar form si hay 6). Cambios reflejan inmediatamente en vista Hoy.",
        acceptance: [
          "CRUD de bloques funciona contra API real",
          "Límite de 6 bloques bloqueado en UI y server",
          "Eliminar bloque actualiza vista Hoy",
        ],
        stack: ["React", "Axios", "Tailwind"],
      },
    ],
  },
  {
    id: "E6",
    title: "Deploy en Raspberry Pi",
    color: "#06b6d4",
    description: "Configuración de producción: docker-compose en la Pi, Cloudflare Tunnel para exposición HTTPS, GitHub webhook para deploys automáticos.",
    stories: [
      {
        id: "E6-S1",
        title: "Configurar docker-compose de producción",
        status: "todo",
        priority: "high",
        estimate: "1d",
        description: "docker-compose.prod.yml separado del de desarrollo. Variables de entorno desde archivo .env (nunca en el compose). Restart policy: unless-stopped. Health checks para server y postgres. Volumen nombrado para datos de PostgreSQL. Imagen de client optimizada con nginx:alpine.",
        acceptance: [
          "docker-compose -f docker-compose.prod.yml up -d levanta todo",
          "Servicios se reinician automáticamente tras reboot de la Pi",
          "Logs accesibles con docker-compose logs",
        ],
        stack: ["Docker", "docker-compose", "nginx"],
      },
      {
        id: "E6-S2",
        title: "Configurar Cloudflare Tunnel",
        status: "todo",
        priority: "high",
        estimate: "0.5d",
        description: "Cloudflare Tunnel apuntando al puerto 80 del contenedor client y al 3001 del server (o un solo dominio con nginx como reverse proxy interno). HTTPS automático via Cloudflare. Configurar subdominio: discipline.tudominio.com.",
        acceptance: [
          "App accesible en HTTPS desde internet",
          "Sin puertos abiertos en el router",
          "Tunnel sobrevive reinicios (servicio systemd o contenedor)",
        ],
        stack: ["Cloudflare Tunnel", "nginx"],
      },
      {
        id: "E6-S3",
        title: "Webhook de deploy automático desde GitHub",
        status: "todo",
        priority: "medium",
        estimate: "1d",
        description: "Script de deploy en la Pi: git pull, docker-compose build, docker-compose up -d con zero-downtime. Endpoint Express en un puerto interno que recibe el webhook de GitHub, valida el secret y ejecuta el script. Notificación por log cuando el deploy termina.",
        acceptance: [
          "Push a main dispara deploy automático",
          "Webhook validado con secret (no ejecuta código arbitrario)",
          "Deploy no genera downtime visible",
        ],
        stack: ["bash", "GitHub Webhooks", "Docker"],
      },
    ],
  },
];

const STATUS_CONFIG = {
  todo: { label: "Por hacer", color: "#374151", text: "#9ca3af" },
  inprogress: { label: "En progreso", color: "#1e3a5f", text: "#60a5fa" },
  review: { label: "En revisión", color: "#3b1f5e", text: "#a78bfa" },
  done: { label: "Hecho", color: "#14532d", text: "#4ade80" },
};

const PRIORITY_CONFIG = {
  high: { label: "Alta", color: "#ef4444" },
  medium: { label: "Media", color: "#f59e0b" },
  low: { label: "Baja", color: "#6b7280" },
};

export default function DevBoard() {
  const [stories, setStories] = useState(() => {
    const initial = {};
    EPICS.forEach(e => e.stories.forEach(s => { initial[s.id] = s.status; }));
    return initial;
  });
  const [selected, setSelected] = useState(null);
  const [expandedEpics, setExpandedEpics] = useState(() => {
    const init = {};
    EPICS.forEach(e => { init[e.id] = true; });
    return init;
  });
  const [filterStatus, setFilterStatus] = useState("all");

  function cycleStatus(id) {
    const order = ["todo", "inprogress", "review", "done"];
    setStories(prev => {
      const curr = prev[id];
      const next = order[(order.indexOf(curr) + 1) % order.length];
      return { ...prev, [id]: next };
    });
  }

  function toggleEpic(id) {
    setExpandedEpics(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const selectedStory = selected
    ? EPICS.flatMap(e => e.stories).find(s => s.id === selected)
    : null;
  const selectedEpic = selected
    ? EPICS.find(e => e.stories.some(s => s.id === selected))
    : null;

  const totalStories = EPICS.reduce((a, e) => a + e.stories.length, 0);
  const doneStories = Object.values(stories).filter(s => s === "done").length;
  const progress = Math.round((doneStories / totalStories) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "'Inter', system-ui, sans-serif", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: 280, background: "#0d1117", borderRight: "1px solid #21262d", padding: "24px 0", flexShrink: 0, overflowY: "auto" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #21262d" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#7d8590", textTransform: "uppercase", marginBottom: 8 }}>Proyecto</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>Discipline App</div>
          <div style={{ fontSize: 12, color: "#7d8590", marginTop: 4 }}>React · Express · PostgreSQL</div>

          {/* Progress */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#7d8590", marginBottom: 6 }}>
              <span>Progreso general</span>
              <span style={{ color: "#e6edf3" }}>{doneStories}/{totalStories}</span>
            </div>
            <div style={{ height: 4, background: "#21262d", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#238636", borderRadius: 2, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: 11, color: "#7d8590", marginTop: 4 }}>{progress}% completado</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #21262d" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#7d8590", textTransform: "uppercase", marginBottom: 10 }}>Filtrar por estado</div>
          {[["all", "Todos"], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([val, label]) => (
            <div
              key={val}
              onClick={() => setFilterStatus(val)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                background: filterStatus === val ? "#21262d" : "transparent",
                color: filterStatus === val ? "#e6edf3" : "#7d8590",
                marginBottom: 2,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Epic nav */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#7d8590", textTransform: "uppercase", marginBottom: 10 }}>Épicas</div>
          {EPICS.map(epic => {
            const epicDone = epic.stories.filter(s => stories[s.id] === "done").length;
            return (
              <div
                key={epic.id}
                onClick={() => document.getElementById(epic.id)?.scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 2, background: epic.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#7d8590", flex: 1, lineHeight: 1.3 }}>{epic.title}</span>
                <span style={{ fontSize: 11, color: "#7d8590" }}>{epicDone}/{epic.stories.length}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px" }}>
        <div style={{ maxWidth: 860 }}>
          {EPICS.map(epic => {
            const epicStories = epic.stories.filter(s =>
              filterStatus === "all" || stories[s.id] === filterStatus
            );
            if (epicStories.length === 0 && filterStatus !== "all") return null;
            const epicDone = epic.stories.filter(s => stories[s.id] === "done").length;

            return (
              <div key={epic.id} id={epic.id} style={{ marginBottom: 40 }}>
                {/* Epic header */}
                <div
                  onClick={() => toggleEpic(epic.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", marginBottom: 16,
                    padding: "12px 16px",
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: 8,
                    borderLeft: `3px solid ${epic.color}`,
                  }}
                >
                  <span style={{ color: "#7d8590", fontSize: 12 }}>{expandedEpics[epic.id] ? "▾" : "▸"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: epic.color, fontWeight: 700, letterSpacing: "0.05em" }}>{epic.id}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#e6edf3" }}>{epic.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#7d8590", marginTop: 4 }}>{epic.description}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#7d8590", flexShrink: 0 }}>
                    {epicDone}/{epic.stories.length} stories
                  </div>
                </div>

                {/* Stories */}
                {expandedEpics[epic.id] && (
                  <div style={{ paddingLeft: 16 }}>
                    {(filterStatus === "all" ? epic.stories : epicStories).map(story => {
                      const status = stories[story.id];
                      const sc = STATUS_CONFIG[status];
                      const pc = PRIORITY_CONFIG[story.priority];
                      return (
                        <div
                          key={story.id}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "12px 16px",
                            background: "#161b22",
                            border: "1px solid #21262d",
                            borderRadius: 6,
                            marginBottom: 6,
                            cursor: "pointer",
                            transition: "border-color 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "#388bfd"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "#21262d"}
                          onClick={() => setSelected(story.id === selected ? null : story.id)}
                        >
                          {/* Status badge */}
                          <div
                            onClick={e => { e.stopPropagation(); cycleStatus(story.id); }}
                            style={{
                              padding: "3px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background: sc.color,
                              color: sc.text,
                              flexShrink: 0,
                              cursor: "pointer",
                              minWidth: 90,
                              textAlign: "center",
                            }}
                            title="Click para cambiar estado"
                          >
                            {sc.label}
                          </div>

                          <span style={{ fontSize: 11, color: "#7d8590", flexShrink: 0, fontFamily: "monospace" }}>{story.id}</span>

                          <span style={{ fontSize: 14, color: "#e6edf3", flex: 1 }}>{story.title}</span>

                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: pc.color, fontWeight: 600 }}>↑ {pc.label}</span>
                            <span style={{ fontSize: 11, color: "#7d8590", background: "#21262d", padding: "2px 6px", borderRadius: 4 }}>{story.estimate}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedStory && (
        <div style={{
          width: 380,
          borderLeft: "1px solid #21262d",
          background: "#0d1117",
          overflowY: "auto",
          padding: 24,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 11, color: selectedEpic?.color, fontWeight: 700 }}>{selectedEpic?.id} · {selectedStory.id}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#7d8590", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3", marginBottom: 16, lineHeight: 1.4 }}>{selectedStory.title}</h2>

          {/* Meta */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{
              padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600,
              background: STATUS_CONFIG[stories[selectedStory.id]].color,
              color: STATUS_CONFIG[stories[selectedStory.id]].text,
            }}>
              {STATUS_CONFIG[stories[selectedStory.id]].label}
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 4, fontSize: 12, background: "#21262d", color: PRIORITY_CONFIG[selectedStory.priority].color }}>
              ↑ {PRIORITY_CONFIG[selectedStory.priority].label}
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 4, fontSize: 12, background: "#21262d", color: "#7d8590" }}>
              ⏱ {selectedStory.estimate}
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #21262d", marginBottom: 20 }} />

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#7d8590", textTransform: "uppercase", marginBottom: 10 }}>Descripción</div>
            <p style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.7, margin: 0 }}>{selectedStory.description}</p>
          </div>

          {/* Acceptance criteria */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#7d8590", textTransform: "uppercase", marginBottom: 10 }}>Criterios de aceptación</div>
            {selectedStory.acceptance.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#238636", marginTop: 1, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#7d8590", textTransform: "uppercase", marginBottom: 10 }}>Stack involucrado</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {selectedStory.stack.map((s, i) => (
                <span key={i} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, background: "#161b22", border: "1px solid #21262d", color: "#7d8590" }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #21262d", margin: "20px 0" }} />

          {/* Change status */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#7d8590", textTransform: "uppercase", marginBottom: 10 }}>Cambiar estado</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                <button
                  key={val}
                  onClick={() => setStories(prev => ({ ...prev, [selectedStory.id]: val }))}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    background: stories[selectedStory.id] === val ? cfg.color : "#21262d",
                    color: stories[selectedStory.id] === val ? cfg.text : "#7d8590",
                    border: "1px solid",
                    borderColor: stories[selectedStory.id] === val ? cfg.text + "40" : "#21262d",
                    cursor: "pointer",
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

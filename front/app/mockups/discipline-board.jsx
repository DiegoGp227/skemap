"use client"
import { useState } from "react";

const EPICS = [
  {
    id: "E1",
    title: "Setup del proyecto",
    color: "#58a6ff",
    description: "Estructura base del monorepo, tooling, Docker y entorno de desarrollo listo para trabajar.",
    stories: [
      {
        id: "E1-S1",
        title: "Inicializar monorepo con /client y /server",
        estimate: "0.5d",
        priority: "high",
        description: "Crear repo en GitHub. Estructura: /client (React+Vite+Tailwind), /server (Node+Express). Configurar .gitignore, README y scripts en raíz. No usar workspaces de npm — mantener simple con dos package.json independientes.",
        acceptance: [
          "Repo en GitHub con rama main",
          "npm install funciona en /client y /server por separado",
          ".env.example en /server con todas las variables necesarias documentadas",
        ],
        stack: ["Git", "Node.js", "npm"],
        notes: "",
      },
      {
        id: "E1-S2",
        title: "Configurar Vite + React + Tailwind en /client",
        estimate: "0.5d",
        priority: "high",
        description: "Vite como bundler, React 18, Tailwind CSS v3. Eliminar boilerplate. Configurar alias de rutas (@/ apunta a /src). Instalar React Router v6 y Axios.",
        acceptance: [
          "npm run dev levanta en localhost:5173",
          "Tailwind aplica estilos",
          "npm run build genera /dist sin errores",
        ],
        stack: ["Vite", "React 18", "Tailwind CSS", "React Router v6", "Axios"],
        notes: "",
      },
      {
        id: "E1-S3",
        title: "Configurar Express + PostgreSQL en /server",
        estimate: "1d",
        priority: "high",
        description: "Express con estructura: /routes, /controllers, /models, /middleware, /config. Conexión a PostgreSQL con node-postgres (pg). Variables de entorno con dotenv. nodemon para desarrollo. Manejo centralizado de errores con middleware.",
        acceptance: [
          "npm run dev levanta en localhost:3001",
          "GET /api/health retorna 200 con status de DB",
          "Errores no manejados no crashean el proceso",
        ],
        stack: ["Express", "pg", "dotenv", "nodemon"],
        notes: "",
      },
      {
        id: "E1-S4",
        title: "Dockerizar para producción (Raspberry Pi)",
        estimate: "1d",
        priority: "high",
        description: "Dockerfile para /client (nginx:alpine sirviendo /dist) y /server (node:20-alpine). docker-compose.prod.yml con tres servicios: client (puerto 80), server (puerto 3001), postgres (puerto 5432 interno). Volumen nombrado para datos de PostgreSQL. Restart policy: unless-stopped.",
        acceptance: [
          "docker-compose -f docker-compose.prod.yml up -d levanta los tres servicios",
          "Client accesible en puerto 80",
          "DB persiste datos entre reinicios del contenedor",
          "Logs accesibles con docker logs",
        ],
        stack: ["Docker", "docker-compose", "nginx:alpine", "node:20-alpine"],
        notes: "Usar imágenes alpine para reducir tamaño — la Pi tiene recursos limitados.",
      },
    ],
  },
  {
    id: "E2",
    title: "Base de datos y modelos",
    color: "#f0883e",
    description: "Schema de PostgreSQL, migraciones y capa de acceso a datos. Cimiento de toda la lógica.",
    stories: [
      {
        id: "E2-S1",
        title: "Diseñar schema completo de PostgreSQL",
        estimate: "1d",
        priority: "high",
        description: `Tablas:\n\n• users (id UUID, email, password_hash, created_at)\n• blocks (id UUID, user_id, name, time TIME, active BOOLEAN, created_at)\n• block_days (id, block_id, day_of_week INT 0-6 donde 0=domingo)\n• daily_logs (id UUID, user_id, block_id, date DATE, completed BOOLEAN)\n• streaks (id, user_id, current_streak INT, longest_streak INT, last_valid_date DATE)\n\nConstraint clave: UNIQUE(block_id, day_of_week) en block_days. UNIQUE(user_id, block_id, date) en daily_logs.`,
        acceptance: [
          "Schema aplicado en DB de desarrollo",
          "Diagrama ER documentado en /docs/schema.md",
          "Constraints de unicidad funcionando — no hay duplicados posibles",
          "FK con CASCADE DELETE donde corresponde",
        ],
        stack: ["PostgreSQL", "SQL"],
        notes: "La tabla block_days es la pieza clave del diseño: un bloque puede estar activo en cualquier combinación de días.",
      },
      {
        id: "E2-S2",
        title: "Migraciones con node-pg-migrate",
        estimate: "0.5d",
        priority: "high",
        description: "Configurar node-pg-migrate. Scripts npm: db:migrate, db:rollback, db:migrate:status. Las migraciones corren automáticamente al iniciar el server en producción (npm start ejecuta migrate antes de levantar Express).",
        acceptance: [
          "npm run db:migrate aplica todas las migraciones en orden",
          "npm run db:rollback revierte la última",
          "Correr migrate dos veces es idempotente",
        ],
        stack: ["node-pg-migrate"],
        notes: "",
      },
      {
        id: "E2-S3",
        title: "Modelos de acceso a datos",
        estimate: "1.5d",
        priority: "high",
        description: "Capa de models con funciones que encapsulan queries SQL. Sin ORM.\n\n• UserModel: findById, findByEmail, create\n• BlockModel: findByUserAndDay(userId, dayOfWeek), create, update, delete, setDays\n• LogModel: findByUserAndDate, upsert\n• StreakModel: get, recalculate(userId, date)\n\nLa función recalculate es la más compleja: recorre hacia atrás desde la fecha dada contando días consecutivos válidos (todos los bloques del día completados O sin bloques ese día).",
        acceptance: [
          "No hay SQL crudo fuera de /models",
          "Queries usan parámetros preparados — sin riesgo de SQL injection",
          "recalculate maneja correctamente días sin bloques (cuenta como válido)",
          "Tests manuales documentados en /docs/models.md",
        ],
        stack: ["pg", "SQL"],
        notes: "La lógica de streak con días sin bloques como válidos vive aquí. Definirla bien evita bugs futuros.",
      },
    ],
  },
  {
    id: "E3",
    title: "Autenticación JWT",
    color: "#3fb950",
    description: "Registro, login, refresh tokens con rotación y middleware de protección de rutas.",
    stories: [
      {
        id: "E3-S1",
        title: "Endpoints de registro y login",
        estimate: "1d",
        priority: "high",
        description: "POST /api/auth/register: valida email+password (express-validator), hashea con bcrypt (rounds: 12), crea usuario, retorna access token (15min) en body y refresh token (7d) en httpOnly cookie.\n\nPOST /api/auth/login: busca por email, compara con bcrypt, si correcto emite tokens. Error 401 genérico si falla — no revelar si el email existe o no.",
        acceptance: [
          "Register con email duplicado retorna 400",
          "Password nunca se guarda en texto plano",
          "Login incorrecto retorna 401 con mensaje genérico",
          "Refresh token llega como httpOnly cookie (no accesible desde JS)",
        ],
        stack: ["bcrypt", "jsonwebtoken", "express-validator"],
        notes: "",
      },
      {
        id: "E3-S2",
        title: "Refresh token con rotación",
        estimate: "1d",
        priority: "high",
        description: "POST /api/auth/refresh: lee refresh token de la cookie. Lo verifica. Si es válido, genera nuevo access token Y nuevo refresh token (rotación). El anterior queda invalidado en tabla refresh_tokens (blacklist simple con token_hash + expires_at).\n\nPOST /api/auth/logout: invalida el refresh token actual y limpia la cookie.",
        acceptance: [
          "Refresh token usado solo puede usarse una vez",
          "Refresh expirado o reutilizado retorna 401",
          "Logout limpia cookie y blacklistea el token",
          "Tabla refresh_tokens tiene job de limpieza de tokens expirados",
        ],
        stack: ["jsonwebtoken", "pg"],
        notes: "La rotación de refresh tokens es la protección principal contra robo de sesión.",
      },
      {
        id: "E3-S3",
        title: "Middleware de autenticación",
        estimate: "0.5d",
        priority: "high",
        description: "authMiddleware: extrae Bearer token del header Authorization, verifica con JWT_ACCESS_SECRET, adjunta { id, email } a req.user. Si token ausente o inválido retorna 401. Si expirado retorna 401 con código 'TOKEN_EXPIRED' para que el cliente sepa que debe hacer refresh.",
        acceptance: [
          "Rutas protegidas sin token retornan 401",
          "req.user.id disponible en todos los controllers protegidos",
          "Token expirado retorna 401 con código distinguible de token inválido",
        ],
        stack: ["jsonwebtoken", "Express middleware"],
        notes: "",
      },
      {
        id: "E3-S4",
        title: "Auth en el cliente (React)",
        estimate: "1.5d",
        priority: "high",
        description: "AuthContext con useState para el access token en memoria (nunca en localStorage). Formularios de login y registro con validación client-side.\n\nAxios interceptor: adjunta token a cada request. Si recibe 401 con TOKEN_EXPIRED, llama a /refresh, obtiene nuevo access token y reintenta el request original de forma transparente.\n\nProtectedRoute component que redirige a /login si no hay sesión. Al cargar la app intenta refresh automático para restaurar sesión.",
        acceptance: [
          "Recargar la página restaura la sesión vía refresh cookie",
          "Access token nunca toca localStorage ni sessionStorage",
          "Refresh automático es transparente — el usuario no nota nada",
          "Logout limpia estado y redirige a /login",
        ],
        stack: ["React Context", "Axios interceptors", "React Router"],
        notes: "El interceptor de Axios es el punto más delicado — manejar la cola de requests durante el refresh para no hacer múltiples llamadas simultáneas.",
      },
    ],
  },
  {
    id: "E4",
    title: "API — Bloques y registros",
    color: "#bc8cff",
    description: "CRUD de bloques con asignación por día de semana y el sistema de logging diario con cálculo de streak.",
    stories: [
      {
        id: "E4-S1",
        title: "CRUD de bloques con días asignados",
        estimate: "1.5d",
        priority: "high",
        description: "GET /api/blocks — todos los bloques del usuario con sus días activos.\nGET /api/blocks/today — bloques activos para el día de hoy (UTC).\nPOST /api/blocks — crea bloque: { name, time, days: [0,1,2,3,4] }. Máximo 10 bloques por usuario.\nPUT /api/blocks/:id — edita name, time o days.\nDELETE /api/blocks/:id — soft delete (active = false). No borra historial.\n\ndays es un array de ints 0-6 (0=domingo, 1=lunes... 6=sábado).",
        acceptance: [
          "Todas las rutas requieren auth",
          "Usuario solo accede a sus propios bloques",
          "Límite de 10 bloques activos retorna 400",
          "GET /api/blocks/today retorna solo los bloques del día UTC actual",
          "Soft delete preserva daily_logs históricos",
        ],
        stack: ["Express", "pg"],
        notes: "El soft delete es importante — el historial es permanente según el diseño.",
      },
      {
        id: "E4-S2",
        title: "Endpoints de registro diario",
        estimate: "1d",
        priority: "high",
        description: "GET /api/logs?date=YYYY-MM-DD — retorna bloques activos para ese día con su estado completed. Solo permite consultar desde hace 1 año hasta mañana (no más).\n\nPOST /api/logs — body: { block_id, date, completed }. Validación: date debe ser hoy o ayer (UTC) — no se permite editar días anteriores. Hace upsert en daily_logs. Tras el upsert llama a StreakModel.recalculate(userId, date) y retorna el streak actualizado.",
        acceptance: [
          "POST con date anterior a ayer retorna 400",
          "POST con date futura retorna 400",
          "Upsert no duplica registros",
          "Streak retornado en la respuesta del POST — el cliente no necesita otro request",
        ],
        stack: ["Express", "pg"],
        notes: "La validación de fecha es la regla de negocio más importante de este endpoint.",
      },
      {
        id: "E4-S3",
        title: "Endpoint de resumen semanal",
        estimate: "1d",
        priority: "medium",
        description: "GET /api/stats/week?date=YYYY-MM-DD — retorna la semana (lunes a domingo) que contiene esa fecha.\n\nRespuesta: { days: [{date, status: 'complete'|'partial'|'empty'|'no_blocks'|'future'}], weekScore: int, blockStats: [{block_id, name, completedDays: int}], currentStreak: int }.\n\nStatus 'no_blocks' cuando no hay bloques asignados ese día (cuenta como válido para streak).",
        acceptance: [
          "Siempre retorna exactamente 7 días de lun a dom",
          "Días futuros retornan status 'future'",
          "no_blocks se distingue de empty",
          "Query eficiente — no hace N+1",
        ],
        stack: ["Express", "pg", "SQL agregaciones"],
        notes: "",
      },
    ],
  },
  {
    id: "E5",
    title: "Frontend — Vistas",
    color: "#f85149",
    description: "Las tres vistas de la app consumiendo la API real. Diseño minimalista, sin distracciones.",
    stories: [
      {
        id: "E5-S1",
        title: "Layout base y navegación",
        estimate: "0.5d",
        priority: "high",
        description: "Shell de la app: nav inferior (móvil) o lateral (desktop) con tres tabs: Hoy, Semana, Bloques. Header con fecha actual y streak visible en todas las vistas. Manejo de estados de carga y error global. Componente ErrorBoundary.",
        acceptance: [
          "Navegación funciona entre las tres vistas",
          "Streak siempre visible en header",
          "Estado de carga no produce layout shift",
        ],
        stack: ["React", "React Router", "Tailwind"],
        notes: "",
      },
      {
        id: "E5-S2",
        title: "Vista Hoy",
        estimate: "1.5d",
        priority: "high",
        description: "Fetch de GET /api/blocks/today + GET /api/logs?date=hoy al montar. Lista de bloques ordenada por hora. Click en bloque llama POST /api/logs con optimistic update — toggle inmediato, revert si el request falla.\n\nSi no hay bloques para hoy: estado vacío con CTA a crear bloques.\nStreak y contador X/Y actualizados tras cada toggle.",
        acceptance: [
          "Toggle es instantáneo (optimistic update)",
          "Streak se actualiza sin recargar la página",
          "Si todos los bloques están completos, indicador visual claro",
          "Estado persiste al recargar (viene de DB, no de estado local)",
        ],
        stack: ["React", "Axios", "Tailwind"],
        notes: "",
      },
      {
        id: "E5-S3",
        title: "Vista Semana",
        estimate: "1d",
        priority: "high",
        description: "Fetch de GET /api/stats/week?date=hoy. Grid de 7 días L-D con colores por status: dorado=completo, gris oscuro=parcial, casi negro=vacío, borde sutil=sin bloques, transparente=futuro. Contador de días perfectos. Barra de progreso por bloque (X/7).",
        acceptance: [
          "Grid refleja datos reales de la DB",
          "Status 'no_blocks' visualmente distinto de 'empty'",
          "Días futuros visualmente apagados y no clickeables",
        ],
        stack: ["React", "Axios", "Tailwind"],
        notes: "",
      },
      {
        id: "E5-S4",
        title: "Vista Bloques — gestión con días",
        estimate: "1.5d",
        priority: "high",
        description: "Lista de bloques del usuario con sus días activos mostrados (L M X J V S D con highlight). Formulario de creación: nombre, hora y selector de días (toggle por día). Edición inline. Eliminar con confirmación. Límite de 10 bloques reforzado en UI.\n\nEl selector de días es el componente más custom — 7 botones toggle tipo chip.",
        acceptance: [
          "Se pueden seleccionar cualquier combinación de días",
          "Cambios se reflejan inmediatamente en vista Hoy",
          "Eliminar un bloque no borra historial (soft delete)",
          "Límite de 10 bloques bloquea el formulario con mensaje claro",
        ],
        stack: ["React", "Axios", "Tailwind"],
        notes: "El selector de días es el componente de UI más complejo de toda la app.",
      },
    ],
  },
  {
    id: "E6",
    title: "Deploy en Raspberry Pi",
    color: "#39d353",
    description: "Producción: docker-compose en la Pi, Cloudflare Tunnel para HTTPS y webhook de deploy automático desde GitHub.",
    stories: [
      {
        id: "E6-S1",
        title: "Deploy inicial en la Pi con docker-compose",
        estimate: "1d",
        priority: "high",
        description: "Clonar repo en la Pi. Crear .env de producción con secrets reales. Ejecutar migraciones. docker-compose -f docker-compose.prod.yml up -d. Verificar que los tres servicios levantan y la DB persiste.\n\nnginx en el contenedor de client actúa como reverse proxy: /api/* → server:3001, /* → /dist.",
        acceptance: [
          "App accesible en la red local de la Pi",
          "DB persistente en volumen Docker",
          "Logs sin errores en arranque",
          "Migraciones corren automáticamente al iniciar server",
        ],
        stack: ["Docker", "docker-compose", "nginx", "PostgreSQL"],
        notes: "Configurar nginx como reverse proxy interno elimina problemas de CORS en producción.",
      },
      {
        id: "E6-S2",
        title: "Cloudflare Tunnel para acceso HTTPS",
        estimate: "0.5d",
        priority: "high",
        description: "Configurar cloudflared como contenedor adicional en docker-compose.prod.yml. Tunnel apunta al contenedor de nginx (puerto 80). HTTPS automático via Cloudflare. Subdominio: discipline.tudominio.com.\n\ncloudflared corre con restart: unless-stopped.",
        acceptance: [
          "App accesible desde internet vía HTTPS",
          "Sin puertos abiertos en el router",
          "Tunnel sobrevive reinicios de la Pi",
          "HTTP redirige a HTTPS automáticamente",
        ],
        stack: ["Cloudflare Tunnel", "cloudflared", "Docker"],
        notes: "Ya tienes esta infraestructura en otros proyectos — replicar el mismo patrón.",
      },
      {
        id: "E6-S3",
        title: "Webhook de deploy automático",
        estimate: "1d",
        priority: "medium",
        description: "Script bash /scripts/deploy.sh: git pull origin main → docker-compose build → docker-compose up -d → docker system prune -f.\n\nEndpoint en el server Express: POST /api/deploy — valida HMAC del webhook de GitHub con WEBHOOK_SECRET, ejecuta el script con child_process.exec. Solo accesible desde IP de GitHub (validar X-GitHub-Delivery header).\n\nConfigurar webhook en GitHub apuntando a discipline.tudominio.com/api/deploy.",
        acceptance: [
          "Push a main dispara deploy automático en menos de 2 minutos",
          "Webhook con secret inválido retorna 401 sin ejecutar nada",
          "Deploy no genera downtime visible (contenedores se reemplazan uno a uno)",
          "Log del deploy accesible con docker logs",
        ],
        stack: ["bash", "GitHub Webhooks", "child_process", "Docker"],
        notes: "",
      },
    ],
  },
];

const STATUS = {
  todo: { label: "Por hacer", bg: "#21262d", text: "#8b949e" },
  inprogress: { label: "En progreso", bg: "#0d2044", text: "#58a6ff" },
  review: { label: "Revisión", bg: "#1a0d44", text: "#bc8cff" },
  done: { label: "Hecho", bg: "#0d2d0d", text: "#3fb950" },
};

const PRIORITY = {
  high: "#f85149",
  medium: "#f0883e",
  low: "#8b949e",
};

function Badge({ children, bg, color, onClick, title }) {
  return (
    <span
      onClick={onClick}
      title={title}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: bg,
        color: color,
        cursor: onClick ? "pointer" : "default",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {children}
    </span>
  );
}

export default function Board() {
  const [statuses, setStatuses] = useState(() => {
    const s = {};
    EPICS.forEach(e => e.stories.forEach(st => { s[st.id] = "todo"; }));
    return s;
  });
  const [selected, setSelected] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [filter, setFilter] = useState("all");

  const totalStories = EPICS.reduce((a, e) => a + e.stories.length, 0);
  const doneCount = Object.values(statuses).filter(s => s === "done").length;
  const progress = Math.round((doneCount / totalStories) * 100);

  const allStories = EPICS.flatMap(e => e.stories.map(s => ({ ...s, epic: e })));
  const selStory = selected ? allStories.find(s => s.id === selected) : null;

  function nextStatus(id) {
    const order = ["todo", "inprogress", "review", "done"];
    setStatuses(p => ({ ...p, [id]: order[(order.indexOf(p[id]) + 1) % order.length] }));
  }

  function toggleCollapse(id) {
    setCollapsed(p => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", fontSize: 14 }}>

      {/* SIDEBAR */}
      <div style={{ width: 240, borderRight: "1px solid #21262d", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Project info */}
        <div style={{ padding: "24px 16px 20px", borderBottom: "1px solid #21262d" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#7d8590", textTransform: "uppercase", marginBottom: 6 }}>Proyecto</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Discipline App</div>
          <div style={{ fontSize: 12, color: "#7d8590" }}>React · Express · PostgreSQL</div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#7d8590", marginBottom: 5 }}>
              <span>Progreso</span><span style={{ color: "#e6edf3" }}>{doneCount}/{totalStories}</span>
            </div>
            <div style={{ height: 3, background: "#21262d", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#238636", borderRadius: 2, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ padding: "16px", borderBottom: "1px solid #21262d" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#7d8590", textTransform: "uppercase", marginBottom: 8 }}>Estado</div>
          {[["all", "Todos"], ...Object.entries(STATUS).map(([k, v]) => [k, v.label])].map(([val, label]) => (
            <div key={val} onClick={() => setFilter(val)} style={{
              padding: "5px 8px", borderRadius: 5, cursor: "pointer", fontSize: 12,
              background: filter === val ? "#21262d" : "transparent",
              color: filter === val ? "#e6edf3" : "#7d8590",
              marginBottom: 1,
            }}>{label}</div>
          ))}
        </div>

        {/* Epic nav */}
        <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#7d8590", textTransform: "uppercase", marginBottom: 8 }}>Épicas</div>
          {EPICS.map(e => {
            const done = e.stories.filter(s => statuses[s.id] === "done").length;
            return (
              <div key={e.id} onClick={() => document.getElementById(e.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 5, cursor: "pointer", marginBottom: 2 }}
                onMouseEnter={el => el.currentTarget.style.background = "#161b22"}
                onMouseLeave={el => el.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 7, height: 7, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#7d8590", flex: 1, lineHeight: 1.3 }}>{e.title}</span>
                <span style={{ fontSize: 11, color: "#484f58" }}>{done}/{e.stories.length}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px" }}>
        <div style={{ maxWidth: 820 }}>
          {EPICS.map((epic, ei) => {
            const visible = filter === "all" ? epic.stories : epic.stories.filter(s => statuses[s.id] === filter);
            if (visible.length === 0 && filter !== "all") return null;
            const epicDone = epic.stories.filter(s => statuses[s.id] === "done").length;
            const isCollapsed = collapsed[epic.id];

            return (
              <div key={epic.id} id={epic.id} style={{ marginBottom: 36 }}>
                {/* Epic header */}
                <div onClick={() => toggleCollapse(epic.id)} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "14px 16px",
                  background: "#161b22",
                  border: "1px solid #21262d",
                  borderLeft: `3px solid ${epic.color}`,
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: "pointer",
                }}>
                  <span style={{ color: "#484f58", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{isCollapsed ? "▸" : "▾"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: epic.color, letterSpacing: "0.05em" }}>{epic.id}</span>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{epic.title}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#7d8590" }}>{epic.description}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#484f58", flexShrink: 0, marginTop: 2 }}>{epicDone}/{epic.stories.length}</span>
                </div>

                {/* Stories */}
                {!isCollapsed && (
                  <div style={{ paddingLeft: 12 }}>
                    {(filter === "all" ? epic.stories : visible).map(story => {
                      const sc = STATUS[statuses[story.id]];
                      return (
                        <div
                          key={story.id}
                          onClick={() => setSelected(selected === story.id ? null : story.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "11px 14px",
                            background: selected === story.id ? "#161b22" : "#0d1117",
                            border: `1px solid ${selected === story.id ? "#388bfd" : "#21262d"}`,
                            borderRadius: 6,
                            marginBottom: 4,
                            cursor: "pointer",
                            transition: "border-color 0.1s",
                          }}
                        >
                          <Badge bg={sc.bg} color={sc.text} onClick={e => { e.stopPropagation(); nextStatus(story.id); }} title="Click para avanzar estado">
                            {sc.label}
                          </Badge>
                          <span style={{ fontSize: 11, color: "#484f58", fontFamily: "monospace", flexShrink: 0 }}>{story.id}</span>
                          <span style={{ flex: 1, fontSize: 13, color: "#e6edf3" }}>{story.title}</span>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: PRIORITY[story.priority], fontWeight: 700 }}>●</span>
                            <span style={{ fontSize: 11, color: "#484f58", background: "#21262d", padding: "2px 7px", borderRadius: 4 }}>{story.estimate}</span>
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

      {/* DETAIL PANEL */}
      {selStory && (
        <div style={{
          width: 360,
          borderLeft: "1px solid #21262d",
          background: "#0d1117",
          overflowY: "auto",
          padding: 24,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: selStory.epic.color, fontWeight: 700 }}>{selStory.id}</span>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#7d8590", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
          </div>

          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, lineHeight: 1.4, color: "#e6edf3" }}>{selStory.title}</h2>

          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            <Badge bg={STATUS[statuses[selStory.id]].bg} color={STATUS[statuses[selStory.id]].text}>{STATUS[statuses[selStory.id]].label}</Badge>
            <Badge bg="#21262d" color={PRIORITY[selStory.priority]}>● {selStory.priority === "high" ? "Alta" : selStory.priority === "medium" ? "Media" : "Baja"}</Badge>
            <Badge bg="#21262d" color="#7d8590">⏱ {selStory.estimate}</Badge>
          </div>

          <div style={{ borderBottom: "1px solid #21262d", marginBottom: 20 }} />

          <Section title="Descripción">
            <p style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>{selStory.description}</p>
          </Section>

          <Section title="Criterios de aceptación">
            {selStory.acceptance.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#238636", flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </Section>

          {selStory.notes && (
            <Section title="Nota técnica">
              <p style={{ fontSize: 12, color: "#7d8590", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{selStory.notes}</p>
            </Section>
          )}

          <Section title="Stack">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {selStory.stack.map((s, i) => (
                <span key={i} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, background: "#161b22", border: "1px solid #21262d", color: "#7d8590" }}>{s}</span>
              ))}
            </div>
          </Section>

          <div style={{ borderBottom: "1px solid #21262d", marginBottom: 16 }} />

          <Section title="Cambiar estado">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {Object.entries(STATUS).map(([val, cfg]) => (
                <button key={val} onClick={() => setStatuses(p => ({ ...p, [selStory.id]: val }))}
                  style={{
                    padding: "6px 0",
                    borderRadius: 5,
                    fontSize: 12,
                    fontWeight: 600,
                    background: statuses[selStory.id] === val ? cfg.bg : "#161b22",
                    color: statuses[selStory.id] === val ? cfg.text : "#484f58",
                    border: `1px solid ${statuses[selStory.id] === val ? cfg.text + "50" : "#21262d"}`,
                    cursor: "pointer",
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#7d8590", textTransform: "uppercase", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

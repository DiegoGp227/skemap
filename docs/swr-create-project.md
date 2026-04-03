# Integración de SWR para crear y listar proyectos

## Lo que se hizo

Se migró el sistema de fetch y creación de proyectos de estado manual con `useState` + `useEffect` a **SWR**, una librería de data fetching que maneja el cache automáticamente.

### Problema anterior

- `useProjects` exponía un `fetchProjects` que había que llamar manualmente desde un `useEffect` en `HomeSistem`.
- Tras crear un proyecto, `NewProjectForm` recibía un prop `onSuccess` con la función `fetchProjects` para refrescar la lista — esto es prop drilling y acopla el form al comportamiento del padre.

### Solución con SWR

**`useProjects`**
- Usa `useSWR` con la key `["projects", status, search]`.
- Cuando `status` o `search` cambian, SWR detecta una key distinta y re-fetcha solo. Ya no necesita `useEffect` ni exponer `fetchProjects`.

**`useCreateProject`**
- Tras crear exitosamente, llama a `mutate()` global de SWR con un filtro que invalida todas las keys que empiecen con `"projects"`.
- Esto hace que cualquier instancia de `useProjects` en el árbol re-fetche de forma automática, sin importar desde dónde se llame `handleCreateProject`.

**`NewProjectForm`**
- Ya no recibe `onSuccess`. Solo cierra el modal si el create fue exitoso.
- El refetch de la lista ocurre como efecto secundario de la invalidación del cache en el hook.

**`HomeSistem`**
- Pasa `status` y `search` directo a `useProjects` como argumentos.
- Ya no coordina el refetch, no tiene `useEffect`, no pasa callbacks al form.

---

## Cómo aprender esto

### 1. Entender el problema que resuelve SWR

Antes de leer la docs, entendé qué problema resuelve: sincronizar datos del servidor con la UI sin escribir lógica de fetch manual en cada componente. SWR se encarga del cache, la deduplicación de requests y la revalidación.

- Lee: [Why SWR](https://swr.vercel.app/docs/getting-started)

### 2. Conceptos clave a estudiar en orden

1. **`useSWR(key, fetcher)`** — La key identifica el recurso. Si la key cambia, SWR re-fetcha. Si es la misma, usa el cache.
2. **Keys como arrays** — Usar `["projects", status, search]` como key permite incluir parámetros dinámicos sin concatenar strings.
3. **`mutate()`** — Invalida el cache de una key y opcionalmente fuerza el refetch. Es el mecanismo central para sincronizar tras una mutación (POST, DELETE, etc.).
4. **`mutate` con filtro de función** — `mutate((key) => ...)` permite invalidar múltiples keys a la vez sin saber sus valores exactos. Útil cuando la key tiene parámetros dinámicos como los filtros de búsqueda.

### 3. Recursos

- [Documentación oficial de SWR](https://swr.vercel.app) — corta y muy clara, recomendada leerla completa.
- Sección específica de mutación: [Mutation & Revalidation](https://swr.vercel.app/docs/mutation)
- Video recomendado: buscar "SWR React data fetching" en YouTube, el canal de Vercel tiene ejemplos prácticos.

### 4. Ejercicio para fijar el concepto

Implementar un `useDeleteProject` que tras eliminar un proyecto llame a `mutate()` e invalide el cache — exactamente el mismo patrón que `useCreateProject`. Si lo podés hacer solo, entendiste SWR.

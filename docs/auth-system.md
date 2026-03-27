# Auth System — Cómo funciona

Este documento explica la arquitectura y el flujo de la feature de autenticación en Skemap.

---

## Stack

| Capa      | Tecnología                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 16, React 19, Tailwind CSS  |
| Animación | Framer Motion                       |
| Formularios | React Hook Form                   |
| Backend   | Express 5, TypeScript               |
| ORM       | Prisma + PostgreSQL                 |
| Auth      | JWT (access token + refresh token)  |

---

## Estructura de archivos

```
front/app/auth/
├── page.tsx                          # Página /auth
└── components/
    ├── molecules/
    │   ├── SelectSistem.tsx          # Tabs "Login / Sign Up"
    │   └── InfoDiv.tsx               # Panel izquierdo con branding
    └── organism/
        ├── AuthCard.tsx              # Contenedor principal (card)
        ├── AuthSistem.tsx            # Orquesta tabs + animación + forms
        ├── LoginForm.tsx             # Formulario de login
        └── SignUpForm.tsx            # Formulario de registro
```

---

## Layout de la card

La card está dividida en dos paneles dentro de un `flex`:

```
┌─────────────────────────────────────────┐
│  InfoDiv (42%, shrink-0)  │  AuthSistem │
│                           │  (flex-1)   │
│  Logo + texto de marca    │  Tabs       │
│  + features               │  + Form     │
└─────────────────────────────────────────┘
```

`InfoDiv` tiene `shrink-0` para mantener su ancho fijo.
`AuthSistem` tiene `flex-1` para ocupar el espacio restante sin desbordarse.

---

## Transición entre formularios

El cambio entre Login y Sign Up usa **Framer Motion** con `AnimatePresence`.

### Por qué no un slider como en el mockup

El mockup HTML mantiene ambos formularios en el DOM y desliza una ventana sobre ellos.
En React, el patrón correcto es renderizar uno u otro condicionalmente — pero eso impide animar la salida del componente que desaparece.

`AnimatePresence` resuelve esto: mantiene el componente saliente en el DOM durante su animación de salida y luego lo desmonta.

### Cómo funciona la animación

```tsx
// AuthSistem.tsx

const variants = {
  enter: (toLogin: boolean) => ({
    x: toLogin ? -40 : 40,   // entra desde el lado opuesto al que sale
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (toLogin: boolean) => ({
    x: toLogin ? 40 : -40,   // sale hacia el lado contrario
    opacity: 0,
  }),
};
```

- **Login → SignUp**: el login sale hacia la izquierda (`x: -40`), el signup entra desde la derecha (`x: 40`).
- **SignUp → Login**: inverso — sale a la derecha, entra desde la izquierda.
- `mode="wait"` hace que la animación de entrada espere a que termine la de salida.
- `custom={isLogin}` pasa la dirección a cada variant en tiempo de ejecución.

```tsx
<AnimatePresence mode="wait" custom={isLogin}>
  <motion.div
    key={isLogin ? "login" : "signup"}   // key diferente = Framer trata cada uno como elemento nuevo
    custom={isLogin}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
  >
    {isLogin ? <LoginForm /> : <SignUpForm />}
  </motion.div>
</AnimatePresence>
```

> El `key` es lo más importante: cuando cambia, Framer Motion sabe que debe desmontar el elemento anterior (con animación de salida) y montar el nuevo (con animación de entrada).

---

## Formularios

Ambos formularios usan **React Hook Form** para manejar el estado y la validación sin re-renders innecesarios.

```tsx
const { register, handleSubmit, formState: { errors } } = useForm();
```

- `register("campo")` conecta el input al form sin necesidad de `useState`.
- `handleSubmit(fn)` valida y llama a `fn` solo si no hay errores.

### SignUpForm — layout de dos columnas

Los campos Name y UserName están en una fila con dos columnas. Para evitar desbordamiento dentro de un contenedor flex:

```tsx
// Correcto: flex-1 + min-w-0 en cada columna, w-full en cada input
<div className="flex w-full gap-5">
  <div className="flex flex-col flex-1 min-w-0">
    <input className="w-full ..." />
  </div>
  <div className="flex flex-col flex-1 min-w-0">
    <input className="w-full ..." />
  </div>
</div>
```

- `flex-1` distribuye el espacio en partes iguales.
- `min-w-0` permite que el flex item encoja por debajo del tamaño mínimo del `<input>` (que por defecto es ~160px).
- `w-full` en el input hace que llene su contenedor en lugar de usar el ancho nativo del browser.

---

## Flujo de autenticación (pendiente de implementar)

```
[SignUpForm] ──POST /api/auth/signup──► [Express]
                                            │
                                       bcrypt hash
                                       Prisma create user
                                            │
                                      ◄─ { accessToken, refreshToken }

[LoginForm]  ──POST /api/auth/login──► [Express]
                                            │
                                       bcrypt compare
                                       sign JWT
                                            │
                                      ◄─ { accessToken, refreshToken }

accessToken  → en memoria (contexto React)
refreshToken → cookie httpOnly
```

El access token **no va a localStorage** para evitar ataques XSS. El refresh token va en cookie httpOnly para que JavaScript no pueda leerlo.

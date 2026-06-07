# CHANGELOG — UTNotasApp

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026  
**Integrantes:** Andrada Santiago · Barbé Dante · Diez Nicolás · Soler Tomás

---

## [Entrega 2] — Escalado funcional · 9 de junio 2026

### Nuevas funcionalidades

- **Edición de perfil:** formulario con nombre, apellido y username; email bloqueado; confirmación con contraseña (`AuthContext`, `ProfileScreen`)
- **Eliminación de cuenta:** modal de confirmación con campo de contraseña y toggle de visibilidad; método `deleteAccount` en `AuthContext` conectado a `DELETE /api/users/:id`
- **Ownership check en materiales:** solo el autor (o un ADMIN) puede editar o eliminar sus materiales — validado tanto en backend como en frontend (`isOwner` en `useMaterial`, botones condicionales en `MaterialDetailScreen`)
- **Autenticación con Google OAuth:** integración con `google-auth-library` en backend, nuevo endpoint `POST /api/auth/google`

### Mejoras y correcciones

- Fix: error `useAuth` fuera de `AuthProvider` en `_layout.tsx`
- Fix: regresión en pantalla de login (botón de registro faltante)
- Fix: `ReferenceError: Property 'email' doesn't exist` en registro
- Fix: redirección post-login al home (`router.replace("/")`)
- Fix: import faltante `KeyboardAvoidingView` en `SignupScreen`
- Fix: `careerId` opcional en schema de Prisma para permitir registro sin carrera seleccionada
- Mejora: estado visual de la pantalla de perfil sin sesión iniciada

### Backend

- Nuevo endpoint: `PATCH /api/users/:id` — actualizar perfil (auth requerida, ownership check)
- Nuevo endpoint: `DELETE /api/users/:id` — eliminar cuenta (auth requerida, confirmación de contraseña)
- Nuevo endpoint: `POST /api/auth/google` — login/registro con Google OAuth
- Refactor: `navigateAfterAuth.ts` extraído como utilidad reutilizable

---

## [Entrega 1] — MVP Básico · 12 de mayo 2026

### Funcionalidades implementadas

- **Autenticación:** registro de usuarios (con selección de carrera), login con email y contraseña, JWT con cookies HttpOnly, cierre de sesión
- **Materiales — Subir:** formulario multi-campo (título, descripción, tipo, materia, año, comisión, archivo), validación Zod en frontend y backend
- **Materiales — Buscar:** búsqueda por texto libre (título, descripción, comisión), filtros por tipo, materia, carrera, año y comisión; paginación cursor-based
- **Materiales — Ver detalle:** pantalla de detalle con información completa del material y datos del autor
- **Materiales — Editar/Eliminar:** reutilización del formulario de carga para edición; confirmación antes de eliminar
- **Perfil de usuario:** pantalla de perfil con datos del usuario autenticado y botón de cierre de sesión

### Stack tecnológico

- **Frontend:** React Native + Expo + TypeScript + expo-router + TanStack Query
- **Backend:** Express.js + TypeScript + Prisma ORM + PostgreSQL
- **Auth:** JWT (7 días) + bcryptjs
- **Validación:** Zod (backend y frontend)
- **Estado global:** React Context API

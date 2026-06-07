# Índice de consultas a IA — Entrega 2

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026

Este directorio contiene las conversaciones con asistentes de IA utilizadas durante el desarrollo de la Entrega 2.

---

## Conversaciones

| # | Archivo | Tema | Herramienta | Archivos afectados |
|---|---------|------|-------------|-------------------|
| 1 | [editar_perfil.md](editar_perfil.md) | Implementacion de la feature de edicion de perfil: formulario con nombre, apellido y usuario; email bloqueado; confirmacion con contrasena | Claude | `AuthContext.tsx`, `profile.tsx`, `ProfileScreen.tsx` |
| 2 | [eliminar_cuenta.md](eliminar_cuenta.md) | Funcionalidad de eliminar cuenta: modal de confirmacion con campo de contrasena, toggle de visibilidad y boton posicionado en la parte inferior | Claude | `AuthContext.tsx`, `profile.tsx` |
| 3 | [bugs_y_backend.md](bugs_y_backend.md) | Resolucion de bugs y regresiones: error useAuth, regresion en login, error registro, setup del backend, careerId opcional en Prisma, redireccion post-login, KeyboardAvoidingView, estilos del estado sin sesion | Claude | `_layout.tsx`, `schema.prisma`, `navigateAfterAuth.ts`, `ProfileScreen.tsx`, `SignupScreen.tsx` |

---

## Archivos de referencia

| Archivo | Descripcion |
|---------|-------------|
| [skills_claude_e2.md](skills_claude_e2.md) | Detalle de las skills y capacidades de Claude utilizadas durante el desarrollo de la Entrega 2 |

---

## Temas consultados (resumen)

| # | Tema | Herramienta |
|---|------|-------------|
| 1 | Implementacion de edicion de perfil con formulario expandible | Claude |
| 2 | Metodo `updateProfile` en `AuthContext` conectado a `PATCH /api/users/:id` | Claude |
| 3 | Bloqueo del campo email en el formulario de edicion | Claude |
| 4 | Mejoras visuales en la pantalla de perfil autenticado | Claude |
| 5 | Modal de confirmacion para eliminar cuenta con campo de contrasena | Claude |
| 6 | Toggle de visibilidad de contrasena en modal (icono ojo/ojo-cerrado) | Claude |
| 7 | Posicionamiento del boton "Eliminar cuenta" al pie de pantalla (`marginTop: "auto"`) | Claude |
| 8 | Metodo `deleteAccount` en `AuthContext` conectado a `DELETE /api/users/:id` | Claude |
| 9 | Fix error `useAuth` fuera de `AuthProvider` en `_layout.tsx` | Claude |
| 10 | Restauracion de pantalla de login con boton de registro | Claude |
| 11 | Fix `ReferenceError: Property 'email' doesn't exist` en registro | Claude |
| 12 | Setup del backend: `prisma generate` y `npm run dev` | Claude |
| 13 | `careerId` opcional en schema de Prisma para permitir registro sin carrera | Claude |
| 14 | Fix de redireccion post-login al home (`router.replace("/")`) | Claude |
| 15 | Fix de import faltante `KeyboardAvoidingView` | Claude |
| 16 | Verificacion de ownership en backend: `updateMaterial` y `deleteMaterial` | Claude |
| 17 | Verificacion de ownership en frontend: `isOwner` en `useMaterial`, botones condicionales en `MaterialDetailScreen` | Claude |

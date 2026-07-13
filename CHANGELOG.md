# CHANGELOG — UTNotasApp

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026  
**Integrantes:** Andrada Santiago · Barbé Dante · Diez Nicolás · Soler Tomás

---

## [Entrega 3] — Producto final · 14 de julio 2026

### Nuevas funcionalidades

- **Votos (upvote/downvote):** los usuarios autenticados pueden votar materiales; el score se actualiza en tiempo real en la vista de detalle y en los resultados de búsqueda (`MaterialActionBar`, `useMaterialEngagement`, `POST/PATCH/DELETE /api/materials/:id/calificaciones/me`)
- **Favoritos:** toggle para marcar/desmarcar materiales como favoritos, persistido en backend (`GET/POST /api/favoritos/:materialId`, `toggleFavorite` en frontend)
- **Reportes:** cualquier usuario autenticado puede reportar un material con motivo y descripción; los ADMIN ven y gestionan los reportes desde una pantalla dedicada (`ReportMaterialModal`, `AdminReportsScreen`, CRUD `/api/reportes`)
- **CRUD de Materias y Carreras:** endpoints completos con gestión de la relación CarreraMateria (año en que se cursa), accesibles solo para ADMIN
- **Catálogo académico conectado a la API:** el formulario de subida de material y el registro de usuario usan las carreras y materias reales de la base de datos en lugar de listas mock; el flujo de selección es materia → carrera → comisión
- **Captura de imagen con cámara:** al adjuntar archivos al material, el usuario puede elegir entre seleccionar un archivo del sistema o tomar una foto con la cámara del dispositivo (`expo-image-picker`, `pickFromCamera`, botón "Tomar foto" en `FileUploadField`)
- **Seed de base de datos:** las 6 carreras y sus materias asociadas se cargan automáticamente via `prisma/seed.ts`

### Mejoras y correcciones

- Fix: `materiaId` era requerido en el schema Zod de creación de material pero el service lo ignoraba, causando 500 al no enviarlo — se marcó como opcional/nullable
- Fix: `rootDir` en `tsconfig.json` apuntaba a `.` en lugar de `./src`, generando `dist/src/server.js` en lugar de `dist/server.js` y rompiendo el start en Render
- Fix: se agrega `tsconfig.build.json` que extiende el base para que el comando de build de Render (`npx tsc -p tsconfig.build.json`) encuentre el archivo
- Fix: CORS ampliado para permitir requests desde la APK (origin `undefined`)
- Mejora: el perfil del usuario autenticado se enriquece con datos de carrera y materiales publicados (`useGetMaterials({ userId })` reemplaza store local)
- Mejora: `careerId` y `materiaId` pasan a ser obligatorios en el schema de Prisma (E3), con migración aplicada

### Backend

- Nuevos endpoints: CRUD completo de `/api/materias` y `/api/carreras` (incluyendo gestión de `CarreraMateria`)
- Nuevos endpoints: `/api/materials/:materialId/calificaciones` — votos por material con operaciones me (get/create/update/delete)
- Nuevos endpoints: `/api/favoritos` y `/api/favoritos/:materialId` — estado y toggle de favorito
- Nuevos endpoints: `/api/reportes` — creación por usuarios, listado y eliminación por ADMIN
- Nuevo endpoint: `GET /api/carreras/materia/:materiaId` — carreras que dictan una materia
- Refactor: `idParamSchema` centralizado en `shared.validation.ts`; saltos de línea por restricción en todos los schemas Zod

### Frontend

- Nuevo componente: `MaterialActionBar` — barra de acciones (voto, favorito, reporte, compartir) integrada en detalle y tarjetas de resultado
- Nuevo componente: `ReportMaterialModal` — modal con selector de motivo y campo de descripción
- Nueva pantalla: `AdminReportsScreen` — panel de reportes accesible solo para ADMIN desde el tab de navegación
- Nuevo hook: `useMaterialEngagement` — orquesta votos, favoritos, reportes y compartir para un material dado
- Nuevos hooks: `useMaterias`, `useCarreras`, `useCarrerasByMateria`, `useCarreraMateriaAnio` (caché de 10 min para catálogo académico)

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

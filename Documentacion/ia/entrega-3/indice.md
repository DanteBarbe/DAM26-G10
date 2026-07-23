# Índice de consultas a IA — Entrega 3

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026

Este directorio contiene las conversaciones con asistentes de IA utilizadas durante el desarrollo de la Entrega 3.

---

## Conversaciones

| # | Archivo | Tema | Herramienta | Archivos afectados |
|---|---------|------|-------------|-------------------|
| 1 | [feat cargar imágenes + fix error de build.md](feat%20cargar%20im%C3%A1genes%20+%20fix%20error%20de%20build.md) | Feature de cámara para subir imágenes (`expo-image-picker`); fix del error 500 al crear material (`materiaId` requerido en Zod); fix del build en Render (`tsconfig.build.json`, ruta de `dist/server.js`); documentación técnica de endpoints | Claude | `filePicker.ts`, `FileUploadField.tsx`, `MaterialCreateScreen.tsx`, `MaterialCreate.styles.ts`, `material.validation.ts`, `tsconfig.build.json`, `API_ENDPOINTS.md` |
| 2 | [feat carreras y materias (crear, filtrar, seed).md](feat%20carreras%20y%20materias%20%28crear%2C%20filtrar%2C%20seed%29.md) | Carreras y materias en materiales: crear (materia → carrera filtrada → comisión autocompletada), filtrar por materia/carrera y mostrarlas; fix de `createMaterial`/`createUser` (guardan las FKs); seed del catálogo (6 carreras + básicas comunes + específicas por carrera); fix del "Materia 2"; DB compartida en Supabase/Render | Claude | `material.service.ts`, `user.service.ts`, `prisma/seed.ts`, `catalogService.ts`, `useCatalog.ts`, `useMaterialForm.ts`, `MaterialCreateScreen.tsx`, `FilterModal.tsx`, `MaterialDetailScreen.tsx`, `MaterialResultCard.tsx`, `materialService.ts`, `SignupScreen.tsx` |

---

## Archivos de referencia

| Archivo | Descripcion |
|---------|-------------|
| [skills_claude_final.md](skills_claude_final.md) | Detalle de las skills y capacidades de Claude utilizadas durante el desarrollo |

---

## Temas consultados (resumen)

| # | Tema | Herramienta |
|---|------|-------------|
| 1 | Feature de cámara: agregar `pickFromCamera` (`expo-image-picker`) y dos botones (archivo / foto) en `FileUploadField` | Claude |
| 2 | Fix error 500 al crear material: `materiaId` estaba requerido en el schema Zod pero el front no lo enviaba | Claude |
| 3 | Fix build en Render: crear `tsconfig.build.json` y corregir la ruta de arranque a `dist/server.js` | Claude |
| 4 | Documentación técnica: tabla de endpoints del backend (`API_ENDPOINTS.md`) | Claude |
| 5 | Análisis del backend/DB para carreras y materias: endpoints `/api/materias`, `/api/carreras`, `/api/carreras/materia/:id`, `/api/carreras/:id/materias/:materiaId` | Claude |
| 6 | Fix backend: `createMaterial` guarda `materiaId`/`carreraId` y `createUser` guarda `careerId` (bloqueaba el build) | Claude |
| 7 | Capa de catálogo en el front: `catalogService` + `useCatalog` (react-query) contra la API real | Claude |
| 8 | Formulario de material: materia obligatoria → carrera filtrada por materia → comisión con prefijo (letra carrera + año) + dígito | Claude |
| 9 | Filtro de búsqueda: primero materia y luego las carreras que la dictan | Claude |
| 10 | Mostrar materia/carrera en tarjeta y detalle del material | Claude |
| 11 | Registro (`SignupScreen`) usa las carreras reales de la API en vez de la lista mock | Claude |
| 12 | Seed del catálogo: 6 carreras + materias básicas (comunes a todas) + específicas por carrera, con ids estables | Claude |
| 13 | Fix del "Materia 2": el `materiaId` no matcheaba una fila real; se resuelve reseedeando la DB | Claude |
| 14 | DB compartida en Supabase: por qué a un compañero no le aparecían los datos (distinto `DATABASE_URL` / backend) | Claude |

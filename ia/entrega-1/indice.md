# Índice de consultas a IA — Entrega 1

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026

Este directorio contiene las conversaciones con asistentes de IA utilizadas durante el desarrollo de la Entrega 1.

---

## Conversaciones

| # | Archivo | Tema | Herramienta | Archivos afectados |
|---|---------|------|-------------|-------------------|
| 1 | [chat-crear-material.md](chat-crear-material.md) | Feature de creación de material de estudio (formulario, validaciones, persistencia local) | Codex | `src/app/index.tsx`, `src/features/materials/`, `materialFormHelpers.ts` |
| 2 | [vistas_buscar_y_ver_material.md](vistas_buscar_y_ver_material.md) | Implementación inicial de las vistas "Resultados de búsqueda" y "Ver material" con componentización y estilos separados | Codex | `src/app/search.tsx`, `src/app/material/[id].tsx`, `src/components/materials/` |
| 3 | [refactor_deuda_tecnica_y_filtros.md](refactor_deuda_tecnica_y_filtros.md) | Refactor integral de deuda técnica (BUG, DUP, ARCH, OPT), homescreen, componentización de create.tsx e implementación del `FilterModal` con chips removibles | Claude | múltiples, `FilterModal`, `search.tsx`, `FormField` global |
| 4 | [eliminar_y_modificar_materiales.md](eliminar_y_modificar_materiales.md) | Análisis del alcance de la Entrega 1 e implementación de HU01.2 (eliminar) y HU01.3 (modificar) materiales | Claude | `MaterialDetailScreen`, `MaterialCreateScreen`, `ConfirmModal` |
| 5 | [navegacion_tabs_y_documentacion.md](navegacion_tabs_y_documentacion.md) | Navegación con tabs (`Consultar`/`Subir`), filtro por carrera en `FilterModal` y documentación final de la entrega (`README`, `doc_tecnica_e1`, `skills_claude_e1`) | Claude | `src/app/(tabs)/`, `FilterModal.tsx`, `search.tsx`, `README.md`, `doc_tecnica_e1.md` |
| 6 | [conversacion_codex_update_material.md](conversacion_codex_update_material.md) | Resolución de conflictos de PR, integración de `QueryClientProvider`, ajustes de alertas y edición de materiales | Codex | `src/app/_layout.tsx`, `MaterialCreateScreen.tsx`, hooks `useMaterial` |
| 7 | [conversacion_toast_sistema.md](conversacion_toast_sistema.md) | Sistema de notificaciones toast con barra de progreso, redirección post-creación y fix de bug visual en chips de filtros | Claude | `ToastContext`, `Toast`, `ToastContainer`, `_layout.tsx`, `MaterialSearchScreen` |

---

## Archivos de referencia

| Archivo | Descripción |
|---------|-------------|
| [skills_claude_e1.md](skills_claude_e1.md) | Detalle de las skills/capacidades de Claude utilizadas durante el desarrollo |

---

## Temas consultados (resumen)

| # | Tema | Herramienta |
|---|------|-------------|
| 1 | Creación inicial de vistas (Subir material, Buscar, Ver detalle) y arquitectura de carpetas | Codex |
| 2 | Componentización: `FormField`, `MaterialResultCard`, `MaterialScreenHeader`, `MaterialPreviewCard`, etc. | Codex / Claude |
| 3 | Validación de formularios y store local (`createdMaterialsStore`) | Codex |
| 4 | Refactor de deuda técnica: bugs, duplicados, arquitectura por features, optimizaciones | Claude |
| 5 | Homescreen con barra de búsqueda y componentización de `create.tsx` | Claude |
| 6 | Filtrado avanzado con `FilterModal`, chips activos y badge de contador | Claude |
| 7 | HU01.2 - Eliminación de materiales con `ConfirmModal` | Claude |
| 8 | HU01.3 - Modificación de materiales propios (ruta `?editId=`) | Claude |
| 9 | Navegación con bottom tabs (`Consultar`/`Subir`) | Claude |
| 10 | Filtro por carrera en `FilterModal` y `search.tsx` | Claude |
| 11 | Documentación de entrega: `README`, `doc_tecnica_e1`, `skills_claude_e1` | Claude |
| 12 | Resolución de conflictos de PR e integración de `@tanstack/react-query` | Codex |
| 13 | Hooks `useMaterialForm`, `useCreateMaterial`, `useUpdateMaterial` | Codex |
| 14 | Sistema de notificaciones toast con barra de progreso animada (reanimated) | Claude |
| 15 | Redirección automática post-creación a `/material/[id]` | Claude |
| 16 | Fix de bug visual: chips de filtros estirándose verticalmente con estado vacío | Claude |

---

## Historial de cambios en este directorio

Para facilitar la trazabilidad, los archivos genéricos fueron renombrados con nombres descriptivos:

| Nombre anterior | Nombre nuevo |
|----------------|--------------|
| `conversacion_claude.md` | `refactor_deuda_tecnica_y_filtros.md` |
| `conversacion_claude2.md` | `eliminar_y_modificar_materiales.md` |
| `conversacion_codex.md` | `vistas_buscar_y_ver_material.md` |

Además, el archivo consolidado `conversaciones_consolidadas_e1.md` (antes `conversaciones_e1.md`) fue descompuesto: las secciones duplicadas que ya existían como archivos individuales fueron eliminadas y la sección única (navegación con tabs + documentación) fue extraída a [navegacion_tabs_y_documentacion.md](navegacion_tabs_y_documentacion.md).

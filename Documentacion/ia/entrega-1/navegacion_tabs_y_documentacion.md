# Conversación con Claude — Navegación con tabs, filtro por carrera y documentación final

**Fecha:** 2026-05-16
**Proyecto:** DAM26-G10
**Herramienta:** Claude Code

---

## Usuario

Basandote en la consigna de la entrega 1 de Guia Trabajo Integrador 2026, decime que es lo que falta hacer para completar la entrega.

---

## Claude

Analicé la guía (cargada como `.txt`) y el `alcance_e1.txt`. El resultado fue el siguiente listado de lo que faltaba:

**Código:**
- Arquitectura de navegación: no había bottom tab bar ("Consultar" / "Subir") — solo pantallas sueltas
- FilterModal no tenía filtro por carrera
- `search.tsx` no filtraba por carrera

**Documentación y entregables:**
- `doc_tecnica_e1.md` con decisiones tecnológicas, diagrama de navegación, arquitectura y deuda técnica
- `README.md` completo (integrantes, prerrequisitos, instalación)
- `ia/entrega-1/skills_claude_e1.md` con tabla de skills de IA utilizadas
- Consolidación de conversaciones en `ia/entrega-1/conversaciones_e1.md`

---

## Usuario

Bueno resolvé vos todas estas correcciones que puedas hacer. Preguntame lo que necesites y decime lo que necesitas que haga a medida que vas corrigiendo.

---

## Claude

Procedí a implementar todos los cambios:

**Navegación con tabs:**
- Creé `UTNotasApp/src/app/(tabs)/_layout.tsx` con el `<Tabs>` de expo-router, íconos Feather "search" (Consultar) y "upload-cloud" (Subir)
- Moví `index.tsx` → `(tabs)/index.tsx` (elimina el botón "Subir material" redundante)
- Moví `create.tsx` → `(tabs)/create.tsx`
- Eliminé los archivos raíz `index.tsx` y `create.tsx` para evitar conflictos de rutas en expo-router

**Filtro por carrera:**
- `FilterModal.tsx`: agregué `carreraId?: number; carrera?: string` a `ActiveFilters`, importé `careers` de `materialOptions`, agregué sección con chips de carreras entre "Tipo de material" y "Materia"
- `search.tsx`: agregué `filters.carreraId` al contador de filtros activos, lógica `matchesCarrera`, limpieza cruzada en `removeFilter`, y chip activo para carrera

**Documentación:**
- `README.md` — información completa del proyecto, integrantes (Andrada, Barbé, Diez, Soler), prerrequisitos, instalación y estructura
- `doc_tecnica_e1.md` — decisiones tecnológicas (React Native + Expo SDK 54, Express.js), diagrama de navegación ASCII, arquitectura Feature-Driven Design, seguridad (RNF-05/06), tabla de deuda técnica
- `ia/entrega-1/skills_claude_e1.md` — 10 skills de Claude utilizadas, herramientas de IA (Claude + Codex), archivos generados con asistencia
- `ia/entrega-1/conversaciones_e1.md` — consolidación de conversaciones previas

---

## Usuario

Todavia no crees el git tag.

---

## Claude

Entendido, el git tag `entrega-1` queda pendiente hasta que el usuario lo confirme.

---

## Resumen de archivos afectados

| Archivo | Tipo |
|---|---|
| `UTNotasApp/src/app/(tabs)/_layout.tsx` | Creado |
| `UTNotasApp/src/app/(tabs)/index.tsx` | Movido desde raíz |
| `UTNotasApp/src/app/(tabs)/create.tsx` | Movido desde raíz |
| `UTNotasApp/src/features/materials/components/FilterModal.tsx` | Modificado (filtro por carrera) |
| `UTNotasApp/src/app/search.tsx` | Modificado (lógica `matchesCarrera`) |
| `README.md` | Reescrito |
| `doc_tecnica_e1.md` | Creado |
| `ia/entrega-1/skills_claude_e1.md` | Creado |
| `ia/entrega-1/conversaciones_e1.md` | Creado (consolidación) |

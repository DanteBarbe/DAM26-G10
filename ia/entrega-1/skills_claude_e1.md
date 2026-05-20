# Skills de Claude utilizadas — Entrega 1

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026

---

## Skills de Claude Code

| # | Skill | Descripción del uso |
|---|-------|---------------------|
| 1 | Generación de código (React Native / TypeScript) | Implementación de pantallas, componentes y lógica de negocio |
| 2 | Revisión y refactoring de código | Detección de deuda técnica, duplicados y mejoras arquitectónicas |
| 3 | Diseño de estructura de carpetas | Definición de la arquitectura por features (`src/features/materials/`) |
| 4 | Validación de formularios | Lógica de validación en `materialFormHelpers.ts` |
| 5 | Gestión de estado con hooks | Implementación de `useState`, `useMemo` y stores custom |
| 6 | Implementación de filtros de búsqueda | Filtrado reactivo con múltiples criterios en `search.tsx` |
| 7 | Diseño de tipos TypeScript | Definición de tipos en `materials.types.ts` |
| 8 | Implementación de navegación | Configuración de expo-router con Stack y Tabs |
| 9 | Generación de mocks de datos | Datos de prueba en `mockMaterials.ts` y `materialOptions.ts` |
| 10 | Análisis y diagnóstico de errores | Debugging de problemas de navegación y tipado |

## Herramientas de IA utilizadas

- **Claude (Anthropic)** — asistente principal de desarrollo
- **Codex (OpenAI)** — consultas puntuales de sintaxis

## Archivos generados con asistencia de IA

- `src/app/(tabs)/_layout.tsx`
- `src/app/(tabs)/index.tsx`
- `src/app/(tabs)/create.tsx`
- `src/app/search.tsx`
- `src/app/material/[id].tsx`
- `src/features/materials/components/FilterModal.tsx`
- `src/features/materials/components/FileUploadField.tsx`
- `src/features/materials/utils/materialFormHelpers.ts`
- `src/features/materials/utils/createdMaterialsStore.ts`
- `src/features/materials/types/materials.types.ts`

# Skills de Claude utilizadas — Entrega 2

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026

---

## Skills de Claude Code (definidas en `skills-lock.json`)

| Skill | Fuente | Uso en E2 |
|-------|--------|-----------|
| `expo-horizon` | software-mansion-labs/skills | Guias de mejores practicas para proyectos Expo al implementar formularios y navegacion en React Native |
| `react-native-best-practices` | software-mansion-labs/skills | Guias de patrones recomendados para componentes React Native (Modal, TextInput, Pressable, estilos) |

---

## Capacidades del agente utilizadas

| Capacidad | Descripcion | Uso en E2 |
|-----------|-------------|-----------|
| **Read** | Lectura de archivos del proyecto | Revision de `AuthContext`, `ProfileScreen`, servicios del backend, schema de Prisma |
| **Edit** | Edicion de archivos existentes | Modificacion de `AuthContext.tsx`, `profile.tsx`, `ProfileScreen.tsx`, `schema.prisma`, `navigateAfterAuth.ts` |
| **Write** | Creacion de nuevos archivos | Creacion de archivos de documentacion |
| **Glob** | Busqueda de archivos por patron | Localizacion de archivos de rutas, servicios y componentes |
| **Grep** | Busqueda de contenido en el codigo | Busqueda de referencias a metodos, imports y tipos |
| **Bash / PowerShell** | Ejecucion de comandos de shell | Inspeccion de directorios, lectura de sesiones JSONL |
| **Agent (Explore)** | Subagente especializado en busqueda de codigo | Analisis del backend de materiales para verificar ownership validation; analisis del frontend de materiales |
| **TodoWrite** | Gestion de tareas | Seguimiento de pasos durante implementaciones multi-archivo |

---

## Herramienta principal

**Claude Code** — CLI de Anthropic integrada en VSCode, modelo `claude-sonnet-4-6`.

Todas las conversaciones de la Entrega 2 se realizaron dentro de Claude Code
en la rama `feature/editar-perfil`.

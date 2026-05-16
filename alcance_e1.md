# Alcance — Entrega 1 · UTNotasApp

**Trabajo Integrador — DAM 2026 · Grupo 10**
Andrada Santiago · Barbé Dante · Diez Nicolás · Soler Tomás

---

## Descripción del Problema

### ¿Qué problema resuelve la app?

La aplicación centraliza el acceso al material de estudio de la UTN-FRLP, solucionando la dispersión de recursos que afecta actualmente a los estudiantes. Al agrupar apuntes en una plataforma única, se elimina la necesidad de buscarlos en distintos canales informales, optimizando los tiempos de estudio y garantizando la disponibilidad de la información necesaria para cada cátedra.

### ¿A quién está dirigida?

El perfil del usuario principal es el estudiante de la UTN Facultad Regional La Plata, abarcando las distintas carreras de ingeniería. La solución está diseñada para alumnos que buscan agilidad en la consulta de materiales.

### ¿Por qué una app móvil y no otra solución?

Si bien el proyecto ya cuenta con una plataforma web, el desarrollo de una aplicación móvil responde a una necesidad de portabilidad. Una app nativa ofrece una experiencia de usuario superior en dispositivos móviles, permitiendo consultas rápidas en cualquier momento y lugar.

---

## Requerimientos Funcionales

- **RF-01: Gestionar Material de Estudio**
  - RF-01.1: Registrar Material de Estudio
    - RF-01.1.1: Cambiar formato de imagen a PDF
  - RF-01.2: Consultar Material de Estudio
    - RF-01.2.1: Calificar Material de Estudio
    - RF-01.2.2: Reportar Material de Estudio
    - RF-01.2.3: Filtrar por materia, carrera, año del material, tipo de material, comisión
  - RF-01.3: Modificar Material de Estudio
  - RF-01.4: Eliminar Material de Estudio
- **RF-02: Gestionar Usuarios**
  - RF-02.1: Registrar Usuario
  - RF-02.2: Autenticar Usuario
  - RF-02.3: Modificar Usuario
  - RF-02.4: Consultar Usuario
  - RF-02.5: Eliminar Usuario
  - RF-02.6: Gestionar roles de usuario (ADMIN, USER)
- **RF-03: Gestionar Materias**
  - RF-03.1: Consultar Materias
- **RF-04: Gestionar Carreras**
  - RF-04.1: Consultar Carreras

> **Aclaración:** Tanto Materias como Carreras no contarán con interfaz visual para su ABM; podrán ser gestionadas directamente desde el backend por un usuario administrador.

### Alcance E1

RF-01 completo, excepto:
- RF-01.1.1 (conversión de imagen a PDF)
- RF-01.2.1 (calificación)
- RF-01.2.2 (reporte)

### Backlog E2

RF-02 (excepto RF-02.6)

### Backlog E3

RF-01.1.1 · RF-01.2.1 · RF-01.2.2 · RF-02.6 · RF-03 · RF-04

---

## Requerimientos No Funcionales

| ID | Requerimiento |
|----|---------------|
| RNF-01.1 | La aplicación debe ser desarrollada en React Native para su despliegue en iOS y Android |
| RNF-02.1 | El tiempo de carga de las pantallas debe ser inferior a 2 segundos |
| RNF-03.1 | El sistema requiere conexión a internet permanente para operar |
| RNF-04.1 | El idioma de la interfaz debe ser estrictamente español latinoamericano |
| RNF-04.2 | Los textos deben ser legibles y los botones tener un tamaño adecuado para ser presionados |
| RNF-04.3 | La interfaz debe presentar estados visuales claros para situaciones normales, de carga, de error y de datos vacíos |
| RNF-05.1 | El código fuente no debe contener credenciales hardcodeadas; las variables sensibles se gestionan mediante archivos `.env` excluidos del repositorio |
| RNF-05.2 | La autenticación de usuarios debe implementarse mediante tokens JWT con tiempo de expiración; el sistema rechazará tokens vencidos o inválidos |
| RNF-06.1 | La estructura del proyecto debe aplicar el Principio de Responsabilidad Única y evitar la repetición de código |

---

## User Stories — Entrega 1

### HU01.1 — Publicar material de estudio
**Prioridad:** Alta

Como usuario, quiero publicar material de estudio para compartirlo con la comunidad.

**Criterios de Aceptación:**

*Éxito:* Dado que quiero publicar material, cuando cargue un archivo `.pdf`, entonces el sistema lo guardará y registrará su ruta en la base de datos.

*Fallo:* Dado que quiero publicar material, cuando intente cargar un archivo en formato inválido (ej. `.mp4`), entonces el sistema informará que el formato es inválido y solicitará reintento.

---

### HU01.2 — Eliminar material de estudio
**Prioridad:** Media

Como usuario, quiero eliminar mi material de estudio subido para evitar compartir contenido que ya no sea útil.

**Criterios de Aceptación:**

*Éxito:* Dado que quiero eliminar un material de mi propiedad, cuando seleccione la opción de eliminar, entonces el sistema eliminará el material de la base de datos.

*Fallo:* Dado que quiero eliminar un material que no es de mi propiedad, entonces el sistema informará que no tengo permisos.

---

### HU01.3 — Modificar material de estudio
**Prioridad:** Media

Como usuario, quiero modificar mi material de estudio subido para corregir metadatos incorrectos.

**Criterios de Aceptación:**

*Éxito:* Dado que quiero modificar la comisión "S22", cuando ingrese "S33", entonces el sistema guardará los cambios e informará un mensaje de éxito.

*Fallo:* Dado que ingrese el año "-2000", entonces el sistema informará que el formato del año es inválido.

---

### HU01.4 — Consultar listado de materiales
**Prioridad:** Alta

Como usuario, quiero ver una lista de los materiales disponibles para encontrar contenido de estudio.

**Criterios de Aceptación:**

*Éxito:* Dado que presiono buscar, cuando existan materiales cargados, entonces el sistema mostrará el listado.

*Fallo:* Dado que presiono buscar, cuando no haya materiales, entonces el sistema mostrará un mensaje indicando que la lista está vacía.

---

### HU01.5 — Filtrar material por título
**Prioridad:** Media

Como usuario, quiero filtrar material por título para encontrar un material mediante su nombre.

**Criterios de Aceptación:**

*Éxito:* Dado que ingreso "Economía", entonces el sistema mostrará todos los materiales asociados a ese título.

*Fallo:* Dado que ingreso un título que no coincide con ningún material (ej. "!"), entonces el sistema informará que no se encontró ningún material.

---

## Documentación Técnica

### Decisión de Tecnología

**Framework:** React Native con Expo (SDK 51+) y Express.js en el backend.

**Justificación:** La elección de React Native se fundamenta en la reutilización de conocimientos del ecosistema React (base del proyecto web UTNotas) y en la eficiencia de desarrollo multiplataforma (Android e iOS) con una única base de código. Express.js ya es la API REST del proyecto web, lo que facilita la integración. Ambas tecnologías están soportadas por la cátedra.

**Versiones mínimas soportadas:**
- Android: API Level 26 (Android 8.0 Oreo) — cubre más del 90% de dispositivos activos.
- iOS: 13.0 — asegura compatibilidad con componentes UI actualizados.

**Dependencias principales:**

| Librería | Versión | Rol |
|----------|---------|-----|
| react-native | 0.73+ | Core del framework |
| expo-router | 3.x | Enrutamiento basado en archivos |
| expo-document-picker | 11.x | Selección de archivos |
| @expo/vector-icons | 14.x | Íconos |

**Gestión de estado:** Context API para estado global de UI (autenticación, tema). React Query para estado del servidor (materiales, caché, sincronización asíncrona).

---

### Diagrama de Navegación

La navegación de E1 usa dos patrones:
- **Barra de pestañas inferior:** alterna entre "Consultar" y "Cargar".
- **Navegación en pila (stack):** profundiza dentro de cada sección.

**Flujo Consultar:**
```
PantallaBuscador → PantallaResultados → PantallaDetalleMaterial
```

**Flujo Cargar:**
```
PantallaFormularioCarga → PantallaExitoCarga
```

El usuario abre la app en la pestaña "Consultar". Al seleccionar un material, la pantalla de detalle se apila sobre los resultados. Al cambiar a "Cargar", el contexto visual cambia al formulario manteniendo en memoria el estado de búsqueda anterior.

# Enlace Figma

https://www.figma.com/design/pckLNSLBjrmzUjTtMSOXAk/Sin-t%C3%ADtulo?node-id=0-1&t=VcHIjR5SPhpHW3jc-1
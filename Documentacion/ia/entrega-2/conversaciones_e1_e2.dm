# Conversaciones con IA — Acumulado E1 + E2

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026
**Integrantes:** Andrada Santiago · Barbé Dante · Diez Nicolás · Soler Tomás
**Herramientas utilizadas:** Claude Code (claude-sonnet-4-6), GitHub Copilot (Codex)

---

# ENTREGA 1

---

## [E1-1] Feature: Crear Material de Estudio

Fecha de generación: 21/05/2026
Herramienta: Codex
Repositorio: `DAM26-G10/UTNotasApp`
Rama: `feature/crear-material`

### Objetivo de la charla

El objetivo fue implementar en la version mobile de UTNotas la feature de
crear un material de estudio para la primera entrega del ABMC de materiales.

El usuario aclaro que:

- El proyecto original de referencia esta en `UTN-DS25-Grupo-2-`.
- El nuevo repositorio mobile esta en `DAM26-G10/UTNotasApp`.
- La entrega debe resolverse solo desde el front, sin backend por ahora.
- La implementacion debia respetar la experiencia del UTNotas original.
- Los comandos debian ejecutarse usando Git Bash, porque PowerShell no estaba funcionando bien.

### Pedido inicial

El usuario pidio crear todo lo necesario para la feature "Crear material de
estudio" en la nueva app mobile, copiando el comportamiento del UTNotas
original.

Pedido resumido:

> Estamos creando la version de UTNotas en el nuevo repositorio UTNotasApp.
> En la primera entrega debemos dar el ABMC de materiales de estudio.
> Me toco la feature Crear material.
> Solo debemos hacerlo desde el front, sin backend aun.
> Hay que tener en cuenta las tecnologias mobile usadas en este repo.
> Estamos en la rama feature/crear-material.
> Necesito que crees todo para Crear un material de estudio igual a como se usa
> en UTNotas original.

### Analisis realizado

Se inspeccionaron ambos proyectos:

- `DAM26-G10/UTNotasApp`: app nueva con Expo, React Native y Expo Router.
- `UTN-DS25-Grupo-2-`: proyecto original con frontend React/Vite y backend.

En el proyecto original se revisaron especialmente:

- `frontend/src/Apps/MaterialCreatePage.jsx`
- `frontend/src/Components/MaterialCreateForm.jsx`
- `frontend/src/Components/FormFields/FileUpload.jsx`
- `frontend/src/Components/FormFields/TipoDropdownSelector.jsx`
- `frontend/src/Components/FormFields/CarreraDropdownSelector.jsx`
- `frontend/src/Components/FormFields/ComisionField.jsx`
- `frontend/src/Components/SearchOptions.jsx`

Del flujo original se tomo como referencia:

- Titulo obligatorio.
- Archivo obligatorio.
- Busqueda de materia con sugerencias.
- Carrera dependiente de la materia elegida.
- Tipo de material obligatorio.
- Campo de comision opcional con prefijo automatico segun carrera y anio.
- Anio de cursada opcional.
- Campo de parcial visible solo para `PARCIAL` y `PARCIAL_RESUELTO`.
- Descripcion opcional.
- Validaciones de campos obligatorios.
- Modal de puntos al crear el material.

### Implementacion realizada

Se reemplazo la pantalla inicial de Expo por una pantalla mobile completa para
crear material de estudio.

Archivos principales creados o modificados:

- `UTNotasApp/src/app/index.tsx`
- `UTNotasApp/src/app/_layout.tsx`
- `UTNotasApp/src/data/materialOptions.ts`
- `UTNotasApp/src/types/materials.ts`
- `UTNotasApp/src/utils/createdMaterialsStore.ts`
- `UTNotasApp/package.json`
- `UTNotasApp/package-lock.json`
- `UTNotasApp/assets/images/*`
- `UTNotasApp/.gitignore`

#### Pantalla creada

La pantalla `src/app/index.tsx` incluye:

- Encabezado UTNotas.
- Formulario "Subi tu material de estudio".
- Input de titulo.
- Selector de archivos multiples.
- Buscador de materia.
- Selector de carrera dependiente.
- Selector de tipo de material.
- Input de anio de cursada.
- Campo de comision con prefijo automatico.
- Selector de parcial condicional.
- Textarea de descripcion.
- Boton "Subir".
- Mensaje de material creado en el front.
- Modal de puntos.

#### Datos mock

Como no se usa backend en esta entrega, se agregaron datos mock del lado front
en `src/data/materialOptions.ts`.

Incluyen:

- Carreras.
- Materias.
- Relacion carrera-materia.
- Tipos de material.
- Helpers para obtener carreras por materia.
- Helper para obtener la relacion carrera-materia.

#### Persistencia front-only

Se agrego `src/utils/createdMaterialsStore.ts` para guardar materiales creados
desde el front:

- En web usa `localStorage`.
- En mobile mantiene una lista en memoria.

Esto permite simular el alta sin depender de backend.

#### Selector de archivos

Se instalo `expo-document-picker` para que el selector de archivos funcione en
mobile:

```bash
npx expo install expo-document-picker
```

La dependencia quedo agregada como:

```json
"expo-document-picker": "~14.0.8"
```

#### Assets de Expo

Expo tenia referencias a iconos y favicon en `app.json`, pero la carpeta
`assets/images` no existia.

Se agregaron assets minimos para evitar advertencias al exportar:

- `icon.png`
- `android-icon-foreground.png`
- `android-icon-background.png`
- `android-icon-monochrome.png`
- `splash-icon.png`
- `favicon.png`

### Verificaciones realizadas

Se corrieron las siguientes verificaciones:

```bash
npx tsc --noEmit
npm run lint
npx expo export --platform web
```

Resultado:

- TypeScript paso correctamente.
- Lint de Expo paso correctamente.
- Export web paso correctamente.
- La advertencia por favicon faltante desaparecio despues de agregar assets.

Tambien se levanto el servidor de Expo:

```bash
npx expo start --web --offline --port 8082
```

URL local usada para probar:

```text
http://localhost:8082
```

Se verifico en navegador integrado que:

- La pantalla renderiza el titulo `Subi tu material de estudio`.
- El formulario aparece con los campos esperados.
- Al presionar `Subir` con el formulario vacio aparece la validacion:
  `El titulo es obligatorio.`

### Resultado final

La feature "Crear material" quedo implementada en el front mobile de
UTNotasApp, respetando el flujo del proyecto original y sin depender del
backend.

Quedo lista para ser revisada dentro de la primera entrega del ABMC de
materiales de estudio.

---

## [E1-2] Vistas: Buscar y Ver Material

Herramienta: Codex
Repositorio: `DAM26-G10/UTNotasApp`

### Pedido inicial

Para este trabajo integrador vamos a desarrollar la aplicacion movil de una aplicacion web que ya tenemos desarrollada llamada UTNotas. Necesito hacer la vista de Ver Material y la vista de los resultados de busqueda de materiales. Estamos en la primera entrega de este trabajo integrador. Te adjunto la guia del trabajo, el link a nuestra aplicación web ya desarrollada para que tomes las referencias, además de lo ya desarrollado hasta ahora en este proyecto https://utn-ds-25-grupo-2.vercel.app/.

### Resultado

Listo. Deje las vistas mockeadas y sin backend, ni votos, guardado, compartir ni reportar.

Separe y componenticé:
- `search.tsx`: vista de resultados.
- `[id].tsx`: vista Ver Material.
- Componentes reutilizables en `src/components/materials`.
- Mocks en `mockMaterials.ts`.

Sobre los `.css`: como esto es Expo/React Native, usar `.css` real rompería mobile. Lo deje separado en archivos de estilos con `StyleSheet`, que es el equivalente correcto para esta app: `materialStyles.ts`, `searchStyles.ts` y `materialDetailStyles.ts`.

Verificacion:
- `npx.cmd tsc --noEmit` paso.
- `npm.cmd run lint` paso.

### Pedido adicional

Me lanzo este error: Failed to set an indexed property [0] on 'CSSStyleDeclaration': Indexed property setter is not supported.
Ademas me gustaria que todas las vistas y componentes del proyecto tuvieran un stylesheet separado en una carpeta de estilos para no ensuciar el codigo de cada uno.

### Resultado final

**Vistas**
- `index.tsx`: Vista para subir material. Usa estado local para el formulario, valida campos, permite adjuntar archivos y guarda el material mockeado con `saveCreatedMaterial`. Tambien se agregaron accesos a busqueda y a un material mock usando `router.push`, evitando `Link asChild`, que probablemente disparaba el error de `CSSStyleDeclaration`.
- `search.tsx`: Vista de resultados de busqueda. Toma materiales mockeados y materiales creados localmente, normaliza texto, filtra por busqueda y tipo de material. No usa backend.
- `[id].tsx`: Vista "Ver Material". Lee el `id` de la ruta, busca el material en mocks/local storage y muestra titulo, autor, materia, carrera, comision, anio, badges y preview mockeada del archivo.

**Componentes**
- `MaterialScreenHeader.tsx`: Header reutilizable con boton volver, marca UTNotas, titulo y accion derecha opcional.
- `MaterialResultCard.tsx`: Card reutilizable para resultados. Muestra titulo, usuario, fecha, descripcion, badges, archivo y boton "Ver material".
- `FilterChip.tsx`: Chip de filtro reutilizable para tipos de material.
- `EmptyMaterialsState.tsx`: Estado vacio cuando no hay resultados.
- `MaterialInfoItem.tsx`: Fila reutilizable de metadata con icono, label y valor.
- `MaterialPreviewCard.tsx`: Preview mockeada del PDF/archivo.

**Datos y tipos**
- `mockMaterials.ts`: Datos mock para la primera entrega.
- `materials.ts`: Agrega tipos para `StudyMaterial`, autor, archivos y materiales creados.
- `createdMaterialsStore.ts`: Persiste materiales creados en memoria/localStorage.

**Estilos**
- `materialCreateStyles.ts`: Estilos de la vista de subida.
- `materialStyles.ts`: Colores y estilos compartidos entre vistas de materiales.
- `searchStyles.ts`: Estilos de busqueda, filtros, cards y estado vacio.
- `materialDetailStyles.ts`: Estilos de detalle, metadata y preview.

Verificacion: `npx.cmd tsc --noEmit` y `npm.cmd run lint` pasan sin errores.

---

## [E1-3] Refactor de deuda tecnica y FilterModal

Fecha: 2026-05-15
Herramienta: Claude Code
Proyecto: DAM26-G10

### Mensaje 1 — Usuario

En el html analisis_entrega1 estan las cosas que faltan de la entrega 1 del tp integrador, el proyecto esta en UTNotasApp. Hace todas las cosas que puedas de las que faltan. Crea una rama de git si podes para la feature que vayas a arreglar. Preguntame lo que te falte

### Mensaje 2 — Claude

Voy a leer el archivo de analisis y explorar la estructura del proyecto.

### Mensaje 3 — Claude

Ahora voy a leer todos los archivos relevantes en paralelo para entender el estado actual del codigo.

### Mensaje 4 — Claude

Necesito leer `index.tsx` para entender el FormField y los OPT issues antes de hacer cambios.

### Mensaje 5 — Claude

Voy a leer mas de `index.tsx` para ver todos los usos del FormField local.

### Mensaje 6 — Claude

Tengo un panorama completo. Antes de arrancar quiero aclararte que puedo hacer solo y que necesito de vos:

**Lo que puedo hacer en codigo ahora mismo:**
- Todos los BUG (1–4), DUP (1–6), ARCH (1–3) y OPT (1–2)
- Actualizar el `README.md`
- Crear la carpeta `/ia/entrega-1/` con indice placeholder
- Crear la rama `entrega-1` en git

**Lo que NO puedo generar (requieren herramientas externas):**
- Figma wireframes/mockups
- `alcance_e1.pdf` y `doc_tecnica_e1.pdf`
- Video de demo
- APK/build ejecutable
- El archivo `.dm` con las conversaciones completas de IA

**Te pregunto dos cosas antes de arrancar:**

1. **Quienes son los integrantes del Grupo 10?** (nombres para el README)
2. **Para DUP-1 (FormField duplicado):** hay dos opciones — preferis que migre `index.tsx` para usar el `FormField` global (mejor diseno, tiene `memo` y accesibilidad), o que simplemente elimine el archivo global que nunca se usa y deje el local?

### Mensaje 7 — Usuario

1. Somos: Andrada Santiago, Barbe Dante, Diez Nicolas y Soler Tomas.
La documentacion que tenemos hasta el momento esta dentro de alcance_e1.txt (creo que esta casi todo).
Los wireframes los tengo en figma.
2. Migra index.tsx para usar el FormField global

### Mensaje 8-26 — Claude

[Claude inspecciona archivos, crea rama `entrega-1`, implementa todos los fixes en paralelo]

Rama creada. Cambios implementados:

| Fix | Que se hizo |
|-----|-------------|
| BUG-3 | Elimine el `//` doble e importe `emptyMaterialStateStyles` que nunca se usaba en `search.tsx` |
| BUG-4 | Reemplace todos los `as never` — rutas simples quedan como string, ruta dinamica usa `{ pathname, params }` |
| BUG-1/2 | `MaterialPreviewCard` ahora muestra el nombre del archivo y tiene un boton "Abrir archivo" que llama a `openFile` |
| DUP-1 | `index.tsx` usa el `FormField` global; la funcion local fue eliminada. Se agrego `fieldErrorFor()` como helper interno |
| DUP-2/5 | Nuevo `src/utils/format.ts` con `normalizeText` y `formatFileSize` |
| DUP-3/4/6 | Nuevo `materialHelpers.ts` con `getTypeLabel`, `formatDate` y `getAllMaterials` |
| ARCH-1 | `MaterialPreviewCard.styles.ts` propio — ya no depende de `MaterialDetail.styles.ts` |
| ARCH-2/3 | Eliminados `EmptyState.tsx`, `EmptyState.styles.ts` y `MateriaDetailScreen.ts` |
| OPT-1 | `commissionPrefix` dentro de `useMemo` |
| OPT-2 | `partialLabel` movido antes del componente |

**Documentacion:**
- `README.md` — info completa del proyecto, integrantes, instrucciones
- `alcance_e1.md` — version Markdown del alcance con RF, RNF, User Stories y doc tecnica
- `ia/entrega-1/indice.md` — estructura para el indice de IA

### Mensaje 29 — Usuario

no puedo ver la aplicacion pq no la puedo ejecutar. Vos podes ejecutarla para que la vea o decirme si esta rota?

### Mensaje 30-35 — Claude

No puedo renderizar la UI visualmente, pero corri el chequeo de TypeScript y el proyecto compila sin errores.

Habia un solo error de TypeScript: `FilterChip.tsx` importaba un modulo que no existia. El archivo `searchStyles` nunca existio en `src/styles/materials/`. Los estilos estaban en `MaterialSearch.styles.ts`. Corregi el import en `FilterChip.tsx`.

`FilterChip.tsx` es un componente global (`src/components/`) pero depende de estilos de una feature especifica — eso es el mismo problema ARCH-1 que ya resolvimos para `MaterialPreviewCard`. Movi los estilos de `filterChip` a un archivo propio del componente.

TypeScript pasa sin errores. Para verla hay que correr `npx expo start` desde `UTNotasApp/` y abrirla en Expo Go o un emulador.

### Mensaje 36 — Usuario

ya lo pude ejecutar.

### Mensaje 38 — Usuario

Me gustaria ver si hay alguna forma de componentizar, fragmentar o disminuir el codigo de index.tsx porque no es normal que tenga 1000 lineas de codigo. Ademas, la aplicacion deberia de empezar en una homescreen donde haya una barra de busqueda como la que se ve en buscar materiales y un boton de crear material y que ahi se vaya a la screen de crear, no que empiece ahi.

### Mensaje 41 — Claude

Mi plan:

1. **Nueva homescreen** en `index.tsx` — barra de busqueda + boton "Subir material"
2. **Mover create** a `src/app/create.tsx`
3. **Extraer 5 sub-componentes** de `create.tsx` a sus propios archivos:
   - `SubjectSearch`, `SelectButton`, `FileUploadField` (+ `IconButton`), `OptionSheet`, `PointsModal`
4. **Extraer utils** de logica pura: `filePicker.ts` y `materialFormHelpers.ts`

Despues de esto `create.tsx` queda con solo el estado + handlers + JSX del formulario, sin sub-componentes inline.

### Mensaje 44-52 — Claude

[Implementa todo en batches paralelos]

TypeScript pasa limpio. Esto es lo que quedo:

**Archivos nuevos creados:**
- `src/app/create.tsx` — pantalla de creacion (aprox. 230 lineas, sin sub-componentes inline)
- `src/app/index.tsx` — homescreen con barra de busqueda funcional + boton "Subir material"
- `src/features/materials/components/SubjectSearch.tsx`
- `src/features/materials/components/SelectButton.tsx`
- `src/features/materials/components/IconButton.tsx`
- `src/features/materials/components/FileUploadField.tsx`
- `src/features/materials/components/OptionSheet.tsx`
- `src/features/materials/components/PointsModal.tsx`
- `src/features/materials/utils/filePicker.ts`
- `src/features/materials/utils/materialFormHelpers.ts`
- `src/styles/Home.styles.ts`

**Archivos modificados:**
- `index.tsx` — reemplazado por la homescreen
- `search.tsx` — lee el parametro `q` inicial, link del header apunta a `/create`
- `.expo/types/router.d.ts` — agregado `/create` a los tipos de rutas

El flujo ahora es: **Home → (buscar) → Search → Detalle** y **Home → (subir) → Create**.

### Mensaje 57-62 — Usuario/Claude

> quiero que el icono de arriba a la derecha de MaterialScreenHeader no aparezca

Se simplifico `MaterialScreenHeader`: solo acepta `title`, muestra la marca "UTNotas" y el titulo, sin icono a la derecha.

### Mensaje 63 — Usuario

Me gustaria que la barra de busquedas busque solo por titulo y que haya un boton de filtros donde se despliegue un modal y permita buscar por filtros como materia, anio, comision, tipo de material, etc. Preguntame las decisiones de diseno que necesites y sugerime cambios que se te ocurran que puedan mejorar la aplicacion.

### Mensaje 64 — Claude

Preguntas de diseno:

**1. Como mostrar los filtros activos?**
- Opcion A: Chips debajo de la barra
- Opcion B: Solo un badge con el numero de filtros activos en el boton
- Opcion C: Ambos

**2. Los filtros se aplican en tiempo real o con un boton "Aplicar"?**

**3. El selector de tipo de material que ya existe como chips horizontales** — lo integro al modal de filtros o lo mantengo visible en la pantalla?

**4. Para el filtro de materia** — hay muchas materias. Querés un buscador dentro del modal (como el SubjectSearch que ya existe en create), o alcanza con una lista scrolleable?

Mis sugerencias:
- Mover los chips de tipo al modal
- Badge con contador
- Boton "Limpiar filtros" dentro del modal
- Busqueda por titulo "fuzzy": ignorar tildes y mayusculas

### Mensaje 65 — Usuario

1. Opcion A
2. Con un boton aplicar
3. Que esten en el modal.
4. Lista scrolleable con buscador.

Estoy deacuerdo con todas las sugerencias, implementalas tambien

### Mensaje 66-71 — Claude

[Implementa FilterModal + actualiza search.tsx]

Resultado:

**`FilterModal`** — nuevo componente con:
- Chips de tipo de material (toggle, reemplaza los chips horizontales del screen)
- Buscador + lista scrolleable de materias
- Inputs de anio y comision en fila
- Botones "Limpiar filtros" y "Aplicar" en el footer fijo
- Se sincroniza con los filtros actuales cada vez que se abre

**`search.tsx`** actualizado:
- Busqueda solo por titulo
- Boton de filtros (icono `sliders`) a la derecha de la barra; se pone verde cuando hay filtros activos
- Badge rojo con el contador de filtros activos
- Chips removibles debajo de la barra, uno por cada filtro activo; tocar el X lo elimina directamente sin abrir el modal

---

## [E1-4] Eliminar y modificar materiales

Fecha: 2026-05-15
Herramienta: Claude Code
Proyecto: DAM26-G10

### Usuario

Ahora quiero que revises devuelta que falta para cumplir con la entrega 1. Las consignas estan en el pdf Guia trabajo integrador

### Claude

Analice la guia y el `alcance_e1.txt`. El resultado fue el siguiente listado de lo que faltaba:

**Implementado:**
- HU01.1: Publicar material (subir PDF, validar formato) — Completo (`/create`)
- HU01.4: Consultar listado de materiales — Completo (`/search`)
- HU01.5: Filtrar por titulo — Completo
- RF-01.2.3: Filtrar por materia, anio, comision, tipo — Completo (FilterModal)
- Ver detalle de material — Completo (`/material/[id]`)

**Falta implementar:**
- HU01.2: Eliminar material de estudio
- HU01.3: Modificar material de estudio

### Usuario

Hace ambas cosas, para la edicion reutiliza el form de create

### Claude

[Inspecciona codigo, implementa en paralelo]

**Eliminar material (HU01.2)**
- Boton "Eliminar" en `material/[id].tsx` visible solo para el dueno del material (`author.id === 1`)
- Abre el `ConfirmModal` existente antes de eliminar
- Llama a `deleteCreatedMaterial()` y redirige a `/search`

**Modificar material (HU01.3)**
- Boton "Editar" en el detalle navega a `/create?editId={id}`
- `create.tsx` detecta el param `editId` y pre-carga el formulario con los datos existentes
- El submit llama a `updateCreatedMaterial()` y vuelve al detalle con `router.back()`
- Titulo cambia a "Editar material", boton a "Guardar cambios", aparece una X para cancelar
- El modal de puntos no aparece en modo edicion

**Store** — `createdMaterialsStore.ts` tiene las nuevas funciones `deleteCreatedMaterial` y `updateCreatedMaterial`.

---

## [E1-5] Navegacion con tabs, filtro por carrera y documentacion final

Fecha: 2026-05-16
Herramienta: Claude Code
Proyecto: DAM26-G10

### Usuario

Basandote en la consigna de la entrega 1 de Guia Trabajo Integrador 2026, decime que es lo que falta hacer para completar la entrega.

### Claude

Analice la guia. Faltaba:

**Codigo:**
- Arquitectura de navegacion: no habia bottom tab bar ("Consultar" / "Subir") — solo pantallas sueltas
- FilterModal no tenia filtro por carrera
- `search.tsx` no filtraba por carrera

**Documentacion y entregables:**
- `doc_tecnica_e1.md` con decisiones tecnologicas, diagrama de navegacion, arquitectura y deuda tecnica
- `README.md` completo (integrantes, prerrequisitos, instalacion)
- `ia/entrega-1/skills_claude_e1.md` con tabla de skills de IA utilizadas
- Consolidacion de conversaciones en `ia/entrega-1/conversaciones_e1.md`

### Usuario

Bueno resolve vos todas estas correcciones que puedas hacer. Preguntame lo que necesites y decime lo que necesitas que haga a medida que vas corrigiendo.

### Claude

Procedi a implementar todos los cambios:

**Navegacion con tabs:**
- Cree `UTNotasApp/src/app/(tabs)/_layout.tsx` con el `<Tabs>` de expo-router, iconos Feather "search" (Consultar) y "upload-cloud" (Subir)
- Movi `index.tsx` a `(tabs)/index.tsx` (elimina el boton "Subir material" redundante)
- Movi `create.tsx` a `(tabs)/create.tsx`
- Elimine los archivos raiz `index.tsx` y `create.tsx` para evitar conflictos de rutas en expo-router

**Filtro por carrera:**
- `FilterModal.tsx`: agregue `carreraId?: number; carrera?: string` a `ActiveFilters`, importe `careers` de `materialOptions`, agregue seccion con chips de carreras entre "Tipo de material" y "Materia"
- `search.tsx`: agregue `filters.carreraId` al contador de filtros activos, logica `matchesCarrera`, limpieza cruzada en `removeFilter`, y chip activo para carrera

**Documentacion:**
- `README.md` — informacion completa del proyecto, integrantes (Andrada, Barbe, Diez, Soler), prerrequisitos, instalacion y estructura
- `doc_tecnica_e1.md` — decisiones tecnologicas (React Native + Expo SDK 54, Express.js), diagrama de navegacion ASCII, arquitectura Feature-Driven Design, seguridad (RNF-05/06), tabla de deuda tecnica
- `ia/entrega-1/skills_claude_e1.md` — 10 skills de Claude utilizadas, herramientas de IA (Claude + Codex), archivos generados con asistencia
- `ia/entrega-1/conversaciones_e1.md` — consolidacion de conversaciones previas

### Usuario

Todavia no crees el git tag.

### Claude

Entendido, el git tag `entrega-1` queda pendiente hasta que el usuario lo confirme.

**Resumen de archivos afectados:**

| Archivo | Tipo |
|---|---|
| `UTNotasApp/src/app/(tabs)/_layout.tsx` | Creado |
| `UTNotasApp/src/app/(tabs)/index.tsx` | Movido desde raiz |
| `UTNotasApp/src/app/(tabs)/create.tsx` | Movido desde raiz |
| `UTNotasApp/src/features/materials/components/FilterModal.tsx` | Modificado (filtro por carrera) |
| `UTNotasApp/src/app/search.tsx` | Modificado (logica `matchesCarrera`) |
| `README.md` | Reescrito |
| `doc_tecnica_e1.md` | Creado |
| `ia/entrega-1/skills_claude_e1.md` | Creado |
| `ia/entrega-1/conversaciones_e1.md` | Creado (consolidacion) |

---

## [E1-6] Conflictos de PR, alertas y edicion de materiales

Fecha: 21/05/2026
Herramienta: GitHub Copilot (Codex)
Repositorio: `DAM26-G10/UTNotasApp`

### Contexto inicial

El usuario estaba trabajando sobre la app mobile UTNotas en Expo/React Native. El objetivo de la sesion fue resolver conflictos de un PR, ajustar alertas visuales y avanzar con la funcionalidad de editar materiales propios usando el store local de materiales creados.

### 1. Resolucion de conflictos del PR

El usuario informo que la rama tenia conflictos en:

- `src/app/_layout.tsx`
- `src/features/materials/screens/MaterialCreateScreen.tsx`

Se reviso el estado del repositorio, las ramas locales/remotas y los archivos en conflicto. La resolucion aplicada fue:

- En `_layout.tsx`, combinar `QueryClientProvider` con `ToastProvider` y `ToastContainer`.
- En `MaterialCreateScreen.tsx`, conservar la version refactorizada con hooks (`useMaterialForm`, `useCreateMaterial`) y sumar el toast de exito proveniente de `main`.
- Instalar dependencias faltantes con `npm install`, ya que `@tanstack/react-query` estaba declarado en `package.json` pero no estaba presente en `node_modules`.
- Validar con:

```bash
npx tsc --noEmit
npm run lint
```

Resultado: TypeScript paso correctamente. Lint paso sin errores, con warnings existentes en archivos no relacionados.

### 2. Alerta de eliminacion y eliminacion de puntos al subir material

El usuario pidio:

- Agregar una alerta/toast: `El material fue eliminado correctamente`.
- Eliminar todo lo relacionado a puntos al subir un material.
- No commitear los cambios y enviar el mensaje de commit sugerido.

Cambios implementados:

- Se agrego el toast de exito en el flujo de borrado dentro de `useDeleteMaterial`.
- Se elimino el modal de puntos: `src/features/materials/components/PointsModal.tsx`
- Se elimino la logica de puntos: `PointsBreakdown`, `buildPointsBreakdown`, `points`, `clearPoints`
- Se limpiaron los estilos asociados a puntos en `MaterialCreate.styles.ts`.
- Se mantuvo el toast de creacion de material.

Commit sugerido:
```bash
git commit -m "fix(materials): agrega alerta de borrado y elimina puntos de creacion"
```

### 3. Problema al iniciar Expo

El usuario ejecuto `npm start`. Expo mostro un error de cache de Metro y luego un `TypeError: fetch failed`.

Solucion recomendada:

```bash
npm start -- --clear --offline
```

El usuario confirmo que con eso la app funciono.

### 4. Implementacion de edicion de materiales

El usuario pidio:
- Mostrar un icono de lapiz junto al icono de borrar dentro de cada material propio.
- Al seleccionarlo, navegar a la misma vista de `Subir material`.
- Precargar los datos del material.
- Permitir modificar los datos.
- Guardar y ver los cambios reflejados.

**Cambios de persistencia y servicios:**

Se extendio `createdMaterialsStore.ts` para permitir:
- Buscar materiales creados por id.
- Actualizar un material propio.
- Reemplazar el contenido en memoria y en `localStorage`.
- Mantener la validacion de ownership con `MATERIAL_NOT_OWNED`.

Se extendio `materialService.ts` con: `getEditableMaterialById`, `updateMaterial`.

**Cambios en hooks:**

Se extendio `useMaterial.ts` con `useGetEditableMaterial` y `useUpdateMaterial`.

El hook de update:
- Actualiza el store local.
- Actualiza cache de React Query.
- Invalida la lista de materiales.
- Muestra toast: `Material actualizado correctamente`.
- Redirige al detalle del material actualizado.

**Cambios en el formulario:**

Se adapto `useMaterialForm.ts` para aceptar valores iniciales y una key de formulario.

Se adapto `MaterialCreateScreen.tsx` para:
- Leer `editId` desde los parametros de ruta.
- Detectar modo creacion o modo edicion.
- Cambiar el titulo: Creacion: `Subi tu material de estudio` / Edicion: `Edita tu material de estudio`
- Cambiar el boton: Creacion: `Subir` / Edicion: `Guardar cambios`

**Cambios en detalle:** Se adapto `MaterialDetailScreen.tsx` para mostrar un icono de lapiz junto al tacho cuando el material pertenece al usuario.

**Cambios en busqueda:** Se uso `useFocusEffect` para refrescar los materiales al volver a enfocar la pantalla.

**Archivos principales tratados:**
- `src/app/_layout.tsx`
- `src/features/materials/screens/MaterialCreateScreen.tsx`
- `src/features/materials/screens/MaterialDetailScreen.tsx`
- `src/features/materials/screens/MaterialSearchScreen.tsx`
- `src/features/materials/hooks/useMaterial.ts`
- `src/features/materials/hooks/useMaterialForm.ts`
- `src/features/materials/services/materialService.ts`
- `src/features/materials/utils/createdMaterialsStore.ts`
- `src/features/materials/screens/styles/MaterialCreate.styles.ts`
- `src/features/materials/screens/styles/MaterialDetail.styles.ts`

---

## [E1-7] Sistema de notificaciones Toast

Herramienta: Claude (Haiku 4.5 / Opus 4.7)
Proyecto: UTNotasApp · Grupo 10 · DAM 2026
Fecha: 2026-05-20 / 2026-05-21

### Tema 1 — Eliminar la puntuacion de MaterialCreateScreen

**Usuario:**
> Elimina la 'puntuacion' de `/src/features/materials/screens/MaterialCreateScreen`

**Claude:** Elimine del archivo `MaterialCreateScreen.tsx` todos los imports, estados y renders relacionados al sistema de puntos (`PointsModal`, `buildPointsBreakdown`, `PointsBreakdown`, `pointsAlert`).

Resultado: el formulario sigue funcionando pero ya no muestra el modal de puntos al crear un material.

---

### Tema 2 — Sistema de mensajes rapidos (toast) + redireccion post-creacion

**Usuario:**
> 1) Agregar un sistema de mensajes rapidos que se muestren por 3 segundos y tengan una cruz para cerrar y arriba una barra que va acortandose a medida que pasa el tiempo (puedes utilizar alguna libreria si es necesario). Con ese sistema agregar un mensaje de material de estudio creado exitosamente al terminar de crear un material.
>
> 2) al hacer click en subir el material, si no hay errores redirigir a `/material/[id]` con el id del material creado

**Claude:**

Arquitectura propuesta: tres archivos nuevos + dos modificaciones, usando `react-native-reanimated` (ya disponible) para la barra de progreso animada.

**Archivos creados:**
- `src/contexts/ToastContext.tsx` — Context + hook personalizado con `showToast`, `removeToast`
- `src/components/Toast.tsx` — Componente visual con barra de progreso animada usando `useSharedValue` + `withTiming`
- `src/components/ToastContainer.tsx` — Contenedor con Modal de RN

**Archivos modificados:**
- `src/app/_layout.tsx` — Envolver app con ToastProvider
- `src/features/materials/screens/MaterialCreateScreen.tsx` — Disparar toast + redirigir

---

### Tema 3 — Posicionamiento del toast (debugging)

**Usuario:** El toast queda debajo del contenido. haz que su posicion sea al frente de todo.

**Claude (Intento 1):** Agregue `position: absolute`, `zIndex: 9999`, `top/left/right/bottom: 0`.

**Usuario:** sigue quedando debajo de "UTNotas / Ver material" pero por arriba del resto.

**Claude (Intento 2):** Cree un componente `ToastOverlay` para renderizar localmente dentro de cada pantalla.

**Usuario:** Sigue sin funcionar, piensa en otra solucion.

**Claude (Solucion final):** Cambio de raiz: usar `Modal` de React Native con `transparent` y `statusBarTranslucent`. El Modal de RN se renderiza en una capa nativa separada que garantiza estar por encima de toda la jerarquia de UI, incluyendo los headers del Stack de expo-router.

---

### Tema 4 — Opacidad del fondo del toast

**Usuario:** cambia la opacidad a 1

**Claude:** Cambio directamente la config del toast a `rgba(36, 122, 72, 1)`, `rgba(192, 57, 43, 1)`, `rgba(31, 99, 181, 1)`. Ahora el toast tiene fondo opaco con texto e iconos blancos.

---

### Tema 5 — Bug visual: chips de filtros se estiran verticalmente

**Usuario:** Cuando no hay resultados en MaterialSearchScreen los badges de filtros se estiran verticalmente, eso no deberia ocurrir.

**Claude:** Diagnostico: el `ScrollView` horizontal de chips, cuando el padre tiene espacio sobrante (caso de `EmptyMaterialsState`), expande sus hijos verticalmente porque no tiene `alignItems` configurado.

Correcciones aplicadas:
- `alignItems: "center"` en contentContainer para alineacion vertical
- `alignSelf: "flex-start"` en chip individual para preservar altura intrinseca
- `flexGrow: 0` en el ScrollView para que no expanda verticalmente

**Archivos afectados:**

| Archivo | Tipo de cambio |
|---|---|
| `src/contexts/ToastContext.tsx` | Creado |
| `src/components/Toast.tsx` | Creado |
| `src/components/ToastContainer.tsx` | Creado (versiones con `Modal` final) |
| `src/app/_layout.tsx` | Modificado (agregar ToastProvider + ToastContainer) |
| `src/features/materials/screens/MaterialCreateScreen.tsx` | Modificado |
| `src/features/materials/screens/MaterialSearchScreen.tsx` | Modificado |
| `src/features/materials/screens/styles/MaterialSearch.styles.ts` | Modificado |

---

# ENTREGA 2

---

## [E2-1] Auth (login / registro), perfil y publicaciones

Fecha de generacion: 19/06/2026
Herramienta: Claude Code
Repositorio: `DAM26-G10/UTNotasApp`
Ramas: `feature/register-login-frontend`, `feature/perfil-mispublicaciones-frontend`

### Objetivo de la charla

Implementar el frontend de la Entrega 2 sobre UTNotasApp (React Native + Expo):

1. Reestructurar el repositorio para separar frontend, backend y documentacion.
2. Construir las pantallas de **login** y **registro** replicando el flujo de la version web.
3. Agregar la pantalla **Mi perfil** con la seccion embebida **Mis Publicaciones**.
4. Resolver el conflicto que aparecio al mergear contra `main` (que en paralelo incorporo el backend completo con Prisma + JWT).
5. Adaptar **Mis Publicaciones** para que lea desde la API real en lugar del store local.

### 1) Reestructuracion del repositorio

**Pedido inicial:**
> mira, necesito que estructuremos el proyecto para estructurarlo bien, porque
> actualmente solo tenemos front y se encuentra todo dentro de utnotasapp, lo
> que se debe hacer ahora, es, dentro de la carpeta utnotasapp separar el front
> del back, ya que anteriormente solo teniamos front y ahora debemos
> implementar back, por otro lado fuera de utnotasapp tenemos 2 carpetas de
> documentacion, debemos ponerlas ambas en una misma carpeta llamada
> Documentacion. Nuestro backend estara hecho con express, necesito que solo
> dejes la estructura, luego nosotros haremos el back end.

**Cambios realizados:**
- Todo el contenido previo de `UTNotasApp/` (Expo / React Native) se movio a `UTNotasApp/frontend/` usando `git mv` para conservar historial.
- Se creo `UTNotasApp/backend/` con la estructura tipica de un proyecto Express (config, controllers, middlewares, models, routes, services, utils).
- Las carpetas `docs/` e `ia/` que estaban en la raiz se unificaron dentro de `Documentacion/` (docs/ + ia/).

**Aclaracion sobre `.gitkeep`:**
> que significa el gitkeep? se conciso

Se explico que `.gitkeep` es un archivo vacio puesto dentro de carpetas vacias para que Git pueda incluirlas en el repo (Git no versiona directorios sin archivos).

### 2) Frontend de login y registro

**Pedido inicial:**
> ok, ya que ahora tienes toda la estructura del proyecto, necesito hacer SOLO
> el frontend del register y login de la app, recuerda que esto es una pagina
> web/app mobil, en react native, te voy a enviar componentes de como es el
> register y login actual en la pagina web ya existente de utnotas, debes
> hacer los mismo pero para react native. no hace falta que uses captcha ni
> google auth, los componentes que necesites debes crearlos, ademas debes
> seguir el flujo real, cuando se selecciona registrar, primero antes del form
> del register, se le debe pedir a que carrera pertenece y luego el form.

Se compartieron los componentes web `LoginPage.jsx`, `SignupPage.jsx`, `LoginRequired.jsx` y `CareerSelector.jsx`.

**Implementacion realizada:**

Se creo la feature `src/features/auth/` con:
- `types/auth.types.ts` — tipos `LoginFormData`, `SignupFormData`, `FormErrors<T>`
- `utils/authValidation.ts` — validaciones puras sin librerias externas
- `utils/navigateAfterAuth.ts` — helper que vuelve al home con el stack limpio
- `hooks/useLoginForm.ts` y `hooks/useSignupForm.ts` — centralizan estado y validacion
- `components/AuthScreenLayout.tsx` — contenedor visual compartido
- `components/AuthTextField.tsx` — input con placeholder, error inline y toggle de visibilidad
- `screens/LoginScreen.tsx` — email + contrasena + boton + link a registro
- `screens/SignupScreen.tsx` — flujo en dos pasos: carrera primero, luego formulario

Se crearon las rutas en `src/app/`: `login.tsx` y `signup.tsx`.

### 3) Ajustes del flujo de sesion

**Problema reportado:**
> no aparece ni el login ni el register ni siquiera una opcion dentro del home
> para poder iniciar sesion o registrarse.

**Causa:** `initialRouteName="login"` en el stack raiz no alcanzaba: expo-router resuelve la URL inicial `/`, que pertenece al grupo `(tabs)`, y eso ignoraba el route inicial del stack.

**Solucion (primera version, sin backend):**

Se introdujo un `AuthContext` en memoria con `isAuthenticated`, `user`, `signIn`, `signOut`.

**Aclaracion del flujo correcto:**
> algo que debes tener en cuenta, es que la primer imagen que se debe ver es
> la del home, el usuario puede navegar por los materiales sin iniciar sesion
> o registrarse, dentro del home debe aparecer la opcion de "mi perfil" en
> donde ahi se pueda iniciar sesion, del mismo modo que el usuario puede ver
> materiales sin iniciar sesion, SI debe iniciar sesion o registrarse si
> quiere subir un material.

**Cambios finales del flujo:**
- Home publico: cualquiera puede entrar y buscar materiales.
- Boton "Mi perfil" en el header del home.
- Pantalla de perfil: sin sesion muestra botones para iniciar sesion / crear cuenta; con sesion muestra datos + boton "Cerrar sesion".
- Pestana "Subir" en los tabs: sin sesion, intercepta con `e.preventDefault()` y dispara un toast informativo.
- Guard tambien en `/create` mediante `AuthRequiredNotice`.

### 4) Pantalla "Mi perfil" y seccion "Mis Publicaciones"

**Pedido inicial:**
> ahora debemos hacer solo el frontend de "Mi perfil" y de "Mis publicaciones,
> que se encuentra dentro de "Mi perfil"

**Implementacion:**

Se extendio `AuthUser` con campos adicionales (`surname`, `username`, `careerId`, `careerName`, `points`, `joinedAt`).

Nuevos componentes:
- `features/auth/components/ProfileCard.tsx` — tarjeta con avatar, nombre/apellido, @usuario, carrera, fecha de union y badge de nivel
- `features/auth/utils/profileHelpers.ts` — `getLevelLabel(points)` y `formatJoinDate(iso)`
- `features/materials/components/MyPublications.tsx` — seccion embebida con stats, buscador local y lista de materiales

### 5) Merge contra `main` (backend ya integrado)

**Contexto:** Al abrir el PR aparecio un conflicto en `SignupScreen.tsx`. `main` ya incorporo en paralelo: backend completo con Prisma + PostgreSQL + JWT, nuevo `AuthContext` con metodos asincronos, cliente HTTP `apiClient.ts`, y `(tabs)/profile.tsx` mas completo.

**Decisiones del merge:**
1. `SignupScreen.tsx` — se acepto la version de `main` (que pega a `POST /api/users/register` + `login(email, password)`).
2. **Archivos eliminados** por quedar obsoletos: `src/contexts/AuthContext.tsx` (version en memoria), `src/app/profile.tsx`, `src/features/auth/screens/ProfileScreen.tsx`, `src/features/auth/components/ProfileCard.tsx`, `src/features/auth/utils/profileHelpers.ts`.
3. `MyPublications.tsx` se preservo, adaptado sin prop `points`.
4. Integracion dentro de `(tabs)/profile.tsx` de main: se envolvio en `ScrollView` y se inserto `<MyPublications />`.

Verificaciones: `npx tsc --noEmit` sin errores. `npx eslint src` sin errores.

### 6) Fix de "Mis Publicaciones" — leer del backend

**Problema senalado por el usuario:**
> MyPublications.tsx lee de un store local (getCreatedMaterials), no de la
> API. Esto significa que la seccion "Mis Publicaciones" en el perfil muestra
> los materiales guardados localmente en la sesion, no los que realmente subio
> el usuario en la base de datos.

**Cambios:**

`services/materialService.ts` — se agrego `userId?: number` al tipo `MaterialListFilters` y al builder de query string.

`components/MyPublications.tsx` — se reescribio para:
- Tomar `user.id` de `useAuth()`.
- Llamar `useGetMaterials({ userId })` en lugar de `getCreatedMaterials()`.
- Manejar tres estados nuevos: cargando (spinner), error (con boton "Reintentar") y vacio (mensaje + CTA).
- La busqueda sigue siendo local por titulo sobre los datos ya cargados.

**Beneficios automaticos al usar `useGetMaterials`:**
1. Los materiales persisten entre sesiones (vienen de la DB).
2. La lista se invalida sola al crear/editar/borrar un material.
3. La autenticacion va incluida: `apiFetch` agrega el header `Authorization: Bearer <token>` automaticamente.

**Resultado final:**
- Repositorio dividido en `frontend/`, `backend/` y `Documentacion/`.
- Flujo de auth completo en el frontend, conectado al backend de Prisma + JWT.
- Home publico; "Subir" intercepta con toast cuando no hay sesion.
- Mi perfil compone: hero de main + datos + "Editar perfil" + "Cerrar sesion" + **"Mis Publicaciones" conectada al backend** + "Eliminar cuenta".

---

## [E2-2] Editar perfil de usuario

Fecha de generacion: 06/06/2026
Herramienta: Claude Code
Repositorio: `DAM26-G10/UTNotasApp`
Rama: `feature/editar-perfil`

### Objetivo de la charla

Implementar la funcionalidad de edicion de perfil en la pantalla "Mi perfil" de UTNotasApp, incluyendo la modificacion de nombre, apellido y usuario, con confirmacion de contrasena. El email se muestra pero no se puede modificar.

### Pedido inicial

> quiero implementar la edicion de perfil y la limitacion de
> accion a publicaciones propias. Revisa la estetica actual del proyecto e
> implementa estas funcionalidades.

### Analisis realizado

Se inspeccionaron los archivos principales del proyecto. Se verifico que `AuthContext` ya exponia los datos del usuario pero no tenia metodo para actualizarlos.

### Implementacion realizada

#### AuthContext — metodo `updateProfile`

Se agrego el tipo `UpdateProfileData` y el metodo `updateProfile` al contexto:

```typescript
export type UpdateProfileData = {
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
  password?: string;
};

const updateProfile = async (data: UpdateProfileData) => {
  if (!user) throw new Error('No hay usuario autenticado.');
  const res = await apiFetch<{ data: AuthUser; message: string }>(
    `/api/users/${user.id}`,
    { method: 'PATCH', body: JSON.stringify(data) },
  );
  setUser(res.data);
};
```

Archivo modificado: `UTNotasApp/frontend/src/features/auth/AuthContext.tsx`

#### ProfileScreen — formulario de edicion

Se modifico la pantalla de perfil para incluir un formulario de edicion expandible con los siguientes campos:

- **Nombre** (`name`) — editable
- **Apellido** (`surname`) — editable
- **Usuario** (`username`) — editable
- **Email** (`email`) — solo lectura, bloqueado
- **Contrasena actual** — requerida para confirmar cambios
- **Nueva contrasena** — opcional

Comportamiento:
- Al presionar "Editar perfil" se despliega el formulario con los valores actuales pre-cargados.
- El campo de email esta deshabilitado visualmente y no se envia en el payload.
- Se valida que la contrasena actual no este vacia antes de enviar.
- Al guardar exitosamente se cierra el formulario y se muestra un toast de confirmacion.

Archivos modificados:
- `UTNotasApp/frontend/src/app/(tabs)/profile.tsx`
- `UTNotasApp/frontend/src/features/auth/screens/ProfileScreen.tsx`

### Mejoras visuales al perfil

El usuario solicito cambios visuales en la pantalla de perfil:
- Se mejoro la presentacion de los datos del usuario (nombre completo, usuario, email).
- Se ajustaron los estilos del avatar, tarjeta de datos y botones de accion.
- Se mantuvieron los estilos del estado "no logueado" exactamente como estaban.

### Verificaciones realizadas

- TypeScript compilo sin errores luego de cada cambio.
- La navegacion post-login volvio al home (`/`) correctamente.
- El formulario de edicion carga los valores actuales del usuario.
- El campo de email aparece bloqueado visualmente.

### Resultado final

La feature de edicion de perfil quedo implementada, conectada al endpoint `PATCH /api/users/:id` del backend. Solo el propio usuario puede editar su perfil (validacion en el backend mediante JWT).

---

## [E2-3] Eliminar cuenta de usuario

Fecha de generacion: 06/06/2026
Herramienta: Claude Code
Repositorio: `DAM26-G10/UTNotasApp`
Rama: `feature/editar-perfil`

### Objetivo de la charla

Agregar la funcionalidad de eliminar la propia cuenta desde la pantalla de perfil, con un modal de confirmacion que solicita la contrasena del usuario.

### Pedido inicial

> ahora quiero agregar la funcionalidad de eliminar perfil, debe ser un boton
> en la page de perfil, que borre al usuario logueado de la bd y que al
> apretar el boton muestre un modal de confirmacion

Pedidos adicionales durante la implementacion:

> me gustaria que el boton de eliminar cuenta este abajo, por encima de los
> botones de direccion pero abajo de toda la page

> el boton de cancelar del modal tiene mal los estilos

> le falta el boton de ver la password al modal

### Analisis realizado

Se verifico que el backend ya tenia el endpoint implementado:

- `DELETE /api/users/:id` en `user.routes.ts`
- `deleteUser(id, password, ctx)` en `user.service.ts`
  - El USER debe proveer la contrasena correcta (comparacion con bcrypt).
  - El ADMIN puede eliminar sin contrasena.
  - Se maneja el error Prisma `P2025` (registro no encontrado) como 404.

No fue necesario ningun cambio en el backend.

### Implementacion realizada

#### AuthContext — metodo `deleteAccount`

Se agrego el metodo `deleteAccount` al contexto de autenticacion:

```typescript
const deleteAccount = async (password: string) => {
  if (!user) throw new Error('No hay usuario autenticado.');
  await apiFetch(`/api/users/${user.id}`, {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
  setAuthToken(null);
  setUser(null);
};
```

Archivo modificado: `UTNotasApp/frontend/src/features/auth/AuthContext.tsx`

#### Modal de confirmacion en ProfileScreen

Se agrego un `Modal` de React Native con:

- Icono de alerta (`alert-triangle` de Feather).
- Titulo: "Eliminar cuenta".
- Texto de advertencia sobre irreversibilidad.
- Campo de contrasena con toggle de visibilidad (ojo/ojo-cerrado).
- Mensaje de error si la contrasena es incorrecta o esta vacia.
- Boton "Eliminar" en rojo que dispara `deleteAccount`.
- Boton "Cancelar" que cierra el modal.

Estados agregados:

```typescript
const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const [deletePassword, setDeletePassword] = useState("");
const [deletePasswordVisible, setDeletePasswordVisible] = useState(false);
const [deleteError, setDeleteError] = useState<string | null>(null);
const [isDeleting, setIsDeleting] = useState(false);
```

#### Posicion del boton de eliminar

El boton "Eliminar cuenta" se posiciono en la parte inferior de la pantalla usando `marginTop: "auto" as const`. El `as const` fue necesario para que TypeScript acepte `"auto"` como valor literal de `marginTop`.

#### Toggle de visibilidad de contrasena

El input de contrasena en el modal se envuelve en una View con icono de ojo:

```tsx
<View style={s.modalInputWrap}>
  <TextInput
    style={s.modalInputInner}
    secureTextEntry={!deletePasswordVisible}
    value={deletePassword}
    onChangeText={setDeletePassword}
    placeholder="Tu contraseña actual"
  />
  <Pressable onPress={() => setDeletePasswordVisible(v => !v)}>
    <Feather name={deletePasswordVisible ? "eye-off" : "eye"} size={20} />
  </Pressable>
</View>
```

### Verificaciones realizadas

- El modal se abre al presionar "Eliminar cuenta".
- El campo de contrasena muestra/oculta el texto con el toggle.
- Si la contrasena esta vacia, muestra error sin llamar a la API.
- Si la contrasena es incorrecta, muestra el mensaje de error de la API.
- Al eliminar exitosamente: cierra el modal, muestra toast "Cuenta eliminada", navega al home y limpia el estado de autenticacion.
- TypeScript compilo sin errores.

### Resultado final

La funcionalidad de eliminar cuenta quedo implementada con modal de confirmacion, validacion de contrasena y toggle de visibilidad, conectada al endpoint `DELETE /api/users/:id` del backend.

---

## [E2-4] Bugs, correcciones y configuracion del backend

Fecha de generacion: 06/06/2026
Herramienta: Claude Code
Repositorio: `DAM26-G10/UTNotasApp`
Rama: `feature/editar-perfil`

### Objetivo de la charla

Resolver una serie de errores y regresiones que aparecieron durante el desarrollo de la feature de editar/eliminar perfil en la Entrega 2.

### Problemas resueltos

#### 1. Error useAuth fuera de AuthProvider

**Sintoma:**
```
ERROR  [Error: useAuth debe usarse dentro de AuthProvider]
```

**Causa:** El `AuthProvider` no estaba envolviendo correctamente la navegacion en `_layout.tsx`.

**Solucion:** Se verifico y corrigio el orden de los providers en `UTNotasApp/frontend/src/app/_layout.tsx` para asegurar que `AuthProvider` envuelva al `Stack` de navegacion.

#### 2. Error al registrarse — ReferenceError email

**Sintoma:**
```
ERROR  [ReferenceError: Property 'email' doesn't exist]
```

**Causa:** La pantalla de registro hacia referencia a una propiedad del formulario que habia sido renombrada o eliminada durante los cambios.

**Solucion:** Se restauro la referencia correcta al campo `email` en el form de registro (`SignupScreen.tsx`).

#### 3. careerId obligatorio en el schema de Prisma

**Problema:** El schema de Prisma definia `careerId` en `User` como campo obligatorio (NOT NULL). Como el ABM de carreras corresponde a la Entrega 3, el front no podia enviar ese ID al registrar usuarios.

**Solucion:** Se hizo el campo `careerId` opcional en el schema de Prisma (`Int?`) y se ejecuto la migracion correspondiente.

Archivo modificado: `UTNotasApp/backend/prisma/schema.prisma`

#### 4. Redireccion post-login al home

**Sintoma:** Al loguearse, la app redireccionaba a la pagina de perfil en lugar del home.

**Causa:** `navigateAfterAuth` usaba una ruta incorrecta.

**Solucion:** Se corrigio para usar `router.replace("/")`.

Archivo modificado: `UTNotasApp/frontend/src/features/auth/utils/navigateAfterAuth.ts`

#### 5. Error KeyboardAvoidingView

**Sintoma:**
```
ERROR  [ReferenceError: Property 'KeyboardAvoidingView' doesn't exist]
```

**Causa:** `KeyboardAvoidingView` no estaba importado en el archivo donde se usaba.

**Solucion:** Se agrego el import correspondiente desde `react-native`.

#### 6. Error `signOut` no existe en AuthContextValue

**Sintoma:**
```
Property 'signOut' does not exist on type 'AuthContextValue'.ts(2339)
```

**Causa:** Una referencia residual usaba `signOut` en lugar del metodo correcto `logout`.

**Solucion:** Se corrigio la referencia a `logout` en `ProfileScreen.tsx`.

### Resultado final

Todos los bugs y regresiones quedaron resueltos. El flujo de registro, login, edicion de perfil y navegacion funciona correctamente con el backend levantado.

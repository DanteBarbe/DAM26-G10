# Chat con IA - Feature Crear Material

Fecha de generacion: 21/05/2026

Repositorio trabajado: `DAM26-G10/UTNotasApp`

Rama indicada: `feature/crear-material`

## Objetivo de la charla

El objetivo fue implementar en la version mobile de UTNotas la feature de
crear un material de estudio para la primera entrega del ABMC de materiales.

El usuario aclaro que:

- El proyecto original de referencia esta en `UTN-DS25-Grupo-2-`.
- El nuevo repositorio mobile esta en `DAM26-G10/UTNotasApp`.
- La entrega debe resolverse solo desde el front, sin backend por ahora.
- La implementacion debia respetar la experiencia del UTNotas original.
- Los comandos debian ejecutarse usando Git Bash, porque PowerShell no estaba funcionando bien.

## Pedido inicial

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

## Analisis realizado

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

## Implementacion realizada

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

### Pantalla creada

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

### Datos mock

Como no se usa backend en esta entrega, se agregaron datos mock del lado front
en `src/data/materialOptions.ts`.

Incluyen:

- Carreras.
- Materias.
- Relacion carrera-materia.
- Tipos de material.
- Helpers para obtener carreras por materia.
- Helper para obtener la relacion carrera-materia.

### Persistencia front-only

Se agrego `src/utils/createdMaterialsStore.ts` para guardar materiales creados
desde el front:

- En web usa `localStorage`.
- En mobile mantiene una lista en memoria.

Esto permite simular el alta sin depender de backend.

### Selector de archivos

Se instalo `expo-document-picker` para que el selector de archivos funcione en
mobile:

```bash
npx expo install expo-document-picker
```

La dependencia quedo agregada como:

```json
"expo-document-picker": "~14.0.8"
```

### Assets de Expo

Expo tenia referencias a iconos y favicon en `app.json`, pero la carpeta
`assets/images` no existia.

Se agregaron assets minimos para evitar advertencias al exportar:

- `icon.png`
- `android-icon-foreground.png`
- `android-icon-background.png`
- `android-icon-monochrome.png`
- `splash-icon.png`
- `favicon.png`

## Verificaciones realizadas

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

## Resultado final

La feature "Crear material" quedo implementada en el front mobile de
UTNotasApp, respetando el flujo del proyecto original y sin depender del
backend.

Quedo lista para ser revisada dentro de la primera entrega del ABMC de
materiales de estudio.


# Conversacion completa - UTNotasApp (Entrega 3)

> Proyecto: UTNotasApp | Rama: feature/front-materia-carrera | Fecha: 2026-07-14
> Temas: carreras y materias en materiales (crear/filtrar/mostrar), comision autocompletada, seed del catalogo, fix de visualizacion, DB compartida en Supabase/Render

---

## Sesion 1 - Analisis e implementacion de carreras/materias

### Usuario [14:02]

Necesito que analices nuevamente este proyecto porque se hicieron cambios y se anadio todo el backend y DB necesario para implementar las carreras y materias dentro de la pagina. Estas deben pertenecer a todos los materiales; se debe poder filtrar por carrera y materia. Ademas, al crear un material es necesario ingresar la materia (a partir de ahi en el desplegable de carrera se filtran las carreras que tienen esa materia), y luego a partir de la materia y la carrera se autocompleta una parte de la comision. Por ejemplo, si se pone Analisis Matematico y Ing. en Sistemas, la comision sera S1..., y el numero que le sigue al 1 es lo que ingresa el usuario al subir el material. Esa parte de la logica ya existe.

---

### Claude [14:03]

Empiezo a re-analizar el estado del repo y qué expone el backend para carreras/materias.

---

### Usuario [14:04]

[Request interrupted by user] Perdon, me habia faltado hacer el ultimo merge a main. Ahora si.

---

### Claude [14:07]

Analizado. Resumen:

**Backend (ya esta, con datos seedeados):**
- Endpoints justos para el flujo:
  - `GET /api/materias` -> lista de materias.
  - `GET /api/carreras/materia/:materiaId` -> carreras que dictan esa materia (para el desplegable filtrado).
  - `GET /api/carreras/:id/materias/:materiaId` -> `{ anio }` (para el prefijo de comision; ej: Sistemas + anio 1 -> "S1").
  - `GET /api/materials?materiaId=&carreraId=` -> ya filtra por esos campos.
- `createMaterialSchema`: `materiaId` obligatorio, `carreraId` opcional.

**Gap bloqueante del backend:** `material.service.createMaterial` **ignora** `materiaId`/`carreraId` (comentario "hasta E3") — y sigue asi en `entrega-3`. O sea, al crear queda `null` en la DB aunque el front mande la materia. Son ~2 lineas de fix.

**Frontend (estado actual):**
- `materialOptions.ts` tiene carreras/materias **hardcodeadas que NO coinciden con la DB** -> hay que reemplazar por la API.
- `useMaterialForm` mantiene la logica materia->carrera->comision, pero usando el mock.
- El formulario de crear tenia materia/carrera **ocultas** (de una tarea anterior); habia que reponerlas.

Antes de arrancar dejo dos decisiones.

---

### Usuario [14:10]

**Backend fix:** Si, backend + frontend (arreglar `createMaterial` ademas de todo el frontend).
**Carrera obligatoria:** Solo materia obligatoria (carrera opcional; sin carrera no se autocompleta la comision).

---

### Claude [14:26]

Implementado y verificado (tsc backend 0 / tsc + eslint frontend limpios, salvo un error preexistente de `expo-image-picker` en `filePicker.ts`, ajeno a esto).

**Backend:**
- [material.service.ts](UTNotasApp/backend/src/services/material.service.ts) — `createMaterial` ahora **guarda `materiaId`/`carreraId`**; ajuste de tipos en `updateMaterial`.
- [user.service.ts](UTNotasApp/backend/src/services/user.service.ts) — `createUser` ahora **guarda `careerId`**. Era el **mismo bug** (la validacion lo exige, el service lo ignoraba) y como el schema lo volvio obligatorio, **rompia el build entero y el registro**.

**Frontend:**
- Nuevos [catalogService.ts](UTNotasApp/frontend/src/features/materials/services/catalogService.ts) + [useCatalog.ts](UTNotasApp/frontend/src/features/materials/hooks/useCatalog.ts): `useMaterias`, `useCarreras`, `useCarrerasByMateria`, `useCarreraMateriaAnio` (react-query contra la API real).
- [useMaterialForm.ts](UTNotasApp/frontend/src/features/materials/hooks/useMaterialForm.ts): reemplaza el mock por la API. Flujo materia -> carreras filtradas por esa materia -> comision con prefijo (letra de la carrera + anio) + digito del usuario.
- [MaterialCreateScreen.tsx](UTNotasApp/frontend/src/features/materials/screens/MaterialCreateScreen.tsx): repone el buscador de Materia (obligatoria), el selector de Carrera (opcional, filtrado) y la comision con prefijo.
- [FilterModal.tsx](UTNotasApp/frontend/src/features/materials/components/FilterModal.tsx): secciones Carrera y Materia desde la API.
- Tarjeta y detalle vuelven a mostrar materia/carrera.
- `materialService.updateMaterial` reactivado para enviar materia/carrera; validacion exige materia.
- [SignupScreen.tsx](UTNotasApp/frontend/src/features/auth/screens/SignupScreen.tsx): usa las carreras reales de la API (antes usaba el mock con ids que no existen en la DB, lo que habria hecho fallar el registro por FK).

---

## Sesion 2 - Ajustes: filtro materia->carrera, seed y fix de visualizacion

### Usuario [15:05]

Va bien. Pero, por ejemplo, al filtrar, primero se pregunta la materia y una vez que se elige se filtran que carreras pertenecen a esa materia. Ademas, las carreras que tenemos son: Ingenieria en Sistemas de Informacion, Ingenieria Industrial, Ingenieria Electrica, Ingenieria Mecanica, Ingenieria Quimica e Ingenieria Civil. Las materias basicas van a pertenecer a todas las carreras, y hay materias especificas para cada carrera (ej: Base de Datos de Sistemas, Administracion de Industrial). Necesito que cargues esas carreras y mas materias especificas por carrera.

Ademas, al ver el material (acabo de subir uno con Analisis Matematico II e Ing. en Sistemas), no me aparece la carrera ni "Analisis Matematico II", sino "Materia 2".

---

### Claude [15:20]

Tres cosas:

**1. Seed recargado** — [seed.ts](UTNotasApp/backend/prisma/seed.ts): las **6 carreras**; **materias basicas** comunes a todas (Analisis I/II, Algebra y Geometria, Fisica I/II, Quimica General, Probabilidad y Estadistica) y **especificas por carrera** (Base de Datos / Paradigmas / Algoritmos / Diseno de Sistemas en Sistemas; Administracion / Investigacion Operativa en Industrial; Estabilidad / Hidraulica en Civil; Circuitos / Maquinas Electricas en Electrica; Termodinamica / Fluidos en Mecanica; Quimica Organica / Operaciones Unitarias en Quimica). Mantuve **ids estables** de materias 1-5 y carreras 1 (Sistemas) y 3 (Civil) para no romper materiales ya subidos. Cada relacion trae su `anio` (base de la comision).

**2. Filtro materia -> carrera** — [FilterModal.tsx](UTNotasApp/frontend/src/features/materials/components/FilterModal.tsx): ahora primero se elige la materia y recien ahi aparecen las carreras que la dictan (usando `/api/carreras/materia/:id`, igual que al crear).

**3. El "Materia 2" / carrera vacia:** el codigo **ya esta bien** (`getMaterialById` incluye materia y carrera y devuelve los nombres). Ese cartel aparece cuando el `materiaId` guardado **no matchea una fila real** en la DB (DB sin seedear o desincronizada), o cuando se le pega a un backend que todavia no tiene los fixes. Se arregla reseedeando la DB y corriendo el backend con estos cambios; ademas mis fixes de backend estan sin deployar todavia.

---

## Sesion 3 - Validacion del seed y commits

### Usuario [15:40]

Si, valida el seed y arma los commits, que no queden muy profesionales pero si bien estructurados.

---

### Claude [15:48]

**Seed validado corriendo contra la DB del `.env`.** Creo 6 carreras, 21 materias, 56 relaciones (7 basicas x 6 carreras = 42, + 14 especificas). Consulta de control:
- `materia id 2 = "Analisis Matematico II"` -> tu material con `materiaId=2` ahora resuelve el nombre (adios "Materia 2").
- AM II (basica) -> 6 carreras; Base de Datos (especifica) -> solo Sistemas.
- `anio(Sistemas, AM II) = 2` -> comision "S2".

**5 commits** (2 de back, 3 de front), mensajes cortos:

```
back: guarda materia/carrera al crear material y careerId al registrarse
back: seed con las 6 carreras y materias (basicas comunes + especificas por carrera)
front: conecta el form de material al catalogo real (materia -> carrera -> comision)
front: muestra materia/carrera y filtra por ellas (primero materia, despues carrera)
front: el registro usa las carreras de la API en vez de la lista mock
```

---

## Sesion 4 - Deploy y DB compartida (Render / Supabase)

### Usuario [16:02]

Debo correr ese seed en Render o no, para que todos tengan esos datos?

---

### Claude [16:04]

La DB del `.env` es **Supabase (en la nube), compartida** — no es local. Es la misma DB a la que apunta el backend (local y el de Render).

**No hace falta correrlo "en Render":** como el seed ya lo corri contra esa Supabase, el catalogo **ya esta cargado para todos** los que peguen a esa DB. Solo verificar que el `DATABASE_URL` del servicio de Render sea exactamente esa URL de Supabase. El seed es idempotente (usa `upsert`), asi que re-correrlo no rompe nada.

Lo que **si** falta para produccion: pushear los commits para que Render redeploye el backend con el fix de codigo (que `createMaterial` guarde materia/carrera). Aviso ademas que, como la Supabase es compartida, correr el seed ya **toco los datos del equipo** (upsert del catalogo; la carrera id 2 paso de "Electronica" a "Industrial") — nada de usuarios reales.

---

### Usuario [16:12]

Y por que a mi amigo no le aparecen las carreras y materias cargadas desde su back remoto?

---

### Claude [16:14]

Porque el seed solo cargo **una** DB: la del `.env` **tuyo** (esa Supabase). El `.env` esta en `.gitignore`, asi que cada uno puede tener un `DATABASE_URL` distinto -> si el back de tu amigo apunta a otra DB, esa esta vacia.

**Diagnostico (rapido):** que tu amigo abra en el navegador la URL de **su** backend + `/api/carreras`:
- Devuelve las 6 carreras -> la DB esta bien; el problema es la app (su `EXPO_PUBLIC_API_URL` apunta a otro lado, o cache -> `npx expo start -c`).
- Devuelve `[]` (vacio) -> su backend usa **otra DB** sin seedear -> hay que seedear esa, o que apunte a la Supabase compartida.
- Devuelve 404 -> su backend tiene **codigo viejo** -> falta deployar los cambios.

**Como deberia ser (grupo):** un solo backend + una sola DB compartida para todo el equipo (todos con el mismo `DATABASE_URL`). Ahi se seedea una vez y listo. Si cada uno tiene su DB local, cada uno corre `npx tsx prisma/seed.ts` con su `DATABASE_URL`.

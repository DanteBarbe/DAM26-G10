# Chat con IA — Auth (login / registro), perfil y publicaciones

Fecha de generacion: 19/06/2026

Repositorio trabajado: `DAM26-G10/UTNotasApp`

Ramas indicadas: `feature/register-login-frontend`, `feature/perfil-mispublicaciones-frontend`

## Objetivo de la charla

Implementar el frontend de la Entrega 2 sobre UTNotasApp (React Native + Expo):

1. Reestructurar el repositorio para separar frontend, backend y documentacion.
2. Construir las pantallas de **login** y **registro** replicando el flujo de la
   version web.
3. Agregar la pantalla **Mi perfil** con la seccion embebida **Mis Publicaciones**.
4. Resolver el conflicto que aparecio al mergear contra `main` (que en paralelo
   incorporo el backend completo con Prisma + JWT).
5. Adaptar **Mis Publicaciones** para que lea desde la API real en lugar del
   store local que se uso durante el desarrollo.

---

## 1) Reestructuracion del repositorio

### Pedido inicial

> mira, necesito que estructuremos el proyecto para estructurarlo bien, porque
> actualmente solo tenemos front y se encuentra todo dentro de utnotasapp, lo
> que se debe hacer ahora, es, dentro de la carpeta utnotasapp separar el front
> del back, ya que anteriormente solo teniamos front y ahora debemos
> implementar back, por otro lado fuera de utnotasapp tenemos 2 carpetas de
> documentacion, debemos ponerlas ambas en una misma carpeta llamada
> Documentacion. Nuestro backend estara hecho con express, necesito que solo
> dejes la estructura, luego nosotros haremos el back end.

### Cambios realizados

- Todo el contenido previo de `UTNotasApp/` (Expo / React Native) se movio a
  `UTNotasApp/frontend/` usando `git mv` para conservar historial.
- Se creo `UTNotasApp/backend/` con la estructura tipica de un proyecto Express:

  ```
  backend/
  ├── src/
  │   ├── config/        configuracion (DB, env, etc.)
  │   ├── controllers/   reciben la request y devuelven la response
  │   ├── middlewares/   middlewares de Express
  │   ├── models/        modelos / acceso a datos
  │   ├── routes/        definicion de rutas de la API
  │   ├── services/      logica de negocio
  │   └── utils/         utilidades y helpers
  ├── .gitignore
  ├── package.json
  └── README.md
  ```

  Cada subcarpeta de `src/` quedo con un `.gitkeep` (archivo vacio que se
  agrega para que Git pueda versionar carpetas sin contenido; Git no rastrea
  directorios vacios).

- Las carpetas `docs/` e `ia/` que estaban en la raiz se unificaron dentro de
  una sola carpeta `Documentacion/`:

  ```
  Documentacion/
  ├── docs/   documentacion de entregas (alcance, mockups, etc.)
  └── ia/     conversaciones con IA y skills usadas
  ```

### Aclaracion sobre `.gitkeep`

> que significa el gitkeep? se conciso

Se explico que `.gitkeep` es un archivo vacio puesto dentro de carpetas vacias
para que Git pueda incluirlas en el repo (Git no versiona directorios sin
archivos). Al agregar codigo real, los `.gitkeep` se pueden borrar.

---

## 2) Frontend de login y registro

### Pedido inicial

> ok, ya que ahora tienes toda la estructura del proyecto, necesito hacer SOLO
> el frontend del register y login de la app, recuerda que esto es una pagina
> web/app mobil, en react native, te voy a enviar componentes de como es el
> register y login actual en la pagina web ya existente de utnotas, debes
> hacer los mismo pero para react native. no hace falta que uses captcha ni
> google auth, los componentes que necesites debes crearlos, ademas debes
> seguir el flujo real, cuando se selecciona registrar, primero antes del form
> del register, se le debe pedir a que carrera pertenece y luego el form.

Se compartieron los componentes web `LoginPage.jsx`, `SignupPage.jsx`,
`LoginRequired.jsx` y `CareerSelector.jsx`, y un par de capturas con el estilo
deseado.

### Analisis del proyecto antes de codificar

Se inspeccionaron las convenciones existentes:

- Tokens de diseño en `src/styles/Colors.ts` (paleta, tipografia, spacing).
- Componentes reutilizables en `src/components/` (`FormField`, `SelectButton`,
  `OptionSheet`, `IconButton`, `Toast`).
- Estructura por feature en `src/features/<feature>/{screens,components,hooks,utils,types}`
  con cada componente acompañado de su archivo `.styles.ts`.
- Routing con `expo-router` (carpeta `src/app/`).
- Contexto de toasts (`ToastContext`) ya existente.

### Implementacion realizada

Se creo la feature `src/features/auth/` con:

- **`types/auth.types.ts`** — tipos `LoginFormData`, `SignupFormData`,
  `FormErrors<T>`.
- **`utils/authValidation.ts`** — validaciones puras (email, requeridos,
  longitudes minimas) para login y registro.
- **`utils/navigateAfterAuth.ts`** — helper que vuelve al home con el stack
  limpio luego de autenticarse.
- **`hooks/useLoginForm.ts`** y **`hooks/useSignupForm.ts`** — centralizan
  estado (valores, errores por campo) y validacion. `useSignupForm` ademas
  maneja los **dos pasos** del registro (carrera primero, formulario despues).
- **`components/AuthScreenLayout.tsx`** — contenedor visual compartido por
  login y registro (logo, titulo, subtitulo opcional, manejo de teclado, card
  centrada).
- **`components/AuthTextField.tsx`** — input con placeholder, error inline y
  toggle de visibilidad para contraseñas.
- **`screens/LoginScreen.tsx`** — email + contraseña + boton "Ingresar" + link
  a registro.
- **`screens/SignupScreen.tsx`** — flujo en dos pasos: primero seleccion de
  carrera (reusa `SelectButton` + `OptionSheet`), luego los campos del
  registro. Boton "← Cambiar carrera" para volver al paso 1.

Se crearon las rutas en `src/app/`:

- `login.tsx` y `signup.tsx` — re-exports de las screens correspondientes.

### Validaciones (sin librerias externas)

Para evitar agregar `react-hook-form` + `yup` al RN app, las validaciones se
hicieron a mano en `authValidation.ts` (regex de email, longitudes minimas,
requeridos). Esto mantiene el bundle chico y el codigo legible.

### Resultado parcial

`tsc` y `eslint` quedaron sin errores. Las pantallas quedaron listas a nivel
visual y de validacion. El submit todavia no se conectaba a un backend.

---

## 3) Ajustes del flujo de sesion

### Problema reportado

> no aparece ni el login ni el register ni siquiera una opcion dentro del home
> para poder iniciar sesion o registrarse. Levante la app y actualmente se ve
> lo mismo que se veia siempre.

### Causa

`initialRouteName="login"` en el stack raiz no alcanza: `expo-router` resuelve
la URL inicial `/`, que pertenece al grupo `(tabs)`, y eso ignora el route
inicial del stack.

### Solucion (primera version, sin backend)

Se introdujo un `AuthContext` **en memoria** (`src/contexts/AuthContext.tsx`):
expone `isAuthenticated`, `user`, `signIn`, `signOut`. Al envolver la app en
`AuthProvider`, los tabs verifican la sesion con un `<Redirect href="/login" />`
cuando no hay usuario.

### Aclaracion del flujo correcto

> algo que debes tener en cuenta, es que la primer imagen que se debe ver es
> la del home, el usuario puede navegar por los materiales sin iniciar sesion
> o registrarse, dentro del home debe aparecer la opcion de "mi perfil" en
> donde ahi se pueda iniciar sesion , del mismo modo que el usuario puede ver
> materiales sin iniciar sesion, SI debe iniciar sesion o registrarse si
> quiere subir un material, si el usuario no inicio sesion y quiere subir un
> material, debe aparecerle un alert como el de "se inicio sesion
> correctamente" pero diciendo que debe iniciar sesion o registrarse si
> quiere subir un material.

### Cambios finales del flujo

- **Home publico**: cualquiera puede entrar y buscar materiales (se quito el
  redirect forzado al login).
- **Boton "Mi perfil"** en el header del home, que abre una pantalla de perfil.
- **Pantalla de perfil**:
  - Sin sesion: "No iniciaste sesion" + botones para Iniciar sesion / Crear
    cuenta.
  - Con sesion: muestra datos del usuario + boton "Cerrar sesion".
- **Pestaña "Subir"** en los tabs:
  - Con sesion: abre el formulario de creacion normal.
  - Sin sesion: se intercepta el `tabPress` con un `listeners.tabPress` que
    llama `e.preventDefault()` y dispara un toast informativo:
    *"Iniciá sesión o registrate para subir un material"*.
- **Guard tambien en `/create`** mediante un componente
  `AuthRequiredNotice` para cubrir el deep-link.
- `LoginScreen` y `SignupScreen`, al validar OK, llaman a `signIn(...)` con
  los datos del registro y vuelven al home con stack limpio.

---

## 4) Pantalla "Mi perfil" y seccion "Mis Publicaciones"

### Pedido inicial

> ahora debemos hacer solo el frontend de "Mi perfil" y de "Mis publicaciones,
> que se encuentra dentro de "Mi perfil", te voy a enviar algunos de los
> componentes de utnotas web para que los tomes de referencia.

Se compartieron `MyMaterialsPage.jsx` y `ProfilePage.jsx` de la version web.

### Implementacion

Se extendio `AuthUser` con campos para presentar el perfil (`surname`,
`username`, `careerId`, `careerName`, `points`, `joinedAt`). El registro pasa a
guardar todos esos datos en el `signIn`.

Nuevos componentes:

- **`features/auth/components/ProfileCard.tsx`** — tarjeta con avatar, nombre y
  apellido, `@usuario`, "Estudiante de {carrera}", "Se unió en {mes año}" y
  badge de nivel + puntos.
- **`features/auth/utils/profileHelpers.ts`** — `getLevelLabel(points)` y
  `formatJoinDate(iso)`.
- **`features/materials/components/MyPublications.tsx`** — seccion embebida en
  el perfil con:
  - 3 stats: Publicaciones / Materias / Puntos.
  - Buscador local por titulo.
  - Lista de materiales subidos por el usuario reusando `MaterialResultCard`.
  - Estado vacio con CTA "Subir material".

La pantalla de perfil quedo asi: top bar (volver + "Mi perfil" + cerrar
sesion), `ProfileCard`, y `MyPublications` dentro de un `ScrollView`.

> Nota: en esta etapa, "Mis publicaciones" leia los materiales desde un store
> local (`createdMaterialsStore`). Esa decision se corrigio mas adelante (ver
> seccion 6).

---

## 5) Merge contra `main` (backend ya integrado)

### Contexto

Al abrir el PR aparecio un conflicto en `SignupScreen.tsx`. Investigando, se
detecto que `main` ya incorporo en paralelo:

- Backend completo con **Prisma + PostgreSQL + JWT** y endpoints reales para
  auth, usuarios y materiales.
- Un nuevo `AuthContext` en `src/features/auth/AuthContext.tsx` con metodos
  asincronos `login`, `logout`, `updateProfile`, `deleteAccount`.
- Cliente HTTP en `src/api/apiClient.ts` (`apiFetch`, `setAuthToken`,
  `ApiError`).
- `(tabs)/profile.tsx` con un ProfileScreen mucho mas completo (hero, edicion
  inline, eliminacion con confirmacion por contraseña, modal).
- Tab de "Perfil" agregado al `(tabs)/_layout.tsx`.

### Decisiones del merge

> hazlo tu (refiriendose a resolver los conflictos)

1. **`SignupScreen.tsx`** — se acepto la version de `main` (la que pega a
   `POST /api/users/register` + `login(email, password)`).
2. **Archivos eliminados** por quedar obsoletos con la llegada del backend:
   - `src/contexts/AuthContext.tsx` (mi version en memoria).
   - `src/app/profile.tsx` (ruta de stack: ahora el perfil es un tab).
   - `src/features/auth/screens/ProfileScreen.tsx` y su `.styles.ts`.
   - `src/features/auth/components/ProfileCard.tsx` y su `.styles.ts`.
   - `src/features/auth/utils/profileHelpers.ts` (dependia de campos como
     `points` y `joinedAt` que el `AuthUser` real no tiene).
3. **`MyPublications.tsx`** se preservo, pero adaptado:
   - Se quito el prop `points`.
   - Las stats quedaron en 2 (Publicaciones / Materias).
4. **Integracion** dentro de `(tabs)/profile.tsx` de main: se envolvio el
   bloque autenticado en un `ScrollView` y se inserto `<MyPublications />`
   entre los botones "Editar perfil / Cerrar sesion" y el botón "Eliminar
   cuenta". Se ajustaron estilos (`scrollContent`, `publicationsWrap`) y se
   quito el `marginTop: "auto"` del `bottomAction` porque dejo de aplicar
   dentro del scroll.

### Verificaciones

- `npx tsc --noEmit` sin errores.
- `npx eslint src` sin errores (solo warnings preexistentes en archivos no
  tocados).
- Merge cerrado con commit:
  `merge: integra main (backend de auth) y migra 'Mi perfil' al tab existente`.

---

## 6) Fix de "Mis Publicaciones" — leer del backend

### Problema señalado por el usuario

> MyPublications.tsx lee de un store local (getCreatedMaterials), no de la
> API. Esto significa que la seccion "Mis Publicaciones" en el perfil muestra
> los materiales guardados localmente en la sesion, no los que realmente subio
> el usuario en la base de datos. Si el usuario cierra la app y vuelve a
> entrar, aparecera vacio aunque tenga materiales subidos.

### Diagnostico

`MyPublications` se desarrollo cuando todavia no habia backend, asi que se
alimentaba de `createdMaterialsStore` (memoria + localStorage en web). Despues
del merge, el frontend ya tiene:

- Endpoint `GET /api/materials` que acepta filtros directos en `req.query` y
  los aplica como `where` en Prisma. Pasando `userId=X` filtra por autor.
- `services/materialService.ts` con `fetchMaterials(filters)` que llama al
  endpoint y mapea la respuesta a `StudyMaterial`.
- `hooks/useMaterial.ts` con `useGetMaterials(filters)` (react-query: cache,
  loading, refetch e invalidacion).
- `useCreateMaterial`, `useUpdateMaterial` y `useDeleteMaterial` ya invalidan
  `materialsListKey` en `onSuccess`, por lo que las listas se refrescan solas.

### Cambios

**`services/materialService.ts`** — se agrego `userId?: number` al tipo
`MaterialListFilters` y al builder de query string:

```ts
export type MaterialListFilters = {
  query?: string;
  tipo?: string;
  comision?: string;
  anioCursada?: string;
  userId?: number;   // <-- agregado
  limit?: number;
  cursor?: number;
};

// dentro de fetchMaterials:
if (filters.userId !== undefined) params.set('userId', String(filters.userId));
```

**`components/MyPublications.tsx`** — se reescribio para:

- Tomar `user.id` de `useAuth()`.
- Llamar `useGetMaterials({ userId })` en lugar de `getCreatedMaterials()`.
- Manejar tres estados nuevos: **cargando** (spinner), **error** (con boton
  "Reintentar" que dispara `refetch`) y **vacio** (mensaje + CTA "Subir
  material").
- La busqueda sigue siendo local por titulo sobre los datos ya cargados
  (respuesta instantanea sin refetch por tecla).
- Las stats (Publicaciones / Materias) se calculan sobre los datos del
  backend.

### Beneficios automaticos al usar `useGetMaterials`

1. Los materiales **persisten entre sesiones** (vienen de la DB).
2. La lista se **invalida sola** al crear/editar/borrar un material (lo hacen
   las otras mutaciones de `useMaterial.ts`).
3. La autenticacion va incluida: `apiFetch` agrega el header
   `Authorization: Bearer <token>` automaticamente.

### Verificacion

- `npx tsc --noEmit` sin errores.
- `npx eslint` sin errores nuevos.

---

## Resultado final

- Repositorio dividido en `frontend/`, `backend/` y `Documentacion/`.
- Flujo de auth completo en el frontend, conectado al backend de Prisma + JWT
  via `apiFetch` y `AuthContext` reales.
- Home publico; "Subir" intercepta con toast cuando no hay sesion; el perfil
  vive en un tab.
- Mi perfil compone: hero de main + datos + boton "Editar perfil" + "Cerrar
  sesion" + **seccion "Mis Publicaciones" conectada al backend** + boton
  "Eliminar cuenta".
- TypeScript y ESLint en verde en todos los pasos.

---

## Anexo — Como levantar el backend

Stack: **Express + Prisma + PostgreSQL**. El backend valida que existan
`DATABASE_URL` y `JWT_SECRET` al arrancar.

1. Tener Postgres corriendo (local o en la nube — Neon / Supabase).
2. Crear `UTNotasApp/backend/.env`:

   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/utnotas?schema=public"
   JWT_SECRET="cambiame-por-cualquier-cosa-larga-y-random"
   PORT=3000
   FRONTEND_URL="http://localhost:8081"
   ```

3. Instalar y sincronizar el schema:

   ```bash
   cd UTNotasApp/backend
   npm install
   npx prisma db push
   npx prisma generate
   npx tsx prisma/seed.ts   # opcional
   ```

4. Levantar el servidor:

   ```bash
   npm run dev
   ```

5. En el frontend, crear `UTNotasApp/frontend/.env` con
   `EXPO_PUBLIC_API_URL=http://localhost:3000` (en Android emulador usar
   `http://10.0.2.2:3000`) y reiniciar Metro con cache limpia
   (`npx expo start -c`).

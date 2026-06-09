# Chat con IA — Editar perfil de usuario

Fecha de generacion: 06/06/2026

Repositorio trabajado: `DAM26-G10/UTNotasApp`

Rama indicada: `feature/editar-perfil`

## Objetivo de la charla

Implementar la funcionalidad de edicion de perfil en la pantalla "Mi perfil" de
UTNotasApp, incluyendo la modificacion de nombre, apellido y usuario, con
confirmacion de contrasena. El email se muestra pero no se puede modificar.

## Pedido inicial

El usuario pidio revisar la estetica actual del proyecto e implementar la
edicion de perfil y la limitacion de acciones a publicaciones propias, en el
contexto de la Entrega 2.

Pedido resumido:

> quiero implementar la edicion de perfil y la limitacion de
> accion a publicaciones propias. Revisa la estetica actual del proyecto e
> implementa estas funcionalidades.

## Analisis realizado

Se inspeccionaron los archivos principales del proyecto:

- `src/app/(tabs)/profile.tsx` — pantalla de perfil existente
- `src/features/auth/AuthContext.tsx` — contexto de autenticacion
- `src/features/auth/screens/ProfileScreen.tsx` — componente de perfil
- `src/styles/Colors.ts` y estilos relacionados

Se verifico que `AuthContext` ya exponia los datos del usuario (`name`, `surname`,
`username`, `email`) pero no tenia metodo para actualizarlos.

## Implementacion realizada

### AuthContext — metodo `updateProfile`

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

### ProfileScreen — formulario de edicion

Se modifico la pantalla de perfil para incluir un formulario de edicion
expandible con los siguientes campos:

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
- Los errores de API se muestran debajo del formulario.

Archivos modificados:
- `UTNotasApp/frontend/src/app/(tabs)/profile.tsx`
- `UTNotasApp/frontend/src/features/auth/screens/ProfileScreen.tsx`

### Mejoras visuales al perfil

El usuario solicito cambios visuales en la pantalla de perfil:

- Se mejoro la presentacion de los datos del usuario (nombre completo, usuario, email).
- Se ajustaron los estilos del avatar, tarjeta de datos y botones de accion.
- Se mantuvieron los estilos del estado "no logueado" exactamente como estaban.

## Verificaciones realizadas

- TypeScript compilo sin errores luego de cada cambio.
- La navegacion post-login volvio al home (`/`) correctamente.
- El formulario de edicion carga los valores actuales del usuario.
- El campo de email aparece bloqueado visualmente.

## Resultado final

La feature de edicion de perfil quedo implementada, conectada al endpoint
`PATCH /api/users/:id` del backend. Solo el propio usuario puede editar su perfil
(validacion en el backend mediante JWT).

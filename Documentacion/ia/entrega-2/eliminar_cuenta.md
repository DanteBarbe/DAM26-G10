# Chat con IA — Eliminar cuenta de usuario

Fecha de generacion: 06/06/2026

Repositorio trabajado: `DAM26-G10/UTNotasApp`

Rama indicada: `feature/editar-perfil`

## Objetivo de la charla

Agregar la funcionalidad de eliminar la propia cuenta desde la pantalla de
perfil, con un modal de confirmacion que solicita la contrasena del usuario.

## Pedido inicial

> ahora quiero agregar la funcionalidad de eliminar perfil, debe ser un boton
> en la page de perfil, que borre al usuario logueado de la bd y que al
> apretar el boton muestre un modal de confirmacion

Pedidos adicionales durante la implementacion:

> me gustaria que el boton de eliminar cuenta este abajo, por encima de los
> botones de direccion pero abajo de toda la page

> el boton de cancelar del modal tiene mal los estilos

> le falta el boton de ver la password al modal

## Analisis realizado

Se verifico que el backend ya tenia el endpoint implementado:

- `DELETE /api/users/:id` en `user.routes.ts`
- `deleteUser(id, password, ctx)` en `user.service.ts`
  - El USER debe proveer la contrasena correcta (comparacion con bcrypt).
  - El ADMIN puede eliminar sin contrasena.
  - Se maneja el error Prisma `P2025` (registro no encontrado) como 404.

No fue necesario ningun cambio en el backend.

## Implementacion realizada

### AuthContext — metodo `deleteAccount`

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

### Modal de confirmacion en ProfileScreen

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

### Posicion del boton de eliminar

El boton "Eliminar cuenta" se posiciono en la parte inferior de la pantalla,
por encima de los tabs de navegacion y por debajo de todo el contenido, usando:

```typescript
const styles = {
  bottomAction: {
    marginTop: "auto" as const,
    paddingBottom: 16,
  }
};
```

El `as const` fue necesario para que TypeScript acepte `"auto"` como valor
literal de `marginTop` en lugar de inferirlo como `string`.

### Toggle de visibilidad de contrasena

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

### Estilos especificos del modal

Se crearon estilos dedicados para el modal (separados de los del formulario de
edicion) para evitar conflictos de estilos:

- `modalOverlay`, `modalCard`, `modalTitle`, `modalBody`
- `modalLabel`, `modalInputWrap`, `modalInputInner`
- `modalError`, `modalDeleteBtn`, `modalDeleteBtnText`
- `modalCancelBtn`, `modalCancelText`

Archivo modificado: `UTNotasApp/frontend/src/app/(tabs)/profile.tsx`

## Verificaciones realizadas

- El modal se abre al presionar "Eliminar cuenta".
- El campo de contrasena muestra/oculta el texto con el toggle.
- Si la contrasena esta vacia, muestra error sin llamar a la API.
- Si la contrasena es incorrecta, muestra el mensaje de error de la API.
- Al eliminar exitosamente: cierra el modal, muestra toast "Cuenta eliminada",
  navega al home y limpia el estado de autenticacion.
- El boton cancelar cierra el modal sin hacer nada.
- TypeScript compilo sin errores.

## Resultado final

La funcionalidad de eliminar cuenta quedo implementada con modal de
confirmacion, validacion de contrasena y toggle de visibilidad, conectada al
endpoint `DELETE /api/users/:id` del backend.

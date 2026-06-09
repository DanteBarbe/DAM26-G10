# Chat con IA — Bugs, correcciones y configuracion del backend

Fecha de generacion: 06/06/2026

Repositorio trabajado: `DAM26-G10/UTNotasApp`

Rama indicada: `feature/editar-perfil`

## Objetivo de la charla

Resolver una serie de errores y regresiones que aparecieron durante el
desarrollo de la feature de editar/eliminar perfil en la Entrega 2.

## Problemas resueltos

### 1. Error useAuth fuera de AuthProvider

**Sintoma:**
```
ERROR  [Error: useAuth debe usarse dentro de AuthProvider]
```

**Causa:** El `AuthProvider` no estaba envolviendo correctamente la navegacion
en `_layout.tsx`.

**Solucion:** Se verifico y corrigio el orden de los providers en
`UTNotasApp/frontend/src/app/_layout.tsx` para asegurar que `AuthProvider`
envuelva al `Stack` de navegacion.

---

### 2. Error al registrarse — ReferenceError email

**Sintoma:**
```
ERROR  [ReferenceError: Property 'email' doesn't exist]
```

**Causa:** La pantalla de registro hacia referencia a una propiedad del
formulario que habia sido renombrada o eliminada durante los cambios.

**Solucion:** Se restauro la referencia correcta al campo `email` en el form de
registro (`SignupScreen.tsx`).

---

### 3. careerId obligatorio en el schema de Prisma

**Problema:** El schema de Prisma definia `careerId` en `User` como campo
obligatorio (NOT NULL). Como el ABM de carreras corresponde a la Entrega 3,
el front no podia enviar ese ID al registrar usuarios.

**Solucion:** Se hizo el campo `careerId` opcional en el schema de Prisma
(`Int?`) y se ejecuto la migracion correspondiente para que el registro
funcione sin requerir carrera.

Archivo modificado: `UTNotasApp/backend/prisma/schema.prisma`

---

### 4. Redireccion post-login al home

**Sintoma:** Al loguearse, la app redireccionaba a la pagina de perfil en
lugar del home.

**Causa:** `navigateAfterAuth` usaba una ruta incorrecta.

**Solucion:** Se corrigio para usar `router.replace("/")`:

```typescript
export function navigateAfterAuth() {
  router.replace("/");
}
```

Archivo modificado:
`UTNotasApp/frontend/src/features/auth/utils/navigateAfterAuth.ts`

---

### 5. Error KeyboardAvoidingView

**Sintoma:**
```
ERROR  [ReferenceError: Property 'KeyboardAvoidingView' doesn't exist]
```

**Causa:** `KeyboardAvoidingView` no estaba importado en el archivo donde se
usaba en el formulario de edicion de perfil.

**Solucion:** Se agrego el import correspondiente desde `react-native`.

---

### 6. Error `signOut` no existe en AuthContextValue

**Sintoma:**
```
Property 'signOut' does not exist on type 'AuthContextValue'.ts(2339)
```

**Causa:** Una referencia residual usaba `signOut` en lugar del metodo
correcto `logout` expuesto por `AuthContext`.

**Solucion:** Se corrigio la referencia a `logout` en `ProfileScreen.tsx`.

## Resultado final

Todos los bugs y regresiones quedaron resueltos. El flujo de registro, login,
edicion de perfil y navegacion funciona correctamente con el backend levantado.

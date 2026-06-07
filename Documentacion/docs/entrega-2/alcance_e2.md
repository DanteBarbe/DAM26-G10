# Documento de Alcance — Entrega 2

**Proyecto:** UTNotasApp  
**Grupo:** 10 · DAM 2026  
**Integrantes:** Andrada Santiago · Barbé Dante · Diez Nicolás · Soler Tomás  
**Fecha de entrega:** 9 de junio de 2026

---

## 1. Descripción del proyecto

UTNotasApp es una aplicación móvil para que estudiantes universitarios compartan y consulten materiales de estudio (parciales, finales, apuntes, resúmenes). Los usuarios pueden subir materiales, buscarlos con filtros por carrera/materia/tipo, y gestionar su cuenta.

---

## 2. Changelog respecto a Entrega 1

### 2.1 Nuevos Requisitos Funcionales

| ID | Requisito | Descripción |
|----|-----------|-------------|
| RF-E2-01 | Editar perfil | El usuario autenticado puede modificar su nombre, apellido y nombre de usuario desde la pantalla de perfil |
| RF-E2-02 | Email no editable | El campo email está bloqueado en el formulario de edición; solo se puede cambiar a futuro por flujo de verificación |
| RF-E2-03 | Confirmación de contraseña para cambios | Al guardar cambios en el perfil se requiere ingresar la contraseña actual |
| RF-E2-04 | Eliminar cuenta | El usuario puede eliminar su propia cuenta mediante un modal de confirmación que exige su contraseña |
| RF-E2-05 | Toggle de visibilidad de contraseña | En el modal de eliminación de cuenta el usuario puede mostrar/ocultar la contraseña ingresada |
| RF-E2-06 | Ownership de materiales | Solo el autor de un material (o un administrador) puede editarlo o eliminarlo |
| RF-E2-07 | Botones condicionales en detalle de material | Los botones de editar y eliminar solo se muestran al autor del material |
| RF-E2-08 | Login con Google | El usuario puede autenticarse usando su cuenta de Google mediante OAuth 2.0 |

### 2.2 Requisitos Funcionales de E1 (vigentes)

| ID | Requisito |
|----|-----------|
| RF-01 | Registro de usuario con email, contraseña, nombre, apellido y carrera |
| RF-02 | Login con email y contraseña |
| RF-03 | Cierre de sesión |
| RF-04 | Subir material con título, descripción, tipo, materia, año, comisión y archivo |
| RF-05 | Buscar materiales por texto libre |
| RF-06 | Filtrar materiales por tipo, materia, carrera, año y comisión |
| RF-07 | Ver detalle de un material |
| RF-08 | Editar un material propio |
| RF-09 | Eliminar un material propio (con confirmación) |
| RF-10 | Ver perfil de usuario autenticado |

### 2.3 Requisitos No Funcionales actualizados

| ID | Requisito |
|----|-----------|
| RNF-01 | La app debe funcionar en Android e iOS mediante Expo Go |
| RNF-02 | Las contraseñas se almacenan con bcrypt (salt rounds: 10) |
| RNF-03 | Los tokens JWT tienen expiración de 7 días |
| RNF-04 | Las solicitudes al backend son validadas con esquemas Zod |
| RNF-05 | El backend responde con estructura JSON estándar (`{ data, error, meta }`) |
| RNF-06 | Las operaciones sobre recursos propios están protegidas por ABAC (ownership check) |
| RNF-07 | Los tokens se transmiten en cookies HttpOnly (clientes web) y como Bearer token (clientes nativos) |

---

## 3. Reglas de negocio (E2)

1. **Edición de perfil:** solo el propio usuario puede editar sus datos. Requiere contraseña actual válida.
2. **Eliminación de cuenta:** solo el propio usuario puede eliminarla. Requiere contraseña actual válida. Al eliminarse, la sesión se cierra y el usuario es redirigido al login.
3. **Ownership de materiales:** el backend verifica que el `userId` del material coincida con el `id` del token JWT. Si no coincide y el usuario no es ADMIN, se responde con 403 Forbidden.
4. **Email no editable:** el campo email no puede ser modificado por el usuario desde la app; su cambio requeriría un flujo de verificación separado (pendiente para E3 o futuro).
5. **Google OAuth:** si el email de la cuenta Google ya está registrado en el sistema, se hace login. Si no existe, se crea una cuenta nueva automáticamente.

---

## 4. Validaciones implementadas

| Campo | Regla |
|-------|-------|
| Nombre / Apellido / Usuario | Requerido, mínimo 2 caracteres |
| Contraseña (confirmación) | Requerida para editar perfil y eliminar cuenta |
| Contraseña nueva (si se cambia) | Mínimo 8 caracteres |
| Token Google | Validado contra la API de Google en el backend |
| Material: título | Requerido, máximo 100 caracteres |
| Material: tipo | Debe ser uno de los valores del enum `TipoMaterial` |

---

## 5. User Stories (E2)

**US-E2-01** — Como usuario autenticado, quiero editar mi nombre, apellido y username para mantener mi perfil actualizado.  
*Criterios:* El formulario muestra los valores actuales. El email está deshabilitado. Al confirmar con la contraseña correcta, los cambios se guardan y se muestra un toast de éxito.

**US-E2-02** — Como usuario autenticado, quiero poder eliminar mi cuenta de forma permanente para dejar de usar la plataforma.  
*Criterios:* Aparece un modal de confirmación. Se requiere ingresar la contraseña. Al confirmar, la cuenta se elimina, la sesión se cierra y el usuario es redirigido al login.

**US-E2-03** — Como autor de un material, quiero que solo yo (o un administrador) pueda editarlo o eliminarlo.  
*Criterios:* Los botones de editar y eliminar solo son visibles para el autor. El backend rechaza con 403 si otro usuario intenta modificar el material.

**US-E2-04** — Como usuario nuevo, quiero poder registrarme e iniciar sesión con mi cuenta de Google para no tener que recordar otra contraseña.  
*Criterios:* Al tocar "Continuar con Google" se inicia el flujo OAuth. Si el email ya existe, se hace login. Si no existe, se crea la cuenta automáticamente.

---

## 6. Deuda técnica identificada (para E3)

- Sistema de votación (upvote/downvote): el modelo `Calificacion` y el modelo `Punto` existen en la base de datos pero no tienen endpoints ni UI.
- Favoritos: el modelo `Favorito` existe en la base de datos pero no está expuesto.
- Reportes de materiales: el modelo `Reporte` existe pero no tiene endpoints.
- Foto de perfil: el campo `profilePicture` existe en el modelo `User` pero no hay lógica de carga.
- reCAPTCHA/hCaptcha: el middleware existe como stub (`recaptcha.middleware.ts`) con `CAPTCHA_ENABLED=false`.
- Verificación de email al registrarse.
- Recuperación de contraseña.
- Moderación de contenido para usuarios con rol ADMIN.

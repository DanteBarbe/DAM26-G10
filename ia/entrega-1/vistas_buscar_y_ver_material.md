Para este trabajo integrador vamos a desarrollar la aplicacion movil de una aplicacion web que ya tenemos desarrollada llamada UTNotas. Necesito hacer la vista de Ver Material y la vista de los resultados de busqueda de materiales. Estamos en la primera entrega de este trabajo integrador. Te adjunto la guia del trabajo, el link a nuestra aplicación web ya desarrollada para que tomes las referencias, además de lo ya desarrollado hasta ahora en este proyecto https://utn-ds-25-grupo-2.vercel.app/.



Listo. Dejé las vistas mockeadas y sin backend, ni votos, guardado, compartir ni reportar.

Separé y componenticé:
- [search.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/app/search.tsx): vista de resultados.
- [[id].tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/app/material/[id].tsx): vista Ver Material.
- Componentes reutilizables en [src/components/materials](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/components/materials).
- Mocks en [mockMaterials.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/data/mockMaterials.ts).

Sobre los `.css`: como esto es Expo/React Native, usar `.css` real rompería mobile. Lo dejé separado en archivos de estilos con `StyleSheet`, que es el equivalente correcto para esta app: `materialStyles.ts`, `searchStyles.ts` y `materialDetailStyles.ts`.

Verificación:
- `npx.cmd tsc --noEmit` pasó.
- `npm.cmd run lint` pasó.



Me lanzó este error: Failed to set an indexed property [0] on 'CSSStyleDeclaration': Indexed property setter is not supported.
Además me gustaría que todas las vistas y componentes del proyecto tuvieran un stylesheet separado en una carpeta de estilos para no ensuciar el codigo de cada uno



Listo. Te dejo el mapa de lo que quedó:

**Vistas**
- [index.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/app/index.tsx)  
  Vista para subir material. Usa estado local para el formulario, valida campos, permite adjuntar archivos y guarda el material mockeado con `saveCreatedMaterial`. También agregué accesos a búsqueda y a un material mock usando `router.push`, evitando `Link asChild`, que probablemente disparaba el error de `CSSStyleDeclaration`.

- [search.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/app/search.tsx)  
  Vista de resultados de búsqueda. Toma materiales mockeados y materiales creados localmente, normaliza texto, filtra por búsqueda y tipo de material. No usa backend.

- [[id].tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/app/material/[id].tsx)  
  Vista “Ver Material”. Lee el `id` de la ruta, busca el material en mocks/local storage y muestra título, autor, materia, carrera, comisión, año, badges y preview mockeada del archivo.

**Componentes**
- [MaterialScreenHeader.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/components/materials/MaterialScreenHeader.tsx)  
  Header reutilizable con botón volver, marca UTNotas, título y acción derecha opcional. Navega con `router`.

- [MaterialResultCard.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/components/materials/MaterialResultCard.tsx)  
  Card reutilizable para resultados. Muestra título, usuario, fecha, descripción, badges, archivo y botón “Ver material”.

- [FilterChip.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/components/materials/FilterChip.tsx)  
  Chip de filtro reutilizable para tipos de material.

- [EmptyMaterialsState.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/components/materials/EmptyMaterialsState.tsx)  
  Estado vacío cuando no hay resultados.

- [MaterialInfoItem.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/components/materials/MaterialInfoItem.tsx)  
  Fila reutilizable de metadata con ícono, label y valor.

- [MaterialPreviewCard.tsx](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/components/materials/MaterialPreviewCard.tsx)  
  Preview mockeada del PDF/archivo. Muestra nombre, tamaño y botón para abrir el archivo si tiene URI.

**Datos y tipos**
- [mockMaterials.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/data/mockMaterials.ts)  
  Datos mock para la primera entrega. También convierte materiales creados desde la app al formato común `StudyMaterial`.

- [materials.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/types/materials.ts)  
  Agrega tipos para `StudyMaterial`, autor, archivos y materiales creados.

- [createdMaterialsStore.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/utils/createdMaterialsStore.ts)  
  Persiste materiales creados en memoria/localStorage para poder verlos en búsqueda sin backend.

**Estilos**
- [materialCreateStyles.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/styles/materialCreateStyles.ts)  
  Estilos de la vista de subida.

- [materialStyles.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/styles/materials/materialStyles.ts)  
  Colores y estilos compartidos entre vistas de materiales.

- [searchStyles.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/styles/materials/searchStyles.ts)  
  Estilos de búsqueda, filtros, cards y estado vacío.

- [materialDetailStyles.ts](c:/Users/dante/Documents/DAM26-G10/UTNotasApp/src/styles/materials/materialDetailStyles.ts)  
  Estilos de detalle, metadata y preview.

Verificación: `npx.cmd tsc --noEmit` y `npm.cmd run lint` pasan sin errores.
# UTNotasApp

Aplicación móvil de UTNotas para la UTN Facultad Regional La Plata. Permite a los estudiantes buscar, consultar y publicar material de estudio (apuntes, parciales, resúmenes, prácticas) organizados por carrera y materia.

**Trabajo Integrador — Desarrollo de Aplicaciones Móviles 2026**
Grupo 10 — Andrada Santiago · Barbé Dante · Diez Nicolás · Soler Tomás

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Para Android: Android Studio con un emulador configurado, o un dispositivo físico con Expo Go
- Para iOS: Xcode (solo en macOS), o un dispositivo físico con Expo Go

---

## Instalación

```bash
cd UTNotasApp/frontend/
npm install
```

---

## Correr el proyecto

```bash
npx expo start
```

En la terminal aparecerán las siguientes opciones:

| Tecla | Acción |
|-------|--------|
| `a`   | Abrir en emulador Android |
| `i`   | Abrir en simulador iOS (macOS) |
| `w`   | Abrir en navegador (web) |

También podés escanear el QR con la app **Expo Go** en tu celular.

---

## Estructura del proyecto

```
UTNotasApp/
├── src/
│   ├── app/                    # Pantallas (file-based routing de Expo Router)
│   │   ├── index.tsx           # Pantalla de carga de material
│   │   ├── search.tsx          # Pantalla de búsqueda
│   │   └── material/[id].tsx   # Detalle de material
│   ├── components/             # Componentes globales reutilizables
│   ├── features/
│   │   └── materials/          # Feature de materiales (components, data, types, utils)
│   ├── styles/                 # Tokens de diseño (colores, tipografía, espaciado)
│   └── utils/                  # Utilidades generales (format.ts)
```

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|------------|---------|-----|
| React Native | 0.73+ | Framework móvil |
| Expo / Expo Router | SDK 51+ | Plataforma y navegación |
| TypeScript | 5.x | Tipado estático |


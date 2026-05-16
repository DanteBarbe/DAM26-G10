# UTNotasApp — DAM 2026 · Grupo 10

Andrada Santiago · Barbé Dante · Diez Nicolás · Soler Tomás

Aplicación móvil para centralizar el material de estudio de la UTN-FRLP.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/client) en el celular, o un emulador Android/iOS configurado

## Instalación

```bash
cd UTNotasApp
npm install
```

## Correr el proyecto

```bash
npm start
```

Esto levanta el servidor de desarrollo. Luego:

- **Celular físico:** escaneá el QR con la app Expo Go
- **Emulador Android:** presioná `a` en la terminal
- **Simulador iOS (macOS):** presioná `i` en la terminal

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run android` | Abre directamente en emulador Android |
| `npm run ios` | Abre directamente en simulador iOS |
| `npm run lint` | Ejecuta el linter |

## Estructura del proyecto

```
UTNotasApp/
  src/
    app/              # Pantallas (expo-router, file-based routing)
      (tabs)/         # Navegador de pestañas (Consultar / Cargar)
    components/       # Componentes reutilizables globales
    features/
      materials/      # Feature de materiales (componentes, pantallas, utils)
    styles/           # Estilos y tokens globales
    utils/            # Utilidades generales
```

## Variables de entorno

Crear un archivo `.env` en la raíz de `UTNotasApp/` con las variables necesarias (ver `.env.example` si existe). No commitear credenciales.

## Rama de entrega

La entrega 1 se encuentra en la rama `entrega-1`.

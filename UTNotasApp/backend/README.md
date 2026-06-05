# UTNotasApp - Backend

Backend de UTNotasApp desarrollado con **Express**.

> Este directorio contiene únicamente la estructura base. La implementación se realizará posteriormente.

## Estructura

```
backend/
├── src/
│   ├── config/        # Configuración (DB, variables de entorno, etc.)
│   ├── controllers/   # Controladores: reciben la request y devuelven la response
│   ├── middlewares/   # Middlewares de Express (auth, validación, errores, etc.)
│   ├── models/        # Modelos / acceso a datos
│   ├── routes/        # Definición de rutas de la API
│   ├── services/      # Lógica de negocio
│   └── utils/         # Utilidades y helpers
├── .gitignore
├── package.json
└── README.md
```

## Puesta en marcha (pendiente)

```bash
cd UTNotasApp/backend
npm install express
npm run dev
```

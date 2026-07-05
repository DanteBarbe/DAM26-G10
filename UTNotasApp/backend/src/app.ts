/**
 * configuración central de la aplicación express.
 *
 * responsabilidades:
 * - registra middlewares globales (cors, json, cookies, logger).
 * - monta las rutas bajo el prefijo /api.
 * - registra el middleware de error global al final del pipeline.
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logRequest } from './middlewares/logger.middleware';
import { handleError } from './middlewares/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { materialRoutes } from './routes/material.routes';
import { carreraRoutes } from './routes/carrera.routes';
import { materiaRoutes } from './routes/materia.routes';
import { favoritoRoutes } from './routes/favorito.routes';

const app = express();

// Lista de orígenes permitidos (tu esquema de la app y local si pruebas en web)
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:8081'];

app.use(cors({
  origin: (origin, callback) => {
    // 1. !origin permite las peticiones del APK (ya que llega como undefined)
    // 2. allowedOrigins.includes(origin) permite tus entornos de desarrollo web
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por políticas de CORS'));
    }
  },
  credentials: true // Necesario si manejas cookies o sesiones
}));


app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/carreras', carreraRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/favoritos', favoritoRoutes);

// El error middleware debe ser el último — Express lo distingue por tener 4 parámetros
app.use(handleError);

export default app;
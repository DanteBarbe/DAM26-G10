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

const app = express();

app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:8081',
	credentials: true, // necesario para que las cookies httpOnly viajen en requests cross-origin
}));

app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// El error middleware debe ser el último — Express lo distingue por tener 4 parámetros
app.use(handleError);

export default app;
/**
 * punto de entrada del servidor.
 *
 * responsabilidades:
 * - valida que las variables de entorno críticas estén presentes antes de arrancar.
 * - inicia el servidor http en el puerto configurado.
 */

import 'dotenv/config';
import app from './app';

const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'] as const;

for (const key of REQUIRED_ENV) {
	if (!process.env[key]) {
		console.error(`[server] Variable de entorno requerida no encontrada: ${key}`);
		process.exit(1);
	}
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`[server] UTNotasApp backend corriendo en http://localhost:${PORT}`);
});
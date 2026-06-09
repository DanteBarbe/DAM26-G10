/**
 * verificación de credenciales de google oauth.
 *
 * responsabilidades:
 * - verifica el ID token de google y devuelve el perfil del usuario.
 * - falla con AppError descriptivo si GOOGLE_CLIENT_ID no está configurado.
 * - no persiste ni crea usuarios — solo valida la identidad.
 */

import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../errors/AppError';

export async function verifyGoogleCredential(credential: string): Promise<{ email?: string; name?: string }> {
	const clientId = process.env.GOOGLE_CLIENT_ID;

	if (!clientId) {
		// Google login no está habilitado en esta instancia — configurar GOOGLE_CLIENT_ID en .env
		throw new AppError('El login con Google no está configurado en este servidor.', 503);
	}

	const client = new OAuth2Client(clientId);

	try {
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: clientId,
		});

		const payload = ticket.getPayload();

		if (!payload?.email) {
			throw new AppError('El token de Google no contiene un email válido.', 400);
		}

		return { email: payload.email, name: payload.name };
	} catch (e: any) {
		if (e instanceof AppError) throw e;
		throw new AppError('El token de Google no es válido o expiró.', 401);
	}
}
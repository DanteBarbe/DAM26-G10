/**
 * middleware de validación de captcha.
 *
 * responsabilidades:
 * - en E2: actúa como pass-through controlado por CAPTCHA_ENABLED.
 * - en E3: reemplazar el bloque interno por la verificación real de hCaptcha
 *   sin modificar rutas ni controllers.
 * - la variable CAPTCHA_ENABLED=false en .env desactiva la validación.
 */

import { Request, Response, NextFunction } from 'express';

export async function validateRecaptcha(req: Request, res: Response, next: NextFunction) {
	// Pass-through mientras CAPTCHA_ENABLED no esté activo
	// En E3: agregar aquí la llamada a la API de hCaptcha/Turnstile
	if (process.env.CAPTCHA_ENABLED !== 'true') {
		return next();
	}

	const token = req.body.captchaToken;
	if (!token) {
		return res.status(400).json({
			success: false,
			error: 'El token de captcha es requerido',
		});
	}

	// TODO E3: verificar token contra hCaptcha API
	// const isValid = await verifyhCaptchaToken(token);
	// if (!isValid) return res.status(400).json({ ... });

	next();
}
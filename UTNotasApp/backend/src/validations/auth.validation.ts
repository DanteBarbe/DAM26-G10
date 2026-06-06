/**
 * schemas de validación zod para el dominio de autenticación.
 *
 * responsabilidades:
 * - valida estructura y tipos del body antes de llegar al controller.
 * - captchaToken es opcional en E2; el middleware validateRecaptcha
 *   controla si se exige o no según CAPTCHA_ENABLED.
 */

import { z } from 'zod';

export const loginSchema = z.object({
	body: z.object({
		email: z.string().email('El email no tiene un formato válido'),
		password: z.string().min(1, 'La contraseña es requerida'),
		// opcional aquí: la obligatoriedad la maneja validateRecaptcha
		captchaToken: z.string().optional(),
	}).strict(),
});

export const googleLoginSchema = z.object({
	body: z.object({
		credential: z.string().min(1, 'La credencial de Google es requerida'),
	}).strict(),
});
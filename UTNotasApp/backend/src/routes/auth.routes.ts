/**
 * rutas del dominio de autenticación.
 *
 * responsabilidades:
 * - registra los endpoints de auth con sus middlewares correspondientes.
 * - validateRecaptcha es un stub controlado por CAPTCHA_ENABLED;
 *   en E3 se reemplaza su implementación interna sin tocar este archivo.
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema, googleLoginSchema } from '../validations/auth.validation';
import { validateRecaptcha } from '../middlewares/recaptcha.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login',
	validateRecaptcha,
	validate(loginSchema),
	authController.login,
);

router.post('/google',
	validate(googleLoginSchema),
	authController.loginWithGoogle,
);

// Requiere token válido en cookie — devuelve el usuario autenticado completo
router.get('/me',
	authenticate,
	authController.me,
);

// Limpia la cookie del lado del servidor
router.post('/logout',
	authenticate,
	authController.logout,
);

export const authRoutes = router;
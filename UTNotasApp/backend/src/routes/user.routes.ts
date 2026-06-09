/**
 * rutas del dominio de usuario.
 *
 * responsabilidades:
 * - registra los endpoints de usuario con sus middlewares correspondientes.
 * - los GETs son públicos — no requieren token.
 * - el ABAC (ownership check) se resuelve en el service, no en la ruta.
 */

import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { registerUserSchema, updateUserSchema, idParamSchema } from '../validations/user.validation';

const router = Router();

// Público — cualquier usuario puede ver perfiles
router.get('/:id',
	validate(idParamSchema),
	userController.getUserById,
);

// Público — registro sin autenticación previa
router.post('/register',
	validate(registerUserSchema),
	userController.register,
);

// Requiere token — ABAC en service: USER solo edita el suyo, ADMIN edita cualquiera
router.patch('/:id',
	authenticate,
	validate(updateUserSchema),
	userController.updateUser,
);

// Requiere token — ABAC en service: USER elimina solo el suyo (con password), ADMIN elimina cualquiera
router.delete('/:id',
	authenticate,
	validate(idParamSchema),
	userController.deleteUser,
);

export const userRoutes = router;

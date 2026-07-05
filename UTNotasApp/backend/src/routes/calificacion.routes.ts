import { Router } from 'express';
import * as calificacionController from '../controllers/calificacion.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createCalificacionSchema, updateCalificacionSchema } from '../validations/calificacion.validation';

const router = Router({ mergeParams: true });

// Requiere token — busqueda de votos del material, filtrando ademas por userId opcional via query
router.get('/',
	authenticate,
	calificacionController.findCalificaciones,
);

// Requiere token — voto propio del usuario autenticado sobre el material
router.get('/me',
	authenticate,
	calificacionController.getCalificacionByMaterialAndUser,
);

// Requiere token — crea el voto del usuario autenticado sobre el material
router.post('/me',
	authenticate,
	validate(createCalificacionSchema),
	calificacionController.createCalificacion,
);

// Requiere token — actualiza el voto del usuario autenticado sobre el material
router.patch('/me',
	authenticate,
	validate(updateCalificacionSchema),
	calificacionController.updateCalificacion,
);

// Requiere token — elimina el voto del usuario autenticado sobre el material
router.delete('/me',
	authenticate,
	calificacionController.deleteCalificacion,
);

export const calificacionRoutes = router;

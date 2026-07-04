import { Router } from 'express';
import * as materiaController from '../controllers/materia.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createMateriaSchema, updateMateriaSchema } from '../validations/materia.validation';
import { idParamSchema } from '../validations/shared.validation';

const router = Router();

// Publico — listado paginado de materias
router.get('/', materiaController.getAllMaterias);

// Publico — detalle de una materia
router.get('/:id',
	validate(idParamSchema),
	materiaController.getMateriaById,
);

// Requiere token — solo ADMIN puede crear materias
router.post('/',
	authenticate,
	authorize('ADMIN'),
	validate(createMateriaSchema),
	materiaController.createMateria,
);

// Requiere token — solo ADMIN puede modificar materias
router.patch('/:id',
	authenticate,
	authorize('ADMIN'),
	validate(updateMateriaSchema),
	materiaController.updateMateria,
);

export const materiaRoutes = router;

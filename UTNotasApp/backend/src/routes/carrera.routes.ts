/**
 * rutas de la entidad carrera y su relacion con materia.
 *
 * responsabilidades:
 * - registra los endpoints de carrera y carrera_materia con sus middlewares correspondientes.
 * - los GETs son publicos — no requieren token.
 * - las mutaciones requieren rol ADMIN, validado en el service ademas del authorize de la ruta.
 */

import { Router } from 'express';
import * as carreraController from '../controllers/carrera.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createCarreraSchema, updateCarreraSchema, upsertCarreraMateriaSchema, carreraMateriaParamsSchema } from '../validations/carrera.validation';
import { idParamSchema } from '../validations/shared.validation';

const router = Router();

// Publico — catalogo completo de carreras
router.get('/', carreraController.getAllCarreras);

// Publico — carreras que dictan una materia dada
router.get('/materia/:materiaId', carreraController.findCarrerasByMateria);

// Publico — detalle de una carrera con sus materias asociadas
router.get('/:id',
	validate(idParamSchema),
	carreraController.getCarreraById,
);

// Publico — consulta puntual de una asociacion carrera-materia
router.get('/:id/materias/:materiaId',
	validate(carreraMateriaParamsSchema),
	carreraController.getCarreraMateria,
);

// Requiere token — solo ADMIN puede crear carreras
router.post('/',
	authenticate,
	authorize('ADMIN'),
	validate(createCarreraSchema),
	carreraController.createCarrera,
);

// Requiere token — solo ADMIN puede modificar carreras
router.patch('/:id',
	authenticate,
	authorize('ADMIN'),
	validate(updateCarreraSchema),
	carreraController.updateCarrera,
);

// Requiere token — solo ADMIN puede eliminar carreras
router.delete('/:id',
	authenticate,
	authorize('ADMIN'),
	validate(idParamSchema),
	carreraController.deleteCarrera,
);

// Requiere token — solo ADMIN puede asignar una materia a la carrera
router.post('/:id/materias',
	authenticate,
	authorize('ADMIN'),
	validate(upsertCarreraMateriaSchema),
	carreraController.upsertCarreraMateria,
);

// Requiere token — solo ADMIN puede actualizar el anio de una materia ya asignada
router.patch('/:id/materias',
	authenticate,
	authorize('ADMIN'),
	validate(upsertCarreraMateriaSchema),
	carreraController.upsertCarreraMateria,
);

// Requiere token — solo ADMIN puede desasignar una materia de la carrera
router.delete('/:id/materias/:materiaId',
	authenticate,
	authorize('ADMIN'),
	validate(carreraMateriaParamsSchema),
	carreraController.deleteCarreraMateria,
);

export const carreraRoutes = router;

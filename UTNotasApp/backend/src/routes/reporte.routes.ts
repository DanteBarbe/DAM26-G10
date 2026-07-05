import { Router } from 'express';
import * as reporteController from '../controllers/reporte.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createReporteSchema } from '../validations/reporte.validation';
import { idParamSchema } from '../validations/shared.validation';

const router = Router();

// Requiere token — solo ADMIN lista/filtra todos los reportes del sistema
router.get('/',
	authenticate,
	authorize('ADMIN'),
	reporteController.findReportes,
);

// Requiere token — reporte propio del usuario autenticado sobre el material (con el material anidado)
router.get('/:materialId/me',
	authenticate,
	reporteController.getReporteByMaterialAndUser,
);

// Requiere token — crea el reporte del usuario autenticado sobre el material
router.post('/:materialId/me',
	authenticate,
	validate(createReporteSchema),
	reporteController.createReporte,
);

// Requiere token — solo ADMIN elimina un reporte por su id
router.delete('/:id',
	authenticate,
	authorize('ADMIN'),
	validate(idParamSchema),
	reporteController.deleteReporte,
);

export const reporteRoutes = router;

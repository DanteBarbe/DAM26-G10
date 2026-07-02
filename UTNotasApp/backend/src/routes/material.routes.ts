import { Router } from 'express';
import * as materialController from '../controllers/material.controller';
import { validate } from '../middlewares/validation.middleware';
import { createMaterialSchema, updateMaterialSchema } from '../validations/material.validation';
import { idParamSchema } from '../validations/shared.validation';
import { authenticate, authorize } from '../middlewares/auth.middleware';

/**
 * rutas de la entidad material.
 *
 * responsabilidades:
 * - registra endpoints públicos y protegidos de /api/materials.
 * - aplica autenticación y autorización por rol antes del controller.
 * - delega validación de body/params al middleware genérico validate.
 */

const router = Router();

// GETs públicos: no requieren token según el contrato de API (sección 11 de CONTEXT.md).
router.get('/', materialController.getMaterials);
router.get('/:id', validate(idParamSchema), materialController.getMaterialById);

router.post('/', authenticate, authorize('ADMIN', 'USER'), validate(createMaterialSchema), materialController.createMaterial);
router.patch('/:id', authenticate, authorize('ADMIN', 'USER'), validate(updateMaterialSchema), materialController.updateMaterial);
router.delete('/:id', authenticate, authorize('ADMIN', 'USER'), validate(idParamSchema), materialController.deleteMaterial);

// DELETE /:materialId/reportes eliminada — es funcionalidad de E3 (Reportes)

export const materialRoutes = router;

import { z } from 'zod';
import { TipoMaterial } from '@prisma/client';

/**
 * esquemas de validación zod para la entidad material.
 *
 * responsabilidades:
 * - valida body y params según el patrón body+params que consume el middleware validate.
 * - no contiene lógica de negocio, solo contratos de entrada.
 * - userId excluido del schema: se extrae del JWT en el controller, no del body.
 */

const materialBodyCore = {
	titulo: z.string().trim().min(1, 'El título es un campo requerido').max(200, 'El título no puede exceder los 200 caracteres'),
	tipo: z.nativeEnum(TipoMaterial),
	archivo: z.string().min(1, 'El archivo es un campo requerido'),
	descripcion: z.string().max(200, 'La descripción no puede exceder los 200 caracteres').nullable().optional(),
	comision: z.string().max(50, 'La comisión no puede exceder los 50 caracteres').nullable().optional(),
	añoCursada: z.number().int('El año de cursada debe ser un número entero').positive('El año de cursada debe ser un número positivo').max(new Date().getFullYear(), 'El año de cursada no puede ser posterior al año actual').nullable().optional(),
	numeroParcial: z.number().int('El número de parcial debe ser un número entero').positive('El número de parcial debe ser un número positivo').nullable().optional(),
	materiaId: z.number().int('El ID de la materia debe ser un número entero').positive('El ID de la materia debe ser un número positivo').nullable().optional(),
	carreraId: z.number().int('El ID de la carrera debe ser un número entero').positive('El ID de la carrera debe ser un número positivo').nullable().optional(),
};

export const createMaterialSchema = z.object({
	body: z.object(materialBodyCore).strict(),
});

export const updateMaterialSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
	body: z.object(materialBodyCore).partial().strict(),
});

export const idParamSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
});

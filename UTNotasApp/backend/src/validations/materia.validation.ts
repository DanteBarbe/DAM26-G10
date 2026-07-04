import { z } from 'zod';

/**
 * esquemas de validación zod para la entidad materia.
 *
 * responsabilidades:
 * - valida body y params según el patrón body+params que consume el middleware validate.
 * - no contiene lógica de negocio, solo contratos de entrada.
 */

const materiaBodyCore = {
	nombre: z.string().trim()
		.min(1, 'El nombre es un campo requerido')
		.max(75, 'El nombre no puede exceder los 75 caracteres'),

	descripcion: z.string().trim()
		.min(1, 'La descripción es un campo requerido')
		.max(300, 'La descripción no puede exceder los 300 caracteres'),
};

export const createMateriaSchema = z.object({
	body: z.object(materiaBodyCore).strict(),
});

export const updateMateriaSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
	body: z.object(materiaBodyCore).partial().strict(),
});

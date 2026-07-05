import { z } from 'zod';

const calificacionBodyCore = {
	materialId: z.number()
		.int('El ID del material debe ser un número entero')
		.positive('El ID del material debe ser un número positivo'),

	value: z.boolean(),
};

export const createCalificacionSchema = z.object({
	body: z.object(calificacionBodyCore).strict(),
});

// params.materialId: update/delete operan sobre el voto del usuario autenticado en ese material, no sobre el id de la calificación
export const updateCalificacionSchema = z.object({
	params: z.object({ materialId: z.coerce.number().int().positive() }),
	body: z.object({ value: calificacionBodyCore.value }).strict(),
});

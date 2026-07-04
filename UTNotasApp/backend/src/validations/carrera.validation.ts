/**
 * schemas de validación zod para el dominio de carrera y carrera_materia.
 *
 * responsabilidades:
 * - valida body y params según el patrón body+params que consume el middleware validate.
 * - no contiene lógica de negocio, solo contratos de entrada.
 */

import { z } from 'zod';

// materiaId + anio, usados tanto al crear la carrera con materias anidadas como en el endpoint dedicado de carrera_materia
const carreraMateriaCore = {
	materiaId: z.coerce.number().int('El ID de la materia debe ser un número entero').positive('El ID de la materia debe ser un número positivo'),
	anio: z.coerce.number().int('El año debe ser un número entero').min(1, 'El año debe ser al menos 1').max(7, 'El año no puede ser mayor a 7'),
};

const carreraBodyCore = {
	nombre: z.string().trim().min(1, 'El nombre es un campo requerido').max(100, 'El nombre no puede exceder los 100 caracteres'),
	icon: z.string().trim().min(1, 'El path del icon es un campo requerido').max(100, 'El path del icon no puede exceder los 100 caracteres'),
};

export const createCarreraSchema = z.object({
	body: z.object({
		nombre: carreraBodyCore.nombre,
		icon: carreraBodyCore.icon,
		materias: z.array(z.object(carreraMateriaCore).strict()).optional(),
	}).strict(),
});

export const updateCarreraSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
	body: z.object(carreraBodyCore).partial().strict(),
});

// POST/PATCH /api/carreras/:id/materias — carreraId fijo por :id en la url; solo inserta o actualiza el anio de esa materia dentro de esa carrera, no reasigna la materia a otra carrera
export const upsertCarreraMateriaSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
	body: z.object(carreraMateriaCore).strict(),
});

// GET y DELETE /api/carreras/:id/materias/:materiaId — consulta/eliminacion puntual de una materia de la carrera
export const carreraMateriaParamsSchema = z.object({
	params: z.object({
		id: z.coerce.number().int().positive(),
		materiaId: z.coerce.number().int().positive(),
	}),
});

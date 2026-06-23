/**
 * schemas de validación zod para el dominio de usuario.
 *
 * responsabilidades:
 * - valida estructura y tipos de body/params antes de llegar al controller.
 * - role nunca se acepta en ningún schema — no es modificable por el usuario.
 * - careerId es opcional en E2 (Int? en el schema de prisma).
 */

import { z } from 'zod';

const userCoreFields = {
	name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede exceder 50 caracteres'),
	surname: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres').max(50, 'El apellido no puede exceder 50 caracteres'),
	email: z.string().email('El email no tiene un formato válido').toLowerCase().trim(),
	// careerId es Int? en el schema de prisma — opcional hasta E3
	careerId: z.coerce.number().int().positive('El ID de carrera debe ser un número positivo').optional(),
	password: z.string().trim()
		.min(8, 'La contraseña debe tener al menos 8 caracteres')
		.regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
		.regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
	username: z.string().trim()
		.min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
		.max(50, 'El nombre de usuario no puede exceder 50 caracteres'),
	profilePicture: z.string().url('La URL de la foto de perfil no es válida').nullable().optional(),
};

export const registerUserSchema = z.object({
	body: z.object({
		name: userCoreFields.name,
		surname: userCoreFields.surname,
		email: userCoreFields.email,
		careerId: userCoreFields.careerId,
		password: userCoreFields.password,
		username: userCoreFields.username,
	}).strict(),
});

export const updateUserSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
	body: z.object({
		name: userCoreFields.name,
		surname: userCoreFields.surname,
		email: userCoreFields.email,
		careerId: userCoreFields.careerId,
		password: userCoreFields.password,
		username: userCoreFields.username,
		profilePicture: userCoreFields.profilePicture,
	}).partial().strict(),
});

export const idParamSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
});

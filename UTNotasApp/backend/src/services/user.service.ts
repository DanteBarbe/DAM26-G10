/**
 * lógica de negocio del dominio de usuario.
 *
 * responsabilidades:
 * - aplica ABAC (ownership check) antes de cualquier escritura.
 * - aplica whitelisting estricto de campos en updateUser para bloquear escalada de privilegios.
 * - delega el formateo de respuesta a formatUser — nunca devuelve password.
 * - lanza AppError para todos los errores operacionales.
 */

import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { CreateUserRequest, UpdateUserRequest, UserCore } from '../types/user.types';
import { UserContext } from '../types/userContext.types';
import { AppError } from '../errors/AppError';
import { formatUser } from '../utils/userFormatter';

export async function getUserById(id: number): Promise<UserCore> {
	// findUnique devuelve null si no existe — no hay P2025 en lecturas
	const user = await prisma.user.findUnique({ where: { id } });
	if (!user) throw new AppError('Usuario no encontrado.', 404);
	return formatUser(user);
}

export async function createUser(data: CreateUserRequest): Promise<UserCore> {
	// Password se hashea en RAM antes de ir a la BD — la BD nunca procesa texto plano
	const hashedPassword = await bcrypt.hash(data.password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				name: data.name,
				surname: data.surname,
				email: data.email,
				username: data.username,
				password: hashedPassword,
				// careerId ignorado hasta Entrega 3 (tabla carreras vacía)
				// role asignado por defecto en el schema de prisma (@default(USER))
			},
		});
		return formatUser(user);
	} catch (e: any) {
		if (e.code === 'P2002') {
			// Determinar cuál campo violó la constraint única
			const field = e.meta?.target?.includes('email') ? 'El email' : 'El nombre de usuario';
			throw new AppError(`${field} ya está registrado.`, 409);
		}
		throw e;
	}
}

export async function updateUser(id: number, data: UpdateUserRequest, ctx: UserContext): Promise<UserCore> {
	// Solo el propio usuario o un ADMIN puede modificar el perfil
	if (ctx.id !== id && ctx.role !== 'ADMIN') {
		throw new AppError('No tenés permiso para modificar este perfil.', 403);
	}

	// Whitelist estricta: role nunca se incluye aunque venga en el body
	const { name, surname, email, username, careerId, profilePicture, password } = data;
	const updateData: Record<string, unknown> = { name, surname, email, username, careerId, profilePicture };

	// Eliminar undefined para no pisar campos existentes con undefined
	Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

	if (password) {
		// Hashear en RAM antes de ir a BD solo si viene nueva contraseña
		updateData.password = await bcrypt.hash(password, 10);
	}

	try {
		const user = await prisma.user.update({ where: { id }, data: updateData });
		return formatUser(user);
	} catch (e: any) {
		if (e.code === 'P2025') throw new AppError('Usuario no encontrado.', 404);
		if (e.code === 'P2002') {
			const field = e.meta?.target?.includes('email') ? 'El email' : 'El nombre de usuario';
			throw new AppError(`${field} ya está registrado.`, 409);
		}
		throw e;
	}
}

export async function deleteUser(id: number, password: string | undefined, ctx: UserContext): Promise<void> {
	// ADMIN puede eliminar cualquier cuenta sin confirmación de contraseña
	if (ctx.role === 'ADMIN') {
		try {
			await prisma.user.delete({ where: { id } });
			return;
		} catch (e: any) {
			if (e.code === 'P2025') throw new AppError('Usuario no encontrado.', 404);
			throw e;
		}
	}

	// USER solo puede eliminar su propio perfil
	if (ctx.id !== id) throw new AppError('No tenés permiso para eliminar este perfil.', 403);

	// Confirmación de contraseña obligatoria para evitar eliminaciones accidentales
	if (!password) throw new AppError('La contraseña es requerida para eliminar la cuenta.', 400);

	// findUnique es unavoidable aquí — necesitamos el hash para comparar contraseña
	const user = await prisma.user.findUnique({ where: { id } });
	if (!user) throw new AppError('Usuario no encontrado.', 404);

	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) throw new AppError('La contraseña ingresada es incorrecta.', 401);

	// delete directo — P2025 solo si hubo una race condition entre el findUnique y acá
	try {
		await prisma.user.delete({ where: { id } });
	} catch (e: any) {
		if (e.code === 'P2025') throw new AppError('Usuario no encontrado.', 404);
		throw e;
	}
}

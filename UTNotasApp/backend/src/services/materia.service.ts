import prisma from '../config/prisma';
import { AppError } from '../errors/AppError';
import { MateriaCore, CreateMateriaRequest, UpdateMateriaRequest } from '../types/materia.types';
import { PaginatedResult } from '../types/pagination.types';
import { UserContext } from '../types/userContext.types';
import { getPrismaPaginationOptions, buildCursorPagination } from '../utils/pagination.util';

/**
 * lógica de negocio de la entidad materia.
 *
 * responsabilidades:
 * - ejecuta el acceso a datos vía Prisma y devuelve tipos puros (MateriaCore), nunca el modelo crudo.
 * - delega la paginación por cursor a las utilidades de pagination.util.
 * - lanza AppError para errores operacionales, nunca maneja objetos http.
 */

// materias paginadas por cursor
export async function getAllMaterias(take: number, cursor?: number): Promise<PaginatedResult<MateriaCore>> {
	const items = await prisma.materia.findMany({
		select: { id: true, nombre: true, descripcion: true },
		...getPrismaPaginationOptions(take, cursor),
	});

	const { paginatedItems, meta } = buildCursorPagination(items, take);
	return { data: paginatedItems, meta };
}

export async function getMateriaById(id: number): Promise<MateriaCore> {
	const materia = await prisma.materia.findUnique({
		where: { id },
		select: { id: true, nombre: true, descripcion: true },
	});

	if (!materia) throw new AppError('Materia no encontrada.', 404);
	return materia;
}

export async function createMateria(data: CreateMateriaRequest, ctx: UserContext): Promise<MateriaCore> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenes permiso para crear materias.', 403);

	const { nombre, descripcion } = data;

	try {
		return await prisma.materia.create({ data: { nombre, descripcion } });
	} catch (e: any) {
		if (e.code === 'P2002') throw new AppError(`Ya existe una materia con el nombre "${nombre}".`, 409);
		throw e;
	}
}

export async function updateMateria(id: number, data: UpdateMateriaRequest, ctx: UserContext): Promise<MateriaCore> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenes permiso para modificar materias.', 403);

	const { nombre, descripcion } = data; // solo se modifica lo q esta permitido, si viene algo mas lo ignora

	try {
		return await prisma.materia.update({
			where: { id },
			data: {
				...(nombre !== undefined && { nombre }),
				...(descripcion !== undefined && { descripcion }),
			},
		});
	} catch (e: any) {
		if (e.code === 'P2025') throw new AppError('Materia no encontrada.', 404);
		if (e.code === 'P2002') throw new AppError(`Ya existe una materia con el nombre "${nombre}".`, 409);
		throw e;
	}
}

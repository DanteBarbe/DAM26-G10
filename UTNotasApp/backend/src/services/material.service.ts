import { CreateMaterialRequest, MaterialWithUser, UpdateMaterialRequest } from '../types/material.types';
import { PaginatedResult } from '../types/pagination.types';
import { UserContext } from '../types/userContext.types';
import { AppError } from '../errors/AppError';
import { getPrismaPaginationOptions, buildCursorPagination } from '../utils/pagination.util';
import prisma from '../config/prisma';
import { Material, TipoMaterial, Prisma } from '@prisma/client';

/**
 * logica de negocio para la entidad material.
 *
 * responsabilidades:
 * - ejecuta operaciones CRUD sobre Material usando Prisma.
 * - aplica ownership check antes de modificar o eliminar.
 * - delega la paginacion por cursor a las utilidades de pagination.util.
 * - lanza AppError para todos los errores operacionales.
 */

const materialInclude = {
	user: { select: { username: true } },
	carrera: { select: { nombre: true } },
	materia: { select: { nombre: true } },
};

const mapToWithUser = (material: any): MaterialWithUser => {
	const { user, carrera, materia, ...rest } = material;
	return {
		...rest,
		username: user?.username ?? null,
		carreraNombre: carrera?.nombre ?? null,
		materiaNombre: materia?.nombre ?? null,
	} as MaterialWithUser;
};

export async function getMaterials(filters: Record<string, any>, take: number, cursor?: number): Promise<PaginatedResult<MaterialWithUser>> {
	const { query, limit: _l, cursor: _c, ...directFilters } = filters;

	// el frontend usa 'anioCursada' (sin tilde), el campo Prisma es 'añoCursada' (nombre real de columna, no se puede cambiar)
	const keyMap: Record<string, string> = { anioCursada: 'añoCursada' };

	const processedFilters: Record<string, any> = {};
	for (const key in directFilters) {
		const normalizedKey = keyMap[key] ?? key;
		const value = directFilters[key];
		if (value !== '' && value !== null && value !== undefined) {
			processedFilters[normalizedKey] = isNaN(Number(value)) ? value : Number(value);
		}
	}

	const directFilterArray = Object.keys(processedFilters).map(key => ({ [key]: processedFilters[key] }));

	// busqueda textual: cubre titulo, descripcion, comision y valores del enum TipoMaterial que coincidan parcialmente
	const textFilter = query
		? (() => {
			const q = String(query).toLowerCase();
			const or: any[] = [
				{ titulo: { contains: query, mode: Prisma.QueryMode.insensitive } },
				{ descripcion: { contains: query, mode: Prisma.QueryMode.insensitive } },
				{ comision: { contains: query, mode: Prisma.QueryMode.insensitive } },
			];
			const tipoMatches = Object.values(TipoMaterial).filter(v => String(v).toLowerCase().includes(q));
			if (tipoMatches.length > 0) or.push({ tipo: { in: tipoMatches } });
			return { OR: or } as any;
		})()
		: {};

	const combinedFilters = [...directFilterArray, textFilter].filter(f => Object.keys(f).length > 0);
	const where = combinedFilters.length > 0 ? { AND: combinedFilters } : {};

	const items = await prisma.material.findMany({
		where,
		include: materialInclude,
		...getPrismaPaginationOptions(take, cursor),
	});

	const { paginatedItems, meta } = buildCursorPagination(items, take);
	return { data: paginatedItems.map(mapToWithUser), meta };
}

export async function getMaterialById(id: number): Promise<MaterialWithUser> {
	const material = await prisma.material.findUnique({ where: { id }, include: materialInclude });
	if (!material) throw new AppError('Material no encontrado.', 404);
	return mapToWithUser(material);
}

export async function createMaterial(data: CreateMaterialRequest, ctx: UserContext): Promise<Material> {
	// userId inyectado desde ctx — el cliente no puede falsificar la autoria
	try {
		return await prisma.material.create({
			data: {
				titulo: data.titulo,
				tipo: data.tipo,
				archivo: data.archivo,
				descripcion: data.descripcion ?? null,
				comision: data.comision ?? null,
				añoCursada: data.añoCursada ?? null,
				numeroParcial: data.numeroParcial ?? null,
				materiaId: data.materiaId!,
				carreraId: data.carreraId ?? null,
				userId: ctx.id,
				cantidadReportes: 0,
			},
		});
	} catch (e: any) {
		// P2003: FK invalida — materiaId, carreraId o userId no referencian registros existentes
		if (e.code === 'P2003') throw new AppError('Una de las referencias (materia, carrera) no existe.', 409);
		throw e;
	}
}

export async function updateMaterial(id: number, data: UpdateMaterialRequest, ctx: UserContext): Promise<Material> {
	const existing = await prisma.material.findUnique({ where: { id }, select: { userId: true } });
	if (!existing) throw new AppError('Material no encontrado.', 404);

	if (existing.userId !== ctx.id && ctx.role !== 'ADMIN') {
		throw new AppError('No tenes permiso para modificar este material.', 403);
	}

	// whitelisting estricto: upvotes, downvotes y cantidadReportes son read-only en E2
	const { titulo, tipo, archivo, descripcion, comision, añoCursada, numeroParcial, materiaId, carreraId } = data;

	try {
		return await prisma.material.update({
			where: { id },
			data: {
				...(titulo !== undefined && { titulo }),
				...(tipo !== undefined && { tipo }),
				...(archivo !== undefined && { archivo }),
				...(descripcion !== undefined && { descripcion }),
				...(comision !== undefined && { comision }),
				...(añoCursada !== undefined && { añoCursada }),
				...(numeroParcial !== undefined && { numeroParcial }),
				...(typeof materiaId === "number" && { materiaId }),
				...(carreraId !== undefined && { carreraId }),
			},
		});
	} catch (e: any) {
		// P2025: race condition entre el findUnique y el update (eliminacion concurrente)
		if (e.code === 'P2025') throw new AppError('Material no encontrado.', 404);
		// P2003: FK invalida — materiaId o carreraId no referencian registros existentes
		if (e.code === 'P2003') throw new AppError('Una de las referencias (materia, carrera) no existe.', 409);
		throw e;
	}
}

export async function deleteMaterial(id: number, ctx: UserContext): Promise<void> {
	if (ctx.role === 'ADMIN') {
		try {
			await prisma.material.delete({ where: { id } });
			return;
		} catch (e: any) {
			if (e.code === 'P2025') throw new AppError('Material no encontrado.', 404);
			throw e;
		}
	}

	const result = await prisma.material.deleteMany({ where: { id, userId: ctx.id } });
	if (result.count === 0) {
		const exists = await prisma.material.findUnique({ where: { id }, select: { id: true } });
		if (!exists) throw new AppError('Material no encontrado.', 404);
		throw new AppError('No tenes permiso para eliminar este material.', 403);
	}
}

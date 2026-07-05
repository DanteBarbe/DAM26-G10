import prisma from '../config/prisma';
import { AppError } from '../errors/AppError';
import { ReporteCore, ReporteWithMaterial, ReporteFilters, CreateReporteRequest } from '../types/reporte.types';
import { MaterialWithUser } from '../types/material.types';
import { UserContext } from '../types/userContext.types';

/**
 * lógica de negocio de la entidad reporte (denuncia de un material por un usuario).
 *
 * responsabilidades:
 * - un usuario tiene a lo sumo un reporte por material (unique userId_materialId).
 * - crear un reporte ajusta en la MISMA transacción el contador cantidadReportes del material
 * - el listado y la eliminación solo son accesibles por ADMIN, verificado ademas del authorize de la ruta.
 * - lanza AppError para errores operacionales.
 */

// select explicito: expone solo los campos de ReporteCore
const reporteSelect = {
	id: true,
	userId: true,
	materialId: true,
	descripcion: true,
	motivo: true,
	createdAt: true,
};

// mismo set acotado que material.service: solo lo necesario para pintar la card del material denunciado (autor, carrera, materia)
const materialInclude = {
	user: { select: { username: true } },
	carrera: { select: { nombre: true } },
	materia: { select: { nombre: true } },
};

// aplana user/carrera/materia a MaterialWithUser — no expone los objetos crudos de prisma (evita filtrar password del user)
const mapMaterialToWithUser = (material: any): MaterialWithUser => {
	const { user, carrera, materia, ...rest } = material;
	return {
		...rest,
		username: user?.username ?? null,
		carreraNombre: carrera?.nombre ?? null,
		materiaNombre: materia?.nombre ?? null,
	} as MaterialWithUser;
};

// listado: sin filtros devuelve todos, con userId/materialId filtra por AND de los presentes (solo ADMIN)
export async function findReportes(filters: ReporteFilters, ctx: UserContext): Promise<ReporteCore[]> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenés permiso para consultar reportes.', 403);

	const { userId, materialId } = filters;

	return prisma.reporte.findMany({
		where: {
			...(userId !== undefined && { userId }),
			...(materialId !== undefined && { materialId }),
		},
		select: reporteSelect,
		orderBy: { createdAt: 'desc' },
	});
}

// reporte propio del usuario sobre un material, con el material anidado (no existe reporte sin material), devuelve null si aún no lo reportó
export async function getReporteByMaterialAndUser(materialId: number, userId: number): Promise<ReporteWithMaterial | null> {
	const reporte = await prisma.reporte.findUnique({
		where: { userId_materialId: { userId, materialId } },
		select: { ...reporteSelect, material: { include: materialInclude } },
	});

	if (!reporte) return null;

	const { material, ...rest } = reporte;
	return { ...rest, material: mapMaterialToWithUser(material) };
}

export async function createReporte(materialId: number, data: CreateReporteRequest, userId: number): Promise<ReporteCore> {
	// materialId sale del path y userId del token — whitelisting: el cliente no puede falsificar ni el material ni la autoria
	const { motivo, descripcion } = data;

	try {
		return await prisma.$transaction(async (tx) => {
			// crear el reporte y ajustar el contador del material en la misma transaccion: si algo falla, se revierte todo
			const reporte = await tx.reporte.create({
				data: { userId, materialId, motivo, descripcion: descripcion ?? null },
				select: reporteSelect,
			});

			await tx.material.update({
				where: { id: materialId },
				data: { cantidadReportes: { increment: 1 } },
			});

			return reporte;
		});
	} catch (e: any) {
		// P2002: el usuario ya reportó este material (unique userId_materialId)
		if (e.code === 'P2002') throw new AppError('Ya reportaste este material.', 409);
		// P2003: el material indicado no existe
		if (e.code === 'P2003') throw new AppError(`El material con ID ${materialId} no existe.`, 404);
		throw e;
	}
}

// solo ADMIN elimina reportes. revierte el contador cantidadReportes en la misma transaccion
export async function deleteReporte(id: number, ctx: UserContext): Promise<void> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenés permiso para eliminar reportes.', 403);

	try {
		await prisma.$transaction(async (tx) => {
			const eliminado = await tx.reporte.delete({
				where: { id },
				select: { materialId: true },
			});

			await tx.material.update({
				where: { id: eliminado.materialId },
				data: { cantidadReportes: { decrement: 1 } },
			});
		});
	} catch (e: any) {
		if (e.code === 'P2025') throw new AppError('Reporte no encontrado.', 404);
		throw e;
	}
}

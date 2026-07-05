import prisma from '../config/prisma';
import { AppError } from '../errors/AppError';
import { CalificacionCore, CalificacionFilters, CalificacionListItem, CreateCalificacionRequest, UpdateCalificacionRequest } from '../types/calificacion.types';
import { procesarPuntosPorVoto, procesarActualizacionVoto, procesarEliminacionVoto } from './punto.service';

/**
 * lógica de negocio de la entidad calificacion (voto up/down sobre un material).
 *
 * responsabilidades:
 * - un usuario tiene a lo sumo un voto por material (unique userId_materialId).
 * - votar no requiere rol especial: cualquier usuario autenticado puede calificar cualquier material
 * - toda escritura de voto ajusta en la MISMA transacción los contadores del material
 *   y los puntos del autor, garantizando atomicidad.
 * - devuelve solo { value }: el cliente ya conoce materialId/userId por estar parado en la card del material.
 * - lanza AppError para errores operacionales.
 */

// voto de un usuario sobre un material puntual — devuelve null si el usuario aún no votó (no es un error)
export async function getCalificacionByMaterialAndUser(materialId: number, userId: number): Promise<CalificacionCore | null> {
	return prisma.calificacion.findUnique({
		where: { userId_materialId: { userId, materialId } },
		select: { value: true },
	});
}

// busca votos por usuario y/o material (AND de los filtros presentes) — ej: perfil de usuario mostrando lo que calificó
export async function findCalificaciones(filters: CalificacionFilters): Promise<CalificacionListItem[]> {
	const { userId, materialId } = filters;
	if (!userId && !materialId) return [];

	return prisma.calificacion.findMany({
		where: {
			...(userId !== undefined && { userId }),
			...(materialId !== undefined && { materialId }),
		},
		select: { materialId: true, value: true },
	});
}

export async function createCalificacion(data: CreateCalificacionRequest, userId: number): Promise<CalificacionCore> {
	const { materialId, value } = data;

	try {
		return await prisma.$transaction(async (tx) => {
			// se lee el material para conocer a su autor (destinatario de los puntos)
			const material = await tx.material.findUnique({ where: { id: materialId }, select: { userId: true } });
			if (!material) throw new AppError(`El material con ID ${materialId} no existe.`, 404);

			const calificacion = await tx.calificacion.create({
				data: { userId, materialId, value },
				select: { value: true },
			});

			// actualiza votes del material
			await tx.material.update({
				where: { id: materialId },
				data: value ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } },
			});

			// puntos al autor dentro de la misma transacción: si algo falla, se revierte todo
			await procesarPuntosPorVoto(tx, material.userId, value);

			return calificacion;
		});
	} catch (e: any) {
		// P2002: el usuario ya calificó este material (unique userId_materialId)
		if (e.code === 'P2002') throw new AppError('Ya calificaste este material.', 409);
		throw e;
	}
}

export async function updateCalificacion(materialId: number, data: UpdateCalificacionRequest, userId: number): Promise<CalificacionCore> {
	const { value } = data;
	if (value === undefined) throw new AppError('Debe indicar el nuevo valor de la calificación.', 400);

	return prisma.$transaction(async (tx) => {
		// el where ya filtra por userId: solo puede editar el voto que el propio usuario emitio, nunca el de otro
		const existing = await tx.calificacion.findUnique({
			where: { userId_materialId: { userId, materialId } },
			select: { value: true, material: { select: { userId: true } } },
		});
		if (!existing) throw new AppError('No calificaste este material.', 404);

		const updated = await tx.calificacion.update({
			where: { userId_materialId: { userId, materialId } },
			data: { value },
			select: { value: true },
		});

		// solo se ajustan contadores y puntos si el voto efectivamente cambió de signo
		if (existing.value !== value) {
			await tx.material.update({
				where: { id: materialId },
				data: value
					? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
					: { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
			});

			await procesarActualizacionVoto(tx, existing.material.userId, value);
		}

		return updated;
	});
}

export async function deleteCalificacion(materialId: number, userId: number): Promise<void> {
	await prisma.$transaction(async (tx) => {
		const existing = await tx.calificacion.findUnique({
			where: { userId_materialId: { userId, materialId } },
			select: { value: true, material: { select: { userId: true } } },
		});
		if (!existing) throw new AppError('No calificaste este material.', 404);

		await tx.calificacion.delete({ where: { userId_materialId: { userId, materialId } } });

		// revierte el contador que el voto había incrementado
		await tx.material.update({
			where: { id: materialId },
			data: existing.value ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } },
		});

		await procesarEliminacionVoto(tx, existing.material.userId, existing.value);
	});
}

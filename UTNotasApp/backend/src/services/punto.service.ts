import prisma from '../config/prisma';
import { Prisma, MotivoPunto } from '@prisma/client';

/**
 * lógica de negocio del sistema de puntos (reputación de usuarios).
 *
 * responsabilidades:
 * - centraliza el otorgamiento/descuento de puntos y su registro en el historial (Punto).
 * - cada función recibe un cliente de transacción (tx) para ejecutarse atómicamente junto a la operación que la dispara (voto, subida de material).
 * - no maneja objetos http; es invocada desde otros services.
 */

// db acepta el cliente de transacción o el prisma global — permite usar estas funciones
// dentro de un $transaction (caso voto) o de forma independiente.
type PrismaClientLike = Prisma.TransactionClient | typeof prisma;

export async function otorgarPuntosPorMaterial(db: PrismaClientLike, userId: number, materialData: any): Promise<void> {
	let totalPoints = 20;

	if (materialData.añoCursada) totalPoints += 5;
	if (materialData.comision) totalPoints += 5;
	if (materialData.descripcion) totalPoints += 5;
	if (materialData.numeroParcial) totalPoints += 5;

	await db.user.update({
		where: { id: userId },
		data: { points: { increment: totalPoints } },
	});

	await db.punto.create({
		data: { userId, valor: totalPoints, motivo: MotivoPunto.SUBIDA_MATERIAL },
	});
}

// voto nuevo sobre un material: +1 al autor si es upvote, -1 si es downvote
export async function procesarPuntosPorVoto(db: PrismaClientLike, authorId: number, isUpvote: boolean): Promise<void> {
	const pointsToAdd = isUpvote ? 1 : -1;
	const motivo = isUpvote ? MotivoPunto.UPVOTE : MotivoPunto.DOWNVOTE;

	await db.user.update({
		where: { id: authorId },
		data: { points: { increment: pointsToAdd } },
	});

	await db.punto.create({
		data: { userId: authorId, valor: pointsToAdd, motivo },
	});
}

// cambio de signo de un voto existente: +2 si pasó a upvote, -2 si pasó a downvote (revierte el anterior y aplica el nuevo)
export async function procesarActualizacionVoto(db: PrismaClientLike, authorId: number, isNewUpvote: boolean): Promise<void> {
	const pointsToAdd = isNewUpvote ? 2 : -2;

	await db.user.update({
		where: { id: authorId },
		data: { points: { increment: pointsToAdd } },
	});

	await db.punto.create({
		data: { userId: authorId, valor: pointsToAdd, motivo: MotivoPunto.VOTO_ACTUALIZADO },
	});
}

// baja de un voto: revierte el efecto original (-1 si era upvote, +1 si era downvote)
export async function procesarEliminacionVoto(db: PrismaClientLike, authorId: number, wasUpvote: boolean): Promise<void> {
	const pointsToAdd = wasUpvote ? -1 : 1;

	await db.user.update({
		where: { id: authorId },
		data: { points: { increment: pointsToAdd } },
	});

	await db.punto.create({
		data: { userId: authorId, valor: pointsToAdd, motivo: MotivoPunto.VOTO_ELIMINADO },
	});
}

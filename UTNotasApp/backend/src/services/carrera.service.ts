import prisma from '../config/prisma';
import { AppError } from '../errors/AppError';
import { CarreraMateria } from '@prisma/client';
import { CarreraCore, CreateCarreraRequest, UpdateCarreraRequest, UpsertCarreraMateriaRequest, CarreraMateriaParams } from '../types/carrera.types';
import { UserContext } from '../types/userContext.types';

// centraliza validacion de nombres duplicados para evitar dos carreras con el mismo nombre.
// idAExcluir se usa en el update para no chocar la carrera contra si misma.
async function validarNombreDuplicado(nombre: string, idAExcluir?: number): Promise<void> {
	const existing = await prisma.carrera.findFirst({
		where: {
			nombre: { equals: nombre, mode: 'insensitive' },
			id: idAExcluir ? { not: idAExcluir } : undefined,
		},
	});

	if (existing) throw new AppError(`Ya existe una carrera con el nombre "${nombre}".`, 409);
}

// lista completa de carreras
export async function getAllCarreras(): Promise<CarreraCore[]> {
	return prisma.carrera.findMany({
		select: { id: true, nombre: true, icon: true },
	});
}

// carreras que dictan una materia dada, via tabla intermedia carrera_materia.
export async function findCarrerasByMateria(materiaId: number): Promise<CarreraCore[]> {
	return prisma.carrera.findMany({
		where: { materias: { some: { materiaId } } },
		select: { id: true, nombre: true, icon: true },
	});
}

//get carrera junto con sus materias asociadas
export async function getCarreraById(id: number): Promise<CarreraCore> {
	const carrera = await prisma.carrera.findUnique({
		where: { id },
		include: {
			materias: {
				select: {
					anio: true,
					materia: { select: { id: true, nombre: true, descripcion: true } },
				},
				orderBy: { anio: 'asc' },
			},
		},
	});

	if (!carrera) throw new AppError('Carrera no encontrada.', 404);
	return carrera;
}

export async function createCarrera(data: CreateCarreraRequest, ctx: UserContext): Promise<CarreraCore> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenes permiso para crear carreras.', 403);

	const { nombre, icon, materias } = data;
	await validarNombreDuplicado(nombre);

	// si el cliente manda la misma materia dos veces, queda una sola
	const materiasUnicas = materias ? [...new Map(materias.map(m => [m.materiaId, m])).values()] : [];

	try {
		return await prisma.$transaction(async (tx) => { // transaccion para crear la carrera junto con materias asociadas en caso de que vengan en payload
			const nuevaCarrera = await tx.carrera.create({ data: { nombre, icon } });

			if (materiasUnicas.length > 0) {
				await tx.carreraMateria.createMany({
					data: materiasUnicas.map(m => ({ carreraId: nuevaCarrera.id, materiaId: m.materiaId, anio: m.anio })),
				});
			}

			return nuevaCarrera;
		});
	} catch (e: any) {
		// P2003: alguna materiaId del array no existe en la tabla materias
		if (e.code === 'P2003') throw new AppError('Una de las materias indicadas no existe.', 409);
		throw e;
	}
}

// actualiza solo campos propios de carrera, la relacion con materias se maneja en upsertCarreraMateria
export async function updateCarrera(id: number, data: UpdateCarreraRequest, ctx: UserContext): Promise<CarreraCore> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenes permiso para modificar carreras.', 403);

	const { nombre, icon } = data; // solo se modifica lo q esta permitido, si viene algo mas lo ignora

	if (nombre !== undefined) await validarNombreDuplicado(nombre, id); // si viene un nombre nuevo, valida que no colisione con otra carrera antes de tocar la bd

	try {
		return await prisma.carrera.update({
			where: { id },
			data: {
				...(nombre !== undefined && { nombre }),
				...(icon !== undefined && { icon }),
			},
		});
	} catch (e: any) {
		if (e.code === 'P2025') throw new AppError('Carrera no encontrada.', 404);
		throw e;
	}
}

export async function deleteCarrera(id: number, ctx: UserContext): Promise<void> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenes permiso para eliminar carreras.', 403);

	try { //  borra asociaciones de la tabla intermedia y luego la carrera, todo o nada
		await prisma.$transaction(async (tx) => {
			await tx.carreraMateria.deleteMany({ where: { carreraId: id } });
			await tx.carrera.delete({ where: { id } });
		});
	} catch (e: any) {
		if (e.code === 'P2025') throw new AppError('Carrera no encontrada.', 404);
		throw e;
	}
}

// consulta puntual de una asociacion carrera-materia (igual que getCarreraMateriabyIds de la web)
export async function getCarreraMateria({ carreraId, materiaId }: CarreraMateriaParams): Promise<CarreraMateria> {
	const carreraMateria = await prisma.carreraMateria.findUnique({
		where: { carreraId_materiaId: { carreraId, materiaId } },
	});

	if (!carreraMateria) throw new AppError('La materia no esta asociada a esta carrera.', 404);
	return carreraMateria;
}

// agrega una materia de la carrera o la modifica si la asociacion ya existia. Afecta una sola asociacion.
export async function upsertCarreraMateria(carreraId: number, data: UpsertCarreraMateriaRequest, ctx: UserContext): Promise<CarreraMateria> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenes permiso para asociar materias a una carrera.', 403);

	const { materiaId, anio } = data;

	try {
		// - where: busca la fila por su PK compuesta (carreraId, materiaId).
		// 		si NO la encuentra: ejecuta el bloque "create" (inserta la fila nueva con los 3 campos).
		//  	si SI la encuentra: ejecuta el bloque "update" (modifica el campo anio de la fila existente).
		// nunca corre los dos bloques, prisma elige uno segun si el where matcheo o no.
		return await prisma.carreraMateria.upsert({
			where: { carreraId_materiaId: { carreraId, materiaId } },
			create: { carreraId, materiaId, anio }, 
			update: { anio },
		});
	} catch (e: any) {
		// P2003: la carrera o la materia no existen
		if (e.code === 'P2003') throw new AppError('La carrera o la materia indicada no existe.', 409);
		throw e;
	}
}

// des-asigna materia de una carrera
export async function deleteCarreraMateria({ carreraId, materiaId }: CarreraMateriaParams, ctx: UserContext): Promise<void> {
	if (ctx.role !== 'ADMIN') throw new AppError('No tenes permiso para desasociar materias de una carrera.', 403);

	try {
		await prisma.carreraMateria.delete({
			where: { carreraId_materiaId: { carreraId, materiaId } },
		});
	} catch (e: any) {
		if (e.code === 'P2025') throw new AppError('La materia no esta asociada a esta carrera.', 404);
		throw e;
	}
}

import prisma from '../config/prisma';
import { AppError } from '../errors/AppError';
import { FavoritoCore, FavoritoFilters } from '../types/favorito.types';
import { MaterialWithUser } from '../types/material.types';
import { PaginatedResult } from '../types/pagination.types';
import { getPrismaPaginationOptions, buildCursorPagination } from '../utils/pagination.util';

/**
 * lógica de negocio de la entidad favorito (marcado de un material por un usuario).
 *
 * responsabilidades:
 * - un usuario tiene a lo sumo un favorito por material (unique userId_materialId).
 * - marcar/desmarcar no requiere rol especial: cualquier usuario autenticado puede favoritear cualquier material.
 * - devuelve solo { isFavorite }: el cliente ya conoce materialId/userId por estar parado en la card del material.
 * - lanza AppError para errores operacionales.
 */

// mismo include que la web: solo lo necesario para pintar la card de favoritos (autor + carrera)
const materialInclude = {
	user: { select: { username: true } },
	carrera: { select: { nombre: true } },
};

const mapToWithUser = (material: any): MaterialWithUser => {
	const { user, carrera, ...rest } = material;
	return {
		...rest,
		username: user?.username ?? null,
		carreraNombre: carrera?.nombre ?? null,
	} as MaterialWithUser;
};

// favorito de un usuario sobre un material puntual — devuelve false si el usuario aún no lo marcó (no es un error)
export async function getFavoritoByMaterialAndUser(materialId: number, userId: number): Promise<FavoritoCore> {
	const favorito = await prisma.favorito.findUnique({
		where: { userId_materialId: { userId, materialId } },
		select: { id: true },
	});

	return { isFavorite: !!favorito };
}

// materiales favoritos de un usuario, con busqueda textual opcional sobre titulo/descripcion
export async function findFavoritos(filters: FavoritoFilters, take: number, cursor?: number): Promise<PaginatedResult<MaterialWithUser>> {
	const { userId, query } = filters;

	const where = {
		userId,
		...(query && {
			material: {
				OR: [
					{ titulo: { contains: query, mode: 'insensitive' as const } },
					{ descripcion: { contains: query, mode: 'insensitive' as const } },
				],
			},
		}),
	};

	// desc: true — orden de alta descendente (mas reciente primero)
	const items = await prisma.favorito.findMany({
		where,
		include: { material: { include: materialInclude } },
		...getPrismaPaginationOptions(take, cursor, true),
	});

	const { paginatedItems, meta } = buildCursorPagination(items, take);
	return { data: paginatedItems.map((f) => mapToWithUser(f.material)), meta };
}

// modifica el favorito intentando crear directo: si ya existia, el unique constraint tira P2002 y se borra en el catch)
export async function toggleFavorito(materialId: number, userId: number): Promise<FavoritoCore> {
	try {
		await prisma.favorito.create({ data: { userId, materialId } });
		return { isFavorite: true };
	} catch (e: any) {
		// P2003: el material indicado no existe
		if (e.code === 'P2003') throw new AppError(`El material con ID ${materialId} no existe.`, 404);

		if (e.code === 'P2002') {
			// ya era favorito: se desmarca. deleteMany en vez de delete porque no tenemos el id, solo la clave unica compuesta
			await prisma.favorito.deleteMany({ where: { userId, materialId } });
			return { isFavorite: false };
		}

		throw e;
	}
}

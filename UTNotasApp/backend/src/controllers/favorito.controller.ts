import { Request, Response, NextFunction } from 'express';
import { FavoritoCore } from '../types/favorito.types';
import { MaterialWithUser } from '../types/material.types';
import { DataResponse } from '../types/api.types';
import { PaginatedDataResponse } from '../types/pagination.types';
import { getPaginationParams } from '../utils/pagination.util';
import * as favoritoService from '../services/favorito.service';

/**
 * responsabilidades:
 * - extrae parámetros de req y delega al service.
 * - marcar/desmarcar favorito no requiere rol especial.
 * - responde usando interfaces genéricas tipadas (DataResponse, PaginatedDataResponse).
 */

// favorito del usuario autenticado sobre un material
export async function getFavoritoByMaterialAndUser(req: Request<{ materialId: string }>, res: Response<DataResponse<FavoritoCore>>, next: NextFunction) {
	try {
		const favorito = await favoritoService.getFavoritoByMaterialAndUser(Number(req.params.materialId), req.user!.id);

		res.json({ data: favorito, message: 'Favorito obtenido correctamente' });

	} catch (error) { next(error); }
}

// lista paginada de materiales favoritos del usuario autenticado, con busqueda textual opcional via query
export async function findFavoritos(req: Request, res: Response<PaginatedDataResponse<MaterialWithUser>>, next: NextFunction) {
	try {
		const { take, cursor } = getPaginationParams(req.query.limit, req.query.cursor);
		const query = req.query.query as string | undefined;

		const result = await favoritoService.findFavoritos({ userId: req.user!.id, query }, take, cursor);

		res.json({ ...result, message: 'Favoritos obtenidos correctamente' });

	} catch (error) { next(error); }
}

export async function toggleFavorito(req: Request<{ materialId: string }>, res: Response<DataResponse<FavoritoCore>>, next: NextFunction) {
	try {
		const favorito = await favoritoService.toggleFavorito(Number(req.params.materialId), req.user!.id);

		res.json({ data: favorito, message: favorito.isFavorite ? 'Material agregado a favoritos' : 'Material quitado de favoritos' });

	} catch (error) { next(error); }
}

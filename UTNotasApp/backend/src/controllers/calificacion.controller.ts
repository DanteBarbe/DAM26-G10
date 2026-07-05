import { Request, Response, NextFunction } from 'express';
import { CalificacionCore, CalificacionListItem, CreateCalificacionRequest, UpdateCalificacionRequest } from '../types/calificacion.types';
import { DataResponse, SuccessResponse } from '../types/api.types';
import * as calificacionService from '../services/calificacion.service';

/**
 * responsabilidades:
 * - extrae parámetros de req y delega al service.
 * - votar no requiere rol especial
 * - responde usando interfaces genéricas tipadas (DataResponse, SuccessResponse).
 */

// voto del usuario autenticado sobre un material — data es null si todavía no votó
export async function getCalificacionByMaterialAndUser(req: Request<{ materialId: string }>, res: Response<DataResponse<CalificacionCore | null>>, next: NextFunction) {
	try {
		const calificacion = await calificacionService.getCalificacionByMaterialAndUser(Number(req.params.materialId), req.user!.id);

		res.json({ data: calificacion, message: calificacion ? 'Calificación obtenida correctamente' : 'El usuario no calificó este material' });

	} catch (error) { next(error); }
}

// busca votos del material de la url, filtrando ademas por userId opcional via query — ej: GET /:materialId/calificaciones?userId=5
export async function findCalificaciones(req: Request<{ materialId: string }>, res: Response<DataResponse<CalificacionListItem[]>>, next: NextFunction) {
	try {
		const materialId = Number(req.params.materialId);
		const userId = req.query.userId ? Number(req.query.userId) : undefined;

		const calificaciones = await calificacionService.findCalificaciones({ userId, materialId });

		res.json({ data: calificaciones, message: 'Calificaciones obtenidas correctamente' });

	} catch (error) { next(error); }
}

export async function createCalificacion(req: Request<{}, {}, CreateCalificacionRequest>, res: Response<DataResponse<CalificacionCore>>, next: NextFunction) {
	try {
		const calificacion = await calificacionService.createCalificacion(req.body, req.user!.id);

		res.status(201).json({ data: calificacion, message: 'Calificación creada correctamente' });

	} catch (error) { next(error); }
}

export async function updateCalificacion(req: Request<{ materialId: string }, {}, UpdateCalificacionRequest>, res: Response<DataResponse<CalificacionCore>>, next: NextFunction) {
	try {
		const calificacion = await calificacionService.updateCalificacion(Number(req.params.materialId), req.body, req.user!.id);

		res.json({ data: calificacion, message: 'Calificación actualizada correctamente' });

	} catch (error) { next(error); }
}

export async function deleteCalificacion(req: Request<{ materialId: string }>, res: Response<SuccessResponse>, next: NextFunction) {
	try {
		await calificacionService.deleteCalificacion(Number(req.params.materialId), req.user!.id);

		res.json({ success: true, message: 'Calificación eliminada correctamente' });

	} catch (error) { next(error); }
}

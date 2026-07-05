import { Request, Response, NextFunction } from 'express';
import { ReporteCore, ReporteWithMaterial, CreateReporteRequest } from '../types/reporte.types';
import { DataResponse, SuccessResponse } from '../types/api.types';
import { UserContext } from '../types/userContext.types';
import * as reporteService from '../services/reporte.service';

/**
 * responsabilidades:
 * - extrae parámetros de req y construye ctx desde el token, delegando al service.
 * - crear un reporte no requiere rol especial; listar y eliminar solo puede el ADMIN (validado en el service).
 * - responde usando interfaces genéricas tipadas (DataResponse, SuccessResponse).
 */

// listado de moderacion ADMIN, con userId/materialId opcionales via query
export async function findReportes(req: Request<{}, {}, {}, { userId?: string; materialId?: string }>, res: Response<DataResponse<ReporteCore[]>>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };
		
		const userId = req.query.userId ? Number(req.query.userId) : undefined;
		const materialId = req.query.materialId ? Number(req.query.materialId) : undefined;

		const reportes = await reporteService.findReportes({ userId, materialId }, ctx);

		res.json({ data: reportes, message: 'Reportes obtenidos correctamente' });

	} catch (error) { next(error); }
}

// reporte del usuario autenticado sobre un material, con el material anidado — data es null si todavía no lo reportó
export async function getReporteByMaterialAndUser(req: Request<{ materialId: string }>, res: Response<DataResponse<ReporteWithMaterial | null>>, next: NextFunction) {
	try {
		const reporte = await reporteService.getReporteByMaterialAndUser(Number(req.params.materialId), req.user!.id);

		res.json({ data: reporte, message: reporte ? 'Reporte obtenido correctamente' : 'El usuario no reportó este material' });

	} catch (error) { next(error); }
}

export async function createReporte(req: Request<{ materialId: string }, {}, CreateReporteRequest>, res: Response<DataResponse<ReporteCore>>, next: NextFunction) {
	try {
		const reporte = await reporteService.createReporte(Number(req.params.materialId), req.body, req.user!.id);

		res.status(201).json({ data: reporte, message: 'Reporte creado correctamente' });

	} catch (error) { next(error); }
}

// eliminacion de moderacion: solo ADMIN
export async function deleteReporte(req: Request<{ id: string }>, res: Response<SuccessResponse>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };

		await reporteService.deleteReporte(Number(req.params.id), ctx);

		res.json({ success: true, message: 'Reporte eliminado correctamente' });

	} catch (error) { next(error); }
}

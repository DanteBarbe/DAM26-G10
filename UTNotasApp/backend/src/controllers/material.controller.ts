import { Request, Response, NextFunction } from 'express';
import { DataResponse, SuccessResponse } from '../types/api.types';
import { PaginatedDataResponse } from '../types/pagination.types';
import { MaterialCore, MaterialWithUser, CreateMaterialRequest, UpdateMaterialRequest } from '../types/material.types';
import { UserContext } from '../types/userContext.types';
import { getPaginationParams } from '../utils/pagination.util';
import * as materialService from '../services/material.service';

/**
 * controlador de la entidad material.
 *
 * responsabilidades:
 * - extrae parámetros de req, construye ctx desde el token JWT y delega al service.
 * - responde usando interfaces genéricas tipadas (DataResponse, PaginatedDataResponse, SuccessResponse).
 * - nunca contiene lógica de negocio ni validaciones de permisos.
 */

export async function getMaterials(req: Request, res: Response<PaginatedDataResponse<MaterialWithUser>>, next: NextFunction) {
	try {
		const { take, cursor } = getPaginationParams(req.query.limit, req.query.cursor);
		const result = await materialService.getMaterials(req.query, take, cursor);
		res.json({ ...result, message: 'Materiales obtenidos correctamente' });
	} catch (error) {
		next(error);
	}
}

export async function getMaterialById(req: Request<{ id: string }>, res: Response<DataResponse<MaterialWithUser>>, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const material = await materialService.getMaterialById(id);
		res.json({ data: material, message: 'Material obtenido correctamente' });
	} catch (error) {
		next(error);
	}
}

export async function createMaterial(req: Request<{}, any, CreateMaterialRequest>, res: Response<DataResponse<MaterialCore>>, next: NextFunction) {
	try {
		// userId se toma de ctx — nunca del body para evitar suplantación de autoría
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };
		const material = await materialService.createMaterial(req.body, ctx);
		res.status(201).json({ data: material, message: 'Material creado correctamente' });
	} catch (error) {
		next(error);
	}
}

export async function updateMaterial(req: Request<{ id: string }, any, UpdateMaterialRequest>, res: Response<DataResponse<MaterialCore>>, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };
		const material = await materialService.updateMaterial(id, req.body, ctx);
		res.json({ data: material, message: 'Material actualizado correctamente' });
	} catch (error) {
		next(error);
	}
}

export async function deleteMaterial(req: Request<{ id: string }>, res: Response<SuccessResponse>, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };
		await materialService.deleteMaterial(id, ctx);
		res.json({ success: true, message: 'Material eliminado correctamente' });
	} catch (error) {
		next(error);
	}
}

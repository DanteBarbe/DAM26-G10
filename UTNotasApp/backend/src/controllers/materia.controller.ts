import { Request, Response, NextFunction } from 'express';
import { MateriaCore, CreateMateriaRequest, UpdateMateriaRequest } from '../types/materia.types';
import { DataResponse } from '../types/api.types';
import { PaginatedDataResponse } from '../types/pagination.types';
import { UserContext } from '../types/userContext.types';
import { getPaginationParams } from '../utils/pagination.util';
import * as materiaService from '../services/materia.service';

/**
 * controlador de la entidad materia.
 *
 * responsabilidades:
 * - extrae parámetros de req y delega al service.
 * - responde usando interfaces genéricas tipadas (DataResponse, PaginatedDataResponse).
 * - nunca contiene lógica de negocio ni validaciones de permisos.
 */

export async function getAllMaterias(req: Request, res: Response<PaginatedDataResponse<MateriaCore>>, next: NextFunction) {
	try {
		const { take, cursor } = getPaginationParams(req.query.limit, req.query.cursor);

		const result = await materiaService.getAllMaterias(take, cursor);

		res.json({ ...result, message: 'Materias obtenidas correctamente' });
	} catch (error) { next(error); }
}

export async function getMateriaById(req: Request<{ id: string }>, res: Response<DataResponse<MateriaCore>>, next: NextFunction) {
	try {
		const materia = await materiaService.getMateriaById(Number(req.params.id));

		res.json({ data: materia, message: 'Materia obtenida correctamente' });
	} catch (error) { next(error); }
}

export async function createMateria(req: Request<{}, {}, CreateMateriaRequest>, res: Response<DataResponse<MateriaCore>>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };

		const materia = await materiaService.createMateria(req.body, ctx);

		res.status(201).json({ data: materia, message: 'Materia creada correctamente' });
	} catch (error) { next(error); }
}

export async function updateMateria(req: Request<{ id: string }, {}, UpdateMateriaRequest>, res: Response<DataResponse<MateriaCore>>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };

		const materia = await materiaService.updateMateria(Number(req.params.id), req.body, ctx);

		res.json({ data: materia, message: 'Materia actualizada correctamente' });
	} catch (error) { next(error); }
}

import { Request, Response, NextFunction } from 'express';
import { CarreraMateria } from '@prisma/client';
import { CarreraCore, CreateCarreraRequest, UpdateCarreraRequest, UpsertCarreraMateriaRequest } from '../types/carrera.types';
import { DataResponse, SuccessResponse } from '../types/api.types';
import { UserContext } from '../types/userContext.types';
import * as carreraService from '../services/carrera.service';

/**
 * responsabilidades:
 * - construye ctx desde el token y delega al service.
 * - responde con interfaces genéricas tipadas (DataResponse, SuccessResponse).
 * - castea ids con Number(), no contiene lógica de negocio ni validaciones de permisos.
 */

export async function getAllCarreras(req: Request, res: Response<DataResponse<CarreraCore[]>>, next: NextFunction) {
	try {
		const carreras = await carreraService.getAllCarreras();

		res.json({ data: carreras, message: 'Carreras obtenidas correctamente' });

	} catch (error) { next(error); }
}

export async function findCarrerasByMateria(req: Request<{ materiaId: string }>, res: Response<DataResponse<CarreraCore[]>>, next: NextFunction) {
	try {
		const carreras = await carreraService.findCarrerasByMateria(Number(req.params.materiaId));

		res.json({ data: carreras, message: 'Carreras obtenidas correctamente' });
	
	} catch (error) { next(error); }
}

export async function getCarreraById(req: Request<{ id: string }>, res: Response<DataResponse<CarreraCore>>, next: NextFunction) {
	try {
		const carrera = await carreraService.getCarreraById(Number(req.params.id));

		res.json({ data: carrera, message: 'Carrera obtenida correctamente' });

	} catch (error) { next(error); }
}

export async function createCarrera(req: Request<{}, {}, CreateCarreraRequest>, res: Response<DataResponse<CarreraCore>>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };

		const carrera = await carreraService.createCarrera(req.body, ctx);
		
		res.status(201).json({ data: carrera, message: 'Carrera creada correctamente' });
	
	} catch (error) { next(error); }
}

export async function updateCarrera(req: Request<{ id: string }, {}, UpdateCarreraRequest>, res: Response<DataResponse<CarreraCore>>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };

		const carrera = await carreraService.updateCarrera(Number(req.params.id), req.body, ctx);

		res.json({ data: carrera, message: 'Carrera actualizada correctamente' });
	} catch (error) { next(error); }
}

export async function deleteCarrera(req: Request<{ id: string }>, res: Response<SuccessResponse>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };

		await carreraService.deleteCarrera(Number(req.params.id), ctx);

		res.json({ success: true, message: 'Carrera eliminada correctamente' });

	} catch (error) { next(error); }
}

export async function getCarreraMateria(req: Request<{ id: string; materiaId: string }>, res: Response<DataResponse<CarreraMateria>>, next: NextFunction) {
	try {
		const carreraMateria = await carreraService.getCarreraMateria({ carreraId: Number(req.params.id), materiaId: Number(req.params.materiaId) });

		res.json({ data: carreraMateria, message: 'Asociación obtenida correctamente' });

	} catch (error) { next(error); }
}

export async function upsertCarreraMateria(req: Request<{ id: string }, {}, UpsertCarreraMateriaRequest>, res: Response<DataResponse<CarreraMateria>>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };

		const carreraMateria = await carreraService.upsertCarreraMateria(Number(req.params.id), req.body, ctx);
		
		res.status(201).json({ data: carreraMateria, message: 'Materia asociada correctamente' });
	
	} catch (error) { next(error); }
}

export async function deleteCarreraMateria(req: Request<{ id: string; materiaId: string }>, res: Response<SuccessResponse>, next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role };
		
		await carreraService.deleteCarreraMateria({ carreraId: Number(req.params.id), materiaId: Number(req.params.materiaId) }, ctx);
		
		res.json({ success: true, message: 'Materia desasociada correctamente' });
	
	} catch (error) { next(error); }
}


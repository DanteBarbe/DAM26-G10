/**
 * controlador del dominio de usuario.
 *
 * responsabilidades:
 * - extrae params/body/ctx del request y delega lógica al service.
 * - responde con interfaces genéricas tipadas (DataResponse, SuccessResponse).
 * - nunca contiene lógica de negocio ni validaciones de permisos.
 */

import { Request, Response, NextFunction } from 'express';
import { CreateUserRequest, UpdateUserRequest, UserCore } from '../types/user.types';
import { DataResponse, SuccessResponse } from '../types/api.types';
import { UserContext } from '../types/userContext.types';
import { Role } from '@prisma/client';
import * as userService from '../services/user.service';

export async function getUserById(req: Request<{ id: string }>, res: Response<DataResponse<UserCore>>, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const user = await userService.getUserById(id);

		res.json({ data: user, message: 'Perfil obtenido correctamente' });
	} catch (error) {
		next(error);
	}
}

export async function register(req: Request<{}, any, CreateUserRequest>, res: Response<DataResponse<UserCore>>, next: NextFunction) {
	try {
		const user = await userService.createUser(req.body);

		res.status(201).json({ data: user, message: 'Usuario registrado correctamente' });
	} catch (error) {
		next(error);
	}
}

export async function updateUser(req: Request<{ id: string }, any, UpdateUserRequest>, res: Response<DataResponse<UserCore>>, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role as Role };
		const user = await userService.updateUser(id, req.body, ctx);

		res.json({ data: user, message: 'Perfil actualizado correctamente' });
	} catch (error) {
		next(error);
	}
}

export async function deleteUser(req: Request<{ id: string }>, res: Response<SuccessResponse>, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role as Role };
		console.log('DELETE body:', req.body, 'type:', typeof req.body);
		const { password } = req.body ?? {};

		await userService.deleteUser(id, password, ctx);

		res.json({ success: true, message: 'Usuario eliminado correctamente' });
	} catch (error) {
		next(error);
	}
}

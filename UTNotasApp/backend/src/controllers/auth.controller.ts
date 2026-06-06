/**
 * controlador del dominio de autenticación.
 *
 * responsabilidades:
 * - extrae datos del request y delega lógica al service.
 * - setea y limpia la cookie httpOnly con el JWT.
 * - responde con interfaces genéricas tipadas (DataResponse, SuccessResponse).
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { LoginRequest, GoogleLoginRequest, LoginResponse, UserWithoutPassword } from '../types/auth.types';
import { DataResponse, SuccessResponse } from '../types/api.types';
import { UserContext } from '../types/userContext.types';
import { Role } from '@prisma/client';

// Opciones de cookie centralizadas — httpOnly impide acceso desde JS del cliente
const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: 'lax' as const,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
	secure: process.env.NODE_ENV === 'production', // HTTPS solo en producción
};

export async function login(req: Request<{}, any, LoginRequest>,res: Response<DataResponse<{ user: UserWithoutPassword }>>,next: NextFunction) {
	try {
		const { user, token } = await authService.login(req.body);

		// El token va en cookie httpOnly, no en el body — el cliente mobile lee la cookie
		res.cookie('token', token, COOKIE_OPTIONS);

		res.json({
			data: { user },
			message: 'Sesión iniciada correctamente',
		});
	} catch (error) {
		next(error);
	}
}

export async function loginWithGoogle( req: Request<{}, any, GoogleLoginRequest>, res: Response<LoginResponse>, next: NextFunction) {
	try {
		const { user, token } = await authService.loginWithGoogle(req.body.credential);

		res.cookie('token', token, COOKIE_OPTIONS);

		res.json({
			data: { user },
			message: 'Sesión iniciada correctamente con Google',
		});
	} catch (error) {
		next(error);
	}
}

export async function me(req: Request,res: Response<DataResponse<UserWithoutPassword>>,next: NextFunction) {
	try {
		const ctx: UserContext = { id: req.user!.id, role: req.user!.role as Role };
		const user = await authService.getMe(ctx.id);

		res.json({
			data: user,
			message: 'Perfil obtenido correctamente',
		});
	} catch (error) {
		next(error);
	}
}

export async function logout(req: Request,res: Response<SuccessResponse>,next: NextFunction) {
	try {
		// clearCookie con las mismas opciones que al setear, excepto maxAge
		res.clearCookie('token', {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
		});

		res.json({
			success: true,
			message: 'Sesión cerrada correctamente',
		});
	} catch (error) {
		next(error);
	}
}
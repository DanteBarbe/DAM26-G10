/**
 * middlewares de autenticación y autorización por rol.
 *
 * responsabilidades:
 * - authenticate: extrae y verifica el JWT desde la cookie httpOnly.
 * - authorize: verifica que el rol del usuario esté en la lista permitida.
 * - augmenta el tipo global Express.Request con el campo user (UserContext).
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { UserContext } from '../types/userContext.types';

// Augmentación global: permite req.user en cualquier middleware/controller
declare global {
	namespace Express {
		interface Request {
			user?: UserContext;
		}
	}
}

function looksLikeJwt(token: string): boolean {
	return /^([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)$/.test(token);
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	try {
		// En mobile el token viaja en cookie httpOnly, no en header Authorization
		const token = req.cookies?.token;

		if (!token || token === 'null' || token === 'undefined') {
			return res.status(401).json({
				success: false,
				error: 'No se ha proporcionado un token de autenticación',
			});
		}

		// Validación de forma antes de llamar a jwt.verify (evita excepciones innecesarias)
		if (!looksLikeJwt(token)) {
			return res.status(401).json({
				success: false,
				error: 'El token de autenticación no es válido',
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

		req.user = {
			id: decoded.id,
			role: decoded.role as Role,
		};

		next();
	} catch (error: any) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				success: false,
				error: 'El token de autenticación ha expirado',
			});
		}
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({
				success: false,
				error: 'El token de autenticación no es válido',
			});
		}

		console.error(error);
		return res.status(401).json({
			success: false,
			error: 'El token de autenticación no es válido',
		});
	}
}

export function authorize(...roles: Role[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				error: 'La solicitud requiere autenticación',
			});
		}
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				error: 'No cuenta con los permisos necesarios para realizar esta acción',
			});
		}
		next();
	};
}
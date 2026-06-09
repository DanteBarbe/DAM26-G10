/**
 * tipos e interfaces del dominio de autenticación.
 *
 * responsabilidades:
 * - define contratos de request/response para login por email y google.
 * - expone UserWithoutPassword para nunca filtrar el hash en respuestas.
 * - no contiene lógica, solo contratos de forma.
 */

import { DataResponse } from './api.types';
import { User } from './user.types';

export interface LoginRequest {
	email: string;
	password: string;
	// captchaToken es opcional en E2; en E3 será requerido cuando se active hCaptcha
	captchaToken?: string;
}

export interface GoogleLoginRequest {
	credential: string;
}

// Omit garantiza que el campo password nunca viaje en una respuesta de API
export interface UserWithoutPassword extends Omit<User, 'password'> {}

// auth.types.ts
export interface LoginResponse extends DataResponse<{ user: UserWithoutPassword }> {}

// Payload que vive dentro del JWT — mínimo necesario para ABAC
export interface AuthenticatedUser {
	id: number;
	role: 'USER' | 'ADMIN';
	email: string;
}
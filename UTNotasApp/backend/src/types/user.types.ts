/**
 * tipos e interfaces del dominio de usuario.
 *
 * responsabilidades:
 * - define User completo para uso interno y compatibilidad con auth.types.ts.
 * - define UserCore como contrato de respuesta (nunca incluye password).
 * - define contratos de request para registro y modificación de perfil.
 * - role no es modificable por el usuario — se omite en UpdateUserRequest.
 */

import { Role } from '@prisma/client';

// Entidad completa — solo para uso interno y composición con auth.types.ts
export interface User {
	id: number;
	name: string;
	surname: string;
	careerId: number | null;
	username: string;
	email: string;
	role: Role;
	password: string;
	profilePicture: string | null;
	points: number;
	createdAt: Date;
	updatedAt: Date;
}

// Contrato de respuesta — password nunca sale de la API
export interface UserCore extends Omit<User, 'password'> {}

export interface CreateUserRequest {
	name: string;
	surname: string;
	careerId?: number;
	email: string;
	password: string;
	username: string;
	// role se asigna como USER por defecto — no aceptar del cliente en E2
}

export interface UpdateUserRequest {
	name?: string;
	surname?: string;
	careerId?: number;
	email?: string;
	password?: string;
	username?: string;
	profilePicture?: string | null;
	// role se ignora — solo ADMIN lo cambia en E3 (RF-02.6)
}

/**
 * lógica de negocio del dominio de autenticación.
 *
 * responsabilidades:
 * - valida credenciales y construye el payload JWT.
 * - devuelve datos puros { user, token } — nunca manipula res/req.
 * - delega la verificación de google a google-auth.service.
 * - aplica protección contra timing attack en login por email.
 */

import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequest, UserWithoutPassword } from '../types/auth.types';
import { verifyGoogleCredential } from './google-auth.service';
import { AppError } from '../errors/AppError';

type AuthUser = Awaited<ReturnType<typeof prisma.user.findUnique>> extends infer T
	? NonNullable<T>
	: never;

// Hash estático usado para igualar el tiempo de respuesta cuando el usuario no existe
// Evita que un atacante detecte si un email está registrado midiendo latencias
const DUMMY_HASH = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';

function buildTokenAndUser(user: AuthUser): { user: UserWithoutPassword; token: string } {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error('JWT_SECRET no está configurado en las variables de entorno');
	}

	const tokenPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};

	// JWT_EXPIRES_IN acepta string ('7d') o número (segundos) — jsonwebtoken lo maneja
	const signOptions: jwt.SignOptions = {
		expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d',
	};

	const token = jwt.sign(tokenPayload, jwtSecret, signOptions);

	// Destructuración estricta: password nunca sale del service
	const { password: _removed, ...userWithoutPassword } = user;

	return {
		user: userWithoutPassword as unknown as UserWithoutPassword,
		token,
	};
}

export async function login(data: LoginRequest): Promise<{ user: UserWithoutPassword; token: string }> {
	const user = await prisma.user.findUnique({
		where: { email: data.email },
	});

	// Siempre se ejecuta bcrypt.compare para igualar el tiempo de respuesta
	// independientemente de si el usuario existe o no (anti timing attack)
	const hashToCompare = user ? user.password : DUMMY_HASH;
	const validPassword = await bcrypt.compare(data.password, hashToCompare);

	if (!user || !validPassword) {
		// Mensaje genérico intencional: no revelar si el email existe o no
		throw new AppError('Las credenciales ingresadas no son válidas', 401);
	}

	return buildTokenAndUser(user);
}

export async function loginWithGoogle(credential: string): Promise<{ user: UserWithoutPassword; token: string }> {
	const googleProfile = await verifyGoogleCredential(credential);

	const user = await prisma.user.findUnique({
		where: { email: googleProfile.email! },
	});

	if (!user) {
		throw new AppError('No existe una cuenta registrada con ese correo. Registrate primero con Google.', 404);
	}

	return buildTokenAndUser(user);
}

export async function getMe(userId: number): Promise<UserWithoutPassword> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new AppError('Usuario no encontrado', 404);
	}

	const { password: _removed, ...userWithoutPassword } = user;
	return userWithoutPassword as unknown as UserWithoutPassword;
}
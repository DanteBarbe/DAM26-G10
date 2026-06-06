/**
 * utilidades de formateo del dominio de usuario.
 *
 * responsabilidades:
 * - excluye el campo password de objetos de usuario antes de retornar al controller.
 * - centraliza el stripping de datos sensibles para no repetir destructuración en cada service.
 */

// Genérico para que funcione tanto con el tipo Prisma como con UserCore extendido
export function formatUser<T extends { password: string }>(user: T): Omit<T, 'password'> {
	// Destructuración estricta: password nunca llega al caller
	const { password: _removed, ...safeUser } = user;
	return safeUser as Omit<T, 'password'>;
}

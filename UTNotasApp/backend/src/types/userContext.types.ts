import { Role } from '@prisma/client';

export interface UserContext {
	id: number;
	role: Role;
}

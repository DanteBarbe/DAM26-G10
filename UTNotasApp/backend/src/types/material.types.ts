import { TipoMaterial } from '@prisma/client';

/**
 * tipos del dominio material.
 *
 * responsabilidades:
 * - define las interfaces de entrada/salida para la entidad Material.
 * - separa la representación de base de datos de la de API.
 * - MaterialCore es el tipo de respuesta seguro (sin campos internos de E3).
 * - userId se omite de las requests de escritura: lo inyecta el controller desde ctx.
 */

export interface MaterialCore {
	id: number;
	titulo: string;
	tipo: TipoMaterial;
	archivo: string;
	descripcion: string | null;
	comision: string | null;
	añoCursada: number | null;
	numeroParcial: number | null;
	materiaId: number | null;
	carreraId: number | null;
	userId: number;
	upvotes: number;
	downvotes: number;
	cantidadReportes: number;
	createdAt: Date;
}

export interface MaterialWithUser extends MaterialCore {
	username: string | null;
	carreraNombre?: string | null;
	materiaNombre?: string | null;
}

export interface CreateMaterialRequest {
	titulo: string;
	tipo: TipoMaterial;
	archivo: string;
	descripcion?: string | null;
	comision?: string | null;
	añoCursada?: number | null;
	numeroParcial?: number | null;
	materiaId?: number | null;
	carreraId?: number | null;
}

//  userId, upvotes y downvotes eliminados — read-only en E2 (upvotes/downvotes son E3)
export interface UpdateMaterialRequest {
	titulo?: string;
	tipo?: TipoMaterial;
	archivo?: string;
	descripcion?: string | null;
	comision?: string | null;
	añoCursada?: number | null;
	numeroParcial?: number | null;
	materiaId?: number | null;
	carreraId?: number | null;
}

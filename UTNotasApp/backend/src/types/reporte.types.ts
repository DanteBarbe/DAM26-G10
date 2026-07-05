import { MotivoReporte } from '@prisma/client';
import { MaterialWithUser } from './material.types';

// reporte de un material por un usuario
export interface ReporteCore {
	id: number;
	userId: number;
	materialId: number;
	descripcion: string | null;
	motivo: MotivoReporte;
	createdAt: Date;
}

// reporte + el material que denuncia (no existe reporte sin material)
export interface ReporteWithMaterial extends ReporteCore {
	material: MaterialWithUser;
}

// materialId viene del path y userId del token — ambos se inyectan en el controller, no viajan en el body
export interface CreateReporteRequest {
	motivo: MotivoReporte;
	descripcion?: string | null;
}

// filtro para ADMIN, ambos opcionales
export interface ReporteFilters {
	userId?: number;
	materialId?: number;
}

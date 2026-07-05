import { z } from 'zod';
import { MotivoReporte } from '@prisma/client';

const reporteBodyCore = {
	motivo: z.enum(MotivoReporte, { error: 'El motivo del reporte no es válido' }),

	descripcion: z.string().trim().max(500, 'La descripción no puede superar los 500 caracteres').nullable().optional(),
};

export const createReporteSchema = z.object({
	params: z.object({ materialId: z.coerce.number().int().positive() }),
	body: z.object(reporteBodyCore).strict(),
});

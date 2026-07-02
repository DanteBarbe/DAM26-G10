/**
 * schemas de validación zod compartidos entre entidades.
 *
 * responsabilidades:
 * - centraliza validaciones idénticas en todas las entidades (todas usan Int autoincrement como PK).
 * - evita duplicar el mismo schema de id en cada archivo de validations/.
 */

import { z } from 'zod';

export const idParamSchema = z.object({
	params: z.object({ id: z.coerce.number().int().positive() }),
});

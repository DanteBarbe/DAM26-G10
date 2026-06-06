import { ZodError, ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

/**
 * middleware de validación de esquemas zod.
 *
 * responsabilidades:
 * - valida { body, params, query } contra el schema recibido.
 * - asigna de vuelta solo los valores que el schema define (coerciones incluidas).
 * - responde 400 con lista de errores si la validación falla.
 */

export const validate = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData: any = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            // asignación condicional: si el schema no define body o params, no se sobreescribe con undefined
            if (validatedData.body !== undefined) req.body = validatedData.body;
            if (validatedData.params !== undefined) (req as any).params = validatedData.params;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(new AppError(
                    `Error de validación: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
                    400
                ));
            }
            return next(error);
        }
    };
};

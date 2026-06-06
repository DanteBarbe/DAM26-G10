import { ZodError, ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const validate = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            //verifica que el schema es compatible con el tipo de datos que se le esta pasando
            const validatedData: any = await schema.parseAsync({ 
                body: req.body,
                params: req.params,
                query: req.query
            });

            //reemplazo de los datos originales por los validados (saca espacios, convierte tipos, etc)
            req.body = validatedData.body;
            req.params = validatedData.params;

            //si todo va bien, sigue al siguiente middleware o controlador
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map(err => 
                    `${err.path.join('.')}: ${err.message}`
                ).join(', ');

                return next(new AppError(`Error de validación: ${errorMessages}`, 400));
            }
            return next(error);
        }
    };
};

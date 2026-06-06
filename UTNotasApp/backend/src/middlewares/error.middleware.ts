import { Request, Response, NextFunction } from 'express';

//err se define como 'any' porque puede ser cualquier tipo de error
export function handleError(err: any, req: Request, res: Response, next: NextFunction) {
	
	//registra momento exacto en que ocurrió el problema
	const timestamp = new Date().toISOString();
	
	//determina código de estado http, si trae codigo lo usa, si no usa 500
	const statusCode = err.statusCode || 500;

	//en producción, si el error no es operativo (es decir, no es un error que se espera y se maneja), se oculta el mensaje real para evitar exponer detalles sensibles
	let message = err.message || 'Internal server error'; //mensaje por defecto para errores sin mensaje específico
    if (process.env.NODE_ENV === 'production' && !err.isOperational) { //si no es un error operativo (un error que se espera y se maneja) y esta en produccion
        message = 'Internal server error'; //mensaje genérico para errores no operativos en producción
    }
	
	//registra el error con su código de estado y mensaje, y si no es un error operativo, también registra el stack trace (pila de llamadas que llevo al error) para facilitar depuracion
    console.log(`[${timestamp}] Error ${statusCode}:`, err.message);
    if (!err.isOperational) console.error(err.stack);
	
	//manda respuesta formal al cliente en formato json
	res.status(statusCode).json({
		status: err.status || (statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'), //si el error tiene un status definido lo usa, si no, determina si es un error del cliente (4xx) o del servidor (5xx) para asignar 'fail' o 'error' 
		message: message,
		timestamp: timestamp 
	});
}

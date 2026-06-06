export class AppError extends Error {
    public readonly statusCode: number;   //cdigo http real (401, 404, 400).
    public readonly status: string;       //string descriptivo: 'fail' / 'error'
    public readonly isOperational: boolean; //error operacional: errores esperados y manejables (ej: usuario no encontrado, contraseña incorrecta)
    //  vs errores de programación (ej: error de sintaxis)

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        
        // Lógica JSend (Estándar de facto):
        //si el código empieza con '4' (ej: 404) = fallo del cliente ('fail').
        //si empieza con '5' (ej: 500) = error del servidor ('error').
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        //marca como TRUE significa que este error es esperado y manejable, no un crash inesperado.
        //en cambio si llega el error al middleware sin esto (isOperational undefined) = crash inesperado.
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
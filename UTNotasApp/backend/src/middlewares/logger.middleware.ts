import { Request, Response, NextFunction } from 'express'; 

//exporta la función para poder usarla en app.ts
export function logRequest (req: Request, res: Response, next: NextFunction) {
	//crea marca de tiempo actual en formato ISO (ej: 2026-02-10T20:15:00Z)
	const timestamp = new Date().toISOString(); 

	//obtiene el método HTTP de la petición (GET, POST...)
	const method = req.method; 
	
	//obtiene la ruta a la que el cliente intentó acceder (ej: /api/books)
	const url = req.url; 
	
	//muestra en consola de la terminal qué está pasando en el servidor
	console.log(`[${timestamp}] ${method} ${url}`); 
	
	//indica q termino y q se pase a la siguiente funcion
	next(); 
}
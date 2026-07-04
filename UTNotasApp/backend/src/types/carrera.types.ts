// Entidad completa — solo para uso interno
export interface Carrera {
	id: number;
	nombre: string;
	icon: string;
}

// Contrato de respuesta simple
export interface CarreraCore extends Carrera {}

// Fila de la tabla intermedia carrera_materia — anio indica en qué año de la carrera se cursa la materia
export interface CarreraMateriaCore {
	carreraId: number;
	materiaId: number;
	anio: number;
}

// Body de POST/PATCH /api/carreras/:id/materias — inserta o actualiza una materia a la carrera (dependiendo de si existia o no)
export interface UpsertCarreraMateriaRequest {
	materiaId: number;
	anio: number;
}

export interface CreateCarreraRequest {
	nombre: string;
	icon: string;
	//reutiliza UpsertCarreraMateriaRequest en vez de CarreraMateria de prisma q solicitaria el id de la tabla (cuando en realidad, al momento de ejecutarse esto si es un insert el id no existe xq lo genera Prisma)
	materias?: UpsertCarreraMateriaRequest[];
}

export interface UpdateCarreraRequest {
	nombre?: string;
	icon?: string;
}

// interfaz para GET y DELETE de la tabla intermedia carrera_materia (para UPDATE usa solo carreraId)
export interface CarreraMateriaParams {
	carreraId: number;
	materiaId: number;
}

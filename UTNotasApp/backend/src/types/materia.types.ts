// Entidad completa — solo para uso interno
export interface Materia {
	id: number;
	nombre: string;
	descripcion: string;
}

// Contrato de respuesta simple
export interface MateriaCore extends Materia {}

export interface CreateMateriaRequest {
	nombre: string;
	descripcion: string;
}

export interface UpdateMateriaRequest {
	nombre?: string;
	descripcion?: string;
}

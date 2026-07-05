// respuesta minima de lectura/escritura de una calificacion — materialId/userId ya los tiene el cliente (viene parado en la card del material)
export interface CalificacionCore {
	value: boolean;
}

// userId se toma de ctx en el controller
export interface CreateCalificacionRequest {
	materialId: number;
	value: boolean;
}

export interface UpdateCalificacionRequest {
	value?: boolean;
}

// filtro de busqueda general — se usa fuera del contexto de un material puntual (ej: perfil de usuario)
export interface CalificacionFilters {
	userId?: number;
	materialId?: number;
}

// forma expuesta por findCalificaciones — a diferencia de CalificacionCore (voto propio) aca si hace falta saber a que material corresponde cada fila
export interface CalificacionListItem {
	materialId: number;
	value: boolean;
}

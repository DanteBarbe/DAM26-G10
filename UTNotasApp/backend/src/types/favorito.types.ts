// respuesta minima de si el usuario marco como favorito un material — materialId/userId ya los tiene el cliente (viene parado en la card del material)
export interface FavoritoCore {
	isFavorite: boolean;
}

// filtro de busqueda general para listar favoritos de un usuario, con texto libre opcional
export interface FavoritoFilters {
	userId: number;
	query?: string;
}

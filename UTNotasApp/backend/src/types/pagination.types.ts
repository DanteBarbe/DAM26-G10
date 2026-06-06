// interfaz generica para respuestas paginadas con cursor
export interface PaginatedResult<T> {
    data: T[]; //T significa que el tipo de dato es generico, se define al usar la interfaz
    meta: {
        hasNextPage: boolean;// le dice al front si hay más datos para hacer scroll
        nextCursor: number | null;// id q el front debe mandar en su próxima petición para obtener la siguiente página, null si no hay más páginas
        limit: number;// cantidad de items por pagina
    };
}

export interface PaginatedDataResponse<T> extends PaginatedResult<T> {
    message: string;
}
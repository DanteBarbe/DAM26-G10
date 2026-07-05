import { PAGINATION_CONFIG } from '../config/pagination.config';

//valida parametros de entrada para la futura response paginada
export function getPaginationParams(queryTake?: any, queryCursor?: any) {
    let take = Number(queryTake) || PAGINATION_CONFIG.DEFAULT_TAKE;
    let cursor = queryCursor ? Number(queryCursor) : undefined;

    //clamping: previene saturación de bd (take=10000) o valores inválidos
    if (take <= 0) take = PAGINATION_CONFIG.DEFAULT_TAKE;
    if (take > PAGINATION_CONFIG.MAX_TAKE) take = PAGINATION_CONFIG.MAX_TAKE;
    
    //valida numero valido para cursor
    if (cursor !== undefined && (isNaN(cursor) || cursor <= 0)) {
        cursor = undefined;
    }

    return { take, cursor };
}

//configuracion generica para consultar a la bd para respuestas paginadas
//desc=true invierte el orden (mas nuevo primero) para listados tipo "favoritos" que necesitan orden de alta descendente
//tipo de retorno explicito (sin any): evita que al spreadear el resultado dentro de un findMany con include, ts pierda el shape y caiga a un overload de prisma sin include
export function getPrismaPaginationOptions(take: number, cursor?: number, desc: boolean = false): { take: number; orderBy: { id: 'asc' | 'desc' }; cursor?: { id: number }; skip?: number } {
    const options: { take: number; orderBy: { id: 'asc' | 'desc' }; cursor?: { id: number }; skip?: number } = {
        take: take + 1,
        orderBy: { id: desc ? 'desc' : 'asc' }
    };
    if (cursor) {
        options.cursor = { id: cursor };
        options.skip = 1;
    }
    return options;
}

// función auxiliar genérica para construir la respuesta de paginación con cursor
export function buildCursorPagination<T extends { id: number }>(items: T[], take: number) {
    //por defecto asume q no hay pagina siguiente y el nextcursor es null
    let hasNextPage = false;
    let nextCursor: number | null = null; //inicializa el cursor para la próxima página como null, lo que indica que no hay más páginas a menos que se determine lo contrario 

    if (items.length > take) {//si el número de items obtenidos es mayor que el límite solicitado
        hasNextPage = true; //significa q hay una pagina siguiente
        const extraItem = items.pop(); //elimina el item extra del array de resultados para no incluirlo en la respuesta, ya que solo se necesitaba para determinar si hay una página siguiente (recorda que se pidio limit + 1 items para saber si hay + páginas)      
        if (extraItem) nextCursor = extraItem.id; //si se obtuvo un item extra, establece el nextCursor como el ID de ese item extra, lo que permitirá al cliente solicitar la próxima página a partir de ese cursor. Si no hay item extra, el nextCursor permanecerá como null, indicando que no hay más páginas.
    } else if (items.length > 0) { //si no hay item extra pero sí hay items en el resultado, significa que esta es la última página
        nextCursor = items[items.length - 1].id; //establece el nextCursor como el ID del último item de esta página, aunque no habrá una página siguiente. Esto permite al cliente saber que llego al final de los resultados.
    }

    return { 
        paginatedItems: items, 
        meta: { hasNextPage, nextCursor, limit: take } //mapeo de take a limit para cumplir con interfaz de Paginated result. Son el mismo numero pero para el front es limit y back es take.
        //Flujo: viene del front limit = 20. Controller recibe esto y CAMBIA el nombre a take y se lo pasa al service con el +1 para q traiga uno extra o la indicacion q fuera para q lo entienda la bd.
    };
}
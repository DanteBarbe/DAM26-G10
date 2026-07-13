import { apiFetch } from "@/src/api/apiClient";

/**
 * cliente del catalogo academico (materias y carreras) contra el backend real.
 *
 * endpoints usados:
 * - GET /api/materias                          -> todas las materias
 * - GET /api/carreras                          -> todas las carreras
 * - GET /api/carreras/materia/:materiaId       -> carreras que dictan esa materia
 * - GET /api/carreras/:id/materias/:materiaId  -> { anio } de la relacion (para la comision)
 */

export type Materia = { id: number; nombre: string };
export type Carrera = { id: number; nombre: string };

type MateriaApi = { id: number; nombre: string; descripcion?: string };
type CarreraApi = { id: number; nombre: string; icon?: string };

export const fetchMaterias = async (): Promise<Materia[]> => {
	const res = await apiFetch<{ data: MateriaApi[] }>("/api/materias?limit=100");
	return res.data.map((m) => ({ id: m.id, nombre: m.nombre }));
};

export const fetchCarreras = async (): Promise<Carrera[]> => {
	const res = await apiFetch<{ data: CarreraApi[] }>("/api/carreras");
	return res.data.map((c) => ({ id: c.id, nombre: c.nombre }));
};

// carreras que dictan la materia dada (para filtrar el desplegable de carrera al crear).
export const fetchCarrerasByMateria = async (
	materiaId: number,
): Promise<Carrera[]> => {
	const res = await apiFetch<{ data: CarreraApi[] }>(
		`/api/carreras/materia/${materiaId}`,
	);
	return res.data.map((c) => ({ id: c.id, nombre: c.nombre }));
};

// anio en que la carrera dicta la materia — base del prefijo de comision (ej: "S1").
export const fetchCarreraMateriaAnio = async (
	carreraId: number,
	materiaId: number,
): Promise<number> => {
	const res = await apiFetch<{ data: { carreraId: number; materiaId: number; anio: number } }>(
		`/api/carreras/${carreraId}/materias/${materiaId}`,
	);
	return res.data.anio;
};

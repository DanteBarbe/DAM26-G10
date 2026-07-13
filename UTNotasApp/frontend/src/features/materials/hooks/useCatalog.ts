import { useQuery } from "@tanstack/react-query";

import {
	fetchCarreraMateriaAnio,
	fetchCarreras,
	fetchCarrerasByMateria,
	fetchMaterias,
	type Carrera,
	type Materia,
} from "@/src/features/materials/services/catalogService";

/**
 * hooks de react-query para el catalogo academico (materias / carreras).
 *
 * el catalogo cambia poco, por eso staleTime alto: se cachea y no se re-pide
 * en cada render/pantalla.
 */

const CATALOG_STALE_TIME = 10 * 60 * 1000;

export const useMaterias = () =>
	useQuery<Materia[]>({
		queryKey: ["materias"],
		queryFn: fetchMaterias,
		staleTime: CATALOG_STALE_TIME,
	});

export const useCarreras = () =>
	useQuery<Carrera[]>({
		queryKey: ["carreras"],
		queryFn: fetchCarreras,
		staleTime: CATALOG_STALE_TIME,
	});

export const useCarrerasByMateria = (materiaId?: number) =>
	useQuery<Carrera[]>({
		queryKey: ["carreras", "materia", materiaId],
		queryFn: () => fetchCarrerasByMateria(materiaId as number),
		enabled: typeof materiaId === "number" && materiaId > 0,
		staleTime: CATALOG_STALE_TIME,
	});

export const useCarreraMateriaAnio = (carreraId?: number, materiaId?: number) =>
	useQuery<number>({
		queryKey: ["carrera-materia-anio", carreraId, materiaId],
		queryFn: () =>
			fetchCarreraMateriaAnio(carreraId as number, materiaId as number),
		enabled:
			typeof carreraId === "number" &&
			carreraId > 0 &&
			typeof materiaId === "number" &&
			materiaId > 0,
		staleTime: CATALOG_STALE_TIME,
	});

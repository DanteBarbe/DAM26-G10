import type {CreatedMaterial, MaterialError, MaterialFormData, StudyMaterial } from "@/src/features/materials/types/materials.types";
import { deleteCreatedMaterial, saveCreatedMaterial } from "@/src/features/materials/utils/createdMaterialsStore";
import { getAllMaterials } from "@/src/features/materials/utils/materialHelpers";

/**
 * responsabilidades:
 * - encapsular peticiones de red y manipulacion de datos de materiales.
 * - arrojar errores estandarizados (materialerror).
 * - operar independientemente de react y tanstack query.
 * - nota: actualmente usa mocks locales (e1), se reemplazara por fetch en e2.
 */

export const getMaterialById = async (id: number): Promise<StudyMaterial> => {
	const found = getAllMaterials().find((m) => m.id === id);
	
	if (!found) {
		const err: MaterialError = {
			code: "NOT_FOUND",
			message: "El material no existe o fue eliminado.",
		};
		throw err;
	}
	
	return found;
};

export const createMaterial = async (form: MaterialFormData): Promise<CreatedMaterial> => {
	// TODO (e2): loggeduserid vendra del backend via token, aca se mockea para e1
	const loggedUserId = 1;

	const material: CreatedMaterial = {
		...form,
		id: Date.now(),
		userId: loggedUserId,
		createdAt: new Date().toISOString(),
		numeroParcial: form.parcial ? Number(form.parcial) : undefined,
	};

	await saveCreatedMaterial(material);
	return material;
};

export const deleteMaterial = async (id: number): Promise<void> => {
	try {
		deleteCreatedMaterial(id);
	} catch (err) {
		const isOwnership = err instanceof Error && err.message === "MATERIAL_NOT_OWNED";
		const mapped: MaterialError = isOwnership
			? { code: "MATERIAL_NOT_OWNED", message: "No tenes permisos para eliminar este material." }
			: { code: "UNKNOWN", message: "Ocurrio un error inesperado. Intenta de nuevo." };
		throw mapped;
	}
};


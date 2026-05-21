import { Platform } from "react-native";

import type { CreatedMaterial } from "@/src/features/materials/types/materials.types";

const STORAGE_KEY = "utnotas.createdMaterials";
const memoryMaterials: CreatedMaterial[] = [];

const getLocalStorage = () => {
  const storage = (globalThis as { localStorage?: Storage }).localStorage;
  return Platform.OS === "web" ? storage : undefined;
};

export const saveCreatedMaterial = async (material: CreatedMaterial) => {
  memoryMaterials.unshift(material);

  const storage = getLocalStorage();
  if (!storage) return;

  const rawItems = storage.getItem(STORAGE_KEY);
  const currentItems = rawItems ? (JSON.parse(rawItems) as CreatedMaterial[]) : [];
  storage.setItem(STORAGE_KEY, JSON.stringify([material, ...currentItems]));
};

export const getCreatedMaterials = () => {
  const storage = getLocalStorage();

  if (!storage) return memoryMaterials;

  const rawItems = storage.getItem(STORAGE_KEY);
  return rawItems ? (JSON.parse(rawItems) as CreatedMaterial[]) : memoryMaterials;
};


/**
 * elimina un material propio del store local.
 *
 * responsabilidades:
 * - valida ownership antes de tocar nada: lanza MATERIAL_NOT_OWNED si el id no existe.
 * - borra de memoria y de localStorage atomicamente.
 * - en e2, este bloque se reemplaza x un DELETE /api/materials/:id en el hook.
 */
export const deleteCreatedMaterial = (id: number): void => {
	const idx = memoryMaterials.findIndex((m) => m.id === id);

	// id no existe en store local = no es material propio
	if (idx === -1) throw new Error("MATERIAL_NOT_OWNED");

	memoryMaterials.splice(idx, 1);

	const storage = getLocalStorage();
	if (!storage) return;

	const rawItems = storage.getItem(STORAGE_KEY);
	if (!rawItems) return;

	const updated = (JSON.parse(rawItems) as CreatedMaterial[]).filter(
		(m) => m.id !== id,
	);
	storage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
import { Platform } from "react-native";

import type { CreatedMaterial } from "@/src/features/materials/types/materials.types";

const STORAGE_KEY = "utnotas.createdMaterials";
const memoryMaterials: CreatedMaterial[] = [];

const getLocalStorage = () => {
  const storage = (globalThis as { localStorage?: Storage }).localStorage;
  return Platform.OS === "web" ? storage : undefined;
};

const replaceMemoryMaterials = (materials: CreatedMaterial[]) => {
  memoryMaterials.splice(0, memoryMaterials.length, ...materials);
};

const buildUpdatedMaterial = (
  current: CreatedMaterial,
  form: Omit<CreatedMaterial, "id" | "userId" | "createdAt" | "numeroParcial">,
): CreatedMaterial => ({
  ...current,
  ...form,
  id: current.id,
  userId: current.userId,
  createdAt: current.createdAt,
  numeroParcial: form.parcial ? Number(form.parcial) : undefined,
});

export const saveCreatedMaterial = async (material: CreatedMaterial) => {
  const nextMaterials = [
    material,
    ...getCreatedMaterials().filter((item) => item.id !== material.id),
  ];
  replaceMemoryMaterials(nextMaterials);

  const storage = getLocalStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEY, JSON.stringify(nextMaterials));
};

export const getCreatedMaterials = () => {
  const storage = getLocalStorage();

  if (!storage) return memoryMaterials;

  const rawItems = storage.getItem(STORAGE_KEY);
  return rawItems ? (JSON.parse(rawItems) as CreatedMaterial[]) : memoryMaterials;
};

export const getCreatedMaterialById = (id: number) =>
  getCreatedMaterials().find((material) => material.id === id);

export const updateCreatedMaterial = (
  id: number,
  form: Omit<CreatedMaterial, "id" | "userId" | "createdAt" | "numeroParcial">,
): CreatedMaterial => {
  const currentItems = getCreatedMaterials();
  const existing = currentItems.find((material) => material.id === id);

  if (!existing) throw new Error("MATERIAL_NOT_OWNED");

  const updatedMaterial = buildUpdatedMaterial(existing, form);
  const nextMaterials = currentItems.map((material) =>
    material.id === id ? updatedMaterial : material,
  );

  replaceMemoryMaterials(nextMaterials);

  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(nextMaterials));
  }

  return updatedMaterial;
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
	const currentItems = getCreatedMaterials();
	const exists = currentItems.some((m) => m.id === id);

	// id no existe en store local = no es material propio
	if (!exists) throw new Error("MATERIAL_NOT_OWNED");

	const updated = currentItems.filter((m) => m.id !== id);
	replaceMemoryMaterials(updated);

	const storage = getLocalStorage();
	if (!storage) return;

	storage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

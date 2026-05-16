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


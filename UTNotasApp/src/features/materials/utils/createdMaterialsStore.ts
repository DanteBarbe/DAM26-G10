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

export const deleteCreatedMaterial = (id: number) => {
  const idx = memoryMaterials.findIndex((m) => m.id === id);
  if (idx !== -1) memoryMaterials.splice(idx, 1);

  const storage = getLocalStorage();
  if (!storage) return;

  const rawItems = storage.getItem(STORAGE_KEY);
  const current = rawItems ? (JSON.parse(rawItems) as CreatedMaterial[]) : [];
  storage.setItem(STORAGE_KEY, JSON.stringify(current.filter((m) => m.id !== id)));
};

export const updateCreatedMaterial = (id: number, updated: CreatedMaterial) => {
  const idx = memoryMaterials.findIndex((m) => m.id === id);
  if (idx !== -1) memoryMaterials[idx] = updated;

  const storage = getLocalStorage();
  if (!storage) return;

  const rawItems = storage.getItem(STORAGE_KEY);
  const current = rawItems ? (JSON.parse(rawItems) as CreatedMaterial[]) : [];
  storage.setItem(STORAGE_KEY, JSON.stringify(current.map((m) => (m.id === id ? updated : m))));
};

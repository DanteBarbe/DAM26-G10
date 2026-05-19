import type { MaterialType } from "@/src/features/materials/data/materialOptions";

export type AttachedFile = {
  id: string;
  name: string;
  size?: number;
  mimeType?: string;
  uri?: string;
};

export type MaterialFormData = {
  titulo: string;
  descripcion: string;
  tipo: MaterialType["value"] | "";
  archivos: AttachedFile[];
  materiaId?: number;
  carreraId?: number;
  materia: string;
  carrera: string;
  comision: string;
  parcial: string;
  anioCursada: string;
};

export type CreatedMaterial = MaterialFormData & {
  id: number;
  userId: number;
  createdAt: string;
  numeroParcial?: number;
};

export type MaterialAuthor = {
  id: number;
  name: string;
  username: string;
  level: string;
};

export type StudyMaterial = {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: MaterialFormData["tipo"];
  materia: string;
  carrera: string;
  comision?: string;
  anioCursada?: number;
  numeroParcial?: number;
  archivo: AttachedFile;
  author: MaterialAuthor;
  createdAt: string;
  score: number;
  isFavorite?: boolean;
  pages?: number;
};

export type FieldName = keyof MaterialFormData;

export type FieldError = {
  field: FieldName;
  message: string;
};

export type PointsBreakdown = {
  total: number;
  base: number;
  bonus: number;
  breakdown: string[];
};

export type MaterialError = {
	code: "MATERIAL_NOT_OWNED" | "NOT_FOUND" | "UNKNOWN";
	message: string;
};
export type Career = {
  id: number;
  nombre: string;
};

export type Subject = {
  id: number;
  nombre: string;
};

export type CareerSubject = {
  carreraId: number;
  materiaId: number;
  anio: number;
};

export type MaterialType = {
  label: string;
  value:
    | "PARCIAL"
    | "PARCIAL_RESUELTO"
    | "FINAL"
    | "FINAL_RESUELTO"
    | "PRACTICA"
    | "PRACTICA_RESUELTA"
    | "APUNTE"
    | "RESUMEN"
    | "OTRO";
};

export const materialTypes: MaterialType[] = [
  { label: "Parcial", value: "PARCIAL" },
  { label: "Parcial resuelto", value: "PARCIAL_RESUELTO" },
  { label: "Final", value: "FINAL" },
  { label: "Final resuelto", value: "FINAL_RESUELTO" },
  { label: "Practica", value: "PRACTICA" },
  { label: "Practica resuelta", value: "PRACTICA_RESUELTA" },
  { label: "Apunte", value: "APUNTE" },
  { label: "Resumen", value: "RESUMEN" },
  { label: "Otro", value: "OTRO" },
];

export const careers: Career[] = [
  { id: 1, nombre: "Ingenieria en Sistemas de Informacion" },
  { id: 2, nombre: "Ingenieria Industrial" },
  { id: 3, nombre: "Ingenieria Civil" },
  { id: 4, nombre: "Ingenieria Electronica" },
  { id: 5, nombre: "Ingenieria Mecanica" },
];

export const subjects: Subject[] = [
  { id: 1, nombre: "Analisis Matematico I" },
  { id: 2, nombre: "Algebra y Geometria Analitica" },
  { id: 3, nombre: "Fisica I" },
  { id: 4, nombre: "Quimica General" },
  { id: 5, nombre: "Algoritmos y Estructuras de Datos" },
  { id: 6, nombre: "Sistemas y Organizaciones" },
  { id: 7, nombre: "Analisis Matematico II" },
  { id: 8, nombre: "Probabilidad y Estadistica" },
  { id: 9, nombre: "Arquitectura de Computadoras" },
  { id: 10, nombre: "Diseno de Sistemas" },
  { id: 11, nombre: "Base de Datos" },
  { id: 12, nombre: "Economia" },
  { id: 13, nombre: "Estabilidad" },
  { id: 14, nombre: "Termodinamica" },
  { id: 15, nombre: "Electronica Aplicada" },
];

export const careerSubjects: CareerSubject[] = [
  { carreraId: 1, materiaId: 1, anio: 1 },
  { carreraId: 1, materiaId: 2, anio: 1 },
  { carreraId: 1, materiaId: 3, anio: 1 },
  { carreraId: 1, materiaId: 5, anio: 1 },
  { carreraId: 1, materiaId: 6, anio: 1 },
  { carreraId: 1, materiaId: 7, anio: 2 },
  { carreraId: 1, materiaId: 8, anio: 2 },
  { carreraId: 1, materiaId: 9, anio: 2 },
  { carreraId: 1, materiaId: 10, anio: 3 },
  { carreraId: 1, materiaId: 11, anio: 3 },
  { carreraId: 2, materiaId: 1, anio: 1 },
  { carreraId: 2, materiaId: 2, anio: 1 },
  { carreraId: 2, materiaId: 3, anio: 1 },
  { carreraId: 2, materiaId: 4, anio: 1 },
  { carreraId: 2, materiaId: 7, anio: 2 },
  { carreraId: 2, materiaId: 8, anio: 2 },
  { carreraId: 2, materiaId: 12, anio: 3 },
  { carreraId: 3, materiaId: 1, anio: 1 },
  { carreraId: 3, materiaId: 2, anio: 1 },
  { carreraId: 3, materiaId: 3, anio: 1 },
  { carreraId: 3, materiaId: 7, anio: 2 },
  { carreraId: 3, materiaId: 8, anio: 2 },
  { carreraId: 3, materiaId: 13, anio: 3 },
  { carreraId: 4, materiaId: 1, anio: 1 },
  { carreraId: 4, materiaId: 2, anio: 1 },
  { carreraId: 4, materiaId: 3, anio: 1 },
  { carreraId: 4, materiaId: 7, anio: 2 },
  { carreraId: 4, materiaId: 8, anio: 2 },
  { carreraId: 4, materiaId: 15, anio: 3 },
  { carreraId: 5, materiaId: 1, anio: 1 },
  { carreraId: 5, materiaId: 2, anio: 1 },
  { carreraId: 5, materiaId: 3, anio: 1 },
  { carreraId: 5, materiaId: 7, anio: 2 },
  { carreraId: 5, materiaId: 8, anio: 2 },
  { carreraId: 5, materiaId: 14, anio: 3 },
];

export const getCareersForSubject = (subjectId?: number) => {
  if (!subjectId) return [];

  const careerIds = new Set(
    careerSubjects
      .filter((relation) => relation.materiaId === subjectId)
      .map((relation) => relation.carreraId),
  );

  return careers.filter((career) => careerIds.has(career.id));
};

export const getCareerSubject = (careerId?: number, subjectId?: number) => {
  if (!careerId || !subjectId) return undefined;

  return careerSubjects.find(
    (relation) =>
      relation.carreraId === careerId && relation.materiaId === subjectId,
  );
};

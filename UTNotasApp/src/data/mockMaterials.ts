import type {
  AttachedFile,
  CreatedMaterial,
  StudyMaterial,
} from "@/src/features/materials/types/materials.types";

export const mockMaterials: StudyMaterial[] = [
  {
    id: 101,
    titulo: "Resumen de Analisis Matematico II",
    descripcion:
      "Apunte ordenado por unidades con limites, integrales impropias, series y ejercicios tipicos de final.",
    tipo: "RESUMEN",
    materia: "Analisis Matematico II",
    carrera: "Ingenieria en Sistemas de Informacion",
    comision: "S2",
    anioCursada: 2025,
    archivo: {
      id: "mock-analisis-ii",
      name: "resumen-analisis-matematico-ii.pdf",
      size: 1840000,
      mimeType: "application/pdf",
      uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    author: {
      id: 7,
      name: "Martina Alvarez",
      username: "martu.alvarez",
      level: "Nivel 4",
    },
    createdAt: "2026-04-18T13:25:00.000Z",
    score: 42,
    isFavorite: true,
    pages: 24,
  },
  {
    id: 102,
    titulo: "Parcial resuelto de Base de Datos",
    descripcion:
      "Resolucion comentada de modelo entidad-relacion, normalizacion y consultas SQL.",
    tipo: "PARCIAL_RESUELTO",
    materia: "Base de Datos",
    carrera: "Ingenieria en Sistemas de Informacion",
    comision: "S3",
    anioCursada: 2024,
    numeroParcial: 2,
    archivo: {
      id: "mock-bdd-parcial",
      name: "parcial-2-base-de-datos-resuelto.pdf",
      size: 920000,
      mimeType: "application/pdf",
      uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    author: {
      id: 8,
      name: "Tomas Rios",
      username: "tomi.rios",
      level: "Nivel 3",
    },
    createdAt: "2026-03-27T20:10:00.000Z",
    score: 31,
    pages: 11,
  },
  {
    id: 103,
    titulo: "Guia practica de Fisica I",
    descripcion:
      "Ejercicios seleccionados de cinematica, dinamica y trabajo-energia con notas al margen.",
    tipo: "PRACTICA",
    materia: "Fisica I",
    carrera: "Ingenieria Industrial",
    comision: "I1",
    anioCursada: 2025,
    archivo: {
      id: "mock-fisica",
      name: "guia-fisica-i.pdf",
      size: 1260000,
      mimeType: "application/pdf",
      uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    author: {
      id: 10,
      name: "Lucia Fernandez",
      username: "lufdez",
      level: "Nivel 2",
    },
    createdAt: "2026-02-11T16:40:00.000Z",
    score: 18,
    pages: 17,
  },
  {
    id: 104,
    titulo: "Final de Algoritmos comentado",
    descripcion:
      "Consignas frecuentes, recorridos de arboles, complejidad y estructuras lineales.",
    tipo: "FINAL_RESUELTO",
    materia: "Algoritmos y Estructuras de Datos",
    carrera: "Ingenieria en Sistemas de Informacion",
    comision: "S1",
    anioCursada: 2023,
    archivo: {
      id: "mock-algoritmos",
      name: "final-algoritmos-resuelto.pdf",
      size: 760000,
      mimeType: "application/pdf",
      uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    author: {
      id: 12,
      name: "Nicolas Vera",
      username: "nico.vera",
      level: "Nivel 5",
    },
    createdAt: "2026-01-30T09:05:00.000Z",
    score: 55,
    pages: 9,
  },
];

const fallbackFile = (material: CreatedMaterial): AttachedFile => {
  return (
    material.archivos[0] ?? {
      id: `created-${material.id}`,
      name: "material-subido.pdf",
      mimeType: "application/pdf",
    }
  );
};

export const mapCreatedMaterialToStudyMaterial = (
  material: CreatedMaterial,
): StudyMaterial => ({
  id: material.id,
  titulo: material.titulo,
  descripcion: material.descripcion || "Material subido desde la app movil.",
  tipo: material.tipo,
  materia: material.materia,
  carrera: material.carrera,
  comision: material.comision,
  anioCursada: material.anioCursada ? Number(material.anioCursada) : undefined,
  numeroParcial: material.numeroParcial,
  archivo: fallbackFile(material),
  author: {
    id: material.userId,
    name: "Usuario demo",
    username: "usuario.demo",
    level: "Nivel 1",
  },
  createdAt: material.createdAt,
  score: 0,
});

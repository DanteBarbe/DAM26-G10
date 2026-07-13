import type {
  FieldError,
  MaterialFormData,
} from "@/src/features/materials/types/materials.types";

const currentYear = new Date().getFullYear();

export const getCareerPrefix = (
  careerName: string,
  careerSubjectYear?: number,
) => {
  if (!careerName || !careerSubjectYear) return "";

  const words = careerName.toLowerCase().split(" ");
  const sourceWord = words[1] === "en" ? words[2] : words[1];
  if (!sourceWord) return "";

  return `${sourceWord[0].toUpperCase()}${careerSubjectYear}`;
};

export const validateForm = (form: MaterialFormData): FieldError | null => {
  const year = Number(form.anioCursada);

  if (!form.titulo.trim()) {
    return { field: "titulo", message: "El titulo es obligatorio." };
  }
  if (form.archivos.length === 0) {
    return { field: "archivos", message: "Debes adjuntar un archivo." };
  }
  if (!form.materiaId) {
    return { field: "materiaId", message: "Debes seleccionar una materia." };
  }
  if (!form.tipo) {
    return { field: "tipo", message: "Debes seleccionar un tipo de material." };
  }
  if (form.anioCursada && (year < 2000 || year > currentYear)) {
    return {
      field: "anioCursada",
      message: `El ano debe estar entre 2000 y ${currentYear}.`,
    };
  }

  return null;
};

export const partialLabel = (value: string) => {
  switch (value) {
    case "0": return "Ninguno";
    case "1": return "1ero";
    case "2": return "2do";
    case "3": return "3ro";
    case "4": return "4to";
    default:  return "Seleccionar";
  }
};

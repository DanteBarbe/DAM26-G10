import { mapCreatedMaterialToStudyMaterial, mockMaterials } from "@/src/features/materials/data/mockMaterials";
import { materialTypes } from "@/src/features/materials/data/materialOptions";
import { getCreatedMaterials } from "@/src/features/materials/utils/createdMaterialsStore";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";

export const getTypeLabel = (value: StudyMaterial["tipo"]) =>
  materialTypes.find((type) => type.value === value)?.label ?? "Material";

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export const getAllMaterials = () => [
  ...getCreatedMaterials().map(mapCreatedMaterialToStudyMaterial),
  ...mockMaterials,
];

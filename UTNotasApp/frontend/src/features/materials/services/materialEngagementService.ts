import { apiFetch } from "@/src/api/apiClient";
import { getMaterialById } from "@/src/features/materials/services/materialService";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";

export type VoteValue = true | false;
export type UserVote = VoteValue | null;

export type ReportReason = "CONTENIDO_INAPROPIADO" | "SPAM" | "PLAGIO" | "OTRO";

export type ReportPayload = {
  motivo: ReportReason;
  descripcion?: string | null;
};

export type ApiReport = {
  id: number;
  userId: number;
  materialId: number;
  descripcion: string | null;
  motivo: ReportReason;
  createdAt: string;
};

export type AdminReport = ApiReport & {
  material: StudyMaterial | null;
};

type ApiData<T> = {
  data: T;
  message: string;
};

export const getMyVote = async (materialId: number): Promise<UserVote> => {
  const res = await apiFetch<ApiData<{ value: boolean } | null>>(
    `/api/materials/${materialId}/calificaciones/me`,
  );
  return res.data?.value ?? null;
};

export const setMyVote = async (materialId: number, nextVote: UserVote): Promise<UserVote> => {
  if (nextVote === null) {
    await apiFetch(`/api/materials/${materialId}/calificaciones/me`, { method: "DELETE" });
    return null;
  }

  const current = await getMyVote(materialId);
  const method = current === null ? "POST" : "PATCH";
  const body = method === "POST" ? { materialId, value: nextVote } : { value: nextVote };

  const res = await apiFetch<ApiData<{ value: boolean }>>(
    `/api/materials/${materialId}/calificaciones/me`,
    {
      method,
      body: JSON.stringify(body),
    },
  );

  return res.data.value;
};

export const getFavoriteStatus = async (materialId: number): Promise<boolean> => {
  const res = await apiFetch<ApiData<{ isFavorite: boolean }>>(`/api/favoritos/${materialId}`);
  return res.data.isFavorite;
};

export const toggleFavorite = async (materialId: number): Promise<boolean> => {
  const res = await apiFetch<ApiData<{ isFavorite: boolean }>>(`/api/favoritos/${materialId}`, {
    method: "POST",
  });
  return res.data.isFavorite;
};

export const getMyReport = async (materialId: number): Promise<ApiReport | null> => {
  const res = await apiFetch<ApiData<ApiReport | null>>(`/api/reportes/${materialId}/me`);
  return res.data;
};

export const createReport = async (materialId: number, payload: ReportPayload): Promise<ApiReport> => {
  const res = await apiFetch<ApiData<ApiReport>>(`/api/reportes/${materialId}/me`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
};

export const fetchAdminReports = async (): Promise<AdminReport[]> => {
  const res = await apiFetch<ApiData<ApiReport[]>>("/api/reportes");
  const reports = await Promise.all(
    res.data.map(async (report) => {
      try {
        const material = await getMaterialById(report.materialId);
        return { ...report, material };
      } catch {
        return { ...report, material: null };
      }
    }),
  );

  return reports;
};

export const ignoreReport = async (reportId: number): Promise<void> => {
  await apiFetch(`/api/reportes/${reportId}`, { method: "DELETE" });
};

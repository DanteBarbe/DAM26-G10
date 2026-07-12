import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Share } from "react-native";

import { useToast } from "@/src/contexts/ToastContext";
import { useAuth } from "@/src/features/auth/AuthContext";
import {
  createReport,
  fetchAdminReports,
  getFavoriteStatus,
  getMyReport,
  getMyVote,
  ignoreReport,
  setMyVote,
  toggleFavorite,
  type AdminReport,
  type ReportPayload,
  type UserVote,
} from "@/src/features/materials/services/materialEngagementService";
import { deleteMaterial } from "@/src/features/materials/services/materialService";
import { materialsListKey } from "@/src/features/materials/hooks/useMaterial";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";

const voteQueryKey = (materialId: number) => ["material-vote", materialId] as const;
const favoriteQueryKey = (materialId: number) => ["material-favorite", materialId] as const;
const reportQueryKey = (materialId: number) => ["material-report", materialId] as const;
const adminReportsQueryKey = ["admin-reports"] as const;

export const useMaterialEngagement = (material: StudyMaterial) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const voteQuery = useQuery({
    queryKey: voteQueryKey(material.id),
    queryFn: () => getMyVote(material.id),
    enabled: isAuthenticated,
  });

  const favoriteQuery = useQuery({
    queryKey: favoriteQueryKey(material.id),
    queryFn: () => getFavoriteStatus(material.id),
    enabled: isAuthenticated,
  });

  const reportQuery = useQuery({
    queryKey: reportQueryKey(material.id),
    queryFn: () => getMyReport(material.id),
    enabled: isAuthenticated,
  });

  const voteMutation = useMutation({
    mutationFn: (nextVote: UserVote) => setMyVote(material.id, nextVote),
    retry: false,
    onSuccess: (vote) => {
      queryClient.setQueryData(voteQueryKey(material.id), vote);
      queryClient.invalidateQueries({ queryKey: ["material", material.id] });
      queryClient.invalidateQueries({ queryKey: materialsListKey });
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : "No se pudo registrar el voto", "error");
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavorite(material.id),
    retry: false,
    onSuccess: (isFavorite) => {
      queryClient.setQueryData(favoriteQueryKey(material.id), isFavorite);
      showToast(isFavorite ? "Agregado a favoritos" : "Quitado de favoritos", "success");
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : "No se pudo actualizar favoritos", "error");
    },
  });

  const reportMutation = useMutation({
    mutationFn: (payload: ReportPayload) => createReport(material.id, payload),
    retry: false,
    onSuccess: (report) => {
      queryClient.setQueryData(reportQueryKey(material.id), report);
      showToast("Reporte enviado para revision", "success");
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : "No se pudo enviar el reporte", "error");
    },
  });

  const requireAuth = (message: string) => {
    if (isAuthenticated) return true;
    showToast(message, "info");
    return false;
  };

  const submitVote = (vote: Exclude<UserVote, null>) => {
    if (!requireAuth("Inicia sesion para votar materiales")) return;
    const currentVote = voteQuery.data ?? null;
    voteMutation.mutate(currentVote === vote ? null : vote);
  };

  const toggleMaterialFavorite = () => {
    if (!requireAuth("Inicia sesion para guardar favoritos")) return;
    favoriteMutation.mutate();
  };

  const submitReport = (payload: ReportPayload) => {
    if (!requireAuth("Inicia sesion para reportar materiales")) return;
    reportMutation.mutate(payload);
  };

  const shareMaterial = async () => {
    try {
      await Share.share({
        title: material.titulo,
        message: `${material.titulo}\n${material.archivo.uri ?? ""}`,
        url: material.archivo.uri,
      });
    } catch {
      showToast("No se pudo compartir el material", "error");
    }
  };

  return {
    userVote: voteQuery.data ?? null,
    isFavorite: favoriteQuery.data ?? false,
    hasReported: !!reportQuery.data,
    isVoting: voteMutation.isPending,
    isTogglingFavorite: favoriteMutation.isPending,
    isReporting: reportMutation.isPending,
    submitVote,
    toggleMaterialFavorite,
    submitReport,
    shareMaterial,
  };
};

export const useAdminReports = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const reportsQuery = useQuery<AdminReport[], Error>({
    queryKey: adminReportsQueryKey,
    queryFn: fetchAdminReports,
    staleTime: 30 * 1000,
  });

  const ignoreMutation = useMutation({
    mutationFn: ignoreReport,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReportsQueryKey });
      showToast("Reporte ignorado", "success");
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : "No se pudo ignorar el reporte", "error");
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: deleteMaterial,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReportsQueryKey });
      queryClient.invalidateQueries({ queryKey: materialsListKey });
      showToast("Material eliminado", "success");
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : "No se pudo eliminar el material", "error");
    },
  });

  return {
    reports: reportsQuery.data ?? [],
    isLoading: reportsQuery.isLoading,
    isError: reportsQuery.isError,
    refetch: reportsQuery.refetch,
    ignoreReport: (id: number) => ignoreMutation.mutate(id),
    deleteReportedMaterial: (id: number) => deleteMaterialMutation.mutate(id),
    pendingReportId: ignoreMutation.variables ?? null,
    pendingMaterialId: deleteMaterialMutation.variables ?? null,
    isIgnoring: ignoreMutation.isPending,
    isDeletingMaterial: deleteMaterialMutation.isPending,
  };
};

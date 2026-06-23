import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useToast } from "@/src/contexts/ToastContext";
import { useAuth } from "@/src/features/auth/AuthContext";
import type { CreatedMaterial, MaterialError, MaterialFormData, StudyMaterial, } from "@/src/features/materials/types/materials.types";
import { createMaterial, deleteMaterial, fetchMaterials, getEditableMaterialById, getMaterialById, updateMaterial, type MaterialListFilters, } from "@/src/features/materials/services/materialService";

/**
 * hooks de react para interaccion con estado de materiales en servidor.
 *
 * responsabilidades:
 * - conectar los servicios asincronos con react query.
 * - gestionar cache, invalidaciones y estados de carga (isloading, ispending).
 * - redirigir tras mutaciones exitosas.
 */

const materialQueryKey = (id: number) => ["material", id] as const;
const editableMaterialQueryKey = (id: number) => ["editable-material", id] as const;
export const materialsListKey = ["materials"] as const;

export const useGetMaterials = (filters: MaterialListFilters = {}) => {
	const query = useQuery<StudyMaterial[], Error>({
		queryKey: [...materialsListKey, filters] as const,
		queryFn: () => fetchMaterials(filters),
		staleTime: 2 * 60 * 1000,
	});

	return {
		materials: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		refetch: query.refetch,
	};
};

export const useGetMaterial = (id: number) => {
	const { user } = useAuth();

	const query = useQuery<StudyMaterial, MaterialError>({
		queryKey: materialQueryKey(id),
		queryFn: () => getMaterialById(id),
		staleTime: 5 * 60 * 1000,
	});

	const isOwner = !!user && query.data?.author.id === user.id;

	return {
		material: query.data,
		isLoading: query.isLoading,
		isNotFound: query.error?.code === "NOT_FOUND",
		isOwner,
	};
};

export const useGetEditableMaterial = (id?: number) => {
	const query = useQuery<CreatedMaterial, MaterialError>({
		queryKey: editableMaterialQueryKey(id ?? 0),
		queryFn: () => getEditableMaterialById(id ?? 0),
		enabled: typeof id === "number" && Number.isFinite(id),
		staleTime: 0,
	});

	return {
		material: query.data,
		isLoading: query.isLoading,
		isNotFound: query.error?.code === "MATERIAL_NOT_OWNED",
		error: query.error ?? null,
	};
};

export const useCreateMaterial = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<StudyMaterial, MaterialError, MaterialFormData>({
		mutationFn: createMaterial,
		retry: false,
		onSuccess: (material) => {
			queryClient.invalidateQueries({ queryKey: materialsListKey });
			router.navigate("/(tabs)");
			router.push(`/material/${material.id}`);
		},
		onError: (err) => {
			console.error("[CRITICAL_UI_ERROR] fallo critico al crear material:", err);
		},
	});

	return {
		submitMaterial: mutation.mutate,
		isSubmitting: mutation.isPending,
		createError: mutation.isError ? mutation.error : null,
	};
};

export const useUpdateMaterial = () => {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	const mutation = useMutation<
		StudyMaterial,
		MaterialError,
		{ id: number; form: MaterialFormData }
	>({
		mutationFn: ({ id, form }) => updateMaterial(id, form),
		retry: false,
		onSuccess: (material) => {
			queryClient.setQueryData(materialQueryKey(material.id), material);
			queryClient.invalidateQueries({ queryKey: materialsListKey });
			showToast("Material actualizado correctamente", "success", 3500);
			router.replace(`/material/${material.id}`);
		},
		onError: (err) => {
			showToast(err.message ?? "No se pudo guardar el material", "error", 3500); console.error("[CRITICAL_UI_ERROR] fallo critico al editar material:", err);
		},
	});

	return {
		updateMaterial: mutation.mutate,
		isUpdating: mutation.isPending,
		updateError: mutation.isError ? mutation.error : null,
		clearUpdateError: () => mutation.reset(),
	};
};

export const useDeleteMaterial = (id: number) => {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	const mutation = useMutation<void, MaterialError, void>({
		mutationFn: () => deleteMaterial(id),
		retry: false,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: materialQueryKey(id) });
			queryClient.invalidateQueries({ queryKey: materialsListKey });
			showToast("El material fue eliminado correctamente", "success", 3500);
			router.replace("/search");
		},
		onError: (err) => {
			console.error("[CRITICAL_UI_ERROR] fallo critico al eliminar material:", err);
		},
	});

	return {
		deleteMaterial: () => mutation.mutate(),
		isDeleting: mutation.isPending,
		deleteError: mutation.isError ? mutation.error : null,
		clearDeleteError: () => mutation.reset(),
	};
};

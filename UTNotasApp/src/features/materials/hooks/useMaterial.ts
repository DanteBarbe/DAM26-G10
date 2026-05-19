import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import type { CreatedMaterial, MaterialError, MaterialFormData, PointsBreakdown, StudyMaterial, } from "@/src/features/materials/types/materials.types";
import { createMaterial, deleteMaterial, getMaterialById, } from "@/src/features/materials/services/materialService";
import { buildPointsBreakdown } from "@/src/features/materials/utils/materialFormHelpers";
import { getCreatedMaterials } from "@/src/features/materials/utils/createdMaterialsStore";

/**
 * hooks de react para interaccion con estado de materiales en servidor.
 *
 * responsabilidades:
 * - conectar los servicios asincronos con react query.
 * - gestionar cache, invalidaciones y estados de carga (isloading, ispending).
 * - redirigir tras mutaciones exitosas.
 */

const materialQueryKey = (id: number) => ["material", id] as const;
const materialsListKey = ["materials"] as const;

export const useGetMaterial = (id: number) => {
	const query = useQuery<StudyMaterial, MaterialError>({
		queryKey: materialQueryKey(id),
		queryFn: () => getMaterialById(id),
		staleTime: 5 * 60 * 1000,
	});

	// nota (e1): simulacion de owner mediante chequeo en store local.
	// en e2 esto se calculara comparando el user.id del AuthContext vs query.data.userId
	const isOwner = getCreatedMaterials().some((m) => String(m.id) === String(id));

	return {
		material: query.data,
		isLoading: query.isLoading,
		isNotFound: query.error?.code === "NOT_FOUND",
		isOwner,
	};
};

export const useCreateMaterial = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<{ material: CreatedMaterial; points: PointsBreakdown }, MaterialError,	MaterialFormData>({
		mutationFn: async (form) => {
			const material = await createMaterial(form);
			const points = buildPointsBreakdown(form);
			return { material, points };
		},
		retry: false,
		onSuccess: ({ material }) => {
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
		points: mutation.data?.points ?? null,
		clearPoints: () => mutation.reset(),
		createError: mutation.isError ? mutation.error : null,
	};
};

export const useDeleteMaterial = (id: number) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<void, MaterialError, void>({
		mutationFn: () => deleteMaterial(id),
		retry: false,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: materialQueryKey(id) });
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
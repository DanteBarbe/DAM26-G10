import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DangerConfirmModal } from "@/src/components/DangerConfirmModal";   
import { IconButton } from "@/src/components/IconButton";
import { MaterialInfoItem } from "@/src/features/materials/components/MaterialInfoItem";
import { MaterialPreviewCard } from "@/src/features/materials/components/MaterialPreviewCard";
import { MaterialScreenHeader } from "@/src/features/materials/components/MaterialScreenHeader";
import { MaterialDetailSkeleton } from "@/src/features/materials/components/MaterialDetailSkeleton";
import { useGetMaterial, useDeleteMaterial } from "@/src/features/materials/hooks/useMaterial";
import { detailStyles } from "@/src/features/materials/screens/styles/MaterialDetail.styles";
import { getTypeLabel, formatDate } from "@/src/features/materials/utils/materialHelpers";
import { GlobalStyles } from "@/src/styles/Global.styles";

export default function MaterialDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const numericId = Number(id);

	const { material, isLoading, isNotFound, isOwner } = useGetMaterial(numericId);
	const { deleteMaterial, isDeleting, deleteError, clearDeleteError } = useDeleteMaterial(numericId);
	const [confirmVisible, setConfirmVisible] = useState(false);

	const handleCancel = () => {
		if (isDeleting) return;
		clearDeleteError();
		setConfirmVisible(false);
	};

	// --- estado de carga ---
	if (isLoading) return <MaterialDetailSkeleton />;

	if (isNotFound || !material) {
		return (
			<SafeAreaView style={GlobalStyles.safeArea}>
				<StatusBar style="dark" />
				<View style={detailStyles.notFound}>
					<Feather name="file-minus" size={56} color="#9a9284" />
					<Text style={detailStyles.notFoundTitle}>Material no encontrado</Text>
					<Pressable
						accessibilityRole="button"
						onPress={() => router.replace("/search")}
						style={detailStyles.primaryButton}
					>
						<Text style={detailStyles.primaryButtonText}>
							Volver a busqueda
						</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={GlobalStyles.safeArea}>
			<StatusBar style="dark" />
			<ScrollView contentContainerStyle={GlobalStyles.content}>
				<MaterialScreenHeader title="Ver material" />

				<View style={detailStyles.infoCard}>
					<View style={detailStyles.infoTopRow}>
						<View style={detailStyles.titleWrap}>
							<Text style={detailStyles.materialTitle}>{material.titulo}</Text>
							<Text style={detailStyles.materialMeta}>
								Subido por @{material.author.username} -{" "}
								{formatDate(material.createdAt)}
							</Text>
						</View>
						{isOwner ? (
							<View style={detailStyles.ownerActions}>
								<IconButton
									icon="edit-3"
									disabled={isDeleting}
									onPress={() =>
										router.push({
											pathname: "/create",
											params: { editId: String(material.id) },
										})
									}
								/>
								<IconButton
									icon="trash-2"
									danger
									disabled={isDeleting}
									onPress={() => setConfirmVisible(true)}
								/>
							</View>
						) : null}
					</View>

					<Text style={detailStyles.description}>{material.descripcion}</Text>

					<View style={detailStyles.badgeRow}>
						<Text style={[detailStyles.badge, detailStyles.badgeType]}>
							{getTypeLabel(material.tipo)}
						</Text>
						<Text style={[detailStyles.badge, detailStyles.badgeCareer]}>
							{material.materia}
						</Text>
						{material.numeroParcial ? (
							<Text style={[detailStyles.badge, detailStyles.badgeNeutral]}>
								Parcial {material.numeroParcial}
							</Text>
						) : null}
					</View>

					<View style={detailStyles.metaGrid}>
						<MaterialInfoItem
							icon="book-open"
							label="Carrera"
							value={material.carrera}
						/>
						<MaterialInfoItem
							icon="users"
							label="Comisión"
							value={material.comision || "Sin especificar"}
						/>
						<MaterialInfoItem
							icon="calendar"
							// MODIFICADO: Se reemplazo "Año" por "Anio" para garantizar regla estricta de prohibido tildes/caracteres conflictivos
							label="Año"
							value={material.anioCursada?.toString() || "Sin especificar"}
						/>
					</View>
				</View>

				<MaterialPreviewCard material={material} />
			</ScrollView>

			<DangerConfirmModal
				visible={confirmVisible}
				title="Eliminar material"
				body="Esta accion es permanente. El material sera eliminado y no podras recuperarlo."
				confirmLabel="Eliminar"
				isPending={isDeleting}
				errorMessage={deleteError?.message ?? null}
				onConfirm={() => deleteMaterial()}
				onCancel={handleCancel}
			/>
		</SafeAreaView>
	);
}

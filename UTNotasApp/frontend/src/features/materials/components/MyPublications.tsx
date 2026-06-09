import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { MaterialResultCard } from "@/src/features/materials/components/MaterialResultCard";
import { mapCreatedMaterialToStudyMaterial } from "@/src/features/materials/data/mockMaterials";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";
import { getCreatedMaterials } from "@/src/features/materials/utils/createdMaterialsStore";
import { colors } from "@/src/styles/Colors";
import { normalizeText } from "@/src/utils/format";
import { myPublicationsStyles as styles } from "./styles/MyPublications.styles";

// publicaciones del usuario = materiales que subio (store local de creados).
const getMyMaterials = (): StudyMaterial[] =>
	getCreatedMaterials().map(mapCreatedMaterialToStudyMaterial);

function StatCard({
	icon,
	value,
	label,
}: {
	icon: keyof typeof Feather.glyphMap;
	value: number;
	label: string;
}) {
	return (
		<View style={styles.statCard}>
			<View style={styles.statIconWrap}>
				<Feather name={icon} size={16} color={colors.primary} />
			</View>
			<Text style={styles.statValue}>{value}</Text>
			<Text style={styles.statLabel}>{label}</Text>
		</View>
	);
}

/**
 * seccion "Mis Publicaciones" embebida en el perfil.
 *
 * responsabilidades:
 * - mostrar estadisticas rapidas, buscador local y la lista de materiales propios.
 * - estado vacio (sin materiales o sin resultados de busqueda).
 */
export function MyPublications() {
	const [materials, setMaterials] = useState<StudyMaterial[]>(getMyMaterials);
	const [query, setQuery] = useState("");

	// refresca al volver a la pantalla (por si subio algo nuevo).
	useFocusEffect(
		useCallback(() => {
			setMaterials(getMyMaterials());
		}, []),
	);

	const filtered = useMemo(() => {
		const normalized = normalizeText(query);
		if (!normalized) return materials;
		return materials.filter((material) =>
			normalizeText(material.titulo).includes(normalized),
		);
	}, [materials, query]);

	const subjectsCount = useMemo(
		() => new Set(materials.map((material) => material.materia)).size,
		[materials],
	);

	const isSearching = query.trim().length > 0;

	return (
		<View style={styles.section}>
			<Text style={styles.title}>Mis Publicaciones</Text>
			<Text style={styles.subtitle}>
				Gestioná todo el material de estudio que subiste
			</Text>

			<View style={styles.statsRow}>
				<StatCard icon="file-text" value={materials.length} label="Publicaciones" />
				<StatCard icon="book" value={subjectsCount} label="Materias" />
			</View>

			<View style={styles.searchBar}>
				<Feather name="search" size={18} color={colors.textMuted} />
				<TextInput
					value={query}
					onChangeText={setQuery}
					placeholder="Buscar en tus publicaciones..."
					placeholderTextColor={colors.textSoft}
					style={styles.searchInput}
				/>
				{isSearching ? (
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Limpiar búsqueda"
						onPress={() => setQuery("")}
						style={styles.clearButton}
					>
						<Feather name="x" size={16} color={colors.textMuted} />
					</Pressable>
				) : null}
			</View>

			{filtered.length === 0 ? (
				<View style={styles.empty}>
					<Feather
						name={isSearching ? "search" : "inbox"}
						size={28}
						color={colors.textSoft}
					/>
					<Text style={styles.emptyTitle}>
						{isSearching
							? "No se encontraron resultados"
							: "Todavía no subiste ningún material"}
					</Text>
					<Text style={styles.emptyText}>
						{isSearching
							? "Probá ajustando la búsqueda."
							: "Comenzá subiendo tu primer material de estudio."}
					</Text>
					{!isSearching ? (
						<Pressable
							accessibilityRole="button"
							onPress={() => router.push("/create")}
							style={({ pressed }) => [
								styles.emptyButton,
								pressed && styles.pressed,
							]}
						>
							<Feather name="upload-cloud" size={18} color={colors.surface} />
							<Text style={styles.emptyButtonText}>Subir material</Text>
						</Pressable>
					) : null}
				</View>
			) : (
				<View style={styles.list}>
					{filtered.map((material) => (
						<MaterialResultCard key={material.id} material={material} />
					))}
				</View>
			)}
		</View>
	);
}

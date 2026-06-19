import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { useAuth } from "@/src/features/auth/AuthContext";
import { MaterialResultCard } from "@/src/features/materials/components/MaterialResultCard";
import { useGetMaterials } from "@/src/features/materials/hooks/useMaterial";
import { colors } from "@/src/styles/Colors";
import { normalizeText } from "@/src/utils/format";
import { myPublicationsStyles as styles } from "./styles/MyPublications.styles";

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
 * - traer del backend los materiales del usuario autenticado (GET /api/materials?userId=...)
 *   via useGetMaterials (react-query: cache, refetch, invalidacion al crear/editar/borrar).
 * - mostrar estadisticas rapidas, buscador local por titulo y la lista de resultados.
 * - estados de carga / error / vacio.
 */
export function MyPublications() {
	const { user } = useAuth();
	const userId = user?.id;
	const { materials, isLoading, isError, refetch } = useGetMaterials(
		userId !== undefined ? { userId } : {},
	);
	const [query, setQuery] = useState("");

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

			{isLoading ? (
				<View style={styles.empty}>
					<ActivityIndicator color={colors.primary} />
					<Text style={styles.emptyText}>Cargando tus publicaciones...</Text>
				</View>
			) : isError ? (
				<View style={styles.empty}>
					<Feather name="alert-circle" size={28} color={colors.error} />
					<Text style={styles.emptyTitle}>No se pudieron cargar tus publicaciones</Text>
					<Text style={styles.emptyText}>Verificá tu conexión e intentá de nuevo.</Text>
					<Pressable
						accessibilityRole="button"
						onPress={() => refetch()}
						style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}
					>
						<Feather name="refresh-cw" size={18} color={colors.surface} />
						<Text style={styles.emptyButtonText}>Reintentar</Text>
					</Pressable>
				</View>
			) : filtered.length === 0 ? (
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

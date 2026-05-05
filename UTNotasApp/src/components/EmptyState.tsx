import { Feather } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/src/styles/Colors";
import { emptyStateStyles as styles } from "@/src/components/styles/EmptyState.styles";

type FeatherName = keyof typeof Feather.glyphMap;

type Props = {
	icon?: FeatherName;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
};

/**
 * componente de estado vacio generico.
 *
 * responsabilidades:
 * - renderizar icono, titulo, descripcion y accion opcional cuando una lista no tiene resultados.
 * - fail-fast si no recibe titulo: retorna null para evitar contenedor vacio.
 */
export const EmptyState = memo(function EmptyState({
	icon = "inbox",
	title,
	description,
	actionLabel,
	onAction,
}: Props) {
	// sin titulo no renderiza nada — contenedor vacio rompe el layout
	if (!title) return null;

	return (
		<View style={styles.container} accessibilityRole="text">
			<View style={styles.iconWrap} accessibilityElementsHidden>
				<Feather name={icon} size={58} color={colors.textMuted} />
			</View>

			<Text style={styles.title}>{title}</Text>

			{description != null && (
				<Text style={styles.description}>{description}</Text>
			)}

			{actionLabel != null && typeof onAction === "function" && (
				<Pressable
					accessibilityRole="button"
					onPress={onAction}
					style={({ pressed }) => [
						styles.action,
						pressed && styles.actionPressed,
					]}
				>
					<Text style={styles.actionText}>{actionLabel}</Text>
				</Pressable>
			)}
		</View>
	);
});
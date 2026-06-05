import { Feather } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/src/styles/Colors";
import { errorStateStyles as styles } from "@/src/components/styles/ErrorState.styles";

type Props = {
	title: string;
	description?: string;
	retryLabel?: string;
	onRetry?: () => void;
};

/**
 * componente de estado de error para fallos de red o datos.
 *
 * responsabilidades:
 * - mostrar feedback visual cuando un fetch falla.
 * - ofrecer accion de reintento opcional al usuario.
 * - fail-fast si no recibe titulo: retorna null.
 */
export const ErrorState = memo(function ErrorState({
	title,
	description,
	retryLabel,
	onRetry,
}: Props) {
	// sin titulo no renderiza nada
	if (!title) return null;

	return (
		<View
			style={styles.container}
			accessibilityRole="alert"
			accessibilityLiveRegion="assertive"
		>
			<View style={styles.iconWrap} accessibilityElementsHidden>
				<Feather name="alert-circle" size={52} color={colors.error} />
			</View>

			<Text style={styles.title}>{title}</Text>

			{description != null && (
				<Text style={styles.description}>{description}</Text>
			)}

			{retryLabel != null && typeof onRetry === "function" && (
				<Pressable
					accessibilityRole="button"
					onPress={onRetry}
					style={({ pressed }) => [
						styles.retry,
						pressed && styles.retryPressed,
					]}
				>
					<Feather name="refresh-cw" size={16} color={colors.surface} />
					<Text style={styles.retryText}>{retryLabel}</Text>
				</Pressable>
			)}
		</View>
	);
});
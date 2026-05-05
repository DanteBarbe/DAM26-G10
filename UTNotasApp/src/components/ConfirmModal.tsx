import { Feather } from "@expo/vector-icons";
import { memo } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	Text,
	View,
} from "react-native";

import { colors } from "@/src/styles/Colors";
import { confirmModalStyles as styles } from "@/src/components/styles/ConfirmModal.styles";

type Variant = "danger" | "warning";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	variant?: Variant;
	isLoading?: boolean;
};

/**
 * modal de confirmacion para acciones destructivas o de advertencia.
 * 
 * responsabilidades:
 * - previene ejecuciones accidentales exigiendo una validacion explicita del usuario.
 * - gestiona estado de bloqueo de la interfaz mientras se resuelve una mutacion asincrona.
 * - mantiene consistencia visual en advertencias a nivel global del sistema.
 */
export const ConfirmModal = memo(function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	variant = "danger",
	isLoading = false,
}: Props) {
	const isDanger = variant === "danger";
	const confirmLabel = isDanger ? "Eliminar" : "Confirmar";

	// arrays de estilos calculados antes del return (evita estilos inline)
	const iconWrapStyle = isDanger
		? [styles.iconWrap, styles.iconWrapDanger]
		: [styles.iconWrap, styles.iconWrapWarning];

	const btnConfirmStyle = isDanger
		? [styles.btn, styles.btnConfirmDanger]
		: [styles.btn, styles.btnConfirmWarning];

	const iconColor = isDanger ? colors.error : colors.warning;
	const iconName = isDanger ? "trash-2" : "alert-circle";

	return (
		<Modal
			visible={isOpen}
			transparent
			animationType="fade"
			onRequestClose={isLoading ? undefined : onClose}
		>
			<Pressable
				style={styles.backdrop}
				onPress={isLoading ? undefined : onClose}
			>
				<Pressable
					style={styles.dialog}
					onPress={(e) => e.stopPropagation()}
				>
					<View style={iconWrapStyle}>
						<Feather name={iconName} size={28} color={iconColor} />
					</View>

					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>

					<View style={styles.actions}>
						<Pressable
							accessibilityRole="button"
							disabled={isLoading}
							onPress={onClose}
							style={({ pressed }) => [
								styles.btn,
								styles.btnCancel,
								pressed && styles.btnPressed,
								isLoading && styles.btnDisabled,
							]}
						>
							<Text style={styles.btnCancelText}>Cancelar</Text>
						</Pressable>

						<Pressable
							accessibilityRole="button"
							disabled={isLoading}
							onPress={onConfirm}
							style={({ pressed }) => [
								...btnConfirmStyle,
								pressed && styles.btnPressed,
								isLoading && styles.btnDisabled,
							]}
						>
							{isLoading ? (
								<ActivityIndicator size="small" color={colors.surface} />
							) : (
								<Text style={styles.btnConfirmText}>{confirmLabel}</Text>
							)}
						</Pressable>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
});
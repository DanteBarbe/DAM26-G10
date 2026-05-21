import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { dangerConfirmModalStyles as styles } from "./styles/DangerConfirmModal.styles";
import { colors } from "@/src/styles/Colors";

/**
 * modal generico de confirmacion para acciones destructivas.
 *
 * responsabilidades:
 * - renderiza titulo, cuerpo, estado de carga y error inline.
 * - no conoce ningun dominio: materials, usuarios, etc.
 * - receptor pasivo de props — zero logica de negocio.
 * - reutilizable en clq feature q necesite confirmar una accion peligrosa.
 */

type Props = {
	visible: boolean;
	title: string;
	body: string;
	confirmLabel?: string;
	confirmIconName?: keyof typeof Feather.glyphMap;
	isPending: boolean;
	errorMessage: string | null;
	onConfirm: () => void;
	onCancel: () => void;
};

export function DangerConfirmModal({
	visible,
	title,
	body,
	confirmLabel = "Eliminar",
	confirmIconName = "trash-2",
	isPending,
	errorMessage,
	onConfirm,
	onCancel,
}: Props) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
			accessibilityViewIsModal
		>
			<View style={styles.overlay}>
				<View style={styles.sheet}>
					<View style={styles.iconWrap}>
						{/* correccion: se utilizan los tokens del design system nativo */}
						<Feather name="alert-triangle" size={28} color={colors.error} />
					</View>

					<Text style={styles.title}>{title}</Text>
					<Text style={styles.body}>{body}</Text>

					{errorMessage ? (
						<View style={styles.errorBanner}>
							<Feather name="alert-circle" size={14} color={colors.errorText} />
							<Text style={styles.errorText}>{errorMessage}</Text>
						</View>
					) : null}

					<View style={styles.actions}>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Cancelar"
							disabled={isPending}
							onPress={onCancel}
							style={({ pressed }) => [
								styles.cancelButton,
								pressed && styles.pressed,
							]}
						>
							<Text style={styles.cancelButtonText}>Cancelar</Text>
						</Pressable>

						<Pressable
							accessibilityRole="button"
							accessibilityLabel={confirmLabel}
							disabled={isPending}
							onPress={onConfirm}
							style={({ pressed }) => [
								styles.confirmButton,
								isPending && styles.confirmButtonDisabled,
								pressed && !isPending && styles.pressed,
							]}
						>
							{isPending ? (
								<ActivityIndicator size="small" color={colors.surface} />
							) : (
								<>
									<Feather name={confirmIconName} size={15} color={colors.surface} />
									<Text style={styles.confirmButtonText}>{confirmLabel}</Text>
								</>
							)}
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}
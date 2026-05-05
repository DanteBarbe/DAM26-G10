import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const confirmModalStyles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.lg,
	},
	dialog: {
		width: "100%",
		maxWidth: 360,
		backgroundColor: colors.surface,
		borderRadius: 14,
		padding: spacing.lg,
		alignItems: "center",
		gap: spacing.sm,
	},
	iconWrap: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	// variantes del fondo del icono segun variant
	iconWrapDanger: {
		backgroundColor: colors.errorLight,
	},
	iconWrapWarning: {
		backgroundColor: colors.warningLight,
	},
	title: {
		fontSize: typography.h3,
		fontWeight: "700",
		color: colors.text,
		textAlign: "center",
	},
	message: {
		fontSize: typography.body,
		color: colors.textMuted,
		textAlign: "center",
		lineHeight: 22,
	},
	actions: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.md,
		width: "100%",
	},
	btn: {
		flex: 1,
		minHeight: 44,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: spacing.sm,
	},
	btnCancel: {
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
	},
	// variantes del boton confirmar segun variant
	btnConfirmDanger: {
		backgroundColor: colors.error,
	},
	btnConfirmWarning: {
		backgroundColor: colors.warning,
	},
	btnPressed: {
		opacity: 0.75,
	},
	btnDisabled: {
		opacity: 0.5,
	},
	btnCancelText: {
		fontSize: typography.body,
		fontWeight: "600",
		color: colors.textMuted,
	},
	btnConfirmText: {
		fontSize: typography.body,
		fontWeight: "700",
		color: colors.surface,
	},
});
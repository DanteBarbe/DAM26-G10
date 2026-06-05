import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const dangerConfirmModalStyles = StyleSheet.create({
	overlay: {
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.48)",
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 24,
	},

	sheet: {
		backgroundColor: colors.surface,
		borderRadius: 12,
		padding: 24,
		width: "100%",
	},

	iconWrap: {
		alignItems: "center",
		backgroundColor: colors.errorLight,
		borderRadius: 40,
		height: 56,
		justifyContent: "center",
		marginBottom: 16,
		width: 56,
	},

	title: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "800",
		marginBottom: 8,
	},

	body: {
		color: colors.textMuted,
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 16,
	},

	errorBanner: {
		alignItems: "center",
		backgroundColor: colors.errorLight,
		borderRadius: 8,
		flexDirection: "row",
		gap: 8,
		marginBottom: 16,
		padding: 10,
	},

	errorText: {
		color: colors.errorText,
		flex: 1,
		fontSize: 13,
		fontWeight: "600",
	},

	actions: {
		flexDirection: "row",
		gap: 10,
		marginTop: 4,
	},

	cancelButton: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		flex: 1,
		justifyContent: "center",
		minHeight: 44,
	},

	cancelButtonText: {
		color: colors.textSoft,
		fontSize: 14,
		fontWeight: "700",
	},

	confirmButton: {
		alignItems: "center",
		backgroundColor: colors.error,
		borderRadius: 8,
		flex: 1,
		flexDirection: "row",
		gap: 6,
		justifyContent: "center",
		minHeight: 44,
	},

	confirmButtonDisabled: {
		opacity: 0.6,
	},

	confirmButtonText: {
		color: colors.surface,
		fontSize: 14,
		fontWeight: "800",
	},

	pressed: {
		opacity: 0.82,
	},
});
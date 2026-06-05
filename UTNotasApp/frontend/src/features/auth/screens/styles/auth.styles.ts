import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

// estilos compartidos por LoginScreen y SignupScreen.
export const authStyles = StyleSheet.create({
	primaryButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: 10,
		justifyContent: "center",
		marginTop: spacing.xs,
		minHeight: 52,
	},
	primaryButtonPressed: {
		backgroundColor: colors.primaryDark,
	},
	primaryButtonText: {
		color: colors.surface,
		fontSize: 16,
		fontWeight: "700",
	},

	fieldBlock: {
		marginBottom: spacing.md,
	},
	fieldError: {
		color: colors.error,
		fontSize: typography.small,
		marginTop: spacing.xs,
	},

	backButton: {
		alignSelf: "flex-start",
		marginBottom: spacing.md,
		paddingVertical: spacing.xs,
	},
	backButtonText: {
		color: colors.primary,
		fontSize: typography.body,
		fontWeight: "700",
	},

	linkRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		marginTop: spacing.md,
	},
	linkText: {
		color: colors.textMuted,
		fontSize: typography.body,
	},
	link: {
		color: colors.bluePrimary,
		fontSize: typography.body,
		fontWeight: "700",
	},
});

import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const authRequiredStyles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: spacing.lg,
	},
	iconWrap: {
		alignItems: "center",
		backgroundColor: colors.softPrimary,
		borderRadius: 999,
		height: 64,
		justifyContent: "center",
		marginBottom: spacing.md,
		width: 64,
	},
	title: {
		color: colors.text,
		fontSize: typography.h2,
		fontWeight: "800",
		textAlign: "center",
	},
	message: {
		color: colors.textMuted,
		fontSize: typography.body,
		lineHeight: 22,
		marginBottom: spacing.lg,
		marginTop: spacing.sm,
		maxWidth: 320,
		textAlign: "center",
	},
	primaryButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: 10,
		justifyContent: "center",
		maxWidth: 320,
		minHeight: 52,
		width: "100%",
	},
	primaryButtonPressed: {
		backgroundColor: colors.primaryDark,
	},
	primaryButtonText: {
		color: colors.surface,
		fontSize: 16,
		fontWeight: "700",
	},
	secondaryButton: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: spacing.md,
		minHeight: 44,
	},
	secondaryButtonText: {
		color: colors.bluePrimary,
		fontSize: typography.body,
		fontWeight: "700",
	},
});

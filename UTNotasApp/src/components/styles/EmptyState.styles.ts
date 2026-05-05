import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const emptyStateStyles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingVertical: spacing.xl,
		paddingHorizontal: spacing.lg,
		gap: spacing.sm,
	},
	iconWrap: {
		marginBottom: spacing.sm,
	},
	title: {
		fontSize: typography.h3,
		fontWeight: "600",
		color: colors.text,
		textAlign: "center",
	},
	description: {
		fontSize: typography.body,
		color: colors.textMuted,
		textAlign: "center",
		lineHeight: 22,
	},
	action: {
		marginTop: spacing.sm,
		backgroundColor: colors.primary,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		borderRadius: 8,
	},
	actionPressed: {
		opacity: 0.8,
	},
	actionText: {
		color: colors.surface,
		fontSize: typography.body,
		fontWeight: "600",
	},
});
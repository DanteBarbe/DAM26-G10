import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const errorStateStyles = StyleSheet.create({
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
		color: colors.errorText,
		textAlign: "center",
	},
	description: {
		fontSize: typography.body,
		color: colors.textMuted,
		textAlign: "center",
		lineHeight: 22,
	},
	retry: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginTop: spacing.sm,
		backgroundColor: colors.error,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		borderRadius: 8,
	},
	retryPressed: {
		opacity: 0.8,
	},
	retryText: {
		color: colors.surface,
		fontSize: typography.body,
		fontWeight: "600",
	},
});
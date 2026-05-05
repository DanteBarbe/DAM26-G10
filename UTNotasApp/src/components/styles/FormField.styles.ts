import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const formFieldStyles = StyleSheet.create({
	field: {
		marginBottom: spacing.md,
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: spacing.xs,
		gap: spacing.xs,
	},
	label: {
		fontSize: typography.small,
		fontWeight: "600",
		color: colors.text,
		flexShrink: 1,
	},
	errorText: {
		fontSize: typography.small,
		color: colors.error,
		textAlign: "right",
		flexShrink: 1,
	},
});
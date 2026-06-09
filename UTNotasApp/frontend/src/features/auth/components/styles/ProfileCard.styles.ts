import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const profileCardStyles = StyleSheet.create({
	card: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 16,
		borderWidth: 1,
		padding: spacing.lg,
	},
	avatar: {
		alignItems: "center",
		backgroundColor: colors.softPrimary,
		borderRadius: 999,
		height: 88,
		justifyContent: "center",
		marginBottom: spacing.md,
		width: 88,
	},
	name: {
		color: colors.text,
		fontSize: typography.h2,
		fontWeight: "800",
		textAlign: "center",
	},
	username: {
		color: colors.textMuted,
		fontSize: typography.body,
		marginTop: 2,
	},
	career: {
		color: colors.text,
		fontSize: typography.body,
		marginTop: spacing.xs,
		textAlign: "center",
	},
	metaRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: spacing.xs,
		marginTop: spacing.sm,
	},
	metaText: {
		color: colors.textMuted,
		fontSize: typography.small,
	},
	levelBadge: {
		alignItems: "center",
		backgroundColor: colors.softPrimary,
		borderRadius: 999,
		flexDirection: "row",
		gap: spacing.xs,
		marginTop: spacing.md,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	levelText: {
		color: colors.primaryDark,
		fontSize: typography.small,
		fontWeight: "800",
	},
});

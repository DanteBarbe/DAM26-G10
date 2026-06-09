import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const myPublicationsStyles = StyleSheet.create({
	section: {
		marginTop: spacing.lg,
	},
	title: {
		color: colors.text,
		fontSize: typography.h2,
		fontWeight: "800",
	},
	subtitle: {
		color: colors.textMuted,
		fontSize: typography.body,
		marginTop: spacing.xs,
	},
	statsRow: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	statCard: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 12,
		borderWidth: 1,
		flex: 1,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.md,
	},
	statIconWrap: {
		alignItems: "center",
		backgroundColor: colors.softPrimary,
		borderRadius: 999,
		height: 34,
		justifyContent: "center",
		marginBottom: spacing.xs,
		width: 34,
	},
	statValue: {
		color: colors.text,
		fontSize: typography.h3,
		fontWeight: "800",
	},
	statLabel: {
		color: colors.textMuted,
		fontSize: typography.tiny,
		fontWeight: "600",
		textAlign: "center",
	},
	searchBar: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 12,
		borderWidth: 1,
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.md,
		minHeight: 50,
		paddingHorizontal: spacing.md,
	},
	searchInput: {
		color: colors.text,
		flex: 1,
		fontSize: typography.body,
		minHeight: 50,
	},
	clearButton: {
		alignItems: "center",
		height: 32,
		justifyContent: "center",
		width: 32,
	},
	list: {
		gap: spacing.md,
		marginTop: spacing.md,
	},
	empty: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 12,
		borderWidth: 1,
		marginTop: spacing.md,
		padding: spacing.xl,
	},
	emptyTitle: {
		color: colors.text,
		fontSize: typography.h3,
		fontWeight: "700",
		marginTop: spacing.sm,
		textAlign: "center",
	},
	emptyText: {
		color: colors.textMuted,
		fontSize: typography.body,
		marginTop: spacing.xs,
		textAlign: "center",
	},
	emptyButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: 10,
		flexDirection: "row",
		gap: spacing.sm,
		justifyContent: "center",
		marginTop: spacing.md,
		minHeight: 48,
		paddingHorizontal: spacing.lg,
	},
	emptyButtonText: {
		color: colors.surface,
		fontSize: typography.body,
		fontWeight: "700",
	},
	pressed: {
		opacity: 0.85,
	},
});

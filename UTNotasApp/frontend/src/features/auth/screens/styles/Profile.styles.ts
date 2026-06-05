import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const profileStyles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	topBar: {
		alignItems: "center",
		borderBottomColor: colors.border,
		borderBottomWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	backButton: {
		alignItems: "center",
		height: 36,
		justifyContent: "center",
		width: 36,
	},
	topBarTitle: {
		color: colors.text,
		fontSize: typography.h3,
		fontWeight: "700",
	},
	content: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: spacing.lg,
	},
	avatar: {
		alignItems: "center",
		backgroundColor: colors.softPrimary,
		borderRadius: 999,
		height: 84,
		justifyContent: "center",
		marginBottom: spacing.md,
		width: 84,
	},
	name: {
		color: colors.text,
		fontSize: typography.h2,
		fontWeight: "800",
		textAlign: "center",
	},
	email: {
		color: colors.textMuted,
		fontSize: typography.body,
		marginTop: spacing.xs,
		textAlign: "center",
	},
	subtitle: {
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
		marginTop: spacing.lg,
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
	dangerButton: {
		alignItems: "center",
		backgroundColor: colors.errorLight,
		borderRadius: 10,
		flexDirection: "row",
		gap: spacing.sm,
		justifyContent: "center",
		marginTop: spacing.lg,
		maxWidth: 320,
		minHeight: 52,
		width: "100%",
	},
	dangerButtonText: {
		color: colors.error,
		fontSize: 16,
		fontWeight: "700",
	},
	pressed: {
		opacity: 0.85,
	},
});

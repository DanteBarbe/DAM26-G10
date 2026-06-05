import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const authLayoutStyles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	flex: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		padding: spacing.lg,
	},
	card: {
		alignSelf: "center",
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 20,
		borderWidth: 1,
		elevation: 6,
		maxWidth: 420,
		padding: spacing.lg,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 24,
		width: "100%",
	},
	header: {
		alignItems: "center",
		marginBottom: spacing.lg,
	},
	logo: {
		height: 56,
		marginBottom: spacing.sm,
		width: 56,
	},
	title: {
		color: colors.text,
		fontSize: typography.h2,
		fontWeight: "800",
		textAlign: "center",
	},
	subtitle: {
		color: colors.textMuted,
		fontSize: typography.body,
		marginTop: spacing.xs,
		textAlign: "center",
	},
});

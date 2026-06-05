import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/src/styles/Colors";

export const authTextFieldStyles = StyleSheet.create({
	field: {
		marginBottom: spacing.md,
	},
	inputWrap: {
		justifyContent: "center",
		position: "relative",
	},
	input: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 10,
		borderWidth: 1,
		color: colors.text,
		fontSize: typography.body,
		minHeight: 50,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	inputWithIcon: {
		paddingRight: 46,
	},
	inputError: {
		borderColor: colors.error,
	},
	eyeButton: {
		alignItems: "center",
		bottom: 0,
		justifyContent: "center",
		position: "absolute",
		right: 4,
		top: 0,
		width: 44,
	},
	errorText: {
		color: colors.error,
		fontSize: typography.small,
		marginTop: spacing.xs,
	},
});

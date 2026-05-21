import { StyleSheet } from "react-native";
import { colors } from "./Colors";

export const GlobalStyles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},

	keyboardView: {
		flex: 1,
	},

	content: {
		padding: 18,
		paddingBottom: 36,
	},

	input: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		color: colors.text,
		fontSize: 15,
		minHeight: 48,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},

	submitButton: {
		alignItems: "center",
		backgroundColor: colors.bluePrimary,
		borderRadius: 8,
		minHeight: 52,
		justifyContent: "center",
	},

	submitButtonText: {
		color: colors.surface,
		fontSize: 16,
		fontWeight: "700",
	},
});
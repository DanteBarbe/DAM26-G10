import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const materialDetailSkeletonStyles = StyleSheet.create({
	headerWrap: {
		gap: 8,
		marginBottom: 18,
	},

	infoCard: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		padding: 16,
	},

	infoTopRow: {
		alignItems: "flex-start",
		flexDirection: "row",
		gap: 10,
	},

	titleWrap: {
		flex: 1,
		gap: 8,
		minWidth: 0,
	},

	descriptionWrap: {
		gap: 8,
		marginTop: 14,
	},

	badgeRow: {
		flexDirection: "row",
		gap: 8,
		marginTop: 14,
	},

	metaGrid: {
		gap: 10,
		marginTop: 16,
	},

	infoItem: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		flexDirection: "row",
		gap: 10,
		minHeight: 58,
		padding: 11,
	},

	infoTextWrap: {
		flex: 1,
		gap: 6,
		minWidth: 0,
	},

	previewCard: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		marginTop: 14,
		overflow: "hidden",
	},

	previewHeader: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderBottomColor: colors.border,
		borderBottomWidth: 1,
		flexDirection: "row",
		gap: 10,
		padding: 12,
	},

	previewBody: {
		alignItems: "center",
		backgroundColor: colors.surface,
		minHeight: 360,
		padding: 18,
	},
});
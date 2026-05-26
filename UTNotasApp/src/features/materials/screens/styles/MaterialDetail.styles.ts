import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const detailStyles = StyleSheet.create({
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
		minWidth: 0,
	},
	ownerActions: {
		flexDirection: "row",
		gap: 8,
	},
	materialTitle: {
		color: colors.text,
		fontSize: 22,
		fontWeight: "800",
		lineHeight: 28,
	},
	materialMeta: {
		color: colors.textMuted,
		fontSize: 13,
		fontWeight: "600",
		marginTop: 6,
	},
	levelBadge: {
		backgroundColor: colors.softPrimary,
		borderRadius: 8,
		paddingHorizontal: 9,
		paddingVertical: 7,
	},
	levelBadgeText: {
		color: colors.primaryDark,
		fontSize: 12,
		fontWeight: "800",
	},
	description: {
		// Modificado: reemplazo de color hardcodeado
		color: colors.text,
		fontSize: 15,
		lineHeight: 22,
		marginTop: 14,
	},
	metaGrid: {
		gap: 10,
		marginTop: 16,
	},
	infoItem: {
		alignItems: "center",
		// Modificado: reemplazo de colores hardcodeados
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
		minWidth: 0,
	},
	infoLabel: {
		color: colors.textSoft,
		fontSize: 12,
		fontWeight: "800",
	},
	infoValue: {
		color: colors.text,
		fontSize: 14,
		fontWeight: "700",
		marginTop: 2,
	},
	actionsRow: {
		alignItems: "center",
		// Modificado: reemplazo de color hardcodeado
		borderTopColor: colors.border,
		borderTopWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
		paddingTop: 14,
	},
	fileSummary: {
		alignItems: "center",
		// Modificado: reemplazo de colores hardcodeados
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		flexDirection: "row",
		gap: 8,
		minHeight: 42,
		paddingHorizontal: 12,
	},
	fileSummaryText: {
		color: colors.primaryDark,
		flex: 1,
		fontSize: 14,
		fontWeight: "800",
	},
	previewCard: {
		backgroundColor: colors.surface,
		// Modificado: reemplazo de color hardcodeado
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		marginTop: 14,
		overflow: "hidden",
	},
	previewHeader: {
		alignItems: "center",
		// Modificado: reemplazo de colores hardcodeados
		backgroundColor: colors.surface,
		borderBottomColor: colors.border,
		borderBottomWidth: 1,
		flexDirection: "row",
		gap: 10,
		padding: 12,
	},
	fileNameWrap: {
		flex: 1,
		minWidth: 0,
	},
	fileName: {
		color: colors.text,
		fontSize: 14,
		fontWeight: "800",
	},
	fileMeta: {
		color: colors.textMuted,
		fontSize: 12,
		fontWeight: "600",
		marginTop: 2,
	},
	openButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: 8,
		height: 38,
		justifyContent: "center",
		width: 38,
	},
	openButtonDisabled: {
		opacity: 0.5,
	},
	previewBody: {
		alignItems: "center",
		// Modificado: reemplazo de color hardcodeado
		backgroundColor: colors.surface,
		minHeight: 360,
		padding: 18,
	},
	documentSheet: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		minHeight: 290,
		overflow: "hidden",
		padding: 22,
		width: "82%",
	},
	documentLineLong: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		height: 16,
		width: "78%",
	},
	documentLine: {
		backgroundColor: colors.border,
		borderRadius: 8,
		height: 10,
		marginTop: 16,
		width: "90%",
	},
	documentLineShort: {
		backgroundColor: colors.border,
		borderRadius: 8,
		height: 10,
		marginTop: 9,
		width: "58%",
	},
	documentDivider: {
		// Modificado: reemplazo de color hardcodeado
		backgroundColor: colors.border,
		height: 1,
		marginVertical: 20,
	},
	documentParagraph: {
		// Modificado: reemplazo de color hardcodeado
		backgroundColor: colors.border,
		borderRadius: 8,
		height: 92,
	},
	documentParagraphSmall: {
		// Modificado: reemplazo de color hardcodeado
		backgroundColor: colors.border,
		borderRadius: 8,
		height: 58,
		marginTop: 14,
		width: "72%",
	},
	documentStamp: {
		alignItems: "center",
		backgroundColor: colors.softSecondary,
		// Modificado: reemplazo de color hardcodeado
		borderColor: colors.border,
		borderRadius: 8,
		borderWidth: 1,
		bottom: 18,
		justifyContent: "center",
		paddingHorizontal: 10,
		paddingVertical: 7,
		position: "absolute",
		right: 18,
	},
	documentStampText: {
		color: colors.secondary,
		fontSize: 12,
		fontWeight: "900",
	},
	previewHint: {
		color: colors.textSoft,
		fontSize: 12,
		fontWeight: "700",
		marginTop: 12,
	},
	notFound: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: 22,
	},
	notFoundTitle: {
		color: colors.text,
		fontSize: 20,
		fontWeight: "800",
		marginTop: 14,
		textAlign: "center",
	},
	badgeRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginTop: 14,
	},
	badge: {
		borderRadius: 8,
		fontSize: 13,
		fontWeight: "800",
		overflow: "hidden",
		paddingHorizontal: 10,
		paddingVertical: 7,
	},
	badgeType: {
		backgroundColor: colors.softSecondary,
		color: colors.secondary,
	},
	badgeCareer: {
		backgroundColor: colors.softPrimary,
		color: colors.primaryDark,
	},
	badgeNeutral: {
		// Modificado: reemplazo de colores hardcodeados
		backgroundColor: colors.border,
		color: colors.text,
	},
	primaryButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: 8,
		flexDirection: "row",
		gap: 7,
		justifyContent: "center",
		minHeight: 42,
		paddingHorizontal: 13,
	},
	primaryButtonText: {
		color: colors.surface,
		fontSize: 14,
		fontWeight: "800",
	},
	centered: {
	alignItems: "center",
	flex: 1,
	justifyContent: "center",
},
});

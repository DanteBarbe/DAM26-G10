import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const MaterialResultCardStyles = StyleSheet.create({
  // CARD
  card: {
    backgroundColor: colors.surface,
    borderColor: "rgba(47, 111, 78, 0.14)",
    borderLeftColor: colors.primary,
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },

  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },

  cardTitleWrap: {
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },

  cardMeta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
  },

  filePill: {
    alignItems: "center",
    backgroundColor: "rgba(47, 111, 78, 0.08)",
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    width: 36,
  },

  description: {
    color: "#403a32",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },

  // BADGES
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
    backgroundColor: "#f0eee8",
    color: "#403a32",
  },

  // FOOTER
  cardFooter: {
    alignItems: "center",
    borderTopColor: "rgba(47, 111, 78, 0.14)",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
  },

  fileName: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    marginRight: 10,
  },

  // BUTTON
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
});
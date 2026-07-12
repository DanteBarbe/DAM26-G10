import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const materialActionBarStyles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
  },
  wrapCompact: {
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  voteGroup: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  iconButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  iconButtonDanger: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  iconButtonMuted: {
    backgroundColor: colors.warningLight,
    opacity: 0.75,
  },
  score: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    minWidth: 24,
    textAlign: "center",
  },
});

import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const emptyMaterialStateStyles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 48,
    gap: 10,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
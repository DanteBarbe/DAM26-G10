import { StyleSheet } from "react-native";

import { colors } from "@/src/styles/Colors";

export const filterChipStyles = StyleSheet.create({
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: "rgba(47, 111, 78, 0.16)",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: 13,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: "#403a32",
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: colors.surface,
  },
});

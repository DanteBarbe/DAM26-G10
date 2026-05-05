import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const MaterialScreenHeaderStyles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  headerButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },

  headerText: {
    flex: 1,
  },

  brand: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "800",
  },

  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 0,
  },
});
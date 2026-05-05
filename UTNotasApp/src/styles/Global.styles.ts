import { StyleSheet } from "react-native";
import { colors } from "./Colors";

export const GlobalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef4fb",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    padding: 18,
    paddingBottom: 36,
  },

  input: {
    backgroundColor: "#f8fbfe",
    borderColor: "#cdd9e5",
    borderRadius: 8,
    borderWidth: 1,
    color: "#263747",
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
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
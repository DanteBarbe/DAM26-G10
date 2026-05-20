import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  selectButton: {
    alignItems: "center",
    backgroundColor: "#f8fbfe",
    borderColor: "#cdd9e5",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 12,
  },

  selectButtonText: {
    color: "#263747",
    flex: 1,
    fontSize: 15,
  },

  pressedInput: {
    backgroundColor: "#eef6ff",
  },
});
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(16, 24, 40, 0.42)",
    flex: 1,
    justifyContent: "center",
    padding: 18,
  },

  sheet: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    maxHeight: "78%",
    padding: 14,
    width: "100%",
  },

  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sheetTitle: {
    color: "#143a5f",
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },

  sheetScroll: {
    maxHeight: 430,
  },

  optionItem: {
    alignItems: "center",
    borderBottomColor: "#edf1f6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },

  optionItemSelected: {
    backgroundColor: "#eef6ff",
  },

  optionText: {
    color: "#263747",
    flex: 1,
    fontSize: 15,
    paddingRight: 10,
  },

  optionTextSelected: {
    color: "#1f63b5",
    fontWeight: "700",
  },

  emptySheetText: {
    color: "#667085",
    fontSize: 14,
    paddingVertical: 18,
    textAlign: "center",
  },

  pressedSuggestion: {
    backgroundColor: "#eef6ff",
  },
});
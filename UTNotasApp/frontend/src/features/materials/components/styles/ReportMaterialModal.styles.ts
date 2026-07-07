import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/Colors";

export const reportMaterialModalStyles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.warningLight,
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
  reasonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  reasonButton: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  reasonButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reasonText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "800",
  },
  reasonTextSelected: {
    color: colors.surface,
  },
  textArea: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 14,
    minHeight: 96,
    padding: 12,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
  },
  cancelText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "800",
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 44,
  },
  disabledButton: {
    opacity: 0.65,
  },
  submitText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "900",
  },
});

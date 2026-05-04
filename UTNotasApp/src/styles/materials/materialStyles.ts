import { StyleSheet } from "react-native";

export const colors = {
  background: "#f5f7f2",
  surface: "#ffffff",
  text: "#28241e",
  textMuted: "#635d52",
  textSoft: "#746c61",
  border: "#ddd7cb",
  primary: "#2f6f4e",
  primaryDark: "#214f37",
  secondary: "#7b5f43",
  softPrimary: "rgba(47, 111, 78, 0.12)",
  softSecondary: "rgba(123, 95, 67, 0.12)",
};

export const sharedStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 34,
  },
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

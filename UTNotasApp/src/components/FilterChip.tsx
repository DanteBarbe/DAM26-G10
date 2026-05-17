import { Pressable, Text } from "react-native";

import { filterChipStyles as styles } from "@/src/components/styles/FilterChip.styles";

export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.filterChip, active && styles.filterChipActive]}
    >
      <Text
        style={[styles.filterText, active && styles.filterTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

import { Pressable, Text } from "react-native";

import { searchStyles } from "@/src/features/materials/screens/styles/MaterialSearch.styles";

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
      style={[searchStyles.filterChip, active && searchStyles.filterChipActive]}
    >
      <Text
        style={[searchStyles.filterText, active && searchStyles.filterTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

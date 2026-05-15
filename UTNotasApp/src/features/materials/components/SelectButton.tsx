import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";

export function SelectButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectButton,
        pressed && styles.pressedInput,
      ]}
    >
      <Feather name={icon} size={18} color="#1f63b5" />
      <Text style={styles.selectButtonText} numberOfLines={1}>
        {label}
      </Text>
      <Feather name="chevron-down" size={18} color="#667085" />
    </Pressable>
  );
}

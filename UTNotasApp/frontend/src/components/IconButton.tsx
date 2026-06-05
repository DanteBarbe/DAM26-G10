import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

import { styles } from "@/src/components/styles/IconButton.styles";

export function IconButton({
  icon,
  onPress,
  disabled,
  danger,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        danger && styles.iconButtonDanger,
        disabled && styles.iconButtonDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Feather
        name={icon}
        size={16}
        color={disabled ? "#aab2c0" : danger ? "#a43f3f" : "#33526f"}
      />
    </Pressable>
  );
}

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { colors, sharedStyles } from "@/src/styles/materials/materialStyles";

export function MaterialScreenHeader({
  title,
  rightHref,
  rightIcon = "search",
}: {
  title: string;
  rightHref?: string;
  rightIcon?: keyof typeof Feather.glyphMap;
}) {
  const rightButton = (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (rightHref) router.push(rightHref as never);
      }}
      style={sharedStyles.headerButton}
    >
      <Feather name={rightIcon} size={22} color={colors.primaryDark} />
    </Pressable>
  );

  return (
    <View style={sharedStyles.header}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={sharedStyles.headerButton}
      >
        <Feather name="arrow-left" size={22} color={colors.primaryDark} />
      </Pressable>
      <View style={sharedStyles.headerText}>
        <Text style={sharedStyles.brand}>UTNotas</Text>
        <Text style={sharedStyles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
      {rightButton}
    </View>
  );
}

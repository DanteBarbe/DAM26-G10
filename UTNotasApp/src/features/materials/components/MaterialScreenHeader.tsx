import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { MaterialScreenHeaderStyles } from "@/src/features/materials/components/styles/MaterialScreenHeader.styles";
import { colors } from "@/src/styles/Colors";

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
      style={MaterialScreenHeaderStyles.headerButton}
    >
      <Feather name={rightIcon} size={22} color={colors.primaryDark} />
    </Pressable>
  );

  return (
    <View style={MaterialScreenHeaderStyles.header}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={MaterialScreenHeaderStyles.headerButton}
      >
        <Feather name="arrow-left" size={22} color={colors.primaryDark} />
      </Pressable>
      <View style={MaterialScreenHeaderStyles.headerText}>
        <Text style={MaterialScreenHeaderStyles.brand}>UTNotas</Text>
        <Text style={MaterialScreenHeaderStyles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
      {rightButton}
    </View>
  );
}

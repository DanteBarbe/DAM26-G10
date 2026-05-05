import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { detailStyles } from "@/src/features/materials/screens/styles/MaterialDetail.styles";

export function MaterialInfoItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={detailStyles.infoItem}>
      <Feather name={icon} size={17} color="#2f6f4e" />
      <View style={detailStyles.infoTextWrap}>
        <Text style={detailStyles.infoLabel}>{label}</Text>
        <Text style={detailStyles.infoValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

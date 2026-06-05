import { Text, View } from "react-native";
import { MaterialScreenHeaderStyles } from "@/src/features/materials/components/styles/MaterialScreenHeader.styles";

export function MaterialScreenHeader({
  title,
}: {
  title: string;
}) {

  return (
    <View style={MaterialScreenHeaderStyles.header}>

      <View style={MaterialScreenHeaderStyles.headerText}>
        <Text style={MaterialScreenHeaderStyles.brand}>UTNotas</Text>
        <Text style={MaterialScreenHeaderStyles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
}

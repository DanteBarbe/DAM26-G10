import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { emptyMaterialStateStyles } from "@/src/features/materials/components/styles/EmptyMaterialState.styles";

export function EmptyMaterialsState() {
  return (
    <View style={emptyMaterialStateStyles.emptyState}>
      <Feather name="search" size={58} color="#9a9284" />
      <Text style={emptyMaterialStateStyles.emptyTitle}>No se encontraron resultados</Text>
      <Text style={emptyMaterialStateStyles.emptyText}>
        Proba ajustar la busqueda o quitar algun filtro.
      </Text>
    </View>
  );
}
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { searchStyles } from "@/src/styles/materials/searchStyles";

export function EmptyMaterialsState() {
  return (
    <View style={searchStyles.emptyState}>
      <Feather name="search" size={58} color="#9a9284" />
      <Text style={searchStyles.emptyTitle}>No se encontraron resultados</Text>
      <Text style={searchStyles.emptyText}>
        Proba ajustar la busqueda o quitar algun filtro.
      </Text>
    </View>
  );
}

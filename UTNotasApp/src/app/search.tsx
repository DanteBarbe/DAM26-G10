import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterChip } from "@/src/components/FilterChip";
import { MaterialResultCard } from "@/src/features/materials/components/MaterialResultCard";
import { MaterialScreenHeader } from "@/src/features/materials/components/MaterialScreenHeader";
import { materialTypes } from "@/src/features/materials/data/materialOptions";
import { searchStyles } from "@/src/features/materials/screens/styles/MaterialSearch.styles";
import { EmptyMaterialsState } from "@/src/features/materials/components/EmptyMaterialState";
import { getAllMaterials } from "@/src/features/materials/utils/materialHelpers";
import { GlobalStyles } from "@/src/styles/Global.styles";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";
import { normalizeText } from "@/src/utils/format";

export default function MaterialSearchScreen() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<StudyMaterial["tipo"] | "TODOS">(
    "TODOS",
  );

  const materials = useMemo(getAllMaterials, []);

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return materials.filter((material) => {
      const matchesText =
        !normalizedQuery ||
        normalizeText(
          `${material.titulo} ${material.descripcion} ${material.materia} ${material.carrera}`,
        ).includes(normalizedQuery);
      const matchesType =
        activeType === "TODOS" || material.tipo === activeType;

      return matchesText && matchesType;
    });
  }, [activeType, materials, query]);

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={GlobalStyles.content}>
        <MaterialScreenHeader title="Buscar materiales" rightHref="/" rightIcon="upload-cloud" />

        <View style={searchStyles.searchBar}>
          <Feather name="search" size={20} color="#746c61" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Materia, titulo o carrera"
            placeholderTextColor="#9a9284"
            style={searchStyles.searchInput}
          />
          {query ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setQuery("")}
              style={searchStyles.clearButton}
            >
              <Feather name="x" size={18} color="#746c61" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={searchStyles.filterRow}
        >
          <FilterChip
            label="Todos"
            active={activeType === "TODOS"}
            onPress={() => setActiveType("TODOS")}
          />
          {materialTypes.map((type) => (
            <FilterChip
              key={type.value}
              label={type.label}
              active={activeType === type.value}
              onPress={() => setActiveType(type.value)}
            />
          ))}
        </ScrollView>

        <View style={searchStyles.resultSummary}>
          <Text style={searchStyles.resultCount}>
            {filteredMaterials.length} resultados
          </Text>
        </View>

        {filteredMaterials.length === 0 ? (
          <EmptyMaterialsState />
        ) : (
          <View style={searchStyles.cardList}>
            {filteredMaterials.map((material) => (
              <MaterialResultCard key={material.id} material={material} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

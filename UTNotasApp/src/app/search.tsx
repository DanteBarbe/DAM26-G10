import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyMaterialsState } from "@/src/components/materials/EmptyMaterialsState";
import { FilterChip } from "@/src/components/materials/FilterChip";
import { MaterialResultCard } from "@/src/components/materials/MaterialResultCard";
import { MaterialScreenHeader } from "@/src/components/materials/MaterialScreenHeader";
import {
  mapCreatedMaterialToStudyMaterial,
  mockMaterials,
} from "@/src/data/mockMaterials";
import { materialTypes } from "@/src/data/materialOptions";
import { sharedStyles } from "@/src/styles/materials/materialStyles";
import { searchStyles } from "@/src/styles/materials/searchStyles";
import type { StudyMaterial } from "@/src/types/materials";
import { getCreatedMaterials } from "@/src/utils/createdMaterialsStore";

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getAllMaterials = () => [
  ...getCreatedMaterials().map(mapCreatedMaterialToStudyMaterial),
  ...mockMaterials,
];

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
    <SafeAreaView style={sharedStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={sharedStyles.content}>
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

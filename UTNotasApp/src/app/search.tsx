import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialResultCard } from "@/src/features/materials/components/MaterialResultCard";
import { MaterialScreenHeader } from "@/src/features/materials/components/MaterialScreenHeader";
import { FilterModal, type ActiveFilters } from "@/src/features/materials/components/FilterModal";
import { materialTypes } from "@/src/features/materials/data/materialOptions";
import { searchStyles } from "@/src/features/materials/screens/styles/MaterialSearch.styles";
import { EmptyMaterialsState } from "@/src/features/materials/components/EmptyMaterialState";
import { getAllMaterials } from "@/src/features/materials/utils/materialHelpers";
import { GlobalStyles } from "@/src/styles/Global.styles";
import { normalizeText } from "@/src/utils/format";

type ActiveChip = { key: keyof ActiveFilters; label: string };

export default function MaterialSearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(q ?? "");
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const materials = useMemo(getAllMaterials, []);

  const activeFilterCount = [
    filters.tipo,
    filters.materiaId,
    filters.anioCursada,
    filters.comision,
  ].filter(Boolean).length;

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return materials.filter((material) => {
      const matchesTitle =
        !normalizedQuery || normalizeText(material.titulo).includes(normalizedQuery);
      const matchesTipo = !filters.tipo || material.tipo === filters.tipo;
      const matchesMateria =
        !filters.materia || material.materia === filters.materia;
      const matchesAnio =
        !filters.anioCursada ||
        String(material.anioCursada ?? "") === filters.anioCursada;
      const matchesComision =
        !filters.comision ||
        normalizeText(material.comision ?? "").includes(
          normalizeText(filters.comision),
        );

      return matchesTitle && matchesTipo && matchesMateria && matchesAnio && matchesComision;
    });
  }, [filters, materials, query]);

  const removeFilter = (key: keyof ActiveFilters) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      if (key === "materia") delete next.materiaId;
      if (key === "materiaId") delete next.materia;
      return next;
    });
  };

  const activeChips: ActiveChip[] = [];
  if (filters.tipo) {
    const label = materialTypes.find((t) => t.value === filters.tipo)?.label ?? filters.tipo;
    activeChips.push({ key: "tipo", label });
  }
  if (filters.materia) {
    activeChips.push({ key: "materia", label: filters.materia });
  }
  if (filters.anioCursada) {
    activeChips.push({ key: "anioCursada", label: `Año: ${filters.anioCursada}` });
  }
  if (filters.comision) {
    activeChips.push({ key: "comision", label: `Com: ${filters.comision}` });
  }

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={GlobalStyles.content}>
        <MaterialScreenHeader title="Buscar materiales" />

        <View style={searchStyles.searchRow}>
          <View style={[searchStyles.searchBar, { flex: 1 }]}>
            <Feather name="search" size={20} color="#746c61" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por título..."
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

          <Pressable
            accessibilityRole="button"
            onPress={() => setShowFilters(true)}
            style={[
              searchStyles.filterButton,
              activeFilterCount > 0 && searchStyles.filterButtonActive,
            ]}
          >
            <Feather
              name="sliders"
              size={20}
              color={activeFilterCount > 0 ? "#ffffff" : "#746c61"}
            />
            {activeFilterCount > 0 && (
              <View style={searchStyles.filterBadge}>
                <Text style={searchStyles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {activeChips.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={searchStyles.activeChipsRow}
          >
            {activeChips.map((chip) => (
              <Pressable
                key={chip.key}
                accessibilityRole="button"
                onPress={() => removeFilter(chip.key)}
                style={searchStyles.activeChip}
              >
                <Text style={searchStyles.activeChipText}>{chip.label}</Text>
                <Feather name="x" size={12} color="#ffffff" />
              </Pressable>
            ))}
          </ScrollView>
        )}

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

      <FilterModal
        visible={showFilters}
        initialFilters={filters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
      />
    </SafeAreaView>
  );
}

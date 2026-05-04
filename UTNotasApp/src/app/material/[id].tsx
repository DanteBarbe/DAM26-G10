import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialInfoItem } from "@/src/components/materials/MaterialInfoItem";
import { MaterialPreviewCard } from "@/src/components/materials/MaterialPreviewCard";
import { MaterialScreenHeader } from "@/src/components/materials/MaterialScreenHeader";
import {
  mapCreatedMaterialToStudyMaterial,
  mockMaterials,
} from "@/src/data/mockMaterials";
import { materialTypes } from "@/src/data/materialOptions";
import { detailStyles } from "@/src/styles/materials/materialDetailStyles";
import { sharedStyles } from "@/src/styles/materials/materialStyles";
import type { StudyMaterial } from "@/src/types/materials";
import { getCreatedMaterials } from "@/src/utils/createdMaterialsStore";

const getTypeLabel = (value: StudyMaterial["tipo"]) =>
  materialTypes.find((type) => type.value === value)?.label ?? "Material";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const getMaterials = () => [
  ...getCreatedMaterials().map(mapCreatedMaterialToStudyMaterial),
  ...mockMaterials,
];

export default function MaterialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const material = useMemo(() => {
    return getMaterials().find((item) => String(item.id) === String(id));
  }, [id]);

  if (!material) {
    return (
      <SafeAreaView style={sharedStyles.safeArea}>
        <StatusBar style="dark" />
        <View style={detailStyles.notFound}>
          <Feather name="file-minus" size={56} color="#9a9284" />
          <Text style={detailStyles.notFoundTitle}>Material no encontrado</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/search" as never)}
            style={sharedStyles.primaryButton}
          >
            <Text style={sharedStyles.primaryButtonText}>
              Volver a busqueda
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={sharedStyles.content}>
        <MaterialScreenHeader
          title="Ver material"
          rightHref="/search"
          rightIcon="search"
        />

        <View style={detailStyles.infoCard}>
          <View style={detailStyles.infoTopRow}>
            <View style={detailStyles.titleWrap}>
              <Text style={detailStyles.materialTitle}>{material.titulo}</Text>
              <Text style={detailStyles.materialMeta}>
                Subido por @{material.author.username} -{" "}
                {formatDate(material.createdAt)}
              </Text>
            </View>
            <View style={detailStyles.levelBadge}>
              <Text style={detailStyles.levelBadgeText}>
                {material.author.level}
              </Text>
            </View>
          </View>

          <Text style={detailStyles.description}>{material.descripcion}</Text>

          <View style={sharedStyles.badgeRow}>
            <Text style={[sharedStyles.badge, sharedStyles.badgeType]}>
              {getTypeLabel(material.tipo)}
            </Text>
            <Text style={[sharedStyles.badge, sharedStyles.badgeCareer]}>
              {material.materia}
            </Text>
            {material.numeroParcial ? (
              <Text style={[sharedStyles.badge, sharedStyles.badgeNeutral]}>
                Parcial {material.numeroParcial}
              </Text>
            ) : null}
          </View>

          <View style={detailStyles.metaGrid}>
            <MaterialInfoItem
              icon="book-open"
              label="Carrera"
              value={material.carrera}
            />
            <MaterialInfoItem
              icon="users"
              label="Comision"
              value={material.comision || "Sin especificar"}
            />
            <MaterialInfoItem
              icon="calendar"
              label="Ano"
              value={material.anioCursada?.toString() || "Sin especificar"}
            />
          </View>

          <View style={detailStyles.actionsRow}>
            <View style={detailStyles.fileSummary}>
              <Feather name="file" size={17} color="#2f6f4e" />
              <Text style={detailStyles.fileSummaryText} numberOfLines={1}>
                Material disponible para consulta
              </Text>
            </View>
          </View>
        </View>

        <MaterialPreviewCard material={material} />
      </ScrollView>
    </SafeAreaView>
  );
}

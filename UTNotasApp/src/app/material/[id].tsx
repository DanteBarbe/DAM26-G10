import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialInfoItem } from "@/src/features/materials/components/MaterialInfoItem";
import { MaterialPreviewCard } from "@/src/features/materials/components/MaterialPreviewCard";
import { MaterialScreenHeader } from "@/src/features/materials/components/MaterialScreenHeader";
import { detailStyles } from "@/src/features/materials/screens/styles/MaterialDetail.styles";
import { getAllMaterials, getTypeLabel, formatDate } from "@/src/features/materials/utils/materialHelpers";
import { GlobalStyles } from "@/src/styles/Global.styles";

export default function MaterialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const material = useMemo(() => {
    return getAllMaterials().find((item) => String(item.id) === String(id));
  }, [id]);

  if (!material) {
    return (
      <SafeAreaView style={GlobalStyles.safeArea}>
        <StatusBar style="dark" />
        <View style={detailStyles.notFound}>
          <Feather name="file-minus" size={56} color="#9a9284" />
          <Text style={detailStyles.notFoundTitle}>Material no encontrado</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/search")}
            style={detailStyles.primaryButton}
          >
            <Text style={detailStyles.primaryButtonText}>
              Volver a busqueda
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={GlobalStyles.content}>
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
          </View>

          <Text style={detailStyles.description}>{material.descripcion}</Text>

          <View style={detailStyles.badgeRow}>
            <Text style={[detailStyles.badge, detailStyles.badgeType]}>
              {getTypeLabel(material.tipo)}
            </Text>
            <Text style={[detailStyles.badge, detailStyles.badgeCareer]}>
              {material.materia}
            </Text>
            {material.numeroParcial ? (
              <Text style={[detailStyles.badge, detailStyles.badgeNeutral]}>
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
              label="Año"
              value={material.anioCursada?.toString() || "Sin especificar"}
            />
          </View>
        </View>

        <MaterialPreviewCard material={material} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { materialTypes } from "@/src/data/materialOptions";
import type { StudyMaterial } from "@/src/types/materials";

import { sharedStyles } from "@/src/styles/materials/materialStyles";
import { searchStyles } from "@/src/styles/materials/searchStyles";

const getTypeLabel = (value: StudyMaterial["tipo"]) =>
  materialTypes.find((type) => type.value === value)?.label ?? "Material";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export function MaterialResultCard({ material }: { material: StudyMaterial }) {
  return (
    <View style={searchStyles.card}>
      <View style={searchStyles.cardHeader}>
        <View style={searchStyles.cardTitleWrap}>
          <Text style={searchStyles.cardTitle}>{material.titulo}</Text>
          <Text style={searchStyles.cardMeta}>
            @{material.author.username} - {formatDate(material.createdAt)}
          </Text>
        </View>
        <View style={searchStyles.filePill}>
          <Feather name="file-text" size={16} color="#214f37" />
        </View>
      </View>

      <Text style={searchStyles.description} numberOfLines={3}>
        {material.descripcion}
      </Text>

      <View style={sharedStyles.badgeRow}>
        <Text style={[sharedStyles.badge, sharedStyles.badgeType]}>
          {getTypeLabel(material.tipo)}
        </Text>
        <Text style={[sharedStyles.badge, sharedStyles.badgeCareer]}>
          {material.materia}
        </Text>
      </View>

      <View style={searchStyles.cardFooter}>
        <Text style={searchStyles.fileName} numberOfLines={1}>
          {material.archivo.name}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/material/${material.id}` as never)}
          style={sharedStyles.primaryButton}
        >
          <Feather name="eye" size={17} color="#ffffff" />
          <Text style={sharedStyles.primaryButtonText}>Ver material</Text>
        </Pressable>
      </View>
    </View>
  );
}

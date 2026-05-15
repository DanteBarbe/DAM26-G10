import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { StudyMaterial } from "@/src/features/materials/types/materials.types";
import { getTypeLabel, formatDate } from "@/src/features/materials/utils/materialHelpers";
import { MaterialResultCardStyles } from "@/src/features/materials/components/styles/MaterialResultCard.styles";

export function MaterialResultCard({ material }: { material: StudyMaterial }) {
  return (
    <View style={MaterialResultCardStyles.card}>
      <View style={MaterialResultCardStyles.cardHeader}>
        <View style={MaterialResultCardStyles.cardTitleWrap}>
          <Text style={MaterialResultCardStyles.cardTitle}>{material.titulo}</Text>
          <Text style={MaterialResultCardStyles.cardMeta}>
            @{material.author.username} - {formatDate(material.createdAt)}
          </Text>
        </View>
        <View style={MaterialResultCardStyles.filePill}>
          <Feather name="file-text" size={16} color="#214f37" />
        </View>
      </View>

      <Text style={MaterialResultCardStyles.description} numberOfLines={3}>
        {material.descripcion}
      </Text>

      <View style={MaterialResultCardStyles.badgeRow}>
        <Text style={[MaterialResultCardStyles.badge, MaterialResultCardStyles.badgeType]}>
          {getTypeLabel(material.tipo)}
        </Text>
        <Text style={[MaterialResultCardStyles.badge, MaterialResultCardStyles.badgeCareer]}>
          {material.materia}
        </Text>
      </View>

      <View style={MaterialResultCardStyles.cardFooter}>
        <Text style={MaterialResultCardStyles.fileName} numberOfLines={1}>
          {material.archivo.name}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: "/material/[id]", params: { id: material.id } })}
          style={MaterialResultCardStyles.primaryButton}
        >
          <Feather name="eye" size={17} color="#ffffff" />
          <Text style={MaterialResultCardStyles.primaryButtonText}>Ver material</Text>
        </Pressable>
      </View>
    </View>
  );
}

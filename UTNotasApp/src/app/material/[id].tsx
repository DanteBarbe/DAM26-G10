import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConfirmModal } from "@/src/components/ConfirmModal";
import { MaterialInfoItem } from "@/src/features/materials/components/MaterialInfoItem";
import { MaterialPreviewCard } from "@/src/features/materials/components/MaterialPreviewCard";
import { MaterialScreenHeader } from "@/src/features/materials/components/MaterialScreenHeader";
import { detailStyles } from "@/src/features/materials/screens/styles/MaterialDetail.styles";
import { deleteCreatedMaterial } from "@/src/features/materials/utils/createdMaterialsStore";
import { getAllMaterials, getTypeLabel, formatDate } from "@/src/features/materials/utils/materialHelpers";
import { GlobalStyles } from "@/src/styles/Global.styles";

const loggedUserId = 1;

export default function MaterialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const material = useMemo(() => {
    return getAllMaterials().find((item) => String(item.id) === String(id));
  }, [id]);

  const isOwner = material?.author.id === loggedUserId;

  const handleDelete = () => {
    setIsDeleting(true);
    deleteCreatedMaterial(Number(id));
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    router.replace("/search");
  };

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
        <MaterialScreenHeader title="Ver material" />

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

          {isOwner && (
            <View style={detailStyles.ownerActionsRow}>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  detailStyles.editButton,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => router.push(`/create?editId=${material.id}`)}
              >
                <Feather name="edit-2" size={15} color="#1f63b5" />
                <Text style={detailStyles.editButtonText}>Editar</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  detailStyles.deleteButton,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => setShowDeleteConfirm(true)}
              >
                <Feather name="trash-2" size={15} color="#c0392b" />
                <Text style={detailStyles.deleteButtonText}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        </View>

        <MaterialPreviewCard material={material} />
      </ScrollView>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar material"
        message="Esta accion no se puede deshacer. El material sera eliminado permanentemente."
        variant="danger"
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
}

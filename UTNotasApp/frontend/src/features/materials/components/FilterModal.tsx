import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { IconButton } from "@/src/components/IconButton";
import { filterModalStyles as styles } from "@/src/features/materials/components/styles/FilterModal.styles";
import { materialTypes } from "@/src/features/materials/data/materialOptions";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";

export type ActiveFilters = {
  materiaId?: number;
  materia?: string;
  carreraId?: number;
  carrera?: string;
  tipo?: StudyMaterial["tipo"];
  anioCursada?: string;
  comision?: string;
};

export function FilterModal({
  visible,
  initialFilters,
  onClose,
  onApply,
}: {
  visible: boolean;
  initialFilters: ActiveFilters;
  onClose: () => void;
  onApply: (filters: ActiveFilters) => void;
}) {
  const [pending, setPending] = useState<ActiveFilters>(initialFilters);

  useEffect(() => {
    if (visible) {
      setPending(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleApply = () => {
    onApply(pending);
    onClose();
  };

  const handleClear = () => {
    setPending({});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <IconButton icon="x" onPress={onClose} />
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
            <Text style={styles.sectionLabel}>Tipo de material</Text>
            <View style={styles.typeGrid}>
              {materialTypes.map((type) => {
                const active = pending.tipo === type.value;
                return (
                  <Pressable
                    key={type.value}
                    accessibilityRole="button"
                    onPress={() =>
                      setPending((p) => ({ ...p, tipo: active ? undefined : type.value }))
                    }
                    style={[styles.typeChip, active && styles.typeChipActive]}
                  >
                    <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.sectionLabel}>Año de cursada</Text>
                <TextInput
                  value={pending.anioCursada ?? ""}
                  onChangeText={(v) =>
                    setPending((p) => ({
                      ...p,
                      anioCursada: v.replace(/\D/g, "").slice(0, 4) || undefined,
                    }))
                  }
                  placeholder="Ej: 2023"
                  placeholderTextColor="#9a9284"
                  keyboardType="number-pad"
                  maxLength={4}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.sectionLabel}>Comisión</Text>
                <TextInput
                  value={pending.comision ?? ""}
                  onChangeText={(v) =>
                    setPending((p) => ({ ...p, comision: v || undefined }))
                  }
                  placeholder="Ej: K4061"
                  placeholderTextColor="#9a9284"
                  autoCapitalize="characters"
                  maxLength={10}
                  style={styles.textInput}
                />
              </View>
            </View>

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Limpiar filtros</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

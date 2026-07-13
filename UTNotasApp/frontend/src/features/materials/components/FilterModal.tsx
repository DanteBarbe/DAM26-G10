import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { IconButton } from "@/src/components/IconButton";
import { filterModalStyles as styles } from "@/src/features/materials/components/styles/FilterModal.styles";
import { materialTypes } from "@/src/features/materials/data/materialOptions";
import { useCarrerasByMateria, useMaterias } from "@/src/features/materials/hooks/useCatalog";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";
import { normalizeText } from "@/src/utils/format";

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
  const [subjectQuery, setSubjectQuery] = useState("");

  const { data: materias = [] } = useMaterias();
  // las carreras se filtran segun la materia elegida (igual que al crear)
  const { data: carrerasDeMateria = [] } = useCarrerasByMateria(pending.materiaId);

  useEffect(() => {
    if (visible) {
      setPending(initialFilters);
      setSubjectQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const filteredSubjects = useMemo(() => {
    if (!subjectQuery.trim()) return materias;
    const q = normalizeText(subjectQuery);
    return materias.filter((m) => normalizeText(m.nombre).includes(q));
  }, [materias, subjectQuery]);

  const selectMateria = (id: number, nombre: string) => {
    setPending((p) => {
      const deselect = p.materiaId === id;
      return {
        ...p,
        materiaId: deselect ? undefined : id,
        materia: deselect ? undefined : nombre,
        // cambiar de materia invalida la carrera elegida
        carreraId: undefined,
        carrera: undefined,
      };
    });
  };

  const handleApply = () => {
    onApply(pending);
    onClose();
  };

  const handleClear = () => {
    setPending({});
    setSubjectQuery("");
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
            <Text style={styles.sectionLabel}>Materia</Text>
            <View style={styles.subjectSearch}>
              <Feather name="search" size={16} color="#746c61" />
              <TextInput
                value={subjectQuery}
                onChangeText={setSubjectQuery}
                placeholder="Buscar materia..."
                placeholderTextColor="#9a9284"
                style={styles.subjectSearchInput}
              />
              {subjectQuery ? (
                <Pressable accessibilityRole="button" onPress={() => setSubjectQuery("")}>
                  <Feather name="x" size={16} color="#746c61" />
                </Pressable>
              ) : null}
            </View>
            <ScrollView style={styles.subjectList} nestedScrollEnabled={true}>
              {filteredSubjects.map((subject) => {
                const selected = pending.materiaId === subject.id;
                return (
                  <Pressable
                    key={subject.id}
                    accessibilityRole="button"
                    onPress={() => selectMateria(subject.id, subject.nombre)}
                    style={[styles.subjectItem, selected && styles.subjectItemSelected]}
                  >
                    <Text
                      style={[styles.subjectText, selected && styles.subjectTextSelected]}
                      numberOfLines={2}
                    >
                      {subject.nombre}
                    </Text>
                    {selected ? <Feather name="check" size={16} color="#1f63b5" /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            {pending.materiaId ? (
              <>
                <Text style={styles.sectionLabel}>Carrera</Text>
                <View style={styles.typeGrid}>
                  {carrerasDeMateria.map((career) => {
                    const active = pending.carreraId === career.id;
                    return (
                      <Pressable
                        key={career.id}
                        accessibilityRole="button"
                        onPress={() =>
                          setPending((p) => ({
                            ...p,
                            carreraId: active ? undefined : career.id,
                            carrera: active ? undefined : career.nombre,
                          }))
                        }
                        style={[styles.typeChip, active && styles.typeChipActive]}
                      >
                        <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                          {career.nombre}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : null}

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
                  placeholder="Ej: S12"
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

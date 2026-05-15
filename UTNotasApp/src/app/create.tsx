import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormField } from "@/src/components/FormField";
import {
  getCareersForSubject,
  getCareerSubject,
  materialTypes,
  subjects,
  type Career,
  type MaterialType,
  type Subject,
} from "@/src/features/materials/data/materialOptions";
import { FileUploadField } from "@/src/features/materials/components/FileUploadField";
import { IconButton } from "@/src/features/materials/components/IconButton";
import { OptionSheet } from "@/src/features/materials/components/OptionSheet";
import { PointsModal } from "@/src/features/materials/components/PointsModal";
import { SelectButton } from "@/src/features/materials/components/SelectButton";
import { SubjectSearch } from "@/src/features/materials/components/SubjectSearch";
import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";
import { pickFiles } from "@/src/features/materials/utils/filePicker";
import {
  buildPointsBreakdown,
  getCareerPrefix,
  partialLabel,
  validateForm,
} from "@/src/features/materials/utils/materialFormHelpers";
import { saveCreatedMaterial } from "@/src/features/materials/utils/createdMaterialsStore";
import type {
  CreatedMaterial,
  FieldError,
  FieldName,
  MaterialFormData,
  PointsBreakdown,
} from "@/src/features/materials/types/materials.types";

const initialForm: MaterialFormData = {
  titulo: "",
  descripcion: "",
  tipo: "",
  archivos: [],
  materiaId: undefined,
  carreraId: undefined,
  materia: "",
  carrera: "",
  comision: "",
  parcial: "",
  anioCursada: "",
};

const loggedUserId = 1;

export default function MaterialCreateScreen() {
  const [form, setForm] = useState<MaterialFormData>(initialForm);
  const [fieldError, setFieldError] = useState<FieldError | null>(null);
  const [activeSelector, setActiveSelector] = useState<
    "career" | "type" | "partial" | null
  >(null);
  const [pointsAlert, setPointsAlert] = useState<PointsBreakdown | null>(null);
  const [lastCreated, setLastCreated] = useState<CreatedMaterial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === form.materiaId),
    [form.materiaId],
  );

  const availableCareers = useMemo(
    () => getCareersForSubject(form.materiaId),
    [form.materiaId],
  );

  const selectedMaterialType = useMemo(
    () => materialTypes.find((t) => t.value === form.tipo),
    [form.tipo],
  );

  const careerSubject = useMemo(
    () => getCareerSubject(form.carreraId, form.materiaId),
    [form.carreraId, form.materiaId],
  );

  const commissionPrefix = useMemo(
    () => getCareerPrefix(form.carrera, careerSubject?.anio),
    [form.carrera, careerSubject?.anio],
  );

  const showParcialSelect = form.tipo === "PARCIAL" || form.tipo === "PARCIAL_RESUELTO";

  const fieldErrorFor = (field: FieldName) =>
    fieldError?.field === field ? fieldError.message : undefined;

  const clearFieldError = (field: FieldName) => {
    if (fieldError?.field === field) setFieldError(null);
  };

  const updateForm = <Key extends keyof MaterialFormData>(
    field: Key,
    value: MaterialFormData[Key],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const handleSelectSubject = (subject: Subject | null) => {
    setForm((current) => ({
      ...current,
      materiaId: subject?.id,
      materia: subject?.nombre ?? "",
      carreraId: undefined,
      carrera: "",
      comision: "",
    }));
    clearFieldError("materiaId");
  };

  const handleSelectCareer = (career: Career) => {
    setForm((current) => ({
      ...current,
      carreraId: career.id,
      carrera: career.nombre,
      comision: "",
    }));
    setActiveSelector(null);
    clearFieldError("carreraId");
  };

  const handleSelectType = (type: MaterialType) => {
    setForm((current) => ({
      ...current,
      tipo: type.value,
      parcial:
        type.value === "PARCIAL" || type.value === "PARCIAL_RESUELTO"
          ? current.parcial
          : "",
    }));
    setActiveSelector(null);
    clearFieldError("tipo");
  };

  const handleCommissionDigit = (digit: string) => {
    const cleanDigit = digit.replace(/\D/g, "").slice(0, 1);
    updateForm("comision", cleanDigit ? `${commissionPrefix}${cleanDigit}` : "");
  };

  const handlePickFiles = async () => {
    const selectedFiles = await pickFiles();
    if (selectedFiles.length === 0) return;
    setForm((current) => ({
      ...current,
      archivos: [...current.archivos, ...selectedFiles],
    }));
    clearFieldError("archivos");
  };

  const removeFile = (fileId: string) => {
    setForm((current) => ({
      ...current,
      archivos: current.archivos.filter((f) => f.id !== fileId),
    }));
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.archivos.length) return current;
      const archivos = [...current.archivos];
      const [file] = archivos.splice(index, 1);
      archivos.splice(nextIndex, 0, file);
      return { ...current, archivos };
    });
  };

  const handleSubmit = async () => {
    const error = validateForm(form);
    if (error) {
      setFieldError(error);
      return;
    }

    setFieldError(null);
    setIsSubmitting(true);

    const material: CreatedMaterial = {
      ...form,
      id: Date.now(),
      userId: loggedUserId,
      createdAt: new Date().toISOString(),
      numeroParcial: form.parcial ? Number(form.parcial) : undefined,
    };

    await saveCreatedMaterial(material);
    setLastCreated(material);
    setPointsAlert(buildPointsBreakdown(form));
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setForm(initialForm);
    setFieldError(null);
    setPointsAlert(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>UTNotas</Text>
              <Text style={styles.title}>Subi tu material de estudio</Text>
            </View>
            <View style={styles.headerIcon}>
              <Feather name="upload-cloud" size={28} color="#1f63b5" />
            </View>
          </View>

          <View style={styles.navigationPanel}>
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          </View>

          <View style={styles.formSurface}>
            <FormField label="Titulo*" error={fieldErrorFor("titulo")}>
              <TextInput
                value={form.titulo}
                onChangeText={(value) => updateForm("titulo", value)}
                placeholder="Ej: Resumen Ecuaciones Diferenciales"
                placeholderTextColor="#8a94a6"
                style={styles.input}
              />
            </FormField>

            <FormField label="Archivo*" error={fieldErrorFor("archivos")}>
              <FileUploadField
                files={form.archivos}
                onAddFiles={handlePickFiles}
                onMoveFile={moveFile}
                onRemoveFile={removeFile}
              />
            </FormField>

            <FormField label="Materia*" error={fieldErrorFor("materiaId")}>
              <SubjectSearch
                value={form.materia}
                subjects={subjects}
                selectedSubject={selectedSubject}
                onSelect={handleSelectSubject}
              />
            </FormField>

            {form.materiaId ? (
              <FormField label="Carrera*" error={fieldErrorFor("carreraId")}>
                <SelectButton
                  icon="book-open"
                  label={form.carrera || "Seleccione una carrera"}
                  onPress={() => setActiveSelector("career")}
                />
              </FormField>
            ) : null}

            <View style={styles.row}>
              <FormField
                label="Tipo de Material*"
                error={fieldErrorFor("tipo")}
                style={styles.rowItem}
              >
                <SelectButton
                  icon="tag"
                  label={selectedMaterialType?.label ?? "Seleccione un tipo"}
                  onPress={() => setActiveSelector("type")}
                />
              </FormField>

              <FormField
                label="Ano de cursada (opcional)"
                error={fieldErrorFor("anioCursada")}
                style={styles.rowItem}
              >
                <TextInput
                  value={form.anioCursada}
                  onChangeText={(value) =>
                    updateForm("anioCursada", value.replace(/\D/g, ""))
                  }
                  placeholder="Ej: 2023"
                  placeholderTextColor="#8a94a6"
                  keyboardType="number-pad"
                  maxLength={4}
                  style={styles.input}
                />
              </FormField>
            </View>

            <FormField label="Comision (opcional)" error={fieldErrorFor("comision")}>
              <View style={styles.commissionRow}>
                <View style={styles.commissionPrefix}>
                  <Text style={styles.commissionPrefixText}>
                    {commissionPrefix || "--"}
                  </Text>
                </View>
                <TextInput
                  value={form.comision.replace(commissionPrefix, "")}
                  onChangeText={handleCommissionDigit}
                  editable={Boolean(commissionPrefix)}
                  placeholder="2"
                  placeholderTextColor="#8a94a6"
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[styles.input, styles.commissionInput]}
                />
              </View>
            </FormField>

            {showParcialSelect ? (
              <FormField
                label="Parcial Relacionado (opcional)"
                error={fieldErrorFor("parcial")}
              >
                <SelectButton
                  icon="layers"
                  label={partialLabel(form.parcial)}
                  onPress={() => setActiveSelector("partial")}
                />
              </FormField>
            ) : null}

            <FormField
              label="Descripcion del material (opcional)"
              error={fieldErrorFor("descripcion")}
            >
              <TextInput
                value={form.descripcion}
                onChangeText={(value) => updateForm("descripcion", value)}
                placeholder="Escribi una breve descripcion del material que estas subiendo."
                placeholderTextColor="#8a94a6"
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textArea]}
              />
            </FormField>

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.pressed,
                isSubmitting && styles.disabledButton,
              ]}
            >
              <Feather name="upload" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Subiendo..." : "Subir"}
              </Text>
            </Pressable>
          </View>

          {lastCreated ? (
            <View style={styles.createdPanel}>
              <View style={styles.createdHeader}>
                <Feather name="check-circle" size={20} color="#247a48" />
                <Text style={styles.createdTitle}>Material listo en el front</Text>
              </View>
              <Text style={styles.createdText} numberOfLines={2}>
                {lastCreated.titulo} - {lastCreated.materia} - {lastCreated.carrera}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <OptionSheet
        visible={activeSelector === "career"}
        title="Seleccione una carrera"
        options={availableCareers.map((c) => ({ label: c.nombre, value: c.id }))}
        emptyLabel="No hay carreras disponibles para esa materia."
        selectedValue={form.carreraId}
        onClose={() => setActiveSelector(null)}
        onSelect={(value) => {
          const career = availableCareers.find((c) => c.id === value);
          if (career) handleSelectCareer(career);
        }}
      />

      <OptionSheet
        visible={activeSelector === "type"}
        title="Tipo de material"
        options={materialTypes.map((t) => ({ label: t.label, value: t.value }))}
        selectedValue={form.tipo}
        onClose={() => setActiveSelector(null)}
        onSelect={(value) => {
          const type = materialTypes.find((t) => t.value === value);
          if (type) handleSelectType(type);
        }}
      />

      <OptionSheet
        visible={activeSelector === "partial"}
        title="Parcial relacionado"
        options={[
          { label: "Ninguno", value: "0" },
          { label: "1ero", value: "1" },
          { label: "2do", value: "2" },
          { label: "3ro", value: "3" },
          { label: "4to", value: "4" },
        ]}
        selectedValue={form.parcial}
        onClose={() => setActiveSelector(null)}
        onSelect={(value) => {
          updateForm("parcial", value);
          setActiveSelector(null);
        }}
      />

      <PointsModal points={pointsAlert} onClose={resetForm} />
    </SafeAreaView>
  );
}

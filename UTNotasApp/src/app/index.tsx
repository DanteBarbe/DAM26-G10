import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getCareersForSubject,
  getCareerSubject,
  materialTypes,
  subjects,
  type Career,
  type MaterialType,
  type Subject,
} from "@/src/data/materialOptions";
import { saveCreatedMaterial } from "@/src/utils/createdMaterialsStore";
import type {
  AttachedFile,
  CreatedMaterial,
  FieldError,
  FieldName,
  MaterialFormData,
  PointsBreakdown,
} from "@/src/types/materials";

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

const currentYear = new Date().getFullYear();
const loggedUserId = 1;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatFileSize = (size?: number) => {
  if (!size) return "Tamano no disponible";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const createFileId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const pickWebFiles = () =>
  new Promise<AttachedFile[]>((resolve) => {
    const maybeDocument = (globalThis as { document?: Document }).document;
    if (!maybeDocument) {
      resolve([]);
      return;
    }

    const input = maybeDocument.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,image/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx";
    input.onchange = () => {
      const selectedFiles = Array.from(input.files ?? []).map((file) => ({
        id: createFileId(),
        name: file.name,
        size: file.size,
        mimeType: file.type,
        uri: URL.createObjectURL(file),
      }));
      resolve(selectedFiles);
    };
    input.click();
  });

const pickFiles = async () => {
  if (Platform.OS === "web") {
    return pickWebFiles();
  }

  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
      type: [
        "application/pdf",
        "image/*",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
    });

    if (result.canceled) return [];

    return result.assets.map((asset) => ({
      id: createFileId(),
      name: asset.name ?? "archivo",
      size: asset.size,
      mimeType: asset.mimeType,
      uri: asset.uri,
    }));
  } catch {
    return [];
  }
};

const getCareerPrefix = (
  careerName: string,
  careerSubjectYear?: number,
) => {
  if (!careerName || !careerSubjectYear) return "";

  const words = careerName.toLowerCase().split(" ");
  const sourceWord = words[1] === "en" ? words[2] : words[1];
  if (!sourceWord) return "";

  return `${sourceWord[0].toUpperCase()}${careerSubjectYear}`;
};

const buildPointsBreakdown = (form: MaterialFormData): PointsBreakdown => {
  const breakdown: string[] = [];

  if (form.anioCursada) breakdown.push("Ano de cursada");
  if (form.comision) breakdown.push("Comision");
  if (form.descripcion.trim()) breakdown.push("Descripcion");
  if (form.parcial !== "") breakdown.push("N de parcial");

  const bonus = breakdown.length * 5;

  return {
    total: 20 + bonus,
    base: 20,
    bonus,
    breakdown,
  };
};

const validateForm = (form: MaterialFormData): FieldError | null => {
  const year = Number(form.anioCursada);

  if (!form.titulo.trim()) {
    return { field: "titulo", message: "El titulo es obligatorio." };
  }

  if (form.archivos.length === 0) {
    return { field: "archivos", message: "Debes adjuntar un archivo." };
  }

  if (!form.materiaId) {
    return { field: "materiaId", message: "Debes seleccionar una materia." };
  }

  if (!form.carreraId) {
    return { field: "carreraId", message: "Debes seleccionar una carrera." };
  }

  if (!form.tipo) {
    return { field: "tipo", message: "Debes seleccionar un tipo de material." };
  }

  if (form.anioCursada && (year < 2000 || year > currentYear)) {
    return {
      field: "anioCursada",
      message: `El ano debe estar entre 2000 y ${currentYear}.`,
    };
  }

  return null;
};

type SelectOption<Value extends string | number> = {
  label: string;
  value: Value;
};

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
    () => subjects.find((subject) => subject.id === form.materiaId),
    [form.materiaId],
  );

  const availableCareers = useMemo(
    () => getCareersForSubject(form.materiaId),
    [form.materiaId],
  );

  const selectedMaterialType = useMemo(
    () => materialTypes.find((type) => type.value === form.tipo),
    [form.tipo],
  );

  const careerSubject = useMemo(
    () => getCareerSubject(form.carreraId, form.materiaId),
    [form.carreraId, form.materiaId],
  );

  const commissionPrefix = getCareerPrefix(form.carrera, careerSubject?.anio);
  const showParcialSelect =
    form.tipo === "PARCIAL" || form.tipo === "PARCIAL_RESUELTO";

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
      archivos: current.archivos.filter((file) => file.id !== fileId),
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

          <View style={styles.formSurface}>
            <FormField
              label="Titulo*"
              field="titulo"
              error={fieldError}
            >
              <TextInput
                value={form.titulo}
                onChangeText={(value) => updateForm("titulo", value)}
                placeholder="Ej: Resumen Ecuaciones Diferenciales"
                placeholderTextColor="#8a94a6"
                style={styles.input}
              />
            </FormField>

            <FormField
              label="Archivo*"
              field="archivos"
              error={fieldError}
            >
              <FileUploadField
                files={form.archivos}
                onAddFiles={handlePickFiles}
                onMoveFile={moveFile}
                onRemoveFile={removeFile}
              />
            </FormField>

            <FormField
              label="Materia*"
              field="materiaId"
              error={fieldError}
            >
              <SubjectSearch
                value={form.materia}
                subjects={subjects}
                selectedSubject={selectedSubject}
                onSelect={handleSelectSubject}
              />
            </FormField>

            {form.materiaId ? (
              <FormField
                label="Carrera*"
                field="carreraId"
                error={fieldError}
              >
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
                field="tipo"
                error={fieldError}
                style={styles.rowItem}
              >
                <SelectButton
                  icon="tag"
                  label={
                    selectedMaterialType?.label ??
                    "Seleccione un tipo de material"
                  }
                  onPress={() => setActiveSelector("type")}
                />
              </FormField>

              <FormField
                label="Ano de cursada (opcional)"
                field="anioCursada"
                error={fieldError}
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

            <FormField
              label="Comision (opcional)"
              field="comision"
              error={fieldError}
            >
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
                field="parcial"
                error={fieldError}
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
              field="descripcion"
              error={fieldError}
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
                {lastCreated.titulo} - {lastCreated.materia} -{" "}
                {lastCreated.carrera}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <OptionSheet
        visible={activeSelector === "career"}
        title="Seleccione una carrera"
        options={availableCareers.map((career) => ({
          label: career.nombre,
          value: career.id,
        }))}
        emptyLabel="No hay carreras disponibles para esa materia."
        selectedValue={form.carreraId}
        onClose={() => setActiveSelector(null)}
        onSelect={(value) => {
          const career = availableCareers.find((item) => item.id === value);
          if (career) handleSelectCareer(career);
        }}
      />

      <OptionSheet
        visible={activeSelector === "type"}
        title="Tipo de material"
        options={materialTypes.map((type) => ({
          label: type.label,
          value: type.value,
        }))}
        selectedValue={form.tipo}
        onClose={() => setActiveSelector(null)}
        onSelect={(value) => {
          const type = materialTypes.find((item) => item.value === value);
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

      <PointsModal
        points={pointsAlert}
        onClose={resetForm}
      />
    </SafeAreaView>
  );
}

function FormField({
  label,
  field,
  error,
  children,
  style,
}: {
  label: string;
  field: FieldName;
  error: FieldError | null;
  children: React.ReactNode;
  style?: object;
}) {
  const visibleError = error?.field === field ? error.message : "";

  return (
    <View style={[styles.field, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {visibleError ? (
          <Text style={styles.fieldError} numberOfLines={2}>
            {visibleError}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function SubjectSearch({
  value,
  subjects: subjectOptions,
  selectedSubject,
  onSelect,
}: {
  value: string;
  subjects: Subject[];
  selectedSubject?: Subject;
  onSelect: (subject: Subject | null) => void;
}) {
  const [query, setQuery] = useState(value);
  const [focused, setFocused] = useState(false);

  const filteredSubjects = useMemo(() => {
    if (!query.trim()) return subjectOptions.slice(0, 10);
    const normalizedQuery = normalizeText(query);
    return subjectOptions
      .filter((subject) => normalizeText(subject.nombre).includes(normalizedQuery))
      .slice(0, 10);
  }, [query, subjectOptions]);

  const showSuggestions = focused && filteredSubjects.length > 0;

  return (
    <View>
      <View style={styles.searchInputWrap}>
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (selectedSubject && text !== selectedSubject.nombre) onSelect(null);
          }}
          onFocus={() => setFocused(true)}
          placeholder="Ej: Analisis Matematico II"
          placeholderTextColor="#8a94a6"
          style={[styles.input, styles.searchInput]}
        />
        {query ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setQuery("");
              onSelect(null);
            }}
            style={styles.clearButton}
          >
            <Feather name="x" size={18} color="#667085" />
          </Pressable>
        ) : null}
      </View>

      {showSuggestions ? (
        <View style={styles.suggestions}>
          {filteredSubjects.map((subject) => (
            <Pressable
              key={subject.id}
              accessibilityRole="button"
              onPress={() => {
                setQuery(subject.nombre);
                setFocused(false);
                onSelect(subject);
              }}
              style={({ pressed }) => [
                styles.suggestionItem,
                pressed && styles.pressedSuggestion,
              ]}
            >
              <Text style={styles.suggestionText}>{subject.nombre}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SelectButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectButton,
        pressed && styles.pressedInput,
      ]}
    >
      <Feather name={icon} size={18} color="#1f63b5" />
      <Text style={styles.selectButtonText} numberOfLines={1}>
        {label}
      </Text>
      <Feather name="chevron-down" size={18} color="#667085" />
    </Pressable>
  );
}

function FileUploadField({
  files,
  onAddFiles,
  onMoveFile,
  onRemoveFile,
}: {
  files: AttachedFile[];
  onAddFiles: () => void;
  onMoveFile: (index: number, direction: -1 | 1) => void;
  onRemoveFile: (fileId: string) => void;
}) {
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={onAddFiles}
        style={({ pressed }) => [
          styles.uploadZone,
          files.length > 0 && styles.uploadZoneWithFiles,
          pressed && styles.pressedInput,
        ]}
      >
        <Feather name="file-plus" size={34} color="#1f63b5" />
        <Text style={styles.uploadText}>
          {files.length > 0
            ? "Agregar mas archivos"
            : "Arrastra o selecciona tus archivos"}
        </Text>
        <Text style={styles.uploadHint}>PDF, imagenes y documentos</Text>
      </Pressable>

      {files.length > 0 ? (
        <View style={styles.fileList}>
          {files.map((file, index) => (
            <View key={file.id} style={styles.fileItem}>
              <View style={styles.fileOrder}>
                <Text style={styles.fileOrderText}>{index + 1}</Text>
              </View>
              <View style={styles.fileIcon}>
                <Feather name="file-text" size={18} color="#1f63b5" />
              </View>
              <View style={styles.fileTextWrap}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
              </View>
              <View style={styles.fileActions}>
                <IconButton
                  icon="arrow-up"
                  disabled={index === 0}
                  onPress={() => onMoveFile(index, -1)}
                />
                <IconButton
                  icon="arrow-down"
                  disabled={index === files.length - 1}
                  onPress={() => onMoveFile(index, 1)}
                />
                <IconButton
                  icon="x"
                  danger
                  onPress={() => onRemoveFile(file.id)}
                />
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function IconButton({
  icon,
  onPress,
  disabled,
  danger,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        danger && styles.iconButtonDanger,
        disabled && styles.iconButtonDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Feather
        name={icon}
        size={16}
        color={disabled ? "#aab2c0" : danger ? "#a43f3f" : "#33526f"}
      />
    </Pressable>
  );
}

function OptionSheet<Value extends string | number>({
  visible,
  title,
  options,
  selectedValue,
  emptyLabel,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  options: SelectOption<Value>[];
  selectedValue?: Value;
  emptyLabel?: string;
  onClose: () => void;
  onSelect: (value: Value) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <IconButton icon="x" onPress={onClose} />
          </View>

          {options.length === 0 ? (
            <Text style={styles.emptySheetText}>{emptyLabel}</Text>
          ) : (
            <ScrollView style={styles.sheetScroll}>
              {options.map((option) => {
                const selected = option.value === selectedValue;
                return (
                  <Pressable
                    key={String(option.value)}
                    accessibilityRole="button"
                    onPress={() => onSelect(option.value)}
                    style={({ pressed }) => [
                      styles.optionItem,
                      selected && styles.optionItemSelected,
                      pressed && styles.pressedSuggestion,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {option.label}
                    </Text>
                    {selected ? (
                      <Feather name="check" size={18} color="#1f63b5" />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function PointsModal({
  points,
  onClose,
}: {
  points: PointsBreakdown | null;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={Boolean(points)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.pointsModal}>
          <View style={styles.pointsIcon}>
            <Feather name="award" size={34} color="#c97913" />
          </View>
          <Text style={styles.pointsTitle}>Material creado correctamente</Text>
          <Text style={styles.pointsTotal}>+{points?.total ?? 0} puntos</Text>
          <Text style={styles.pointsBase}>Base: {points?.base ?? 20}</Text>
          {points?.bonus ? (
            <Text style={styles.pointsDetail}>
              Bonus +{points.bonus}: {points.breakdown.join(", ")}
            </Text>
          ) : (
            <Text style={styles.pointsDetail}>
              Completa campos opcionales para sumar bonus.
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              styles.modalButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.modalButtonText}>Aceptar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const partialLabel = (value: string) => {
  switch (value) {
    case "0":
      return "Ninguno";
    case "1":
      return "1ero";
    case "2":
      return "2do";
    case "3":
      return "3ro";
    case "4":
      return "4to";
    default:
      return "Seleccionar";
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef4fb",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    minHeight: 74,
  },
  brand: {
    color: "#c97913",
    fontSize: 16,
    fontWeight: "700",
  },
  title: {
    color: "#143a5f",
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 32,
    maxWidth: 270,
  },
  headerIcon: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d7e5f5",
    borderRadius: 8,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  formSurface: {
    backgroundColor: "#ffffff",
    borderColor: "#dfe7f0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  labelRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 7,
  },
  label: {
    color: "#425466",
    flexShrink: 0,
    fontSize: 14,
    fontWeight: "600",
  },
  fieldError: {
    color: "#d06d18",
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },
  input: {
    backgroundColor: "#f8fbfe",
    borderColor: "#cdd9e5",
    borderRadius: 8,
    borderWidth: 1,
    color: "#263747",
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 108,
  },
  row: {
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  searchInputWrap: {
    position: "relative",
  },
  searchInput: {
    paddingRight: 42,
  },
  clearButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: 4,
    top: 4,
    width: 40,
  },
  suggestions: {
    backgroundColor: "#ffffff",
    borderColor: "#d7e1ec",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
    overflow: "hidden",
  },
  suggestionItem: {
    borderBottomColor: "#edf1f6",
    borderBottomWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  pressedSuggestion: {
    backgroundColor: "#eef6ff",
  },
  suggestionText: {
    color: "#263747",
    fontSize: 14,
  },
  selectButton: {
    alignItems: "center",
    backgroundColor: "#f8fbfe",
    borderColor: "#cdd9e5",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  selectButtonText: {
    color: "#263747",
    flex: 1,
    fontSize: 15,
  },
  uploadZone: {
    alignItems: "center",
    backgroundColor: "#f8fbfe",
    borderColor: "#b9cce1",
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 138,
    padding: 18,
  },
  uploadZoneWithFiles: {
    minHeight: 96,
  },
  uploadText: {
    color: "#425466",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  uploadHint: {
    color: "#7a8797",
    fontSize: 12,
    marginTop: 4,
  },
  fileList: {
    gap: 8,
    marginTop: 10,
  },
  fileItem: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#dfe7f0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 64,
    padding: 8,
  },
  fileOrder: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d8e2ec",
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    marginRight: 8,
    width: 24,
  },
  fileOrderText: {
    color: "#425466",
    fontSize: 12,
    fontWeight: "700",
  },
  fileIcon: {
    alignItems: "center",
    backgroundColor: "#edf6ff",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    marginRight: 8,
    width: 38,
  },
  fileTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    color: "#263747",
    fontSize: 14,
    fontWeight: "600",
  },
  fileSize: {
    color: "#7a8797",
    fontSize: 12,
    marginTop: 2,
  },
  fileActions: {
    flexDirection: "row",
    gap: 4,
    marginLeft: 8,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#f3f6fa",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  iconButtonDanger: {
    backgroundColor: "#fff0f0",
  },
  iconButtonDisabled: {
    backgroundColor: "#f6f7f9",
  },
  commissionRow: {
    flexDirection: "row",
  },
  commissionPrefix: {
    alignItems: "center",
    backgroundColor: "#5d6d7d",
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    justifyContent: "center",
    minHeight: 48,
    width: 58,
  },
  commissionPrefixText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  commissionInput: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    flex: 1,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#1f63b5",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  createdPanel: {
    backgroundColor: "#ecf7f0",
    borderColor: "#b7dfc4",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 13,
  },
  createdHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  createdTitle: {
    color: "#247a48",
    fontSize: 15,
    fontWeight: "700",
  },
  createdText: {
    color: "#375647",
    fontSize: 13,
    marginTop: 6,
  },
  pressed: {
    opacity: 0.82,
  },
  pressedInput: {
    backgroundColor: "#eef6ff",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(16, 24, 40, 0.42)",
    flex: 1,
    justifyContent: "center",
    padding: 18,
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    maxHeight: "78%",
    padding: 14,
    width: "100%",
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sheetTitle: {
    color: "#143a5f",
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  sheetScroll: {
    maxHeight: 430,
  },
  optionItem: {
    alignItems: "center",
    borderBottomColor: "#edf1f6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  optionItemSelected: {
    backgroundColor: "#eef6ff",
  },
  optionText: {
    color: "#263747",
    flex: 1,
    fontSize: 15,
    paddingRight: 10,
  },
  optionTextSelected: {
    color: "#1f63b5",
    fontWeight: "700",
  },
  emptySheetText: {
    color: "#667085",
    fontSize: 14,
    paddingVertical: 18,
    textAlign: "center",
  },
  pointsModal: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    width: "100%",
  },
  pointsIcon: {
    alignItems: "center",
    backgroundColor: "#fff4df",
    borderRadius: 8,
    height: 62,
    justifyContent: "center",
    width: 62,
  },
  pointsTitle: {
    color: "#143a5f",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 14,
    textAlign: "center",
  },
  pointsTotal: {
    color: "#c97913",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
  },
  pointsBase: {
    color: "#425466",
    fontSize: 14,
    marginTop: 6,
  },
  pointsDetail: {
    color: "#667085",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center",
  },
  modalButton: {
    alignItems: "center",
    backgroundColor: "#1f63b5",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 18,
    minHeight: 46,
    width: "100%",
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});

import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native";

import {
  type ReportPayload,
  type ReportReason,
} from "@/src/features/materials/services/materialEngagementService";
import { reportMaterialModalStyles as styles } from "@/src/features/materials/components/styles/ReportMaterialModal.styles";
import { colors } from "@/src/styles/Colors";

const reportReasons: { value: ReportReason; label: string }[] = [
  { value: "CONTENIDO_INAPROPIADO", label: "Contenido inapropiado" },
  { value: "SPAM", label: "Spam" },
  { value: "PLAGIO", label: "Plagio" },
  { value: "OTRO", label: "Otro" },
];

type Props = {
  visible: boolean;
  isPending: boolean;
  onSubmit: (payload: ReportPayload) => void;
  onCancel: () => void;
};

export function ReportMaterialModal({ visible, isPending, onSubmit, onCancel }: Props) {
  const [motivo, setMotivo] = useState<ReportReason>("CONTENIDO_INAPROPIADO");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (!visible) {
      setMotivo("CONTENIDO_INAPROPIADO");
      setDescripcion("");
    }
  }, [visible]);

  const submit = () => {
    onSubmit({
      motivo,
      descripcion: descripcion.trim() ? descripcion.trim() : null,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <View style={styles.iconWrap}>
              <Feather name="flag" size={22} color={colors.warningText} />
            </View>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>Reportar material</Text>
              <Text style={styles.subtitle}>El reporte queda pendiente para moderacion.</Text>
            </View>
          </View>

          <View style={styles.reasonGrid}>
            {reportReasons.map((reason) => {
              const selected = motivo === reason.value;
              return (
                <Pressable
                  key={reason.value}
                  accessibilityRole="button"
                  onPress={() => setMotivo(reason.value)}
                  style={[styles.reasonButton, selected && styles.reasonButtonSelected]}
                >
                  <Text style={[styles.reasonText, selected && styles.reasonTextSelected]}>
                    {reason.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripcion opcional"
            placeholderTextColor={colors.textSoft}
            multiline
            maxLength={500}
            style={styles.textArea}
          />

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isPending}
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isPending}
              onPress={submit}
              style={[styles.submitButton, isPending && styles.disabledButton]}
            >
              {isPending ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <>
                  <Feather name="send" size={15} color={colors.surface} />
                  <Text style={styles.submitText}>Enviar</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

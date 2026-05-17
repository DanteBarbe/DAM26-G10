import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

import type { PointsBreakdown } from "@/src/features/materials/types/materials.types";
import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";

export function PointsModal({
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
            style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}
          >
            <Text style={styles.modalButtonText}>Aceptar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

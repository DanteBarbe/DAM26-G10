import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DangerConfirmModal } from "@/src/components/DangerConfirmModal";
import { useAuth } from "@/src/features/auth/AuthContext";
import { MaterialScreenHeader } from "@/src/features/materials/components/MaterialScreenHeader";
import { useAdminReports } from "@/src/features/materials/hooks/useMaterialEngagement";
import { adminReportsStyles as styles } from "@/src/features/materials/screens/styles/AdminReports.styles";
import type { AdminReport } from "@/src/features/materials/services/materialEngagementService";
import { formatDate, getTypeLabel } from "@/src/features/materials/utils/materialHelpers";
import { GlobalStyles } from "@/src/styles/Global.styles";
import { colors } from "@/src/styles/Colors";

const reasonLabels: Record<AdminReport["motivo"], string> = {
  CONTENIDO_INAPROPIADO: "Contenido inapropiado",
  SPAM: "Spam",
  PLAGIO: "Plagio",
  OTRO: "Otro",
};

export default function AdminReportsScreen() {
  const { user } = useAuth();
  const {
    reports,
    isLoading,
    isError,
    refetch,
    ignoreReport,
    deleteReportedMaterial,
    pendingReportId,
    pendingMaterialId,
    isIgnoring,
    isDeletingMaterial,
  } = useAdminReports();
  const [reportToDelete, setReportToDelete] = useState<AdminReport | null>(null);

  if (user?.role !== "ADMIN") {
    return (
      <SafeAreaView style={GlobalStyles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.centered}>
          <Feather name="lock" size={42} color={colors.textSoft} />
          <Text style={styles.emptyTitle}>Acceso restringido</Text>
          <Text style={styles.emptyText}>Esta pantalla solo esta disponible para administradores.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={GlobalStyles.content}>
        <MaterialScreenHeader title="Panel admin" />

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Reportes activos</Text>
            <Text style={styles.summaryValue}>{reports.length}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => refetch()} style={styles.refreshButton}>
            <Feather name="refresh-cw" size={18} color={colors.primaryDark} />
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={colors.primary} />
        ) : isError ? (
          <View style={styles.centeredBlock}>
            <Text style={styles.emptyText}>No se pudieron cargar los reportes.</Text>
            <Pressable accessibilityRole="button" onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.centeredBlock}>
            <Feather name="check-circle" size={40} color={colors.success} />
            <Text style={styles.emptyTitle}>Sin reportes pendientes</Text>
            <Text style={styles.emptyText}>Los reportes ignorados dejan de aparecer en esta lista.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {reports.map((report) => {
              const material = report.material;
              const deletingThis = isDeletingMaterial && pendingMaterialId === report.materialId;
              const ignoringThis = isIgnoring && pendingReportId === report.id;

              return (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View style={styles.reasonPill}>
                      <Feather name="flag" size={14} color={colors.warningText} />
                      <Text style={styles.reasonText}>{reasonLabels[report.motivo]}</Text>
                    </View>
                    <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                  </View>

                  <Text style={styles.description}>
                    {report.descripcion || "Sin descripcion adicional."}
                  </Text>

                  <View style={styles.materialBox}>
                    {material ? (
                      <>
                        <Text style={styles.materialTitle}>{material.titulo}</Text>
                        <Text style={styles.materialMeta}>
                          @{material.author.username} - {getTypeLabel(material.tipo)}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.materialTitle}>Material no disponible</Text>
                        <Text style={styles.materialMeta}>ID #{report.materialId}</Text>
                      </>
                    )}
                  </View>

                  <View style={styles.actions}>
                    <Pressable
                      accessibilityRole="button"
                      disabled={!material}
                      onPress={() =>
                        router.push({ pathname: "/material/[id]", params: { id: String(report.materialId) } })
                      }
                      style={[styles.secondaryButton, !material && styles.disabledButton]}
                    >
                      <Feather name="eye" size={15} color={colors.primaryDark} />
                      <Text style={styles.secondaryButtonText}>Ver</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      disabled={ignoringThis || deletingThis}
                      onPress={() => ignoreReport(report.id)}
                      style={[styles.secondaryButton, (ignoringThis || deletingThis) && styles.disabledButton]}
                    >
                      <Feather name="x-circle" size={15} color={colors.textSoft} />
                      <Text style={styles.secondaryButtonText}>Ignorar</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      disabled={!material || deletingThis || ignoringThis}
                      onPress={() => setReportToDelete(report)}
                      style={[styles.dangerButton, (!material || deletingThis || ignoringThis) && styles.disabledButton]}
                    >
                      <Feather name="trash-2" size={15} color={colors.surface} />
                      <Text style={styles.dangerButtonText}>Eliminar material</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <DangerConfirmModal
        visible={!!reportToDelete}
        title="Eliminar material reportado"
        body="Esta accion elimina el material y todos sus votos, favoritos y reportes asociados."
        confirmLabel="Eliminar"
        isPending={isDeletingMaterial}
        errorMessage={null}
        onCancel={() => {
          if (!isDeletingMaterial) setReportToDelete(null);
        }}
        onConfirm={() => {
          if (!reportToDelete) return;
          deleteReportedMaterial(reportToDelete.materialId);
          setReportToDelete(null);
        }}
      />
    </SafeAreaView>
  );
}

import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ReportMaterialModal } from "@/src/features/materials/components/ReportMaterialModal";
import { useMaterialEngagement } from "@/src/features/materials/hooks/useMaterialEngagement";
import type { StudyMaterial } from "@/src/features/materials/types/materials.types";
import { materialActionBarStyles as styles } from "@/src/features/materials/components/styles/MaterialActionBar.styles";
import { colors } from "@/src/styles/Colors";

type Props = {
  material: StudyMaterial;
  compact?: boolean;
};

export function MaterialActionBar({ material, compact = false }: Props) {
  const [reportVisible, setReportVisible] = useState(false);
  const {
    userVote,
    isFavorite,
    hasReported,
    isVoting,
    isTogglingFavorite,
    isReporting,
    submitVote,
    toggleMaterialFavorite,
    submitReport,
    shareMaterial,
  } = useMaterialEngagement(material);

  const score = material.score + (userVote === true ? 0 : 0);

  return (
    <>
      <View style={[styles.wrap, compact && styles.wrapCompact]}>
        <View style={styles.voteGroup}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Votar positivo"
            disabled={isVoting}
            onPress={() => submitVote(true)}
            style={[styles.iconButton, userVote === true && styles.iconButtonActive]}
          >
            <Feather
              name="arrow-up"
              size={17}
              color={userVote === true ? colors.surface : colors.primaryDark}
            />
          </Pressable>
          <Text style={styles.score}>{score}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Votar negativo"
            disabled={isVoting}
            onPress={() => submitVote(false)}
            style={[styles.iconButton, userVote === false && styles.iconButtonDanger]}
          >
            <Feather
              name="arrow-down"
              size={17}
              color={userVote === false ? colors.surface : colors.primaryDark}
            />
          </Pressable>
        </View>

        <View style={styles.secondaryActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Compartir"
            onPress={shareMaterial}
            style={styles.iconButton}
          >
            <Feather name="share-2" size={17} color={colors.primaryDark} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Favorito"
            disabled={isTogglingFavorite}
            onPress={toggleMaterialFavorite}
            style={[styles.iconButton, isFavorite && styles.iconButtonActive]}
          >
            <Feather
              name="star"
              size={17}
              color={isFavorite ? colors.surface : colors.primaryDark}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reportar"
            disabled={hasReported}
            onPress={() => setReportVisible(true)}
            style={[styles.iconButton, hasReported && styles.iconButtonMuted]}
          >
            <Feather
              name="flag"
              size={17}
              color={hasReported ? colors.textSoft : colors.warningText}
            />
          </Pressable>
        </View>
      </View>

      <ReportMaterialModal
        visible={reportVisible}
        isPending={isReporting}
        onCancel={() => {
          if (!isReporting) setReportVisible(false);
        }}
        onSubmit={(payload) => {
          submitReport(payload);
          setReportVisible(false);
        }}
      />
    </>
  );
}

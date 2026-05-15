import { Feather } from "@expo/vector-icons";
import { Linking, Pressable, Text, View } from "react-native";

import type { StudyMaterial } from "@/src/features/materials/types/materials.types";
import { previewCardStyles as styles } from "@/src/features/materials/components/styles/MaterialPreviewCard.styles";

export function MaterialPreviewCard({ material }: { material: StudyMaterial }) {
  const openFile = async () => {
    if (!material.archivo.uri) return;
    await Linking.openURL(material.archivo.uri);
  };

  return (
    <View style={styles.previewCard}>
      <View style={styles.previewHeader}>
        <Feather name="file-text" size={20} color="#7b5f43" />
        <View style={styles.fileNameWrap}>
          <Text style={styles.fileName} numberOfLines={1}>
            {material.archivo.name}
          </Text>
        </View>
      </View>

      <View style={styles.previewBody}>
        <View style={styles.documentSheet}>
          <View style={styles.documentLineLong} />
          <View style={styles.documentLine} />
          <View style={styles.documentLineShort} />
          <View style={styles.documentDivider} />
          <View style={styles.documentParagraph} />
          <View style={styles.documentParagraphSmall} />
          <View style={styles.documentStamp}>
            <Text style={styles.documentStampText}>PDF</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

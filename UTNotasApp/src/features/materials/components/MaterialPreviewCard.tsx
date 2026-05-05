import { Feather } from "@expo/vector-icons";
import { Linking, Pressable, Text, View } from "react-native";

import type { StudyMaterial } from "@/src/features/materials/types/materials.types";

import { detailStyles } from "@/src/features/materials/screens/styles/MaterialDetail.styles";

const formatSize = (size?: number) => {
  if (!size) return "Tamaño no disponible";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export function MaterialPreviewCard({ material }: { material: StudyMaterial }) {
  const openFile = async () => {
    if (!material.archivo.uri) return;
    await Linking.openURL(material.archivo.uri);
  };

  return (
    <View style={detailStyles.previewCard}>
      <View style={detailStyles.previewHeader}>
        <Feather name="file-text" size={20} color="#7b5f43" />
      </View>

      <View style={detailStyles.previewBody}>
        <View style={detailStyles.documentSheet}>
          <View style={detailStyles.documentLineLong} />
          <View style={detailStyles.documentLine} />
          <View style={detailStyles.documentLineShort} />
          <View style={detailStyles.documentDivider} />
          <View style={detailStyles.documentParagraph} />
          <View style={detailStyles.documentParagraphSmall} />
          <View style={detailStyles.documentStamp}>
            <Text style={detailStyles.documentStampText}>PDF</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

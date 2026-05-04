import { Feather } from "@expo/vector-icons";
import { Linking, Pressable, Text, View } from "react-native";

import type { StudyMaterial } from "@/src/types/materials";

import { detailStyles } from "@/src/styles/materials/materialDetailStyles";

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
        <View style={detailStyles.fileNameWrap}>
          <Text style={detailStyles.fileName} numberOfLines={1}>
            {material.archivo.name}
          </Text>
          <Text style={detailStyles.fileMeta}>
            {formatSize(material.archivo.size)}
            {material.pages ? ` - ${material.pages} paginas` : ""}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!material.archivo.uri}
          onPress={openFile}
          style={[
            detailStyles.openButton,
            !material.archivo.uri && detailStyles.openButtonDisabled,
          ]}
        >
          <Feather name="external-link" size={18} color="#ffffff" />
        </Pressable>
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
        <Text style={detailStyles.previewHint}>
          Vista previa mockeada para primera entrega
        </Text>
      </View>
    </View>
  );
}

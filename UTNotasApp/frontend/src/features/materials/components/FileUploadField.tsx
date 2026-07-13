import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, Text, View } from "react-native";

import type { AttachedFile } from "@/src/features/materials/types/materials.types";
import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";
import { formatFileSize } from "@/src/utils/format";
import { IconButton } from "@/src/components/IconButton";

export function FileUploadField({
  files,
  onAddFiles,
  onTakePhoto,
  onMoveFile,
  onRemoveFile,
}: {
  files: AttachedFile[];
  onAddFiles: () => void;
  onTakePhoto?: () => void;
  onMoveFile: (index: number, direction: -1 | 1) => void;
  onRemoveFile: (fileId: string) => void;
}) {
  const showCamera = Platform.OS !== "web" && onTakePhoto != null;

  return (
    <View>
      <View style={styles.uploadActions}>
        <Pressable
          accessibilityRole="button"
          onPress={onAddFiles}
          style={({ pressed }) => [
            styles.uploadZone,
            styles.uploadZoneHalf,
            files.length > 0 && styles.uploadZoneWithFiles,
            pressed && styles.pressedInput,
          ]}
        >
          <Feather name="file-plus" size={28} color="#1f63b5" />
          <Text style={styles.uploadText}>
            {files.length > 0 ? "Más archivos" : "Seleccionar archivo"}
          </Text>
          <Text style={styles.uploadHint}>PDF, imágenes y documentos</Text>
        </Pressable>

        {showCamera ? (
          <Pressable
            accessibilityRole="button"
            onPress={onTakePhoto}
            style={({ pressed }) => [
              styles.uploadZone,
              styles.uploadZoneHalf,
              pressed && styles.pressedInput,
            ]}
          >
            <Feather name="camera" size={28} color="#1f63b5" />
            <Text style={styles.uploadText}>Tomar foto</Text>
            <Text style={styles.uploadHint}>Usar la cámara</Text>
          </Pressable>
        ) : null}
      </View>

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
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
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
                <IconButton icon="x" danger onPress={() => onRemoveFile(file.id)} />
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

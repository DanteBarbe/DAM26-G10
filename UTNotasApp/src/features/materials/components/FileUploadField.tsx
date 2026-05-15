import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AttachedFile } from "@/src/features/materials/types/materials.types";
import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";
import { formatFileSize } from "@/src/utils/format";
import { IconButton } from "@/src/features/materials/components/IconButton";

export function FileUploadField({
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
          {files.length > 0 ? "Agregar mas archivos" : "Arrastra o selecciona tus archivos"}
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

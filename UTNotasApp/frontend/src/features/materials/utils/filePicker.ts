import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

import type { AttachedFile } from "@/src/features/materials/types/materials.types";

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

export const pickFiles = async (): Promise<AttachedFile[]> => {
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

export const pickFromCamera = async (): Promise<AttachedFile[]> => {
  if (Platform.OS === "web") return [];

  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") return [];

  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.85,
      allowsEditing: false,
    });

    if (result.canceled) return [];

    return result.assets.map((asset) => {
      const filename = asset.fileName ?? asset.uri.split("/").pop() ?? "foto.jpg";
      return {
        id: createFileId(),
        name: filename,
        size: asset.fileSize,
        mimeType: asset.mimeType ?? "image/jpeg",
        uri: asset.uri,
      };
    });
  } catch {
    return [];
  }
};

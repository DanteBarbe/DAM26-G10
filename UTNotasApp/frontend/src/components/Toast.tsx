import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, spacing, typography } from "@/src/styles/Colors";
import type { Toast as ToastData, ToastType } from "@/src/contexts/ToastContext";

type Props = {
  toast: ToastData;
  onClose: () => void;
};

const typeConfig: Record<ToastType, { bg: string; text: string; icon: string }> = {
  success: { bg: "rgba(36, 122, 72, 1)", text: colors.surface, icon: "check-circle" },
  error: { bg: "rgba(192, 57, 43, 1)", text: colors.surface, icon: "alert-circle" },
  info: { bg: "rgba(31, 99, 181, 1)", text: colors.surface, icon: "info" },
};

export function Toast({ toast, onClose }: Props) {
  const config = typeConfig[toast.type];
  const progressWidth = useSharedValue(100);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      progressWidth.value = withTiming(0, {
        duration: toast.duration,
      });
    }
  }, [toast.duration, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderLeftWidth: 4,
        borderLeftColor: config.text,
        borderRadius: 8,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: spacing.md,
          gap: spacing.md,
        }}
      >
        <Feather name={config.icon as any} size={20} color={config.text} />
        <Text
          style={{
            flex: 1,
            color: config.text,
            fontSize: typography.body,
            fontWeight: "500",
          }}
          numberOfLines={2}
        >
          {toast.message}
        </Text>
        <Pressable
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={18} color={config.text} />
        </Pressable>
      </View>
      <Animated.View
        style={[
          {
            height: 3,
            backgroundColor: config.text,
          },
          progressStyle,
        ]}
      />
    </View>
  );
}

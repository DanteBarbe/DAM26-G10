import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

import { Toast } from "@/src/components/Toast";
import { useToast } from "@/src/contexts/ToastContext";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        top: insets.top,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: "box-none",
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
}

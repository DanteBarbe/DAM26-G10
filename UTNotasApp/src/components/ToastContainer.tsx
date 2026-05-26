import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Toast } from "@/src/components/Toast";
import { useToast } from "@/src/contexts/ToastContext";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const insets = useSafeAreaInsets();

  const visible = toasts.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: "transparent",
        }}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </View>
    </Modal>
  );
}

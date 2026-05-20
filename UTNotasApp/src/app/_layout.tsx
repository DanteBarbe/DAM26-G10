import { Stack } from "expo-router";
import { ToastProvider } from "@/src/contexts/ToastContext";
import { ToastContainer } from "@/src/components/ToastContainer";

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <ToastContainer />
    </ToastProvider>
  );
}

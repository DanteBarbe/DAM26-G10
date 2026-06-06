import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1f63b5",
        tabBarInactiveTintColor: "#9a9284",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e8e0d5",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Consultar",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Subir",
          tabBarIcon: ({ color, size }) => (
            <Feather name="upload-cloud" size={size} color={color} />
          ),
        }}
        listeners={{
          // subir material requiere sesion: si no hay, avisamos y no navegamos.
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              showToast(
                "Iniciá sesión o registrate para subir un material",
                "info",
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="material/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

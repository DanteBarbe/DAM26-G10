import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/features/auth/AuthContext";
import { ApiError } from "@/src/api/apiClient";
import { colors } from "@/src/styles/Colors";

export default function ProfileScreen() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Completá email y contraseña.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <View style={styles.avatarWrap}>
            <Feather name="user" size={40} color={colors.primary} />
          </View>
          <Text style={styles.name}>{user.name} {user.surname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
          >
            <Feather name="log-out" size={18} color="#ffffff" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.brand}>UTNotas</Text>
          <Text style={styles.title}>Iniciá sesión</Text>
          <Text style={styles.subtitle}>
            Necesitás una cuenta para subir, editar o eliminar materiales.
          </Text>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#9a9284"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              placeholderTextColor="#9a9284"
              secureTextEntry
              style={styles.input}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.loginBtn,
                pressed && styles.pressed,
                isLoading && styles.disabledBtn,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Feather name="log-in" size={18} color="#ffffff" />
                  <Text style={styles.loginText}>Ingresar</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  safe: { flex: 1, backgroundColor: "#f5f7f2" },
  content: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 32,
    gap: 8,
  },
  brand: { fontSize: 13, fontWeight: "700" as const, color: colors.primary, letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: "700" as const, color: "#28241e", textAlign: "center" as const, marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#746c61", textAlign: "center" as const, marginBottom: 16 },
  form: { width: "100%" as const, gap: 12 },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd7cb",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#28241e",
  },
  errorText: { fontSize: 13, color: colors.error, textAlign: "center" as const },
  loginBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 4,
  },
  loginText: { color: "#ffffff", fontWeight: "700" as const, fontSize: 15 },
  disabledBtn: { opacity: 0.6 },
  pressed: { opacity: 0.85 },
  // --- estado logueado ---
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8f5ee",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  name: { fontSize: 22, fontWeight: "700" as const, color: "#28241e" },
  username: { fontSize: 14, color: colors.primary, fontWeight: "600" as const },
  email: { fontSize: 13, color: "#746c61", marginTop: 2, marginBottom: 8 },
  roleBadge: {
    backgroundColor: "#e8f5ee",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 24,
  },
  roleText: { fontSize: 12, fontWeight: "700" as const, color: colors.primary, letterSpacing: 0.5 },
  logoutBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    backgroundColor: "#c0392b",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  logoutText: { color: "#ffffff", fontWeight: "700" as const, fontSize: 15 },
};

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/features/auth/AuthContext";
import { ApiError } from "@/src/api/apiClient";
import { colors } from "@/src/styles/Colors";
import { useToast } from "@/src/contexts/ToastContext";

export default function ProfileScreen() {
  const { user, isAuthenticated, logout, updateProfile, deleteAccount } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSurname, setEditSurname] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const openDeleteModal = () => {
    setDeletePassword("");
    setDeleteError(null);
    setDeleteModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("Ingresá tu contraseña para confirmar.");
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(deletePassword.trim());
      setDeleteModalVisible(false);
      showToast("Cuenta eliminada", "info");
      router.replace("/");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Error al eliminar la cuenta.");
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = () => {
    if (!user) return;
    setEditName(user.name);
    setEditSurname(user.surname);
    setEditUsername(user.username);
    setEditPassword("");
    setEditConfirmPassword("");
    setSaveError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSaveProfile = async () => {
    setSaveError(null);

    if (editPassword.trim() && editPassword !== editConfirmPassword) {
      setSaveError("Las contraseñas no coinciden.");
      return;
    }

    const data: Record<string, string> = {
      name: editName.trim(),
      surname: editSurname.trim(),
      username: editUsername.trim(),
    };
    if (editPassword.trim()) {
      data.password = editPassword.trim();
    }

    setIsSaving(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
      showToast("Perfil actualizado correctamente", "success", 3000);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- pantalla de edición ---
  if (isAuthenticated && user && isEditing) {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", default: undefined })}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={s.editContent} keyboardShouldPersistTaps="handled">
            <View style={s.editHeader}>
              <Pressable
                accessibilityRole="button"
                onPress={cancelEditing}
                hitSlop={10}
                style={({ pressed }) => [s.backBtn, pressed && s.pressed]}
              >
                <Feather name="arrow-left" size={22} color={colors.text} />
              </Pressable>
              <Text style={s.editTitle}>Editar perfil</Text>
              <View style={{ width: 32 }} />
            </View>

            <Text style={s.fieldLabel}>Nombre</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre"
              placeholderTextColor="#9a9284"
              autoCapitalize="words"
              style={s.input}
            />

            <Text style={s.fieldLabel}>Apellido</Text>
            <TextInput
              value={editSurname}
              onChangeText={setEditSurname}
              placeholder="Apellido"
              placeholderTextColor="#9a9284"
              autoCapitalize="words"
              style={s.input}
            />

            <Text style={s.fieldLabel}>Usuario</Text>
            <TextInput
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="@usuario"
              placeholderTextColor="#9a9284"
              autoCapitalize="none"
              style={s.input}
            />

            <Text style={s.fieldLabel}>Email</Text>
            <View style={s.inputLocked}>
              <Feather name="lock" size={14} color="#9a9284" style={{ marginRight: 8 }} />
              <Text style={s.inputLockedText}>{user.email}</Text>
            </View>

            <Text style={s.fieldLabel}>Nueva contraseña</Text>
            <TextInput
              value={editPassword}
              onChangeText={setEditPassword}
              placeholder="Dejar vacío para no cambiar"
              placeholderTextColor="#9a9284"
              secureTextEntry
              style={s.input}
            />

            <Text style={s.fieldLabel}>Confirmar contraseña</Text>
            <TextInput
              value={editConfirmPassword}
              onChangeText={setEditConfirmPassword}
              placeholder="Repetí la nueva contraseña"
              placeholderTextColor="#9a9284"
              secureTextEntry
              style={s.input}
            />

            {saveError ? <Text style={s.errorText}>{saveError}</Text> : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleSaveProfile}
              disabled={isSaving}
              style={({ pressed }) => [
                s.primaryBtn,
                pressed && s.pressed,
                isSaving && s.disabledBtn,
              ]}
            >
              {isSaving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Feather name="check" size={18} color="#ffffff" />
                  <Text style={s.primaryBtnText}>Guardar cambios</Text>
                </>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={cancelEditing}
              disabled={isSaving}
              style={({ pressed }) => [s.cancelBtn, pressed && s.pressed]}
            >
              <Text style={s.cancelText}>Cancelar</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // --- pantalla de perfil ---
  if (isAuthenticated && user) {
    const initials = `${user.name[0]}${user.surname[0]}`.toUpperCase();

    return (
      <SafeAreaView style={s.safe}>
        <StatusBar style="light" />

        <View style={s.hero}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarInitials}>{initials}</Text>
          </View>
          <Text style={s.heroName}>{user.name} {user.surname}</Text>
          <Text style={s.heroUsername}>@{user.username}</Text>
          <View style={s.rolePill}>
            <Text style={s.rolePillText}>{user.role}</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.infoRow}>
            <Feather name="mail" size={16} color={colors.primary} />
            <View style={s.infoTextWrap}>
              <Text style={s.infoLabel}>Email</Text>
              <Text style={s.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.infoRow}>
            <Feather name="user" size={16} color={colors.primary} />
            <View style={s.infoTextWrap}>
              <Text style={s.infoLabel}>Usuario</Text>
              <Text style={s.infoValue}>@{user.username}</Text>
            </View>
          </View>
        </View>

        <View style={s.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={startEditing}
            style={({ pressed }) => [s.editBtn, pressed && s.pressed]}
          >
            <Feather name="edit-2" size={16} color="#ffffff" />
            <Text style={s.editBtnText}>Editar perfil</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => [s.logoutBtn, pressed && s.pressed]}
          >
            <Feather name="log-out" size={16} color="#c0392b" />
            <Text style={s.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </View>

        <View style={s.bottomAction}>
          <Pressable
            accessibilityRole="button"
            onPress={openDeleteModal}
            style={({ pressed }) => [s.deleteBtn, pressed && s.pressed]}
          >
            <Feather name="trash-2" size={16} color="#c0392b" />
            <Text style={s.deleteText}>Eliminar cuenta</Text>
          </Pressable>
        </View>

        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => !isDeleting && setDeleteModalVisible(false)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalCard}>
              <Feather name="alert-triangle" size={32} color="#c0392b" style={{ marginBottom: 12 }} />
              <Text style={s.modalTitle}>¿Eliminar cuenta?</Text>
              <Text style={s.modalBody}>
                Esta acción es irreversible. Todos tus datos serán eliminados permanentemente.
              </Text>
              <Text style={s.modalLabel}>Ingresá tu contraseña para confirmar</Text>
              <TextInput
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Contraseña"
                placeholderTextColor="#9a9284"
                secureTextEntry
                editable={!isDeleting}
                style={s.modalInput}
              />
              {deleteError ? <Text style={s.modalError}>{deleteError}</Text> : null}
              <Pressable
                accessibilityRole="button"
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                style={({ pressed }) => [s.modalDeleteBtn, pressed && s.pressed, isDeleting && s.disabledBtn]}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={s.modalDeleteBtnText}>Eliminar cuenta</Text>
                )}
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
                style={({ pressed }) => [s.modalCancelBtn, pressed && s.pressed]}
              >
                <Text style={s.modalCancelText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // --- pantalla sin sesión ---
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <View style={s.centeredContent}>
        <View style={s.avatarCircleGray}>
          <Feather name="user" size={36} color="#9a9284" />
        </View>
        <Text style={s.guestTitle}>No iniciaste sesión</Text>
        <Text style={s.guestSubtitle}>
          Iniciá sesión o creá una cuenta para subir tus materiales.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/login")}
          style={({ pressed }) => [s.loginBtn, pressed && s.pressed]}
        >
          <Text style={s.loginBtnText}>Iniciar sesión</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/signup")}
          style={({ pressed }) => [s.secondaryBtn, pressed && s.pressed]}
        >
          <Text style={s.secondaryBtnText}>Crear cuenta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = {
  safe: { flex: 1, backgroundColor: "#f5f7f2" },

  // hero
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center" as const,
    gap: 6,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  avatarInitials: { fontSize: 28, fontWeight: "700" as const, color: "#ffffff" },
  heroName: { fontSize: 20, fontWeight: "700" as const, color: "#ffffff" },
  heroUsername: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  rolePill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 4,
  },
  rolePillText: { fontSize: 11, fontWeight: "700" as const, color: "#ffffff", letterSpacing: 0.8 },

  // info card
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 14,
    gap: 12,
  },
  infoTextWrap: { flex: 1 },
  infoLabel: { fontSize: 11, color: "#9a9284", fontWeight: "600" as const, marginBottom: 2 },
  infoValue: { fontSize: 14, color: "#28241e", fontWeight: "500" as const },
  divider: { height: 1, backgroundColor: "#f0ece5" },

  // actions
  actions: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 10,
  },
  bottomAction: {
    marginHorizontal: 20,
    marginTop: "auto" as const,
    paddingTop: 16,
    paddingBottom: 12,
  },
  editBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  editBtnText: { color: "#ffffff", fontWeight: "700" as const, fontSize: 15 },
  logoutBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e8d0ce",
  },
  logoutText: { color: "#c0392b", fontWeight: "700" as const, fontSize: 15 },
  deleteBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: "#fff0ee",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#f5c6c0",
  },
  deleteText: { color: "#c0392b", fontWeight: "700" as const, fontSize: 15 },

  // modal de confirmación
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%" as const,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center" as const,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" as const, color: "#28241e", marginBottom: 8 },
  modalBody: { fontSize: 14, color: "#635d52", textAlign: "center" as const, marginBottom: 16 },
  modalLabel: { fontSize: 13, fontWeight: "600" as const, color: "#635d52", alignSelf: "flex-start" as const, marginBottom: 4 },
  modalInput: {
    width: "100%" as const,
    backgroundColor: "#f5f7f2",
    borderWidth: 1,
    borderColor: "#ddd7cb",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#28241e",
    marginBottom: 4,
  },
  modalError: { fontSize: 13, color: "#c0392b", textAlign: "center" as const, marginBottom: 4 },
  modalDeleteBtn: {
    width: "100%" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "#c0392b",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 12,
  },
  modalDeleteBtnText: { color: "#ffffff", fontWeight: "700" as const, fontSize: 15 },
  modalCancelBtn: {
    width: "100%" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: "#ddd7cb",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  modalCancelText: { color: "#635d52", fontWeight: "600" as const, fontSize: 15 },

  // guest
  centeredContent: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 32,
    gap: 12,
  },
  avatarCircleGray: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eeebe5",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  guestTitle: { fontSize: 20, fontWeight: "700" as const, color: "#28241e" },
  guestSubtitle: { fontSize: 14, color: "#746c61", textAlign: "center" as const, marginBottom: 8 },

  // edit form
  editContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  editHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 20,
    paddingTop: 4,
  },
  backBtn: { padding: 4 },
  editTitle: { fontSize: 18, fontWeight: "700" as const, color: "#28241e" },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#635d52",
    marginBottom: 4,
    marginTop: 14,
  },
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
  inputLocked: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#f0ece5",
    borderWidth: 1,
    borderColor: "#ddd7cb",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLockedText: { fontSize: 15, color: "#9a9284", flex: 1 },
  errorText: { fontSize: 13, color: colors.error, textAlign: "center" as const, marginTop: 8 },

  // buttons shared
  primaryBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
  },
  primaryBtnText: { color: "#ffffff", fontWeight: "700" as const, fontSize: 15 },
  loginBtn: {
    alignSelf: "stretch" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
  },
  loginBtnText: { color: "#ffffff", fontWeight: "700" as const, fontSize: 15 },
  secondaryBtn: {
    alignSelf: "stretch" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
  },
  secondaryBtnText: { color: colors.primary, fontWeight: "700" as const, fontSize: 15 },
  cancelBtn: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: "#ddd7cb",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelText: { color: "#635d52", fontWeight: "600" as const, fontSize: 15 },
  disabledBtn: { opacity: 0.6 },
  pressed: { opacity: 0.85 },
};

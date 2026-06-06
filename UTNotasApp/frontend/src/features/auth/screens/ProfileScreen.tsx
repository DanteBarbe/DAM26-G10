import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/features/auth/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import { colors } from "@/src/styles/Colors";
import { profileStyles as styles } from "./styles/Profile.styles";

/**
 * pantalla "Mi perfil".
 *
 * responsabilidades:
 * - sin sesion: invitar a iniciar sesion o registrarse.
 * - con sesion: mostrar datos basicos del usuario y permitir cerrar sesion.
 */
export default function ProfileScreen() {
	const { isAuthenticated, user, logout } = useAuth();
	const { showToast } = useToast();

	const handleSignOut = () => {
		logout();
		showToast("Sesión cerrada", "info");
	};

	const handleBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace("/");
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar style="dark" />

			<View style={styles.topBar}>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Volver"
					hitSlop={8}
					onPress={handleBack}
					style={styles.backButton}
				>
					<Feather name="arrow-left" size={22} color={colors.text} />
				</Pressable>
				<Text style={styles.topBarTitle}>Mi perfil</Text>
				<View style={styles.backButton} />
			</View>

			<View style={styles.content}>
				<View style={styles.avatar}>
					<Feather name="user" size={34} color={colors.primary} />
				</View>

				{isAuthenticated ? (
					<>
						<Text style={styles.name}>{user?.name ?? "Tu cuenta"}</Text>
						{user?.email ? <Text style={styles.email}>{user.email}</Text> : null}

						<Pressable
							accessibilityRole="button"
							onPress={handleSignOut}
							style={({ pressed }) => [
								styles.dangerButton,
								pressed && styles.pressed,
							]}
						>
							<Feather name="log-out" size={18} color={colors.error} />
							<Text style={styles.dangerButtonText}>Cerrar sesión</Text>
						</Pressable>
					</>
				) : (
					<>
						<Text style={styles.name}>No iniciaste sesión</Text>
						<Text style={styles.subtitle}>
							Iniciá sesión o creá una cuenta para subir tus materiales.
						</Text>

						<Pressable
							accessibilityRole="button"
							onPress={() => router.push("/login")}
							style={({ pressed }) => [
								styles.primaryButton,
								pressed && styles.primaryButtonPressed,
							]}
						>
							<Text style={styles.primaryButtonText}>Iniciar sesión</Text>
						</Pressable>

						<Pressable
							accessibilityRole="button"
							onPress={() => router.push("/signup")}
							style={styles.secondaryButton}
						>
							<Text style={styles.secondaryButtonText}>Crear cuenta</Text>
						</Pressable>
					</>
				)}
			</View>
		</SafeAreaView>
	);
}

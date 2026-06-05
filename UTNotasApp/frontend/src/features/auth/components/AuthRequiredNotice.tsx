import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/src/styles/Colors";
import { authRequiredStyles as styles } from "./styles/AuthRequiredNotice.styles";

type Props = {
	title?: string;
	message?: string;
};

/**
 * aviso de funcion restringida: se muestra cuando una pantalla requiere sesion
 * y el usuario todavia no inicio (ej: subir material por deep-link).
 *
 * ofrece accesos directos a iniciar sesion o registrarse.
 */
export function AuthRequiredNotice({
	title = "Función restringida",
	message = "Necesitás iniciar sesión para usar esta función.",
}: Props) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar style="dark" />
			<View style={styles.content}>
				<View style={styles.iconWrap}>
					<Feather name="lock" size={28} color={colors.primary} />
				</View>

				<Text style={styles.title}>{title}</Text>
				<Text style={styles.message}>{message}</Text>

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
			</View>
		</SafeAreaView>
	);
}

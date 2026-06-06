import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import { AuthScreenLayout } from "../components/AuthScreenLayout";
import { AuthTextField } from "../components/AuthTextField";
import { useLoginForm } from "../hooks/useLoginForm";
import { navigateAfterAuth } from "../utils/navigateAfterAuth";
import { authStyles as styles } from "./styles/auth.styles";

/**
 * pantalla de inicio de sesion (solo frontend).
 *
 * responsabilidades:
 * - orquestar useLoginForm y presentar los campos.
 * - validar en el submit y, si todo esta ok, navegar a la app.
 * - NO realiza la autenticacion real (pendiente backend).
 */
export default function LoginScreen() {
	const { values, errors, setField, validate } = useLoginForm();
	const { showToast } = useToast();
	const { signIn } = useAuth();

	const handleSubmit = () => {
		if (!validate()) return;
		signIn({ email: values.email.trim() });
		showToast("¡Sesión iniciada exitosamente!", "success");
		navigateAfterAuth();
	};

	return (
		<AuthScreenLayout title="Iniciar Sesión">
			<AuthTextField
				placeholder="Correo electrónico"
				value={values.email}
				onChangeText={(value) => setField("email", value)}
				error={errors.email}
				keyboardType="email-address"
			/>

			<AuthTextField
				placeholder="Contraseña"
				value={values.password}
				onChangeText={(value) => setField("password", value)}
				error={errors.password}
				secure
			/>

			<Pressable
				accessibilityRole="button"
				onPress={handleSubmit}
				style={({ pressed }) => [
					styles.primaryButton,
					pressed && styles.primaryButtonPressed,
				]}
			>
				<Text style={styles.primaryButtonText}>Ingresar</Text>
			</Pressable>

			<View style={styles.linkRow}>
				<Text style={styles.linkText}>¿No tenés cuenta? </Text>
				<Pressable accessibilityRole="link" onPress={() => router.push("/signup")}>
					<Text style={styles.link}>Registrate</Text>
				</Pressable>
			</View>
		</AuthScreenLayout>
	);
}

import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ApiError } from "@/src/api/apiClient";
import { useAuth } from "@/src/features/auth/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import { AuthScreenLayout } from "../components/AuthScreenLayout";
import { AuthTextField } from "../components/AuthTextField";
import { useLoginForm } from "../hooks/useLoginForm";
import { navigateAfterAuth } from "../utils/navigateAfterAuth";
import { authStyles as styles } from "./styles/auth.styles";

export default function LoginScreen() {
	const { values, errors, setField, validate } = useLoginForm();
	const { showToast } = useToast();
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const handleSubmit = async () => {
		if (!validate()) return;
		setApiError(null);
		setIsLoading(true);
		try {
			await login(values.email.trim(), values.password);
			showToast("¡Sesión iniciada exitosamente!", "success");
			navigateAfterAuth();
		} catch (err) {
			setApiError(err instanceof ApiError ? err.message : "Error al iniciar sesión.");
		} finally {
			setIsLoading(false);
		}
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

			{apiError ? <Text style={styles.fieldError}>{apiError}</Text> : null}

			<Pressable
				accessibilityRole="button"
				onPress={handleSubmit}
				disabled={isLoading}
				style={({ pressed }) => [
					styles.primaryButton,
					pressed && styles.primaryButtonPressed,
					isLoading && { opacity: 0.6 },
				]}
			>
				{isLoading ? (
					<ActivityIndicator color="#ffffff" />
				) : (
					<Text style={styles.primaryButtonText}>Ingresar</Text>
				)}
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

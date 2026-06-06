import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ApiError, apiFetch } from "@/src/api/apiClient";
import { OptionSheet } from "@/src/components/OptionSheet";
import { SelectButton } from "@/src/components/SelectButton";
import { useToast } from "@/src/contexts/ToastContext";
import { useAuth } from "@/src/features/auth/AuthContext";
import { careers } from "@/src/features/materials/data/materialOptions";
import { AuthScreenLayout } from "../components/AuthScreenLayout";
import { AuthTextField } from "../components/AuthTextField";
import { useSignupForm } from "../hooks/useSignupForm";
import { navigateAfterAuth } from "../utils/navigateAfterAuth";
import { authStyles as styles } from "./styles/auth.styles";

export default function SignupScreen() {
	const {
		step,
		values,
		errors,
		careerError,
		setField,
		selectCareer,
		goToForm,
		backToCareer,
		validateForm,
	} = useSignupForm();
	const { login } = useAuth();
	const { showToast } = useToast();
	const [careerSheetOpen, setCareerSheetOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const selectedCareer = careers.find((career) => career.id === values.career);

	const handleRegister = async () => {
		if (!validateForm()) return;
		setApiError(null);
		setIsLoading(true);
		try {
			await apiFetch("/api/users/register", {
				method: "POST",
				body: JSON.stringify({
					name: values.name.trim(),
					surname: values.surname.trim(),
					username: values.username.trim(),
					email: values.email.trim(),
					password: values.password,
					careerId: values.career ?? undefined,
				}),
			});
			await login(values.email.trim(), values.password);
			showToast("¡Bienvenido!", "success");
			navigateAfterAuth();
		} catch (err) {
			setApiError(err instanceof ApiError ? err.message : "Error al registrarse.");
		} finally {
			setIsLoading(false);
		}
	};

	// Paso 1: elegir carrera
	if (step === 1) {
		return (
			<AuthScreenLayout title="Crear Cuenta" subtitle="Primero, elegí tu carrera">
				<View style={styles.fieldBlock}>
					<SelectButton
						icon="book-open"
						label={selectedCareer?.nombre ?? "Seleccioná tu carrera"}
						onPress={() => setCareerSheetOpen(true)}
					/>
					{careerError ? (
						<Text style={styles.fieldError}>{careerError}</Text>
					) : null}
				</View>

				<Pressable
					accessibilityRole="button"
					onPress={goToForm}
					style={({ pressed }) => [
						styles.primaryButton,
						pressed && styles.primaryButtonPressed,
					]}
				>
					<Text style={styles.primaryButtonText}>Continuar</Text>
				</Pressable>

				<View style={styles.linkRow}>
					<Text style={styles.linkText}>¿Ya tenés cuenta? </Text>
					<Pressable
						accessibilityRole="link"
						onPress={() => router.replace("/login")}
					>
						<Text style={styles.link}>Inicia Sesión</Text>
					</Pressable>
				</View>

				<OptionSheet
					visible={careerSheetOpen}
					title="Seleccioná tu carrera"
					options={careers.map((career) => ({
						label: career.nombre,
						value: career.id,
					}))}
					selectedValue={values.career ?? undefined}
					onClose={() => setCareerSheetOpen(false)}
					onSelect={(careerId) => {
						selectCareer(careerId);
						setCareerSheetOpen(false);
					}}
				/>
			</AuthScreenLayout>
		);
	}

	// Paso 2: formulario de datos
	return (
		<AuthScreenLayout title="Crear Cuenta">
			<Pressable
				accessibilityRole="button"
				onPress={backToCareer}
				style={styles.backButton}
			>
				<Text style={styles.backButtonText}>← Cambiar carrera</Text>
			</Pressable>

			<AuthTextField
				placeholder="Nombre"
				value={values.name}
				onChangeText={(value) => setField("name", value)}
				error={errors.name}
				autoCapitalize="words"
			/>
			<AuthTextField
				placeholder="Apellido"
				value={values.surname}
				onChangeText={(value) => setField("surname", value)}
				error={errors.surname}
				autoCapitalize="words"
			/>
			<AuthTextField
				placeholder="Usuario"
				value={values.username}
				onChangeText={(value) => setField("username", value)}
				error={errors.username}
			/>
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
				onPress={handleRegister}
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
					<Text style={styles.primaryButtonText}>Registrarme</Text>
				)}
			</Pressable>

			<View style={styles.linkRow}>
				<Text style={styles.linkText}>¿Ya tenés cuenta? </Text>
				<Pressable
					accessibilityRole="link"
					onPress={() => router.replace("/login")}
				>
					<Text style={styles.link}>Inicia Sesión</Text>
				</Pressable>
			</View>
		</AuthScreenLayout>
	);
}

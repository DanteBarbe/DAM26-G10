import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { OptionSheet } from "@/src/components/OptionSheet";
import { SelectButton } from "@/src/components/SelectButton";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import { careers } from "@/src/features/materials/data/materialOptions";
import { AuthScreenLayout } from "../components/AuthScreenLayout";
import { AuthTextField } from "../components/AuthTextField";
import { useSignupForm } from "../hooks/useSignupForm";
import { navigateAfterAuth } from "../utils/navigateAfterAuth";
import { authStyles as styles } from "./styles/auth.styles";

/**
 * pantalla de registro (solo frontend) en dos pasos, igual que el flujo web.
 *
 * responsabilidades:
 * - paso 1: elegir la carrera antes que nada.
 * - paso 2: completar el formulario de datos.
 * - validar en cada paso y navegar a la app al finalizar.
 * - NO crea la cuenta en el backend (pendiente).
 */
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
	const { showToast } = useToast();
	const { signIn } = useAuth();
	const [careerSheetOpen, setCareerSheetOpen] = useState(false);

	const selectedCareer = careers.find((career) => career.id === values.career);

	const handleRegister = () => {
		if (!validateForm()) return;
		signIn({ name: values.name.trim(), email: values.email.trim() });
		showToast("¡Cuenta creada exitosamente!", "success");
		navigateAfterAuth();
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

			<Pressable
				accessibilityRole="button"
				onPress={handleRegister}
				style={({ pressed }) => [
					styles.primaryButton,
					pressed && styles.primaryButtonPressed,
				]}
			>
				<Text style={styles.primaryButtonText}>Registrarme</Text>
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

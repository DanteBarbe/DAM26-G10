// Ruta: src/features/materials/screens/MaterialCreateScreen.tsx
/**
 * pantalla de creacion de material.
 *
 * responsabilidades:
 * - orquestar usematerialform y usecreatematerial.
 * - manejar usefocuseffect (ciclo de vida de pantalla, no del formulario).
 * - llamar pickfiles y pasar los archivos al hook via addfiles.
 * - renderizar el formulario sin logica de negocio.
 */
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormField } from "@/src/components/FormField";
import { OptionSheet } from "@/src/components/OptionSheet";
import { SelectButton } from "@/src/components/SelectButton";
import { FileUploadField } from "@/src/features/materials/components/FileUploadField";
import { PointsModal } from "@/src/features/materials/components/PointsModal";
import { SubjectSearch } from "@/src/features/materials/components/SubjectSearch";
import { materialTypes,	parcialOptions, subjects, } from "@/src/features/materials/data/materialOptions";
import { useCreateMaterial } from "@/src/features/materials/hooks/useMaterial";
import { useMaterialForm } from "@/src/features/materials/hooks/useMaterialForm";
import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";
import { pickFiles } from "@/src/features/materials/utils/filePicker";
import { partialLabel, validateForm } from "@/src/features/materials/utils/materialFormHelpers";

export default function MaterialCreateScreen() {
	const { values, errors, uiState, options, handlers } = useMaterialForm();
	const { submitMaterial, isSubmitting, points, clearPoints } = useCreateMaterial();

	useFocusEffect(
		useCallback(() => {
			errors.set(null);
		}, []),
	);

	const handlePickFiles = async () => {
		const selectedFiles = await pickFiles();
		if (selectedFiles.length === 0) return;
		handlers.addFiles(selectedFiles);
	};

	const handleSubmit = () => {
		const error = validateForm(values);
		if (error) {
			errors.set(error);
			return;
		}
		errors.set(null);
		submitMaterial(values);
	};

	const handleClosePoints = () => {
		clearPoints();
		handlers.resetForm();
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar style="dark" />
			<KeyboardAvoidingView
				behavior={Platform.select({ ios: "padding", default: undefined })}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.content}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.header}>
						<View style={styles.headerTextWrap}>
							<Text style={styles.brand}>UTNotas</Text>
							<Text style={styles.title}>Subi tu material de estudio</Text>
						</View>
					</View>

					<View style={styles.formSurface}>
						<FormField label="Titulo*" error={errors.forField("titulo")}>
							<TextInput
								value={values.titulo}
								onChangeText={(value) => handlers.updateForm("titulo", value)}
								placeholder="Ej: Resumen Ecuaciones Diferenciales"
								placeholderTextColor="#8a94a6"
								style={styles.input}
							/>
						</FormField>

						<FormField label="Archivo*" error={errors.forField("archivos")}>
							<FileUploadField
								files={values.archivos}
								onAddFiles={handlePickFiles}
								onMoveFile={handlers.moveFile}
								onRemoveFile={handlers.removeFile}
							/>
						</FormField>

						<FormField label="Materia*" error={errors.forField("materiaId")}>
							<SubjectSearch
								value={values.materia}
								subjects={subjects}
								selectedSubject={options.selectedSubject}
								onSelect={handlers.handleSelectSubject}
							/>
						</FormField>

						{values.materiaId ? (
							<FormField label="Carrera*" error={errors.forField("carreraId")}>
								<SelectButton
									icon="book-open"
									label={values.carrera || "Seleccione una carrera"}
									onPress={() => handlers.setActiveSelector("career")}
								/>
							</FormField>
						) : null}

						<View style={styles.row}>
							<FormField
								label="Tipo de Material*"
								error={errors.forField("tipo")}
								style={styles.rowItem}
							>
								<SelectButton
									icon="tag"
									label={options.selectedMaterialType?.label ?? "Seleccione un tipo"}
									onPress={() => handlers.setActiveSelector("type")}
								/>
							</FormField>

							<FormField
								label="Ano de cursada (opcional)"
								error={errors.forField("anioCursada")}
								style={styles.rowItem}
							>
								<TextInput
									value={values.anioCursada}
									onChangeText={(value) =>
										handlers.updateForm("anioCursada", value.replace(/\D/g, ""))
									}
									placeholder="Ej: 2023"
									placeholderTextColor="#8a94a6"
									keyboardType="number-pad"
									maxLength={4}
									style={styles.input}
								/>
							</FormField>
						</View>

						<FormField label="Comision (opcional)" error={errors.forField("comision")}>
							<View style={styles.commissionRow}>
								<View style={styles.commissionPrefix}>
									<Text style={styles.commissionPrefixText}>
										{uiState.commissionPrefix || "--"}
									</Text>
								</View>
								<TextInput
									value={values.comision.replace(uiState.commissionPrefix, "")}
									onChangeText={handlers.handleCommissionDigit}
									editable={Boolean(uiState.commissionPrefix)}
									placeholder="2"
									placeholderTextColor="#8a94a6"
									keyboardType="number-pad"
									maxLength={1}
									style={[styles.input, styles.commissionInput]}
								/>
							</View>
						</FormField>

						{uiState.showParcialSelect ? (
							<FormField
								label="Parcial Relacionado (opcional)"
								error={errors.forField("parcial")}
							>
								<SelectButton
									icon="layers"
									label={partialLabel(values.parcial)}
									onPress={() => handlers.setActiveSelector("partial")}
								/>
							</FormField>
						) : null}

						<FormField
							label="Descripcion del material (opcional)"
							error={errors.forField("descripcion")}
						>
							<TextInput
								value={values.descripcion}
								onChangeText={(value) => handlers.updateForm("descripcion", value)}
								placeholder="Escribi una breve descripcion del material que estas subiendo."
								placeholderTextColor="#8a94a6"
								multiline
								textAlignVertical="top"
								style={[styles.input, styles.textArea]}
							/>
						</FormField>

						<Pressable
							accessibilityRole="button"
							disabled={isSubmitting}
							onPress={handleSubmit}
							style={({ pressed }) => [
								styles.submitButton,
								pressed && styles.pressed,
								isSubmitting && styles.disabledButton,
							]}
						>
							<Feather name="upload" size={20} color="#ffffff" />
							<Text style={styles.submitButtonText}>
								{isSubmitting ? "Subiendo..." : "Subir"}
							</Text>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<OptionSheet
				visible={uiState.activeSelector === "career"}
				title="Seleccione una carrera"
				options={options.availableCareers.map((c) => ({ label: c.nombre, value: c.id }))}
				emptyLabel="No hay carreras disponibles para esa materia."
				selectedValue={values.carreraId}
				onClose={() => handlers.setActiveSelector(null)}
				onSelect={handlers.handleSelectCareerId}
			/>

			<OptionSheet
				visible={uiState.activeSelector === "type"}
				title="Tipo de material"
				options={materialTypes.map((t) => ({ label: t.label, value: t.value }))}
				selectedValue={values.tipo || undefined}
				onClose={() => handlers.setActiveSelector(null)}
				onSelect={handlers.handleSelectTypeValue}
			/>

			<OptionSheet
				visible={uiState.activeSelector === "partial"}
				title="Parcial relacionado"
				options={parcialOptions}
				selectedValue={values.parcial}
				onClose={() => handlers.setActiveSelector(null)}
				onSelect={(value) => {
					handlers.updateForm("parcial", value);
					handlers.setActiveSelector(null);
				}}
			/>

			<PointsModal points={points} onClose={handleClosePoints} />
		</SafeAreaView>
	);
}

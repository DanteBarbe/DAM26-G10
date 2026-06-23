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
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo } from "react";
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
import { useToast } from "@/src/contexts/ToastContext";
import { FileUploadField } from "@/src/features/materials/components/FileUploadField";
import {
	materialTypes,
	parcialOptions,
} from "@/src/features/materials/data/materialOptions";
import {
	useCreateMaterial,
	useGetEditableMaterial,
	useUpdateMaterial,
} from "@/src/features/materials/hooks/useMaterial";
import { useMaterialForm } from "@/src/features/materials/hooks/useMaterialForm";
import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";
import type { MaterialFormData } from "@/src/features/materials/types/materials.types";
import { pickFiles } from "@/src/features/materials/utils/filePicker";
import {
	partialLabel,
	validateForm,
} from "@/src/features/materials/utils/materialFormHelpers";

export default function MaterialCreateScreen({
	editId,
}: { editId?: number } = {}) {
	// editId llega por prop desde la ruta de edicion (/material/edit/[id]).
	// La pestaña "Subir" renderiza esta pantalla sin editId -> siempre modo creacion.
	const editableMaterialId =
		typeof editId === "number" && Number.isFinite(editId) && editId > 0
			? editId
			: undefined;
	const isEditing = editableMaterialId !== undefined;
	const {
		material: editableMaterial,
		isLoading: isLoadingEditableMaterial,
		isNotFound: isEditableMaterialNotFound,
	} = useGetEditableMaterial(editableMaterialId);

	const initialFormValues = useMemo<MaterialFormData | undefined>(() => {
		if (!editableMaterial) return undefined;

		return {
			titulo: editableMaterial.titulo,
			descripcion: editableMaterial.descripcion,
			tipo: editableMaterial.tipo,
			archivos: editableMaterial.archivos,
			materiaId: editableMaterial.materiaId,
			carreraId: editableMaterial.carreraId,
			materia: editableMaterial.materia,
			carrera: editableMaterial.carrera,
			comision: editableMaterial.comision,
			parcial: editableMaterial.parcial,
			anioCursada: editableMaterial.anioCursada,
		};
	}, [editableMaterial]);

	const { showToast } = useToast();
	const { values, errors, uiState, options, handlers } = useMaterialForm(
		initialFormValues,
		isEditing ? `edit-${editableMaterialId}` : "create",
	);
	const { submitMaterial, isSubmitting } = useCreateMaterial();
	const { updateMaterial, isUpdating } = useUpdateMaterial();
	const setFormError = errors.set;
	const isSaving = isEditing ? isUpdating : isSubmitting;
	const title = isEditing
		? "Edita tu material de estudio"
		: "Subi tu material de estudio";
	const submitLabel = isEditing ? "Guardar cambios" : "Subir";
	const submittingLabel = isEditing ? "Guardando..." : "Subiendo...";

	useFocusEffect(
		useCallback(() => {
			setFormError(null);
		}, [setFormError]),
	);

	const handlePickFiles = async () => {
		const selectedFiles = await pickFiles();
		if (selectedFiles.length === 0) return;
		handlers.addFiles(selectedFiles);
	};

	const handleSubmit = () => {
		const error = validateForm(values);
		if (error) {
			setFormError(error);
			return;
		}
		setFormError(null);
		if (isEditing && editableMaterialId) {
			updateMaterial({ id: editableMaterialId, form: values });
			return;
		}

		submitMaterial(values, {
			onSuccess: () => {
				// limpia el formulario para que la proxima vez "Subir" arranque vacio.
				handlers.resetForm();
				showToast("Material de estudio creado exitosamente", "success", 3500);
			},
		});
	};

	if (isEditing && isLoadingEditableMaterial) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar style="dark" />
				<View style={styles.stateContent}>
					<Text style={styles.stateTitle}>Cargando material...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (isEditing && isEditableMaterialNotFound) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar style="dark" />
				<View style={styles.stateContent}>
					<Feather name="shield-off" size={56} color="#9a9284" />
					<Text style={styles.stateTitle}>Sin permiso</Text>
					<Text style={styles.stateText}>
						No tenés permiso para editar este material.
					</Text>
					<Pressable
						accessibilityRole="button"
						onPress={() => router.back()}
						style={styles.stateButton}
					>
						<Text style={styles.stateButtonText}>Volver</Text>
					</Pressable>
					<Pressable
						accessibilityRole="button"
						onPress={() => router.replace("/search")}
						style={styles.stateButtonSecondary}
					>
						<Text style={styles.stateButtonSecondaryText}>Ir a búsqueda</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

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
							<Text style={styles.title}>{title}</Text>
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
							<TextInput
								value={values.comision}
								onChangeText={(value) =>
									handlers.updateForm("comision", value.toUpperCase())
								}
								placeholder="Ej: K4061"
								placeholderTextColor="#8a94a6"
								autoCapitalize="characters"
								maxLength={10}
								style={styles.input}
							/>
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
							disabled={isSaving}
							onPress={handleSubmit}
							style={({ pressed }) => [
								styles.submitButton,
								pressed && styles.pressed,
								isSaving && styles.disabledButton,
							]}
						>
							<Feather
								name={isEditing ? "save" : "upload"}
								size={20}
								color="#ffffff"
							/>
							<Text style={styles.submitButtonText}>
								{isSaving ? submittingLabel : submitLabel}
							</Text>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

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
		</SafeAreaView>
	);
}

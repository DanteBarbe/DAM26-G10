import { useEffect, useMemo, useState } from "react";
import { getCareersForSubject, getCareerSubject, materialTypes, subjects, type MaterialType, type Subject, } from "@/src/features/materials/data/materialOptions";
import type { FieldError, FieldName, MaterialFormData, } from "@/src/features/materials/types/materials.types";
import { getCareerPrefix } from "@/src/features/materials/utils/materialFormHelpers";

/**
 * hook q centraliza estado del formulario de creacion de material.
 *
 * responsabilidades:
 * - estado de campos, errores de validacion y selector activo.
 * - logica de seleccion dependiente (materia -> carrera -> comision).
 * - derivados calculados (prefix comision, showParcialSelect, opciones disponibles).
 * - NO conoce pickFiles (infraestructura) ni useFocusEffect (ciclo de pantalla).
 */

const initialForm: MaterialFormData = {
	titulo: "",
	descripcion: "",
	tipo: "",
	archivos: [],
	materiaId: undefined,
	carreraId: undefined,
	materia: "",
	carrera: "",
	comision: "",
	parcial: "",
	anioCursada: "",
};

export const useMaterialForm = (
	initialValues: MaterialFormData = initialForm,
	formKey = "create",
) => {
	const [form, setForm] = useState<MaterialFormData>(initialValues);
	const [fieldError, setFieldError] = useState<FieldError | null>(null);
	const [activeSelector, setActiveSelector] = useState<"career" | "type" | "partial" | null>(null);

	useEffect(() => {
		setForm(initialValues);
		setFieldError(null);
		setActiveSelector(null);
	}, [formKey, initialValues]);

	const selectedSubject = useMemo(
		() => subjects.find((s) => s.id === form.materiaId),
		[form.materiaId],
	);

	const availableCareers = useMemo(
		() => getCareersForSubject(form.materiaId),
		[form.materiaId],
	);

	const selectedMaterialType = useMemo(
		() => materialTypes.find((t) => t.value === form.tipo),
		[form.tipo],
	);

	const careerSubject = useMemo(
		() => getCareerSubject(form.carreraId, form.materiaId),
		[form.carreraId, form.materiaId],
	);

	const commissionPrefix = useMemo(
		() => getCareerPrefix(form.carrera, careerSubject?.anio),
		[form.carrera, careerSubject?.anio],
	);

	const showParcialSelect =
		form.tipo === "PARCIAL" || form.tipo === "PARCIAL_RESUELTO";

	const fieldErrorFor = (field: FieldName) =>
		fieldError?.field === field ? fieldError.message : undefined;

	const clearFieldError = (field: FieldName) => {
		if (fieldError?.field === field) setFieldError(null);
	};

	const updateForm = <Key extends keyof MaterialFormData>(
		field: Key,
		value: MaterialFormData[Key],
	) => {
		setForm((current) => ({ ...current, [field]: value }));
		clearFieldError(field);
	};

	const handleSelectSubject = (subject: Subject | null) => {
		setForm((current) => ({
			...current,
			materiaId: subject?.id,
			materia: subject?.nombre ?? "",
			carreraId: undefined,
			carrera: "",
			comision: "",
		}));
		clearFieldError("materiaId");
	};

	// la screen pasa el id — el find vive aca, no en la vista
	const handleSelectCareerId = (careerId: number) => {
		const career = availableCareers.find((c) => c.id === careerId);
		if (!career) return;
		setForm((current) => ({
			...current,
			carreraId: career.id,
			carrera: career.nombre,
			comision: "",
		}));
		setActiveSelector(null);
		clearFieldError("carreraId");
	};

	// la screen pasa el value — el find vive aca, no en la vista
	const handleSelectTypeValue = (value: MaterialType["value"]) => {
		const type = materialTypes.find((t) => t.value === value);
		if (!type) return;
		setForm((current) => ({
			...current,
			tipo: type.value,
			parcial:
				type.value === "PARCIAL" || type.value === "PARCIAL_RESUELTO"
					? current.parcial
					: "",
		}));
		setActiveSelector(null);
		clearFieldError("tipo");
	};

	const handleCommissionDigit = (digit: string) => {
		const cleanDigit = digit.replace(/\D/g, "").slice(0, 1);
		updateForm("comision", cleanDigit ? `${commissionPrefix}${cleanDigit}` : "");
	};

	// addFiles: recibe los archivos ya seleccionados — pickFiles queda en la screen
	const addFiles = (files: MaterialFormData["archivos"]) => {
		setForm((current) => ({
			...current,
			archivos: [...current.archivos, ...files],
		}));
		clearFieldError("archivos");
	};

	const removeFile = (fileId: string) => {
		setForm((current) => ({
			...current,
			archivos: current.archivos.filter((f) => f.id !== fileId),
		}));
	};

	const moveFile = (index: number, direction: -1 | 1) => {
		setForm((current) => {
			const nextIndex = index + direction;
			if (nextIndex < 0 || nextIndex >= current.archivos.length) return current;
			const archivos = [...current.archivos];
			const [file] = archivos.splice(index, 1);
			archivos.splice(nextIndex, 0, file);
			return { ...current, archivos };
		});
	};

	const resetForm = () => {
		setForm(initialForm);
		setFieldError(null);
		setActiveSelector(null);
	};

	return {
		values: form,
		errors: {
			forField: fieldErrorFor,
			set: setFieldError,
		},
		uiState: {
			activeSelector,
			showParcialSelect,
			commissionPrefix,
		},
		options: {
			selectedSubject,
			availableCareers,
			selectedMaterialType,
		},
		handlers: {
			updateForm,
			handleSelectSubject,
			handleSelectCareerId,
			handleSelectTypeValue,
			handleCommissionDigit,
			addFiles,
			removeFile,
			moveFile,
			setActiveSelector,
			resetForm,
		},
	};
};

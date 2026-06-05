import { useState } from "react";

import type { FormErrors, SignupFormData } from "../types/auth.types";
import { validateSignup } from "../utils/authValidation";

const initialValues: SignupFormData = {
	career: null,
	name: "",
	surname: "",
	username: "",
	email: "",
	password: "",
};

/**
 * hook que centraliza el estado del registro en dos pasos.
 *
 * responsabilidades:
 * - paso 1 (carrera) y paso 2 (datos): controla en que paso esta el flujo.
 * - mantener valores, errores por campo y el error puntual de carrera.
 * - validar la carrera antes de avanzar y los datos antes de finalizar.
 */
export function useSignupForm() {
	const [step, setStep] = useState<1 | 2>(1);
	const [values, setValues] = useState<SignupFormData>(initialValues);
	const [errors, setErrors] = useState<FormErrors<SignupFormData>>({});
	const [careerError, setCareerError] = useState("");

	const setField = <Key extends keyof SignupFormData>(
		field: Key,
		value: SignupFormData[Key],
	) => {
		setValues((current) => ({ ...current, [field]: value }));
		setErrors((current) =>
			current[field] ? { ...current, [field]: undefined } : current,
		);
	};

	const selectCareer = (careerId: number) => {
		setValues((current) => ({ ...current, career: careerId }));
		setCareerError("");
	};

	// paso 1 -> paso 2: solo avanza si ya eligio una carrera.
	const goToForm = () => {
		if (values.career == null) {
			setCareerError("Seleccioná tu carrera para continuar");
			return;
		}
		setCareerError("");
		setStep(2);
	};

	const backToCareer = () => setStep(1);

	const validateForm = () => {
		const nextErrors = validateSignup(values);
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	return {
		step,
		values,
		errors,
		careerError,
		setField,
		selectCareer,
		goToForm,
		backToCareer,
		validateForm,
	};
}

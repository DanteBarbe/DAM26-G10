import { useState } from "react";

import type { FormErrors, LoginFormData } from "../types/auth.types";
import { validateLogin } from "../utils/authValidation";

const initialValues: LoginFormData = {
	email: "",
	password: "",
};

/**
 * hook que centraliza el estado del formulario de login.
 *
 * responsabilidades:
 * - mantener valores y errores por campo.
 * - limpiar el error de un campo cuando el usuario lo edita.
 * - validar todo el formulario en el submit.
 */
export function useLoginForm() {
	const [values, setValues] = useState<LoginFormData>(initialValues);
	const [errors, setErrors] = useState<FormErrors<LoginFormData>>({});

	const setField = <Key extends keyof LoginFormData>(
		field: Key,
		value: LoginFormData[Key],
	) => {
		setValues((current) => ({ ...current, [field]: value }));
		setErrors((current) =>
			current[field] ? { ...current, [field]: undefined } : current,
		);
	};

	const validate = () => {
		const nextErrors = validateLogin(values);
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	return { values, errors, setField, validate };
}

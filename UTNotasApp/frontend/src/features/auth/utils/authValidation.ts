/**
 * validaciones de los formularios de auth.
 *
 * responsabilidades:
 * - reglas puras (sin estado ni react): reciben los valores y devuelven errores.
 * - los hooks/pantallas deciden cuando ejecutarlas y como mostrar el resultado.
 */
import type { FormErrors, LoginFormData, SignupFormData } from "../types/auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;
const MIN_USERNAME = 3;

export function validateLogin(values: LoginFormData): FormErrors<LoginFormData> {
	const errors: FormErrors<LoginFormData> = {};

	const email = values.email.trim();
	if (!email) {
		errors.email = "Ingresá tu correo electrónico";
	} else if (!EMAIL_REGEX.test(email)) {
		errors.email = "El correo no es válido";
	}

	if (!values.password) {
		errors.password = "Ingresá tu contraseña";
	}

	return errors;
}

export function validateSignup(values: SignupFormData): FormErrors<SignupFormData> {
	const errors: FormErrors<SignupFormData> = {};

	if (!values.name.trim()) {
		errors.name = "Ingresá tu nombre";
	}

	if (!values.surname.trim()) {
		errors.surname = "Ingresá tu apellido";
	}

	const username = values.username.trim();
	if (!username) {
		errors.username = "Elegí un nombre de usuario";
	} else if (username.length < MIN_USERNAME) {
		errors.username = `Mínimo ${MIN_USERNAME} caracteres`;
	}

	const email = values.email.trim();
	if (!email) {
		errors.email = "Ingresá tu correo electrónico";
	} else if (!EMAIL_REGEX.test(email)) {
		errors.email = "El correo no es válido";
	}

	if (!values.password) {
		errors.password = "Ingresá una contraseña";
	} else if (values.password.length < MIN_PASSWORD) {
		errors.password = `Mínimo ${MIN_PASSWORD} caracteres`;
	}

	return errors;
}

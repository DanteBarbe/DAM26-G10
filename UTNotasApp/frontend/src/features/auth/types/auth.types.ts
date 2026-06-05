/**
 * tipos compartidos por la feature de autenticacion.
 */

export type LoginFormData = {
	email: string;
	password: string;
};

export type SignupFormData = {
	career: number | null;
	name: string;
	surname: string;
	username: string;
	email: string;
	password: string;
};

// errores por campo: clave = nombre del campo, valor = mensaje a mostrar.
export type FormErrors<T> = Partial<Record<keyof T, string>>;

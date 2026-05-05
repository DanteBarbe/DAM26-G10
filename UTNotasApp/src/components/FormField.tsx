import { memo } from "react";
import { Text, View, type ViewStyle } from "react-native";

import { formFieldStyles as styles } from "@/src/components/styles/FormField.styles";

type Props = {
	label: string;
	error?: string;
	children: React.ReactNode;
	style?: ViewStyle;
};

/**
 * componente contenedor que envuelve a cualquier elemento de entrada (input) mediante 'children'.
 * 
 * responsabilidades:
 * - centralizar label, error inline y espaciado vertical de cada campo.
 * - no se encarga de validar si lo que el usuario ingreso es correcto o incorrecto, ni de procesar reglas de negocio.
 *   Solamente espera que el componente padre (el que lo invoca) haga todas las validaciones necesarias y le pase 
 *   el texto definitivo que debe pintar en pantalla. (ej: MaterialCreateScreen).
 */
export const FormField = memo(function FormField({
	label,
	error,
	children,
	style,
}: Props) {
	return (
		<View style={[styles.field, style]}>
			<View style={styles.labelRow}>
				<Text style={styles.label}>{label}</Text>
				{error != null && error !== "" && (
					<Text
						style={styles.errorText}
						numberOfLines={2}
						accessibilityRole="alert"
					>
						{error}
					</Text>
				)}
			</View>
			{children}
		</View>
	);
});
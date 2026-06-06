import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
	Pressable,
	Text,
	TextInput,
	View,
	type KeyboardTypeOptions,
	type TextInputProps,
} from "react-native";

import { colors } from "@/src/styles/Colors";
import { authTextFieldStyles as styles } from "./styles/AuthTextField.styles";

type Props = {
	placeholder: string;
	value: string;
	onChangeText: (value: string) => void;
	error?: string;
	secure?: boolean;
	keyboardType?: KeyboardTypeOptions;
	autoCapitalize?: TextInputProps["autoCapitalize"];
};

/**
 * input de texto para los formularios de auth.
 *
 * responsabilidades:
 * - render del input con placeholder y error inline (sin label, como el diseño web).
 * - alternar la visibilidad de la contraseña cuando secure=true.
 */
export function AuthTextField({
	placeholder,
	value,
	onChangeText,
	error,
	secure = false,
	keyboardType,
	autoCapitalize = "none",
}: Props) {
	const [hidden, setHidden] = useState(true);
	const isHidden = secure && hidden;
	const hasError = error != null && error !== "";

	return (
		<View style={styles.field}>
			<View style={styles.inputWrap}>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={colors.textSoft}
					secureTextEntry={isHidden}
					keyboardType={keyboardType}
					autoCapitalize={autoCapitalize}
					autoCorrect={false}
					style={[
						styles.input,
						secure && styles.inputWithIcon,
						hasError && styles.inputError,
					]}
				/>
				{secure ? (
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={isHidden ? "Mostrar contraseña" : "Ocultar contraseña"}
						hitSlop={8}
						onPress={() => setHidden((current) => !current)}
						style={styles.eyeButton}
					>
						<Feather
							name={isHidden ? "eye-off" : "eye"}
							size={18}
							color={colors.textSoft}
						/>
					</Pressable>
				) : null}
			</View>
			{hasError ? (
				<Text style={styles.errorText} accessibilityRole="alert">
					{error}
				</Text>
			) : null}
		</View>
	);
}

import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authLayoutStyles as styles } from "./styles/AuthScreenLayout.styles";

// el logo reutiliza el icono "UT" de la app.
const logo = require("../../../../assets/images/icon.png");

type Props = {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
};

/**
 * contenedor visual compartido por las pantallas de auth (login / registro).
 *
 * responsabilidades:
 * - fondo, safe area y manejo del teclado.
 * - tarjeta centrada con logo, titulo y subtitulo opcional.
 * - NO contiene logica de formularios; solo presenta a sus children.
 */
export function AuthScreenLayout({ title, subtitle, children }: Props) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar style="dark" />
			<KeyboardAvoidingView
				behavior={Platform.select({ ios: "padding", default: undefined })}
				style={styles.flex}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.card}>
						<View style={styles.header}>
							<Image source={logo} style={styles.logo} contentFit="contain" />
							<Text style={styles.title}>{title}</Text>
							{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
						</View>
						{children}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

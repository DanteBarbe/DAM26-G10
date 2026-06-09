import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { AuthUser } from "@/src/contexts/AuthContext";
import { colors } from "@/src/styles/Colors";
import { formatJoinDate, getLevelLabel } from "../utils/profileHelpers";
import { profileCardStyles as styles } from "./styles/ProfileCard.styles";

/**
 * tarjeta de perfil: avatar, nombre, usuario, carrera, fecha de alta y nivel.
 * Toma del usuario lo que haya disponible y usa fallbacks para el resto.
 */
export function ProfileCard({ user }: { user: AuthUser }) {
	const fallbackHandle = user.email.split("@")[0];
	const fullName = [user.name, user.surname].filter(Boolean).join(" ");
	const displayName = fullName || user.username || fallbackHandle;
	const username = user.username ?? fallbackHandle;
	const points = user.points ?? 0;

	return (
		<View style={styles.card}>
			<View style={styles.avatar}>
				<Feather name="user" size={40} color={colors.primary} />
			</View>

			<Text style={styles.name}>{displayName}</Text>
			<Text style={styles.username}>@{username}</Text>

			{user.careerName ? (
				<Text style={styles.career}>Estudiante de {user.careerName}</Text>
			) : null}

			<View style={styles.metaRow}>
				<Feather name="calendar" size={14} color={colors.textMuted} />
				<Text style={styles.metaText}>Se unió en {formatJoinDate(user.joinedAt)}</Text>
			</View>

			<View style={styles.levelBadge}>
				<Feather name="award" size={14} color={colors.primaryDark} />
				<Text style={styles.levelText}>
					{getLevelLabel(points)} · {points} pts
				</Text>
			</View>
		</View>
	);
}

import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { skeletonBlockStyles as styles } from "./styles/SkeletonBlock.styles";

/**
 * bloque shimmer generico reutilizable x clq skeleton del proyecto.
 *
 * responsabilidades:
 * - anima opacity entre opaco y transparente simulando carga.
 * - acepta width, height y borderRadius como props para adaptarse a clq forma.
 * - no conoce ningun dominio.
 */

type Props = {
	width?: number | `${number}%`;
	height?: number;
	borderRadius?: number;
};

export function SkeletonBlock({ width = "100%", height = 16, borderRadius = 8 }: Props) {
	const opacity = useRef(new Animated.Value(0.4)).current;

	useEffect(() => {
		// loop de pulso: 0.4 → 1 → 0.4, 900ms x ciclo
		const anim = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
				Animated.timing(opacity, { toValue: 0.4, duration: 450, useNativeDriver: true }),
			]),
		);
		anim.start();
		// limpieza obligatoria al desmontar
		return () => anim.stop();
	}, [opacity]);

	return (
		<Animated.View
			style={[
				styles.block,
				{ width, height, borderRadius, opacity },
			]}
		/>
	);
}
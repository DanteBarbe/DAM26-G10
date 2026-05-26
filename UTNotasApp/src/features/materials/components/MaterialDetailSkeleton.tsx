import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SkeletonBlock } from "@/src/components/SkeletonBlock";
import { materialDetailSkeletonStyles as styles } from "@/src/features/materials/components/styles/MaterialDetailSkeleton.styles";
import { GlobalStyles } from "@/src/styles/Global.styles";

/**
 * skeleton de la pantalla de detalle de material.
 *
 * responsabilidades:
 * - replica la estructura visual exacta de materialdetailscreen en estado de carga.
 * - usa skeletonblock como primitiva — no define animaciones propias.
 * - cuando haya datos reales, este componente se desmonta y no deja cls.
 */

export function MaterialDetailSkeleton() {
	return (
		<SafeAreaView style={GlobalStyles.safeArea}>
			<StatusBar style="dark" />
			<ScrollView contentContainerStyle={GlobalStyles.content} scrollEnabled={false}>

				<View style={styles.headerWrap}>
					<SkeletonBlock width="30%" height={13} />
					<SkeletonBlock width="55%" height={28} borderRadius={6} />
				</View>

				{/* infoCard */}
				<View style={styles.infoCard}>

					{/* titulo + boton trash */}
					<View style={styles.infoTopRow}>
						<View style={styles.titleWrap}>
							<SkeletonBlock width="70%" height={22} />
							<SkeletonBlock width="50%" height={13} />
						</View>
						<SkeletonBlock width={34} height={34} borderRadius={8} />
					</View>

					{/* descripcion */}
					<View style={styles.descriptionWrap}>
						<SkeletonBlock width="100%" height={13} />
						<SkeletonBlock width="80%" height={13} />
					</View>

					{/* badges */}
					<View style={styles.badgeRow}>
						<SkeletonBlock width={80} height={30} borderRadius={8} />
						<SkeletonBlock width={100} height={30} borderRadius={8} />
					</View>

					{/* meta items — replica los 3 MaterialInfoItem */}
					<View style={styles.metaGrid}>
						{[0, 1, 2].map((i) => (
							<View key={i} style={styles.infoItem}>
								<SkeletonBlock width={17} height={17} borderRadius={4} />
								<View style={styles.infoTextWrap}>
									<SkeletonBlock width="30%" height={11} />
									<SkeletonBlock width="55%" height={14} />
								</View>
							</View>
						))}
					</View>
				</View>

				{/* previewCard — replica header del archivo */}
				<View style={styles.previewCard}>
					<View style={styles.previewHeader}>
						<SkeletonBlock width={20} height={20} borderRadius={4} />
						<SkeletonBlock width="60%" height={14} />
					</View>
					<View style={styles.previewBody}>
						<SkeletonBlock width="82%" height={290} borderRadius={8} />
					</View>
				</View>

			</ScrollView>
		</SafeAreaView>
	);
}
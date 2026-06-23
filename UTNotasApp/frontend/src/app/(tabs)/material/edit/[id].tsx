import { useLocalSearchParams } from "expo-router";

import { useAuth } from "@/src/features/auth/AuthContext";
import { AuthRequiredNotice } from "@/src/features/auth/components/AuthRequiredNotice";
import MaterialCreateScreen from "@/src/features/materials/screens/MaterialCreateScreen";

/**
 * editar material requiere sesion. Ruta separada de /create para que la pestaña
 * "Subir" siempre abra en modo creacion (sin arrastrar el editId de una edicion
 * previa). El guard cubre el acceso directo (deep-link) a /material/edit/:id.
 */
export default function EditMaterialRoute() {
	const { isAuthenticated } = useAuth();
	const { id } = useLocalSearchParams<{ id?: string }>();
	const editId = Number(id);

	if (!isAuthenticated) {
		return (
			<AuthRequiredNotice message="Iniciá sesión o registrate para editar un material." />
		);
	}

	return (
		<MaterialCreateScreen editId={Number.isFinite(editId) ? editId : undefined} />
	);
}

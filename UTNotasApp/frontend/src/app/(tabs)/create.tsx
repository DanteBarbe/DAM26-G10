import { useAuth } from "@/src/contexts/AuthContext";
import { AuthRequiredNotice } from "@/src/features/auth/components/AuthRequiredNotice";
import MaterialCreateScreen from "@/src/features/materials/screens/MaterialCreateScreen";

/**
 * subir material requiere sesion. La intercepcion del tab muestra un aviso
 * antes de navegar; este guard cubre el acceso directo (deep-link) a /create.
 */
export default function CreateRoute() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return (
			<AuthRequiredNotice message="Iniciá sesión o registrate para subir un material." />
		);
	}

	return <MaterialCreateScreen />;
}

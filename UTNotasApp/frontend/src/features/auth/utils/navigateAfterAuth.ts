import { router } from "expo-router";

/**
 * vuelve a la app despues de iniciar sesion o registrarse.
 *
 * descarta las pantallas de auth que quedaron apiladas (perfil / login /
 * registro) para dejar al usuario en el home con un stack limpio.
 */
export function navigateAfterAuth() {
	if (router.canDismiss()) {
		router.dismissAll();
	} else {
		router.replace("/");
	}
}

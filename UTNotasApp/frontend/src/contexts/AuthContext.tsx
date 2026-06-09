import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export type AuthUser = {
	name?: string;
	surname?: string;
	username?: string;
	email: string;
	careerId?: number;
	careerName?: string;
	points?: number;
	joinedAt?: string;
};

/**
 * estado de sesion del lado del cliente (solo frontend, en memoria).
 *
 * responsabilidades:
 * - exponer si hay sesion activa y los datos basicos del usuario.
 * - permitir iniciar sesion / cerrarla.
 * - NO habla con el backend todavia: signIn solo guarda al usuario.
 *   Cuando exista el backend, signIn pasara a validar credenciales reales y
 *   los datos (puntos, fecha de alta, etc.) vendran del servidor.
 */
type AuthContextType = {
	isAuthenticated: boolean;
	user: AuthUser | null;
	signIn: (user: AuthUser) => void;
	signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);

	// completa valores que (por ahora) no tenemos del backend.
	const signIn = useCallback((nextUser: AuthUser) => {
		setUser({ points: 0, joinedAt: new Date().toISOString(), ...nextUser });
	}, []);

	const signOut = useCallback(() => setUser(null), []);

	const value = useMemo(
		() => ({ isAuthenticated: user !== null, user, signIn, signOut }),
		[user, signIn, signOut],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
	}
	return context;
}

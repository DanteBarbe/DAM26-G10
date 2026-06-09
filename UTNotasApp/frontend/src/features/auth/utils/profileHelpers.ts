/**
 * helpers de presentacion del perfil.
 */

// nivel simple derivado de los puntos (placeholder hasta tener backend).
export const getLevelLabel = (points: number) =>
	`Nivel ${Math.floor(points / 100) + 1}`;

// "Se unio en {mes año}" a partir de una fecha ISO.
export const formatJoinDate = (iso?: string) => {
	if (!iso) return "—";
	return new Intl.DateTimeFormat("es-AR", {
		month: "long",
		year: "numeric",
	}).format(new Date(iso));
};

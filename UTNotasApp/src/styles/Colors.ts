/**
 * responsabilidades:
 * - unica fuente de colores, tipografia y espaciado.
 */

export const colors = Object.freeze({
	// superficies
	background:    "#f5f7f2",
	surface:       "#ffffff",

	// textos
	text:          "#28241e",
	textMuted:     "#635d52",
	textSoft:      "#746c61",

	// bordes
	border:        "#ddd7cb",

	// primario (verde)
	primary:       "#2f6f4e",
	primaryDark:   "#214f37",

	// secundario (marron)
	secondary:     "#7b5f43",

	// fondos suaves
	softPrimary:   "rgba(47, 111, 78, 0.12)",
	softSecondary: "rgba(123, 95, 67, 0.12)",

	// acento azul
	bluePrimary:   "#1f63b5",

	// naranja/advertencia
	orange:        "#c97913",

	// tokens de estado — usados x ErrorState, FormField, ConfirmModal
	error:         "#c0392b",
	errorLight:    "rgba(192, 57, 43, 0.10)",
	errorText:     "#922b21",

	success:       "#247a48",
	successLight:  "rgba(36, 122, 72, 0.10)",
	successText:   "#1a5c36",

	warning:       "#c97913",
	warningLight:  "rgba(201, 121, 19, 0.10)",
	warningText:   "#7d4c0b",

	info:          "#1f63b5",
	infoLight:     "rgba(31, 99, 181, 0.10)",
	infoText:      "#154a8a",
}) as {
	background:    string;
	surface:       string;
	text:          string;
	textMuted:     string;
	textSoft:      string;
	border:        string;
	primary:       string;
	primaryDark:   string;
	secondary:     string;
	softPrimary:   string;
	softSecondary: string;
	bluePrimary:   string;
	orange:        string;
	error:         string;
	errorLight:    string;
	errorText:     string;
	success:       string;
	successLight:  string;
	successText:   string;
	warning:       string;
	warningLight:  string;
	warningText:   string;
	info:          string;
	infoLight:     string;
	infoText:      string;
};

export const typography = Object.freeze({
	h1:    28,
	h2:    22,
	h3:    18,
	body:  15,
	small: 13,
	tiny:  11,
});

export const spacing = Object.freeze({
	xs:  4,
	sm:  8,
	md:  16,
	lg:  24,
	xl:  32,
});
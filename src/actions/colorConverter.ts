import { CxFFile } from "@/lib/types";
import { parseXML } from "@/lib/utils";

type ILLUMINANT = "d50" | "d65";
type OBSERVER = "2" | "10";
type STEP = 5 | 10;

const STDOBSERV: OBSERVER = "2"; // 2 (initial) lub 10
const REFERENCE_ILLUM: ILLUMINANT = "d50"; // d50 (initial) lub d65
const SPECTRUM_STEP: STEP = 10; //@TODO 5

// Standard observer (2°) and Illuminant D50
const STDOBSERV_X2 = [
	0.0, 0.0, 0.0001299, 0.0004149, 0.001368, 0.004243, 0.01431, 0.04351, 0.13438, 0.2839, 0.34828,
	0.3362, 0.2908, 0.19536, 0.09564, 0.03201, 0.0049, 0.0093, 0.06327, 0.1655, 0.2904, 0.4334499,
	0.5945, 0.7621, 0.9163, 1.0263, 1.0622, 1.0026, 0.8544499, 0.6424, 0.4479, 0.2835, 0.1649, 0.0874,
	0.04677, 0.0227, 0.01135916, 0.005790346, 0.002899327, 0.001439971, 0.0006900786, 0.0003323011,
	0.0001661505, 0.00008307527, 0.00004150994, 0.00002067383, 0.00001025398, 0.000005085868,
	0.000002522525, 0.000001251141,
] as const;

const STDOBSERV_Y2 = [
	0.0, 0.0, 0.000003917, 0.00001239, 0.000039, 0.00012, 0.000396, 0.00121, 0.004, 0.0116, 0.023,
	0.038, 0.06, 0.09098, 0.13902, 0.20802, 0.323, 0.503, 0.71, 0.862, 0.954, 0.9949501, 0.995, 0.952,
	0.87, 0.757, 0.631, 0.503, 0.381, 0.265, 0.175, 0.107, 0.061, 0.032, 0.017, 0.00821, 0.004102,
	0.002091, 0.001047, 0.00052, 0.0002492, 0.00012, 0.00006, 0.00003, 0.00001499, 0.0000074657,
	0.0000037029, 0.0000018366, 0.00000091093, 0.00000045181,
] as const;

const STDOBSERV_Z2 = [
	0.0, 0.0, 0.0006061, 0.001946, 0.006450001, 0.02005001, 0.06785001, 0.2074, 0.6456, 1.3856,
	1.74706, 1.77211, 1.6692, 1.28764, 0.8129501, 0.46518, 0.272, 0.1582, 0.07824999, 0.04216, 0.0203,
	0.008749999, 0.0039, 0.0021, 0.001650001, 0.0011, 0.0008, 0.00034, 0.00019, 0.00004999999,
	0.00002, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0,
] as const;

const STDOBSERV_X10 = [
	0.0, 0.0, 0.0000001222, 0.0000059586, 0.000159952, 0.0023616, 0.0191097, 0.084736, 0.204492,
	0.314679, 0.383734, 0.370702, 0.302273, 0.195618, 0.080507, 0.016172, 0.003816, 0.037465,
	0.117749, 0.236491, 0.376772, 0.529826, 0.705224, 0.878655, 1.01416, 1.11852, 1.12399, 1.03048,
	0.856297, 0.647467, 0.431567, 0.268329, 0.152568, 0.0812606, 0.0408508, 0.0199413, 0.00957688,
	0.00455263, 0.00217496, 0.00104476, 0.000508258, 0.000250969, 0.00012639, 0.0000645258,
	0.0000334117, 0.0000176115, 0.00000941363, 0.00000509347, 0.00000279531, 0.00000155314,
] as const;

const STDOBSERV_Y10 = [
	0.0, 0.0, 0.000000013398, 0.0000006511, 0.000017364, 0.0002534, 0.0020044, 0.008756, 0.021391,
	0.038676, 0.062077, 0.089456, 0.128201, 0.18519, 0.253589, 0.339133, 0.460777, 0.606741, 0.761757,
	0.875211, 0.961988, 0.991761, 0.99734, 0.955552, 0.868934, 0.777405, 0.658341, 0.527963, 0.398057,
	0.283493, 0.179828, 0.107633, 0.060281, 0.0318004, 0.0159051, 0.0077488, 0.00371774, 0.00176847,
	0.00084619, 0.00040741, 0.00019873, 0.000098428, 0.000049737, 0.000025486, 0.000013249,
	0.0000070128, 0.00000376473, 0.00000204613, 0.00000112809, 0.0000006297,
] as const;

const STDOBSERV_Z10 = [
	0.0, 0.0, 0.000000535027, 0.0000261437, 0.000704776, 0.0104822, 0.0860109, 0.389366, 0.972542,
	1.55348, 1.96728, 1.9948, 1.74537, 1.31756, 0.772125, 0.415254, 0.218502, 0.112044, 0.060709,
	0.030451, 0.013676, 0.003988, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
] as const;

const REFERENCE_ILLUM_D50 = [
	17.92, 20.98, 23.91, 25.89, 24.45, 29.83, 49.25, 56.45, 59.97, 57.76, 74.77, 87.19, 90.56, 91.32,
	95.07, 91.93, 95.7, 96.59, 97.11, 102.09, 100.75, 102.31, 100.0, 97.74, 98.92, 93.51, 97.71,
	99.29, 99.07, 95.75, 98.9, 95.71, 98.24, 103.06, 99.19, 87.43, 91.66, 92.94, 76.89, 86.56, 92.63,
	78.27, 57.72, 82.97, 78.31, 79.59, 73.44, 63.95, 70.81, 74.48,
] as const;

const REFERENCE_ILLUM_D65 = [
	39.9, 44.86, 46.59, 51.74, 49.92, 54.6, 82.69, 91.42, 93.37, 86.63, 104.81, 116.96, 117.76,
	114.82, 115.89, 108.78, 109.33, 107.78, 104.78, 107.68, 104.4, 104.04, 100.0, 96.34, 95.79, 88.69,
	90.02, 89.61, 87.71, 83.3, 83.72, 80.05, 80.24, 82.3, 78.31, 69.74, 71.63, 74.37, 61.62, 69.91,
	75.11, 63.61, 46.43, 66.83, 63.4, 64.32, 59.47, 51.97, 57.46, 60.33,
] as const;

const REF_STDOBSERV_TABLE = {
	"2": { x: STDOBSERV_X2, y: STDOBSERV_Y2, z: STDOBSERV_Z2 },
	"10": { x: STDOBSERV_X10, y: STDOBSERV_Y10, z: STDOBSERV_Z10 },
} as const;

const REF_ILLUM_TABLE = {
	d50: REFERENCE_ILLUM_D50,
	d65: REFERENCE_ILLUM_D65,
} as const;

// Normalizaca danych wejściowych do pełnego spektrum 340–830nm co 10nm
function normalizeSpectrum(values: number[], startWL: number, step: STEP) {
	if (!Array.isArray(values) || values.length === 0) {
		throw new Error("Tablica wartości spektralnych nie może być pusta.");
	}

	if (typeof startWL !== "number" || startWL < 340 || startWL > 830) {
		throw new Error("StartWL musi być liczbą z zakresu 340-830.");
	}

	const length = values.length;
	const normalized = new Array(50).fill(0);
	const offset = Math.round((startWL - 340) / step);

	if (offset < 0 || offset + length > 50) {
		throw new Error("Spektrum wykracza poza obsługiwany zakres 340-830.");
	}

	for (let i = 0; i < length; i++) {
		normalized[offset + i] = values[i];
	}

	return normalized;
}

// Konwersja spektrum do XYZ | illuminant="d50" lub "d65" | observer="2" lub "10"
function spectralToXYZ(sample: number[], illuminant: ILLUMINANT, observer: OBSERVER) {
	if (!REF_ILLUM_TABLE[illuminant]) {
		throw new Error('Nieznany illuminant. Użyj "d50" lub "d65".');
	}

	if (!REF_STDOBSERV_TABLE[observer]) {
		throw new Error('Nieznany standard observer. Użyj "2" lub "10".');
	}

	// Illuminant standard
	const referenceIllum = REF_ILLUM_TABLE[illuminant];

	// Rozkład X, Y, Z widma dla wybranego standardu (stałe)
	const stdObsX = REF_STDOBSERV_TABLE[observer].x;
	const stdObsY = REF_STDOBSERV_TABLE[observer].y;
	const stdObsZ = REF_STDOBSERV_TABLE[observer].z;

	// Normalizacja danych wejściiowych

	// Denominator jest stały dla współrzędnych X, Y i Z. Oblicz go raz i użyj ponownie.
	const denom = stdObsY.map((v, i) => v * referenceIllum[i]!);

	// Tablica mnożona przez wybrane źródła światła
	const sampleByRefIllum = sample.map((v, i) => v * referenceIllum[i]!);

	const xNumerator = sampleByRefIllum.map((v, i) => v * stdObsX[i]!);
	const yNumerator = sampleByRefIllum.map((v, i) => v * stdObsY[i]!);
	const zNumerator = sampleByRefIllum.map((v, i) => v * stdObsZ[i]!);

	const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

	const denomSum = sum(denom);

	if (denomSum === 0) {
		throw new Error("Dzielenie przez zero w normalizacji XYZ, sprawdź dane wejściowe.");
	}

	return {
		x: parseFloat((sum(xNumerator) / denomSum).toFixed(4)),
		y: parseFloat((sum(yNumerator) / denomSum).toFixed(4)),
		z: parseFloat((sum(zNumerator) / denomSum).toFixed(4)),
	};
}

// wyciągniecie z przkazanego json sepctrum lub Lab i przkształcenie w XYZ
function parseCxFtoXYZ(cxfFile: string) {
	const cxf = parseXML<CxFFile>(cxfFile);
	const reflectanceCxF =
		cxf["cc:CxF"]["cc:Resources"]?.["cc:ObjectCollection"]?.["cc:Object"]["cc:ColorValues"][
			"cc:ReflectanceSpectrum"
		];

	if (!reflectanceCxF) {
		throw new Error("Brak spektrum odbicia w przkazanym pliku CxF.");
	}

	const startWl = reflectanceCxF[0]?.["@_StartWL"];
	const colorSpec = reflectanceCxF[0]?.["@_ColorSpecification"];
	let illuminant = REFERENCE_ILLUM;
	let observer = STDOBSERV;

	//Szuka w specyfikacji koloru ciagów znaków D50, D65 jeżeli nie ma REFERENCE_ILLUM = d50
	if (colorSpec?.toUpperCase().indexOf("D50") !== -1) {
		illuminant = "d50";
	} else if (colorSpec?.toUpperCase().indexOf("D65") !== -1) {
		illuminant = "d65";
	}

	//Szuka w specyfikacji koloru ciagów znaków 10 lub 2 jeżeli nie ma STDOBSERV = 2
	if (colorSpec?.slice(-2) === "10") {
		observer = "10";
	} else if (colorSpec?.slice(-1) === "2") {
		observer = "2";
	}

	const reflectanceSpectrum = reflectanceCxF[0]
		? reflectanceCxF[0]["#text"].split(/\s+/).map((val) => parseFloat(val))
		: [];

	// STDOBSERV, REFERENCE_ILLUM, SPECTRUM_STEP zdefiniowane na początku skryptu
	const normalizeSpectrumBase = normalizeSpectrum(
		reflectanceSpectrum,
		Number(startWl),
		SPECTRUM_STEP
	);

	return spectralToXYZ(normalizeSpectrumBase, illuminant, observer);
}

// Konwersja XYZ to LAB
function xyzToLab(xyz: { x: number; y: number; z: number }) {
	// Observer = 2°, Illuminant = D65
	// let x = xyz.x / 95.047;
	// let y = xyz.y / 100.0;
	// let z = xyz.z / 108.883;

	// Observer = 2°, Illuminant = D50
	let x = (xyz.x * 100) / 96.422;
	let y = (xyz.y * 100) / 100.0;
	let z = (xyz.z * 100) / 82.521;

	const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

	const l = 116 * f(y) - 16;
	const a = 500 * (f(x) - f(y));
	const b = 200 * (f(y) - f(z));

	return { l: l.toFixed(2), a: a.toFixed(2), b: b.toFixed(2) };
}

// Konwersja XYZ do sRGB
function xyzToSRGB(xyz: { x: number; y: number; z: number }) {
	// Przekształcenie XYZ do Linear RGB (matryca sRGB dla D50 – adaptowana Bradfordem)
	const rLin = 3.1338561 * xyz.x - 1.6168667 * xyz.y - 0.4906146 * xyz.z;
	const gLin = -0.9787684 * xyz.x + 1.9161415 * xyz.y + 0.033454 * xyz.z;
	const bLin = 0.0719453 * xyz.x - 0.2289914 * xyz.y + 1.4052427 * xyz.z;

	// Kompresja gamma (sRGB standard)
	const gammaCorrect = (c: number) =>
		c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

	const clamp = (v: number) => Math.max(0, Math.min(1, gammaCorrect(v)));

	return {
		r: Math.floor(clamp(rLin) * 255),
		g: Math.floor(clamp(gLin) * 255),
		b: Math.floor(clamp(bLin) * 255),
	};
}

// Konwersja RGB to CMYK
function rgbToCmyk(r: number, g: number, b: number) {
	// Normalize to [0–1]
	const rN = r / 255;
	const gN = g / 255;
	const bN = b / 255;

	const k = 1 - Math.max(rN, gN, bN);
	const c = (1 - rN - k) / (1 - k) || 0;
	const m = (1 - gN - k) / (1 - k) || 0;
	const y = (1 - bN - k) / (1 - k) || 0;

	return {
		c: Math.floor(c * 100),
		m: Math.floor(m * 100),
		y: Math.floor(y * 100),
		k: Math.floor(k * 100),
	};
}

function rgbToHex(r: number, g: number, b: number): string {
	const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
	const toHex = (v: number) => clamp(v).toString(16).padStart(2, "0").toUpperCase();

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export async function cxfConverter(jsonCxF: string) {
	if (!jsonCxF) {
		throw new Error("Brak danych przkazanych.");
	}

	const xyzResult = parseCxFtoXYZ(jsonCxF);

	if (!xyzResult) {
		throw new Error("Cos poszło nie tak przy przkształcaniu danych z CxF do XYZ.");
	}

	const srgb = xyzToSRGB(xyzResult);
	const lab = xyzToLab(xyzResult);
	const cmyk = rgbToCmyk(srgb.r, srgb.g, srgb.b);
	const hex = rgbToHex(srgb.r, srgb.g, srgb.b);

	return [
		{ space: "sRGB", value: `${srgb.r},${srgb.g},${srgb.b}` },
		{ space: "LAB", value: `${lab.l},${lab.a},${lab.b}` },
		{ space: "CMYK", value: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%` },
		{ space: "HEX", value: hex },
	];
}

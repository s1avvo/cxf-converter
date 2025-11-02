import { REF_ILLUM_TABLE, REF_STDOBSERV_TABLE } from "@/lib/constant";
import type { ParsedSpectrum, CxFFile, Illuminants, Observers } from "@/lib/types";
import { applyChromaticAdaptation, parseXML } from "@/lib/utils";
import { cbrt, dotMultiply, floor, multiply, sqrt, sum, atan2, max, min, round } from "mathjs";

// Normalizaca danych wejściowych do pełnego spektrum 340–830nm co 10nm
function normalizeSpectrum(
	values: number[],
	startWL: number | undefined,
	step: number | undefined
) {
	if (!values || values.length === 0) {
		throw new Error("Brak danych spektrum do normalizacji.");
	}

	if (!startWL || startWL < 340 || startWL > 830) {
		throw new Error("StartWL musi być liczbą z zakresu 340-830.");
	}

	if (!step) {
		throw new Error("Step musi być zdefiniowany.");
	}

	const totalPoints = floor((830 - 340) / step) + 1;
	const normalized = new Array(totalPoints);

	// Oblicz indeks początkowy w znormalizowanym widmie
	const offset = round((startWL - 340) / step);
	const endIndex = offset + values.length - 1;

	for (let i = 0; i < totalPoints; i++) {
		if (i < offset) {
			// przed początkiem danych – użyj pierwszej wartości
			normalized[i] = values[0];
		} else if (i > endIndex) {
			// za końcem danych – użyj ostatniej wartości
			normalized[i] = values[values.length - 1];
		} else {
			// wewnątrz zakresu – przepisz dane
			normalized[i] = values[i - offset];
		}
	}

	return normalized;
}

export function getSpectrumFromCxF(cxfFile: string) {
	const cxf = parseXML<CxFFile>(cxfFile);

	const reflectanceList =
		cxf["cc:CxF"]["cc:Resources"]?.["cc:ObjectCollection"]?.["cc:Object"]?.["cc:ColorValues"]?.[
			"cc:ReflectanceSpectrum"
		];

	if (!reflectanceList || reflectanceList.length === 0) {
		throw new Error("Brak danych spektrum w pliku CxF.");
	}

	const colorSpecs =
		cxf["cc:CxF"]["cc:Resources"]?.["cc:ColorSpecificationCollection"]?.["cc:ColorSpecification"];

	const results = reflectanceList
		.filter((r) => r["@_ColorSpecification"])
		.map((r, idx) => {
			const id = r["@_ColorSpecification"];

			const spec = colorSpecs?.find((s) => s["@_Id"] === id);

			if (!spec) return null;

			const startWl = spec["cc:MeasurementSpec"]?.["cc:WavelengthRange"]?.["@_StartWL"];
			const steps = spec["cc:MeasurementSpec"]?.["cc:WavelengthRange"]?.["@_Increment"];
			const illuminant = spec["cc:TristimulusSpec"]?.["cc:Illuminant"].toLowerCase() as Illuminants;
			const observer = spec["cc:TristimulusSpec"]?.["cc:Observer"].split("_")[0] as Observers;

			const spectrumRaw = reflectanceList[idx]?.["#text"].split(/\s+/).map(Number) ?? [];
			const spectrum = normalizeSpectrum(spectrumRaw, startWl, steps) as number[];

			return {
				id,
				illuminant,
				observer,
				spectrum,
			};
		})
		.filter(Boolean) as ParsedSpectrum[];

	return results;
}

// Konwersja spektrum do XYZ | illuminant="d50" lub "d65" | observer="2" lub "10"
function spectralToXYZ(sample: number[], illuminant: Illuminants, observer: Observers) {
	const referenceIllum = REF_ILLUM_TABLE[illuminant];
	if (!referenceIllum) {
		throw new Error(`Nieznany illuminant: ${illuminant}`);
	}

	const stdObs = REF_STDOBSERV_TABLE[observer];
	if (!stdObs) {
		throw new Error(`Nieznany observer: ${observer}`);
	}

	if (
		!Array.isArray(sample) ||
		sample.length !== referenceIllum.length ||
		stdObs.x.length !== referenceIllum.length
	) {
		throw new Error("Długość tablic niezgodna - sprawdź dane wejściowe.");
	}

	// Denominator jest stały dla współrzędnych X, Y i Z. Oblicz go raz i użyj ponownie.
	const denom = dotMultiply(stdObs.y as number[], referenceIllum as number[]);

	// Tablica mnożona przez wybrane źródła światła
	const sampleByRef = dotMultiply(sample, referenceIllum as number[]);

	const xNum = dotMultiply(sampleByRef, stdObs.x as number[]);
	const yNum = dotMultiply(sampleByRef, stdObs.y as number[]);
	const zNum = dotMultiply(sampleByRef, stdObs.z as number[]);

	const denomSum = sum(denom);
	if (denomSum === 0) {
		throw new Error(
			"Denominator wynosi zero - nieprawidłowe źródło światła lub obserwator odniesienia"
		);
	}

	const X = sum(xNum) / denomSum;
	const Y = sum(yNum) / denomSum;
	const Z = sum(zNum) / denomSum;

	return { x: X, y: Y, z: Z };
}

// Konwersja XYZ to OKLab
export function xyzToOklab(xyz: { x: number; y: number; z: number }, illuminant: Illuminants) {
	let adaptedXYZ = [xyz.x, xyz.y, xyz.z];

	if (illuminant === "d50") {
		adaptedXYZ = applyChromaticAdaptation(xyz.x, xyz.y, xyz.z, illuminant, "d65", "2") as [
			number,
			number,
			number,
		];
	}

	//Matrices from Björn Ottosson's OKLab definition
	const M1 = [
		[0.8189330101, 0.3618667424, -0.1288597137],
		[0.0329845436, 0.9293118715, 0.0361456387],
		[0.0482003018, 0.2643662691, 0.633851707],
	];

	const M2 = [
		[0.2104542553, 0.793617785, -0.0040720468],
		[1.9779984951, -2.428592205, 0.4505937099],
		[0.0259040371, 0.7827717662, -0.808675766],
	];

	// macierz konwersji XYZ → LMS
	const lms = multiply(M1, adaptedXYZ) as [number, number, number];

	// nieliniowa transformacja (sześcienny pierwiastek)
	const l_ = cbrt(lms[0]);
	const m_ = cbrt(lms[1]);
	const s_ = cbrt(lms[2]);

	// konwersji LMS → OKLab
	const [L, a, b] = multiply(M2, [l_, m_, s_]);
	if (!L || !a || !b) {
		throw new Error("Nieoczekiwane wartości w obliczeniach OKLab.");
	}

	return { L, a, b };
}

// Konwersja OKLab to OKLCH
export function oklabToOklch({ L, a, b }: { L: number; a: number; b: number }) {
	const C = sqrt(a * a + b * b);
	let h = atan2(b, a) * (180 / Math.PI);
	if (h < 0) h += 360;

	return { L, C, h };
}

// Konwersja XYZ do sRGB(D65)
function xyzToSRGB(xyz: { x: number; y: number; z: number }, illuminant: Illuminants) {
	let adaptedXYZ = [xyz.x, xyz.y, xyz.z];

	if (illuminant === "d50") {
		adaptedXYZ = applyChromaticAdaptation(xyz.x, xyz.y, xyz.z, illuminant, "d65", "2");
	}

	// Macierz konwersji XYZ → liniowe RGB
	const RGBLin = [
		[3.24071, -1.53726, -0.498571],
		[-0.969258, 1.87599, 0.0415557],
		[0.0556352, -0.203996, 1.05707],
	];

	const lin = multiply(RGBLin, adaptedXYZ);

	// Zapewnienie, że wartości są nieujemne
	const rLin = max(lin[0]!, 0.0);
	const gLin = max(lin[1]!, 0.0);
	const bLin = max(lin[2]!, 0.0);

	// Kompresja gamma (sRGB standard)
	const gammaCorrect = (c: number) =>
		c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

	// const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
	const r = gammaCorrect(rLin);
	const g = gammaCorrect(gLin);
	const b = gammaCorrect(bLin);

	return { r, g, b };
}

// Konwersja RGB to CMYK
function rgbToCmyk(r: number, g: number, b: number) {
	const k = 1 - max(r, g, b);
	const c = k < 1 ? (1 - r - k) / (1 - k) : 0;
	const m = k < 1 ? (1 - g - k) / (1 - k) : 0;
	const y = k < 1 ? (1 - b - k) / (1 - k) : 0;

	return {
		c: floor(c * 100),
		m: floor(m * 100),
		y: floor(y * 100),
		k: floor(k * 100),
	};
}

// Konwersja RGB to HEX
function rgbToHex(r: number, g: number, b: number) {
	const toHex = (v: number) =>
		max(0, min(255, round(v * 255)))
			.toString(16)
			.padStart(2, "0")
			.toUpperCase();

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function cxfConverter({ name, jsonCxF }: { name: string; jsonCxF: string }) {
	if (!jsonCxF) {
		throw new Error("Brak danych przkazanych.");
	}

	const spectra = getSpectrumFromCxF(jsonCxF);

	const result = spectra.map((spec) => {
		const xyz = spectralToXYZ(spec.spectrum, spec.illuminant, spec.observer);
		const srgb = xyzToSRGB(xyz, spec.illuminant);
		const oklab = xyzToOklab(xyz, spec.illuminant);
		const oklch = oklabToOklch(oklab);
		const cmyk = rgbToCmyk(srgb.r, srgb.g, srgb.b);
		const hex = rgbToHex(srgb.r, srgb.g, srgb.b);

		return {
			name: `${name.slice(0, 30)} - ${spec.id}`,
			result: [
				{
					space: "sRGB",
					value: `${round(srgb.r * 255, 0)},${round(srgb.g * 255, 0)},${round(srgb.b * 255, 0)}`,
				},
				{ space: "CMYK", value: `${cmyk.c}%,${cmyk.m}%,${cmyk.y}%,${cmyk.k}%` },
				{
					space: "OKLab (Lightness, a-axis, b-axis)",
					value: `${round(oklab.L * 100, 2)}%,${round(oklab.a, 2)},${round(oklab.b, 2)}`,
				},
				{
					space: "OKLCH (Lightness, Chroma, Hue)",
					value: `${round(oklch.L * 100, 2)}%,${round(oklch.C, 2)},${round(oklch.h, 2)}`,
				},
				{ space: "HEX", value: hex },
			],
		};
	});

	return result;
}

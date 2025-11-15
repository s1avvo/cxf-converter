import { round } from "mathjs";
import {
	oklabToOklch,
	rgbToCmyk,
	rgbToHex,
	spectralToXYZ,
	xyzToLab,
	xyzToOklab,
	xyzToSRGB,
} from "@/lib/color-conversions";
import { getSpectrumFromCxF } from "@/lib/cxf-parser";
import type { ConversionResult, CxFFile } from "@/lib/types";
import { parseXML } from "@/lib/utils";

function formatColorValues(
	srgb: { r: number; g: number; b: number },
	cmyk: { c: number; m: number; y: number; k: number },
	lab: { L: number; a: number; b: number },
	oklab: { L: number; a: number; b: number },
	oklch: { L: number; C: number; h: number },
	hex: string
): ConversionResult["result"] {
	return [
		{
			space: "sRGB",
			value: `${round(srgb.r * 255, 0)},${round(srgb.g * 255, 0)},${round(srgb.b * 255, 0)}`,
		},
		{
			space: "CMYK",
			value: `${cmyk.c}%,${cmyk.m}%,${cmyk.y}%,${cmyk.k}%`,
		},
		{
			space: "CIELab",
			value: `${round(lab.L, 2)},${round(lab.a, 2)},${round(lab.b, 2)}`,
		},
		{
			space: "OKLab (Lightness, a-axis, b-axis)",
			value: `${round(oklab.L * 100, 2)}%,${round(oklab.a, 2)},${round(oklab.b, 2)}`,
		},
		{
			space: "OKLCH (Lightness, Chroma, Hue)",
			value: `${round(oklch.L * 100, 2)}%,${round(oklch.C, 2)},${round(oklch.h, 2)}`,
		},
		{
			space: "HEX",
			value: hex,
		},
	];
}

export function cxfConverter(cxfFileContent: string): ConversionResult[] {
	const cxf = parseXML<CxFFile>(cxfFileContent);

	if (!cxf) {
		throw new Error("Failed to parse CxF file.");
	}

	const spectra = getSpectrumFromCxF(cxf);

	return spectra.map((spectrum) => {
		// Convert spectrum to XYZ tristimulus values
		const xyz = spectralToXYZ(spectrum.spectrum, spectrum.illuminant, spectrum.observer);

		// Convert to various color spaces
		const srgb = xyzToSRGB(xyz, spectrum.illuminant, spectrum.observer);
		const lab = xyzToLab(xyz, spectrum.illuminant, spectrum.observer);
		const oklab = xyzToOklab(xyz, spectrum.illuminant, spectrum.observer);
		const oklch = oklabToOklch(oklab);
		const cmyk = rgbToCmyk(srgb.r, srgb.g, srgb.b);
		const hex = rgbToHex(srgb.r, srgb.g, srgb.b);

		return {
			name: spectrum.name,
			result: formatColorValues(srgb, cmyk, lab, oklab, oklch, hex),
		};
	});
}

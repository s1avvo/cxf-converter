/**
 * CxF Color Converter
 * Main entry point for converting CxF spectral data to various color spaces
 */

import { round } from "mathjs";
import { getSpectrumFromCxF } from "@/lib/cxf-parser";
import {
	spectralToXYZ,
	xyzToSRGB,
	xyzToLab,
	xyzToOklab,
	oklabToOklch,
	rgbToCmyk,
	rgbToHex,
} from "@/lib/color-conversions";
import type { ConversionResult } from "@/lib/types";

// Re-export commonly used color conversion functions
export { xyzToOklab, oklabToOklch } from "@/lib/color-conversions";
export { getSpectrumFromCxF } from "@/lib/cxf-parser";

/**
 * Format color values for display
 */
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

/**
 * Convert CxF spectral data to multiple color spaces
 * @param cxfFileContent - CxF XML file content as string
 * @returns Array of conversion results with color values in different spaces
 */
export function cxfConverter(cxfFileContent: string): ConversionResult[] {
	if (!cxfFileContent) {
		throw new Error("No CxF data provided");
	}

	const spectra = getSpectrumFromCxF(cxfFileContent);

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

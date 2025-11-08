/**
 * Color space conversion utilities
 * Provides conversion functions between different color spaces (XYZ, Lab, OKLab, sRGB, etc.)
 */

import { cbrt, dotMultiply, floor, multiply, sqrt, atan2, max, min, round, sum } from "mathjs";
import { REF_ILLUM_TABLE, REF_STDOBSERV_TABLE } from "@/lib/constant";
import { applyChromaticAdaptation, getIlluminantXYZ } from "@/lib/utils";
import type { Illuminants, Observers } from "@/lib/types";

/** Conversion matrices for XYZ to OKLab */
const OKLAB_M1 = [
	[0.8189330101, 0.3618667424, -0.1288597137],
	[0.0329845436, 0.9293118715, 0.0361456387],
	[0.0482003018, 0.2643662691, 0.633851707],
];

const OKLAB_M2 = [
	[0.2104542553, 0.793617785, -0.0040720468],
	[1.9779984951, -2.428592205, 0.4505937099],
	[0.0259040371, 0.7827717662, -0.808675766],
];

/** Conversion matrix for XYZ to linear RGB (sRGB) */
const XYZ_TO_RGB_MATRIX = [
	[3.24071, -1.53726, -0.498571],
	[-0.969258, 1.87599, 0.0415557],
	[0.0556352, -0.203996, 1.05707],
];

/** CIE epsilon constant */
const CIE_EPSILON = 216.0 / 24389.0;

/** CIE kappa constant */
const CIE_KAPPA = 24389.0 / 27.0;

/**
 * Convert spectral reflectance data to XYZ tristimulus values
 */
export function spectralToXYZ(
	spectrum: number[],
	illuminant: Illuminants,
	observer: Observers
): { x: number; y: number; z: number } {
	const referenceIlluminant = REF_ILLUM_TABLE[illuminant];
	if (!referenceIlluminant) {
		throw new Error(`Unknown illuminant: ${illuminant}`);
	}

	const standardObserver = REF_STDOBSERV_TABLE[observer];
	if (!standardObserver) {
		throw new Error(`Unknown observer: ${observer}`);
	}

	if (
		spectrum.length !== referenceIlluminant.length ||
		standardObserver.x.length !== referenceIlluminant.length
	) {
		throw new Error("Array length mismatch - check input data");
	}

	// Calculate common denominator for X, Y, Z coordinates
	const denominator = dotMultiply(standardObserver.y as number[], referenceIlluminant as number[]);
	const denominatorSum = sum(denominator);

	if (denominatorSum === 0) {
		throw new Error("Invalid illuminant or observer reference - denominator is zero");
	}

	// Multiply spectrum by reference illuminant
	const spectrumByIlluminant = dotMultiply(spectrum, referenceIlluminant as number[]);

	// Calculate tristimulus values
	const xNumerator = dotMultiply(spectrumByIlluminant, standardObserver.x as number[]);
	const yNumerator = dotMultiply(spectrumByIlluminant, standardObserver.y as number[]);
	const zNumerator = dotMultiply(spectrumByIlluminant, standardObserver.z as number[]);

	const x = sum(xNumerator) / denominatorSum;
	const y = sum(yNumerator) / denominatorSum;
	const z = sum(zNumerator) / denominatorSum;

	return { x, y, z };
}

/**
 * Convert XYZ tristimulus values to OKLab color space
 */
export function xyzToOklab(
	xyz: { x: number; y: number; z: number },
	illuminant: Illuminants,
	observer: Observers
): { L: number; a: number; b: number } {
	let adaptedXYZ = [xyz.x, xyz.y, xyz.z];

	// Adapt from D50 to D65 if necessary
	if (illuminant === "d50") {
		adaptedXYZ = applyChromaticAdaptation(xyz.x, xyz.y, xyz.z, illuminant, "d65", observer);
	}

	// Convert XYZ to LMS using M1 matrix
	const lms = multiply(OKLAB_M1, adaptedXYZ) as [number, number, number];

	// Apply nonlinear transformation (cube root)
	const l_ = cbrt(lms[0]);
	const m_ = cbrt(lms[1]);
	const s_ = cbrt(lms[2]);

	// Convert LMS to OKLab using M2 matrix
	const [L, a, b] = multiply(OKLAB_M2, [l_, m_, s_]);

	if (L === undefined || a === undefined || b === undefined) {
		throw new Error("Unexpected values in OKLab calculations");
	}

	return { L, a, b };
}

/**
 * Convert OKLab to OKLCH (cylindrical representation)
 */
export function oklabToOklch(oklab: { L: number; a: number; b: number }): {
	L: number;
	C: number;
	h: number;
} {
	const { L, a, b } = oklab;
	const C = sqrt(a * a + b * b) as number;
	let h = (atan2(b, a) as number) * (180 / Math.PI);

	// Normalize hue to [0, 360)
	if (h < 0) {
		h += 360;
	}

	return { L, C, h };
}

/**
 * Convert XYZ to sRGB color space
 */
export function xyzToSRGB(
	xyz: { x: number; y: number; z: number },
	illuminant: Illuminants,
	observer: Observers
): { r: number; g: number; b: number } {
	let adaptedXYZ = [xyz.x, xyz.y, xyz.z];

	// Adapt from D50 to D65 if necessary
	if (illuminant === "d50") {
		adaptedXYZ = applyChromaticAdaptation(xyz.x, xyz.y, xyz.z, illuminant, "d65", observer);
	}

	// Convert XYZ to linear RGB
	const linearRGB = multiply(XYZ_TO_RGB_MATRIX, adaptedXYZ);

	// Ensure non-negative values
	const rLinear = max(linearRGB[0]!, 0.0);
	const gLinear = max(linearRGB[1]!, 0.0);
	const bLinear = max(linearRGB[2]!, 0.0);

	// Apply gamma correction (sRGB standard)
	const r = applySRGBGamma(rLinear);
	const g = applySRGBGamma(gLinear);
	const b = applySRGBGamma(bLinear);

	return { r, g, b };
}

/**
 * Apply sRGB gamma correction
 */
function applySRGBGamma(linear: number): number {
	return linear <= 0.0031308 ? 12.92 * linear : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
}

/**
 * Convert XYZ to CIE Lab color space
 */
export function xyzToLab(
	xyz: { x: number; y: number; z: number },
	illuminant: Illuminants,
	observer: Observers
): { L: number; a: number; b: number } {
	const whitePoint = getIlluminantXYZ(illuminant, observer);

	// Normalize by white point
	let xRatio = xyz.x / whitePoint.X;
	let yRatio = xyz.y / whitePoint.Y;
	let zRatio = xyz.z / whitePoint.Z;

	// Apply CIE Lab transformation
	xRatio = applyLabFunction(xRatio);
	yRatio = applyLabFunction(yRatio);
	zRatio = applyLabFunction(zRatio);

	const L = 116.0 * yRatio - 16.0;
	const a = 500.0 * (xRatio - yRatio);
	const b = 200.0 * (yRatio - zRatio);

	return { L, a, b };
}

/**
 * Apply CIE Lab function transformation
 */
function applyLabFunction(t: number): number {
	return t > CIE_EPSILON ? Math.pow(t, 1.0 / 3.0) : (CIE_KAPPA * t + 16.0) / 116.0;
}

/**
 * Convert RGB to CMYK color space
 */
export function rgbToCmyk(
	r: number,
	g: number,
	b: number
): { c: number; m: number; y: number; k: number } {
	const k = 1 - max(r, g, b);
	const divisor = 1 - k;

	const c = divisor < 0.0001 ? 0 : (1 - r - k) / divisor;
	const m = divisor < 0.0001 ? 0 : (1 - g - k) / divisor;
	const y = divisor < 0.0001 ? 0 : (1 - b - k) / divisor;

	return {
		c: floor(c * 100),
		m: floor(m * 100),
		y: floor(y * 100),
		k: floor(k * 100),
	};
}

/**
 * Convert RGB to hexadecimal color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (value: number): string => {
		const clamped = max(0, min(255, round(value * 255)));
		return clamped.toString(16).toUpperCase().padStart(2, "0");
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

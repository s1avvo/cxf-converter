/**
 * CxF (Color Exchange Format) file parsing utilities
 * Handles parsing and normalization of spectral data from CxF XML files
 */

import { floor, round } from "mathjs";
import { parseXML } from "@/lib/utils";
import type {
	CxFFile,
	Illuminants,
	Observers,
	ParsedSpectrum,
	ReflectanceSpectrum,
} from "@/lib/types";

/** Spectral range constants */
const MIN_WAVELENGTH = 340;
const MAX_WAVELENGTH = 830;

/**
 * Normalize spectrum data to full range (340-830nm at 10nm intervals)
 * Extends the spectrum by repeating first/last values outside the measured range
 */
function normalizeSpectrum(
	values: number[],
	startWavelength: number | undefined,
	step: number | undefined
): number[] {
	if (!values || values.length === 0) {
		throw new Error("No spectrum data to normalize");
	}

	if (!startWavelength || startWavelength < MIN_WAVELENGTH || startWavelength > MAX_WAVELENGTH) {
		throw new Error(
			`Start wavelength must be a number between ${MIN_WAVELENGTH} and ${MAX_WAVELENGTH}`
		);
	}

	if (!step || step <= 0) {
		throw new Error("Step must be defined and greater than zero");
	}

	const totalPoints = floor((MAX_WAVELENGTH - MIN_WAVELENGTH) / step) + 1;
	const normalized = new Array<number>(totalPoints);

	// Calculate starting index in normalized spectrum
	const offset = round((startWavelength - MIN_WAVELENGTH) / step);
	const endIndex = offset + values.length - 1;

	for (let i = 0; i < totalPoints; i++) {
		if (i < offset) {
			// Before data range - use first value
			normalized[i] = values[0]!;
		} else if (i > endIndex) {
			// After data range - use last value
			normalized[i] = values[values.length - 1]!;
		} else {
			// Within range - copy data
			normalized[i] = values[i - offset]!;
		}
	}

	return normalized;
}

/**
 * Extract and parse spectral data from CxF file
 */
export function getSpectrumFromCxF(cxfFileContent: string): ParsedSpectrum[] {
	const cxf = parseXML<CxFFile>(cxfFileContent);

	const objectCollection = cxf["cc:CxF"]["cc:Resources"]?.["cc:ObjectCollection"];

	if (!objectCollection) {
		throw new Error("No ObjectCollection found in CxF file");
	}

	// Handle both single object and array of objects
	const objects = Array.isArray(objectCollection["cc:Object"])
		? objectCollection["cc:Object"]
		: [objectCollection["cc:Object"]];

	// Extract all reflectance spectra from Target or Standard objects
	const allReflectanceSpectra: Array<{
		name: string;
		spectrum: number[];
		colorSpecId: string;
	}> = [];

	objects
		.filter((obj) => obj["@_ObjectType"] === "Target" || obj["@_ObjectType"] === "Standard")
		.forEach((obj) => {
			const reflectanceList = obj["cc:ColorValues"]?.["cc:ReflectanceSpectrum"];

			if (reflectanceList) {
				reflectanceList.forEach((reflectance: ReflectanceSpectrum) => {
					if (reflectance["@_ColorSpecification"]) {
						allReflectanceSpectra.push({
							colorSpecId: reflectance["@_ColorSpecification"],
							name: reflectance["@_Name"] || "Unnamed Spectrum",
							spectrum: reflectance["#text"].split(/\s+/).map(Number) ?? [],
						});
					}
				});
			}
		});

	if (allReflectanceSpectra.length === 0) {
		throw new Error("No spectrum data found in CxF file");
	}

	const colorSpecs =
		cxf["cc:CxF"]["cc:Resources"]?.["cc:ColorSpecificationCollection"]?.["cc:ColorSpecification"];

	if (!colorSpecs) {
		throw new Error("No color specifications found in CxF file");
	}

	// Process each spectrum with its corresponding specification
	const results = allReflectanceSpectra
		.map(({ name, spectrum, colorSpecId }) => {
			const spec = colorSpecs.find((s) => s["@_Id"] === colorSpecId);

			if (!spec) {
				console.warn(`Color specification not found for ID: ${colorSpecId}`);
				return null;
			}

			const startWavelength = spec["cc:MeasurementSpec"]?.["cc:WavelengthRange"]?.["@_StartWL"];
			const step = spec["cc:MeasurementSpec"]?.["cc:WavelengthRange"]?.["@_Increment"];
			const illuminant = spec["cc:TristimulusSpec"]?.["cc:Illuminant"].toLowerCase() as Illuminants;
			const observer = spec["cc:TristimulusSpec"]?.["cc:Observer"].split("_")[0] as Observers;

			const normalizedSpectrum = normalizeSpectrum(spectrum, startWavelength, step);

			return {
				id: colorSpecId,
				name,
				illuminant,
				observer,
				spectrum: normalizedSpectrum,
			};
		})
		.filter((item): item is ParsedSpectrum => item !== null);

	return results;
}

import { type ClassValue, clsx } from "clsx";
import { XMLParser } from "fast-xml-parser";
import { diag, type Matrix, multiply, pinv } from "mathjs";
import { twMerge } from "tailwind-merge";
import { ADAPTATIONS, ILLUMINANTS } from "@/lib/constant";
import type { Illuminants, Observers } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const parseXML = <T>(xml: string): T => {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
		allowBooleanAttributes: true,
		parseAttributeValue: true,
		parseTagValue: true,
		trimValues: true,
		isArray: (tagName) => tagName === "cc:ReflectanceSpectrum",
	});

	return parser.parse(xml) as T;
};

/** Tworzy macierz adaptacji barwnej */
function getAdaptationMatrix(wpSrc: Illuminants, wpDst: Illuminants, observer: Observers) {
	const mSharp = ADAPTATIONS["bradford"] as Matrix;

	const wpSrcArr = ILLUMINANTS[observer][wpSrc.toLowerCase() as "d50" | "d65"];
	const wpDstArr = ILLUMINANTS[observer][wpDst.toLowerCase() as "d50" | "d65"];

	const rgbSrc = multiply(mSharp, wpSrcArr).toArray() as [number, number, number];
	const rgbDst = multiply(mSharp, wpDstArr).toArray() as [number, number, number];

	const ratio = rgbDst.map((v, i) => v / rgbSrc[i]!);
	const mRat = diag(ratio);

	const mSharpInv = pinv(mSharp);

	return multiply(multiply(mSharpInv, mRat), mSharp);
}

/** Adaptacja barwna pojedynczego punktu XYZ */
export function applyChromaticAdaptation(
	valX: number,
	valY: number,
	valZ: number,
	origIllum: Illuminants,
	targIllum: Illuminants,
	observer: Observers = "2"
) {
	const transformMatrix = getAdaptationMatrix(origIllum, targIllum, observer);

	const XYZ = [valX, valY, valZ];

	return multiply(transformMatrix, XYZ).toArray() as [number, number, number];
}

export function getIlluminantXYZ(illuminant: Illuminants, observer: Observers) {
	if (!illuminant || !(illuminant.toLowerCase() === "d50" || illuminant.toLowerCase() === "d65")) {
		throw new Error(
			`Invalid illuminant: ${illuminant}. Supported illuminants are 'd50' and 'd65'.`
		);
	}

	if (!observer || !(observer === "2" || observer === "10")) {
		throw new Error(`Invalid observer: ${observer}. Supported observers are '2' and '10'.`);
	}

	const illumXYZ = ILLUMINANTS[observer][illuminant.toLowerCase() as "d50" | "d65"].toArray() as [
		number,
		number,
		number,
	];

	return { X: illumXYZ[0], Y: illumXYZ[1], Z: illumXYZ[2] };
}

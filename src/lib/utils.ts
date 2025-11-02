import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { XMLParser } from "fast-xml-parser";
import { type Illuminants, type Observers } from "@/lib/types";
import { multiply, diag, pinv, type Matrix } from "mathjs";
import { ADAPTATIONS, ILLUMINANTS } from "@/lib/constant";

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

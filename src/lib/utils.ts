import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { XMLParser } from "fast-xml-parser";

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

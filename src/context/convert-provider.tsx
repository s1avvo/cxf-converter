"use client";

import { type ConversionResult } from "@/lib/types";
import React, { createContext, ReactNode, use, useState } from "react";

type ConverterContextType = {
	colorResult: ConversionResult[] | null;
	setColorResult: (result: ConversionResult[] | null) => void;
};

export const ConverterContext = createContext<ConverterContextType | undefined>(undefined);

export function ConverterProvider({ children }: { children: ReactNode }) {
	const [colorResult, setColorResult] = useState<ConversionResult[] | null>(null);

	return <ConverterContext value={{ colorResult, setColorResult }}>{children}</ConverterContext>;
}

export function useConverter() {
	const context = use(ConverterContext);
	if (!context) {
		throw new Error("useConverter must be used within a ConverterProvider");
	}

	return context;
}

"use client";

import React, { createContext, ReactNode, use, useState } from "react";

type ColorResult = {
	name: string;
	result: { space: string; value: string }[];
};

type ConverterContextType = {
	colorResult: ColorResult[] | null;
	setColorResult: (result: ColorResult[] | null) => void;
};

export const ConverterContext = createContext<ConverterContextType | undefined>(undefined);

export function ConverterProvider({ children }: { children: ReactNode }) {
	const [colorResult, setColorResult] = useState<ColorResult[] | null>(null);

	return <ConverterContext value={{ colorResult, setColorResult }}>{children}</ConverterContext>;
}

export function useConverter() {
	const context = use(ConverterContext);
	if (!context) {
		throw new Error("useConverter must be used within a ConverterProvider");
	}

	return context;
}

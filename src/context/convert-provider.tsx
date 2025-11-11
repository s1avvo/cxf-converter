"use client";

import { useSearchParams } from "next/navigation";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import type { ConversionResult } from "@/lib/types";

type ConverterContextType = {
	colorResult: ConversionResult[] | null;
	setColorResult: (result: ConversionResult[] | null) => void;
};

export const ConverterContext = createContext<ConverterContextType | undefined>(undefined);

export function ConverterProvider({ children }: { children: ReactNode }) {
	const searchParams = useSearchParams();
	const [colorResult, setColorResult] = useState<ConversionResult[] | null>(null);

	useEffect(() => {
		const cxf = searchParams.get("encoded-file");
		if (!cxf) {
			setColorResult(null);
		}
	}, [searchParams]);

	return <ConverterContext value={{ colorResult, setColorResult }}>{children}</ConverterContext>;
}

export function useConverter() {
	const context = use(ConverterContext);
	if (!context) {
		throw new Error("useConverter must be used within a ConverterProvider");
	}

	return context;
}

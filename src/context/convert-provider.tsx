"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createContext, type ReactNode, use, useEffect, useState, useTransition } from "react";
import type { ConversionResult } from "@/lib/types";
import { decodeResults, encodeResults } from "@/lib/utils";

const RESULTS_PARAM = "results";

type ConverterContextType = {
	colorResult: ConversionResult[] | null;
	isPending: boolean;
	setColorResult: (result: ConversionResult[] | null) => void;
};

export const ConverterContext = createContext<ConverterContextType | undefined>(undefined);

export function ConverterProvider({ children }: { children: ReactNode }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [colorResult, setColorResultState] = useState<ConversionResult[] | null>(null);
	const [isPending, startTransition] = useTransition();

	// const handleDecode = useEffectEvent((encoded: string) => {
	// 	const run = () => setColorResultState(decodeResults(encoded));
	// 	encoded.length > 2000 ? setTimeout(run, 0) : run();
	// });

	useEffect(() => {
		const encoded = searchParams.get(RESULTS_PARAM);
		if (!encoded) return setColorResultState(null);

		// handleDecode(encoded);
		const decodeAsync = () => setColorResultState(decodeResults(encoded));
		encoded.length > 2000 ? setTimeout(decodeAsync, 0) : decodeAsync();
	}, [searchParams]);

	const setColorResult = (result: ConversionResult[] | null) => {
		setColorResultState(result);
		const params = new URLSearchParams(searchParams.toString());

		if (result && result.length > 0) {
			const encoded = encodeResults(result);
			encoded.length < 2000 ? params.set(RESULTS_PARAM, encoded) : params.delete(RESULTS_PARAM);
		} else {
			params.delete(RESULTS_PARAM);
		}

		startTransition(() => {
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<ConverterContext value={{ colorResult, isPending, setColorResult }}>
			{children}
		</ConverterContext>
	);
}

export function useConverter() {
	const context = use(ConverterContext);
	if (!context) {
		throw new Error("useConverter must be used within a ConverterProvider");
	}

	return context;
}

"use client";

import { DM_Sans } from "next/font/google";
import { useEffect } from "react";
import { Button } from "@/ui/shadcn/button";
import "./globals.css";

const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-sans",
});

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html lang="en" className={`${dmSans.variable} antialiased`}>
			<body className="font-dm-sans min-h-full flex-col">
				<main className="bg-background">
					<div className="container mx-auto flex min-h-screen max-w-md flex-col justify-center">
						<h2 className="text-secondary mt-3 text-4xl md:text-5xl">Something went wrong!</h2>
						<p className="mt-4">Sorry, an error occurred. Please try again.</p>
						<div className="mt-6 flex items-center">
							<Button variant="secondary" onClick={() => reset()}>
								Try again
							</Button>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}

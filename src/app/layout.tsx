import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@ui/footer";
import { Header } from "@ui/header";
import { Toaster } from "@ui/shadcn/sonner";
import { Suspense } from "react";
import { ConverterProvider } from "@/context/convert-provider";

const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-sans",
});

export const metadata: Metadata = {
	title: "CxF File Converter - Professional Color Space Conversion",
	description: "Convert CxF to CMYK, sRGB, OKLab, OKLch and HEX formats.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${dmSans.variable} antialiased`}>
			<body className="font-dm-sans min-h-full flex-col">
				<Header />
				<Suspense fallback={<div className="mt-20 text-center">Loading...</div>}>
					<ConverterProvider>{children}</ConverterProvider>
				</Suspense>
				<Footer />
				<Toaster position="bottom-left" />
			</body>
		</html>
	);
}

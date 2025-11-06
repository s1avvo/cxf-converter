import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@ui/header";
import { Footer } from "@ui/footer";
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
				<ConverterProvider>{children}</ConverterProvider>
				<Footer />
			</body>
		</html>
	);
}

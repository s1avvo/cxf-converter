import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@ui/header";
import { Footer } from "@ui/footer";

const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-sans",
});

export const metadata: Metadata = {
	title: "CxF Color Converter - Professional Color Space Conversion",
	description: "Convert CxF files to other color spaces.",
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
				{children}
				<Footer />
			</body>
		</html>
	);
}

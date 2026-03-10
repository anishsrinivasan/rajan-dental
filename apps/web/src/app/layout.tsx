import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Smile On! AI Smile Makeover",
	description:
		"Smile On! AI Smile Makeover is an innovative web application that uses artificial intelligence to help users visualize and enhance their smiles. With advanced image processing and machine learning algorithms, users can upload their photos and see potential improvements to their teeth and overall smile aesthetics. Whether you're considering cosmetic dentistry or just want to see how a new smile could look, Smile On! provides a fun and interactive way to explore your smile transformation possibilities.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={montserrat.variable} lang="en" suppressHydrationWarning>
			<body className="font-sans antialiased">
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">{children}</div>
				</Providers>
			</body>
		</html>
	);
}

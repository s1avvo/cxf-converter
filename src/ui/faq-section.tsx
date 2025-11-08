import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@ui/shadcn/accordion";

const faqs = [
	{
		question: "What are spectral data?",
		answer: `Spectral data describe how a surface reflects light across different wavelengths of the visible spectrum. Instead of storing a single color value (like RGB), a spectral curve contains reflectance percentages for each wavelength. This allows for more accurate and device-independent color computations — especially when converting between illuminants or observers.`,
	},
	{
		question: "How does the conversion from spectral data to OKLCH work?",
		answer: `The process begins with reading reflectance values from the CxF file. These spectral data points represent how much light is reflected at specific wavelengths (typically every 10 nm between 400–700 nm). The spectrum is then multiplied by the illuminant and observer functions to calculate tristimulus values (X, Y, Z). These XYZ values are then adapted to the D65 white point using the Bradford chromatic adaptation method, and finally transformed into OKLab or OKLCH color space for perceptually uniform results.`,
	},
	{
		question: "Why is chromatic adaptation (Bradford method) applied?",
		answer: `Chromatic adaptation adjusts colors so they appear consistent under different lighting conditions. For example, a color measured under D50 (warm light) will look slightly different under D65 (cool light). The Bradford method is a widely accepted transformation that models human vision’s response to changes in illuminant. It converts XYZ values measured under one illuminant to the corresponding values under another, such as D50 → D65.`,
	},
	{
		question: "What is the difference between D50 and D65 illuminants?",
		answer: `D50 and D65 are standard illuminants defined by the CIE. D50 represents a warm daylight source (~5000 K) typically used in printing and color proofing. D65 represents average daylight (~6500 K) and is the default for most digital displays. When converting between these illuminants, chromatic adaptation (usually Bradford) is applied to maintain visual consistency of the color appearance.`,
	},
	{
		question: "What role does the 2° or 10° observer play?",
		answer: `The observer defines how human vision perceives color across the visual field. The 2° standard observer represents central vision and is commonly used in most color measurements. The 10° observer covers a wider field of view, which can slightly change the weighting of wavelengths. Your CxF file defines which observer was used during measurement — we use that information directly when calculating XYZ.`,
	},
	{
		question: "Why use OKLab and OKLCH instead of LAB and LCH?",
		answer: `OKLab and OKLCH are newer, perceptually uniform color spaces designed to fix nonlinearity issues present in CIELAB. They produce more visually consistent gradients and better predict perceived differences between colors. When converting from spectral data, OKLab and OKLCH give smoother and more accurate color representations, especially for comparisons or visualization.`,
	},
];

export function FaqSection() {
	return (
		<section id="faq" className="bg-muted py-8 sm:py-12 md:py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<header className="mb-16 text-center">
					<h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
						Frequently Asked Questions
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
						Get answers to common questions about our color conversion service.
					</p>
				</header>

				<div className="mx-auto max-w-3xl">
					<Accordion type="multiple">
						{faqs.map((faq, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger className="text-foreground text-left font-semibold">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}

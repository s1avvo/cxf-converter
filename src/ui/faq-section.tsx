import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@ui/shadcn/accordion";

const faqs = [
	{
		question: "What color formats does the converter support?",
		answer:
			"Our converter supports all major color formats including CMYK, RGB, HSL, HSV, LAB, and Hex codes. We also support industry-standard color profiles for accurate conversion.",
	},
	{
		question: "How accurate are the color conversions?",
		answer:
			"We use advanced color science algorithms and ICC color profiles to ensure maximum accuracy. Our conversions maintain color integrity across different color spaces with less than 1% deviation.",
	},
	{
		question: "Can I convert multiple files at once?",
		answer:
			"Yes! Our batch processing feature allows you to upload and convert multiple files simultaneously, saving you time on large projects.",
	},
	{
		question: "Is there a file size limit?",
		answer:
			"Individual files can be up to 50MB, and you can process up to 100 files in a single batch. For larger requirements, contact our enterprise team.",
	},
	{
		question: "Do you store my uploaded files?",
		answer:
			"No, we prioritize your privacy. All uploaded files are processed in real-time and automatically deleted from our servers within 24 hours.",
	},
	{
		question: "What's the difference between the free and premium plans?",
		answer:
			"The free plan includes basic conversions with a daily limit. Premium plans offer unlimited conversions, batch processing, advanced color profiles, and priority support.",
	},
];

export function FaqSection() {
	return (
		<section className="bg-muted py-20">
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

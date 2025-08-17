import { Card, CardDescription, CardHeader, CardTitle } from "@ui/shadcn/card";
import { Target, Layers, Zap } from "lucide-react";

const features = [
	{
		icon: Target,
		title: "Precision Conversion",
		description:
			"Industry-leading accuracy with advanced color matching algorithms that preserve color integrity across all formats.",
		color: "bg-primary",
	},
	{
		icon: Layers,
		title: "Multiple Formats Supported",
		description:
			"Convert between CMYK, RGB, and HEX formats seamlessly. Support for all major color space standards and profiles.",
		color: "bg-secondary",
	},
	{
		icon: Zap,
		title: "Lightning Fast",
		description:
			"Process files in seconds with our optimized conversion engine. Batch processing available for multiple files.",
		color: "bg-accent",
	},
];

export function FeaturesSection() {
	return (
		<section id="features" className="bg-muted py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<header className="mb-16 text-center">
					<h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
						Why Choose Our Converter?
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
						Built for professionals who demand accuracy and efficiency in color space conversion.
					</p>
				</header>

				<ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{features.map((feature, index) => (
						<li key={index}>
							<Card className="bg-card border-border group relative mt-4 overflow-hidden transition-all duration-300 hover:shadow-lg">
								<CardHeader>
									<span
										className={`${feature.color} mb-4 flex h-12 w-12 items-center justify-center rounded-lg`}
										aria-hidden="true"
									>
										<feature.icon className="h-6 w-6 text-white" />
									</span>
									<CardTitle>
										<h3 className="text-lg">{feature.title}</h3>
									</CardTitle>
									<CardDescription>{feature.description}</CardDescription>
								</CardHeader>
							</Card>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

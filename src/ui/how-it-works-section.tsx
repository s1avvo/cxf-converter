import { Card, CardContent } from "@ui/shadcn/card";
import { Upload, Play, CheckCircle, BarChart3, MailCheck } from "lucide-react";

const steps = [
	{
		icon: Upload,
		title: "Upload Your CXF File",
		description:
			"Drag and drop or browse to select your CXF color exchange file. We support all standard CXF formats.",
		color: "text-primary",
		gradientClass: "gradient-step-1",
	},
	{
		icon: Play,
		title: "Click Start Converting",
		description: "Simply click the convert button to begin the color space transformation process.",
		color: "text-secondary",
		gradientClass: "gradient-step-2",
	},
	{
		icon: BarChart3,
		title: "Show Results",
		description:
			"View your converted colors in CMYK, RGB, HEX, and LAB formats with visual color swatches.",
		color: "text-muted-foreground",
		gradientClass: "gradient-step-4",
	},
	{
		icon: MailCheck,
		title: "Send Results",
		description: "Send your converted color data via email or copy/paste it directly from the app.",
		color: "text-accent",
		gradientClass: "gradient-step-3",
	},
];

export function HowItWorksSection() {
	return (
		<section id="how-it-works" className="bg-background py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<header className="mb-16 text-center">
					<h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
						Simple, fast, and accurate color space conversion in just four steps.
					</p>
				</header>

				<ol className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, index) => (
						<li key={index}>
							<Card className="bg-card border-border group relative mt-4 h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
								<div
									className={`absolute inset-0 ${step.gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
									aria-hidden="true"
								/>
								<div
									className={`absolute top-0 right-0 left-0 h-2 ${step.gradientClass}`}
									aria-hidden="true"
								/>

								<CardContent className="relative z-10 p-6 text-center">
									<div className="relative mb-4 inline-block">
										<span
											className={`${step.gradientClass} flex h-16 w-16 items-center justify-center rounded-full shadow-lg`}
											aria-hidden="true"
										>
											<step.icon className="h-8 w-8 text-white" />
										</span>
										<span
											className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-800 shadow-md"
											aria-hidden="true"
										>
											{index + 1}
										</span>
									</div>
									<h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
									<p className="text-muted-foreground text-sm">{step.description}</p>
								</CardContent>
							</Card>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

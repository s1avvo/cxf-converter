import { Separator } from "@ui/shadcn/separator";
import Link from "next/link";

const sections = [
	{
		header: "Support",
		links: [
			{
				label: "How It Works",
				href: "https://cxf-converter.vercel.app/#how-it-works",
			},
			{
				label: "FAQ",
				href: "https://cxf-converter.vercel.app/#faq",
			},
		],
	},
	{
		header: "Terms",
		links: [
			{
				label: "Privacy Policy",
				href: "https://cxf-converter.vercel.app/privacy-policy",
			},
			{
				label: "Terms of Service",
				href: "https://cxf-converter.vercel.app/terms-of-service",
			},
		],
	},
];

export function Footer() {
	return (
		<footer className="bg-muted w-full">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="col-span-1 md:col-span-2">
						<h3 className="text-primary mb-4 text-2xl font-bold">CXF Converter</h3>
						<p className="text-muted-foreground mb-4 max-w-md">
							Color space conversion service trusted by designers and print professionals worldwide.
							Accurate, fast, and reliable CXF file conversion.
						</p>
					</div>

					<nav className="grid grid-cols-2 gap-8">
						{sections.map((section) => (
							<section key={section.header}>
								<h3 className="text-foreground mb-4 font-semibold">{section.header}</h3>
								<ul className="space-y-2">
									{section.links.map((link) => (
										<li key={link.label}>
											<Link className="text-muted-foreground hover:text-primary" href={link.href}>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</section>
						))}
					</nav>
				</div>

				<div>
					<Separator className="my-8" />
					<p className="text-muted-foreground text-center">
						© 2025 CXF Converter. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

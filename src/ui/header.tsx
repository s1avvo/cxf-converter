import { Separator } from "@ui/shadcn/separator";
import Link from "next/link";

const links = [
	{
		label: "Features",
		href: "#features",
	},
	{
		label: "How It Works",
		href: "#how-it-works",
	},
	{
		label: "Contact",
		href: "#contact",
	},
];

export function Header() {
	return (
		<header className="bg-background">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="gradient-text text-2xl font-bold"
					aria-label="CXF Converter Homepage"
				>
					CXF Converter
				</Link>

				<nav className="hidden md:block" aria-label="Main navigation">
					<ul className="flex items-baseline space-x-8">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="text-foreground hover:text-primary inline-flex h-16 w-max items-center px-3 py-2 text-sm font-medium transition-all duration-300"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
			<Separator />
		</header>
	);
}

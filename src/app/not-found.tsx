import Link from "next/link";

import { Button } from "@/ui/shadcn/button";

export default function NotFound() {
	return (
		<main className="bg-background">
			<div className="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
				<h2 className="text-primary text-2xl">Error 404</h2>
				<h1 className="text-secondary mt-3 text-4xl md:text-5xl">Not Found</h1>
				<p className="mt-4">The page you are looking for does not exist</p>
				<div className="mt-6 flex items-center">
					<Button variant="default" asChild>
						<Link href="/">Home</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}

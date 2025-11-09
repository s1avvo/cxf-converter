import { ContactSection } from "@ui/contact-section";
import { FaqSection } from "@ui/faq-section";
import { HeroSection } from "@ui/hero-section";
import { HowItWorksSection } from "@ui/how-it-works-section";

export default function Home() {
	return (
		<main className="mx-auto flex w-full flex-1 flex-col">
			<HeroSection />
			<HowItWorksSection />
			<ContactSection />
			<FaqSection />
		</main>
	);
}

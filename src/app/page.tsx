import { HeroSection } from "@ui/hero-section";
import { FeaturesSection } from "@ui/features-section";
import { HowItWorksSection } from "@ui/how-it-works-section";
import { FaqSection } from "@ui/faq-section";
import { ContactSection } from "@ui/contact-section";

export default function Home() {
	return (
		<main className="mx-auto flex w-full flex-1 flex-col">
			<HeroSection />
			<FeaturesSection />
			<HowItWorksSection />
			<FaqSection />
			<ContactSection />
		</main>
	);
}

"use client";

import { useActionState } from "react";
import { Button } from "@ui/shadcn/button";
import { Input } from "@ui/shadcn/input";
import { Textarea } from "@ui/shadcn/textarea";
import { Label } from "@ui/shadcn/label";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

async function submitContactForm(prevState: any, formData: FormData) {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const message = formData.get("message") as string;
	const agreeToPrivacy = formData.get("agreeToPrivacy") === "on";

	// Validation
	const errors: Record<string, string> = {};

	if (!name || name.length < 2) {
		errors.name = "Name must be at least 2 characters";
	}

	if (!email || !email.includes("@")) {
		errors.email = "Please enter a valid email address";
	}

	if (!message || message.length < 10) {
		errors.message = "Message must be at least 10 characters";
	}

	if (!agreeToPrivacy) {
		errors.agreeToPrivacy = "You must agree to the privacy policy";
	}

	if (Object.keys(errors).length > 0) {
		return {
			success: false,
			errors,
			data: { name, email, message, agreeToPrivacy },
		};
	}

	// In a real app, you would send the email here
	console.log("Contact form submitted:", { name, email, message, agreeToPrivacy });

	return {
		success: true,
		message: "Thank you for your message! We'll get back to you soon.",
		errors: {},
		data: null,
	};
}

export function ContactSection() {
	const [state, formAction, isPending] = useActionState(submitContactForm, {
		success: false,
		errors: {},
		data: null,
		message: "",
	});

	return (
		<section id="contact" className="bg-background py-20">
			<div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
				<div className="border-border rounded-lg">
					<div className="mb-8 text-center">
						<h2 className="gradient-text mb-4 text-3xl font-bold md:text-4xl">Get in Touch</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
							Have questions about CXF conversion or need support?
						</p>
					</div>

					{state.success && (
						<div className="mx-auto mb-6 flex max-w-2xl items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-4">
							<CheckCircle className="h-5 w-5 text-green-600" />
							<p className="text-green-800">{state.message}</p>
						</div>
					)}

					<form action={formAction} className="mx-auto max-w-2xl space-y-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-foreground font-medium">
									Name
								</Label>
								<Input
									id="name"
									name="name"
									defaultValue={state.data?.name || ""}
									placeholder="Your full name"
									className="border-muted focus:border-primary border transition-colors"
									required
									disabled={isPending}
								/>
								{state.errors?.name && (
									<div className="flex items-center space-x-1">
										<AlertCircle className="h-4 w-4 text-red-500" />
										<p className="text-sm text-red-500">{state.errors.name}</p>
									</div>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-foreground font-medium">
									Email
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									defaultValue={state.data?.email || ""}
									placeholder="your.email@example.com"
									className="border-muted focus:border-primary border transition-colors"
									required
									disabled={isPending}
								/>
								{state.errors?.email && (
									<div className="flex items-center space-x-1">
										<AlertCircle className="h-4 w-4 text-red-500" />
										<p className="text-sm text-red-500">{state.errors.email}</p>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message" className="text-foreground font-medium">
								Message
							</Label>
							<Textarea
								id="message"
								name="message"
								defaultValue={state.data?.message || ""}
								placeholder="Tell us more about your inquiry..."
								rows={6}
								className="border-muted focus:border-primary resize-none border transition-colors"
								required
								disabled={isPending}
							/>
							{state.errors?.message && (
								<div className="flex items-center space-x-1">
									<AlertCircle className="h-4 w-4 text-red-500" />
									<p className="text-sm text-red-500">{state.errors.message}</p>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="privacy"
									name="agreeToPrivacy"
									defaultChecked={state.data?.agreeToPrivacy || false}
									required
									disabled={isPending}
									className="border-muted border"
								/>
								<Label htmlFor="privacy">
									<p className="text-foreground text-sm font-normal">
										By selecting this you agree to our{" "}
										<Link href="#" className="inline-flex font-medium underline">
											Privacy Policy
										</Link>
									</p>
								</Label>
							</div>
							{state.errors?.agreeToPrivacy && (
								<div className="flex items-center space-x-1">
									<AlertCircle className="h-4 w-4 text-red-500" />
									<p className="text-sm text-red-500">{state.errors.agreeToPrivacy}</p>
								</div>
							)}
						</div>

						<div className="pt-4">
							<Button
								type="submit"
								size="lg"
								className="gradient-primary gradient-primary-hover w-full font-semibold text-white shadow-md transition-all duration-300"
								disabled={isPending}
							>
								<Mail className="mr-2 h-5 w-5" />
								{isPending ? "Sending..." : "Send Message"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}

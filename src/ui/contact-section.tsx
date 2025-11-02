"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@ui/shadcn/button";
import { Input } from "@ui/shadcn/input";
import { Label } from "@ui/shadcn/label";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Mail, CheckCircle, AlertCircle, CircleX } from "lucide-react";

import { type ContactFormData, submitContactForm } from "@/actions/submitContactForm";

import { useConverter } from "@/context/convert-provider";

const initialData: ContactFormData = {
	email: "",
	privacy: false,
	results: "",
};

export function ContactSection() {
	const { colorResult } = useConverter();
	const [state, formAction, isPending] = useActionState(submitContactForm, {
		success: false,
		data: initialData,
		errors: undefined,
		message: "",
	});

	async function handleSubmit(formData: FormData) {
		if (colorResult) {
			formData.append("results", JSON.stringify(colorResult));
		}
		formAction(formData);
	}

	return (
		colorResult && (
			<section id="contact" className="bg-background py-20">
				<div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
					<div className="border-border rounded-lg border p-8">
						<div className="mb-8 text-center">
							<h2
								id="contact-heading"
								className="gradient-text mb-4 text-3xl font-bold md:text-4xl"
							>
								Send Results
							</h2>
							<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
								Send to Your email address the results of conversion.
							</p>
						</div>

						<form action={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 gap-6">
								<div className="space-y-2">
									<Label htmlFor="email" className="text-foreground font-medium">
										Email
									</Label>
									<Input
										id="email"
										name="email"
										defaultValue={state.data?.email || ""}
										placeholder="email@example.com"
										className="border-muted focus:border-primary border transition-colors"
										disabled={isPending}
										aria-describedby={state.errors?.email ? "email-error" : undefined}
									/>
									{state.errors?.email && (
										<div className="flex items-center space-x-1" id="email-error">
											<AlertCircle className="h-4 w-4 text-red-500" />
											<span className="text-sm text-red-500">{state.errors.email[0]}</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex items-start space-x-2">
								<Checkbox
									id="privacy"
									name="privacy"
									defaultChecked={state.data?.privacy || false}
									disabled={isPending}
									className="border-muted border"
								/>
								<Label htmlFor="privacy" className="text-foreground text-sm font-normal">
									By selecting this you agree to our{" "}
									<Link href="#" className="font-medium underline">
										Privacy Policy
									</Link>
								</Label>
							</div>
							{state.errors?.privacy && (
								<div className="flex items-center space-x-1">
									<AlertCircle className="h-4 w-4 text-red-500" />
									<span className="text-sm text-red-500">{state.errors.privacy[0]}</span>
								</div>
							)}

							{state.success && (
								<div className="mx-auto mb-6 flex max-w-2xl items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-4">
									<CheckCircle className="h-5 w-5 text-green-600" />
									<span className="text-green-800">{state.message}</span>
								</div>
							)}

							{!state.success && state.message.length > 0 && (
								<div className="mx-auto mb-6 flex max-w-2xl items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-4">
									<CircleX className="h-5 w-5 text-red-500" />
									<span className="text-red-500">{state.message}</span>
								</div>
							)}

							<div className="pt-4">
								<Button
									type="submit"
									size="lg"
									className="gradient-primary gradient-primary-hover w-full font-semibold text-white shadow-md transition-all duration-300"
									disabled={isPending}
									aria-busy={isPending}
								>
									<Mail className="mr-2 h-5 w-5" />
									{isPending ? "Sending..." : "Send Message"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</section>
		)
	);
}

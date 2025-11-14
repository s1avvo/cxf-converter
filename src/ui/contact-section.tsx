"use client";

import { Button } from "@ui/shadcn/button";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Input } from "@ui/shadcn/input";
import { Label } from "@ui/shadcn/label";
import { AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { toast } from "sonner";
import { submitColorResult } from "@/actions/submit-color-result";

import { useConverter } from "@/context/convert-provider";
import type { ContactFormData, ContactFormState } from "@/lib/schema";

const INITIAL_DATA: ContactFormData = {
	email: "",
	privacy: false,
	results: "",
};

export function ContactSection() {
	const { colorResult } = useConverter();
	const [state, formAction, isPending] = useActionState(
		async (_prevState: ContactFormState, formData: FormData) => {
			if (colorResult) {
				formData.append("results", JSON.stringify(colorResult));
			}

			const result = await submitColorResult(formData);

			if (!result.success && result.message.length > 0) {
				toast.error(result.message);
			}

			if (result.success) {
				toast.success(result.message);
			}

			return result;
		},
		{ success: false, data: INITIAL_DATA, errors: undefined, message: "" }
	);

	return (
		colorResult && (
			<section className="bg-background py-8 sm:py-12 md:py-16">
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

						<form action={formAction} className="space-y-4">
							<div className="grid grid-cols-1 gap-6">
								<div className="space-y-2">
									<Label htmlFor="email" className="text-foreground font-medium">
										Email
									</Label>
									<Input
										id="email"
										name="email"
										defaultValue={state.data.email || ""}
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

							<div>
								<div className="inline-flex items-start space-x-2">
									<Checkbox
										id="privacy"
										name="privacy"
										defaultChecked={state.data.privacy || false}
										disabled={isPending}
										className="border-muted border"
									/>
									<span className="flex items-start">
										<Label htmlFor="privacy" className="text-foreground inline text-sm font-normal">
											By selecting this you agree to our{" "}
											<Link href="/policy" className="inline font-medium underline">
												Privacy Policy
											</Link>
										</Label>
									</span>
								</div>
								{state.errors?.privacy && (
									<div className="flex items-center space-x-1">
										<AlertCircle className="h-4 w-4 text-red-500" />
										<span className="text-sm text-red-500">{state.errors.privacy[0]}</span>
									</div>
								)}
							</div>

							<div className="pt-4">
								<Button
									size="lg"
									type="submit"
									className="gradient-primary gradient-primary-hover w-full"
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

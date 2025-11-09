"use server";

import { Resend } from "resend";
import { z } from "zod";
import {
	type ContactFormData,
	type ContactFormErrors,
	type ContactFormState,
	contactFormSchema,
} from "@/lib/schema";
import { EmailTemplate } from "@/ui/email-template";

/**
 * Initialize Resend client
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Initial empty form state
 */
const INITIAL_DATA: ContactFormData = {
	email: "",
	privacy: false,
	results: "",
};

/**
 * Create error response state
 */
function createErrorState(
	data: Partial<ContactFormData>,
	message: string,
	errors?: ContactFormErrors
): ContactFormState {
	return {
		success: false,
		data: data as ContactFormData,
		errors,
		message,
	};
}

/**
 * Create success response state
 */
function createSuccessState(message: string): ContactFormState {
	return {
		success: true,
		data: INITIAL_DATA,
		errors: undefined,
		message,
	};
}

/**
 * Server action for handling form submission
 */
export async function submitColorResult(formData: FormData): Promise<ContactFormState> {
	// Extract form data
	const data = {
		email: formData.get("email")?.toString().trim() || "",
		privacy: formData.get("privacy") === "on" || false,
		results: formData.get("results")?.toString() || "",
	};

	// Early validation for missing results
	if (!data.results) {
		return createErrorState(data, "Missing conversion data");
	}

	// Validate form data with schema
	const result = contactFormSchema.safeParse(data);

	if (!result.success) {
		return createErrorState(data, "", z.flattenError<ContactFormData>(result.error).fieldErrors);
	}

	const { email, results } = result.data;

	try {
		await resend.emails.send({
			from: "cxf-converter.app <no-reply@floorballsrem.com>",
			to: [email],
			subject: "Your Color Conversion Results",
			html: EmailTemplate(JSON.parse(results)),
		});

		return createSuccessState("Email sent successfully!");
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An error occurred while sending email";

		return createErrorState(data, message);
	}
}

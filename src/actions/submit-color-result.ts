"use server";

import { Resend } from "resend";
import { z } from "zod";
import { EmailTemplate } from "@/ui/email-template";
import type { ConversionResult } from "@/lib/types";

/**
 * Initialize Resend client
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Validate JSON conversion results
 */
function isValidConversionResults(value: string): boolean {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) && parsed.length > 0;
	} catch {
		return false;
	}
}

/**
 * Contact form validation schema
 */
const contactFormSchema = z.object({
	email: z
		.string()
		.email("Please enter a valid email address")
		.trim()
		.toLowerCase()
		.min(1, "Email is required"),
	privacy: z.boolean().refine((val) => val === true, {
		message: "You must agree to the privacy policy",
	}),
	results: z.string().min(1, "Missing conversion data").refine(isValidConversionResults, {
		message: "Invalid conversion results format",
	}),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string[]>>;
export type ContactFormState = {
	success: boolean;
	data: ContactFormData;
	errors?: ContactFormErrors;
	message: string;
};

/**
 * Initial empty form state
 */
const INITIAL_FORM_DATA: ContactFormData = {
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
		data: INITIAL_FORM_DATA,
		errors: undefined,
		message,
	};
}

/**
 * Send email with conversion results
 */
async function sendConversionEmail(
	email: string,
	results: ConversionResult[]
): Promise<{ success: boolean; message: string }> {
	try {
		const response = await resend.emails.send({
			from: "cxf-converter.app <no-reply@floorballsrem.com>",
			to: [email],
			subject: "Your Color Conversion Results",
			html: EmailTemplate(results),
		});

		if (response.error) {
			return {
				success: false,
				message: response.error.message || "Failed to send email",
			};
		}

		return {
			success: true,
			message: "Email sent successfully!",
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
		return {
			success: false,
			message: `Failed to send email: ${errorMessage}`,
		};
	}
}

/**
 * Submit color conversion results via email
 * Server action for handling form submission
 */
export async function submitColorResult(
	_prevState: ContactFormState,
	formData: FormData
): Promise<ContactFormState> {
	// Extract form data
	const data = {
		email: formData.get("email")?.toString().trim() || "",
		privacy: formData.get("privacy") === "on" || formData.get("privacy") === "true",
		results: formData.get("results")?.toString() || "",
	};

	// Early validation for missing results
	if (!data.results) {
		return createErrorState(data, "Missing conversion data");
	}

	// Validate form data with schema
	const validationResult = contactFormSchema.safeParse(data);

	if (!validationResult.success) {
		return createErrorState(
			data,
			"Please correct the errors below",
			z.flattenError<ContactFormData>(validationResult.error).fieldErrors
		);
	}

	const { email, results: resultsString } = validationResult.data;

	// Send email
	const emailResult = await sendConversionEmail(email, JSON.parse(resultsString));

	if (!emailResult.success) {
		return createErrorState(INITIAL_FORM_DATA, emailResult.message);
	}

	return createSuccessState(emailResult.message);
}

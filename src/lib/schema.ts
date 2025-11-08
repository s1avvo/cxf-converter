import { z } from "zod";

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
export const contactFormSchema = z.object({
	email: z.email("Please enter a valid email address").min(1, "Email is required"),
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

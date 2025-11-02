"use server";

import { Resend } from "resend";
import z from "zod";
import { EmailTemplate } from "@/ui/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
	email: z.email("Please enter a valid email address").trim().toLowerCase(),
	privacy: z.boolean().refine((val) => val === true, "You must agree to the privacy policy"),
	results: z
		.string()
		.min(1, "Missing conversion data")
		.refine((val) => {
			try {
				const parsed = JSON.parse(val);
				return Array.isArray(parsed) && parsed.length > 0;
			} catch {
				return false;
			}
		}, "Invalid conversion results JSON"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string[]>>;
export type ContactFormState = {
	success: boolean;
	data: ContactFormData;
	errors?: ContactFormErrors;
	message: string;
};

const initialData: ContactFormData = {
	email: "",
	privacy: false,
	results: "",
};

export async function submitContactForm(
	_prevState: ContactFormState,
	formData: FormData
): Promise<ContactFormState> {
	const data = {
		email: formData.get("email")?.toString() || "",
		privacy: formData.get("privacy") === "on" || formData.get("privacy") === "true",
		results: formData.get("results")?.toString() || "",
	};

	if (!data.results) {
		return {
			success: false,
			data,
			errors: undefined,
			message: "Missing conversion data",
		};
	}

	const result = contactFormSchema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			data,
			errors: z.flattenError<ContactFormData>(result.error).fieldErrors,
			message: "Sending the email failed!",
		};
	}

	try {
		const { email, results } = result.data;

		const res = await resend.emails.send({
			from: "cxf-converter.app <no-reply@floorballsrem.com>",
			to: [email],
			subject: "Your Color Conversion Results",
			html: EmailTemplate(JSON.parse(results)),
		});

		if (res.error) {
			return {
				success: false,
				data: initialData,
				errors: undefined,
				message: res.error.message,
			};
		}

		return {
			success: true,
			data: initialData,
			errors: undefined,
			message: "Email sent successfully!",
		};
	} catch (err) {
		return {
			success: false,
			data: initialData,
			errors: undefined,
			message: "Unknown error",
		};
	}
}

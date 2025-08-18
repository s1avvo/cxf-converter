"use server";

import { initialData } from "@/ui/contact-section";
// import { Resend } from "resend";
import z from "zod";

const contactFormSchema = z.object({
	name: z.string("The field is required").min(2, "Name must be at least 2 characters"),
	email: z.email("Please enter a valid email address").trim().toLowerCase(),
	message: z
		.string("The field is required")
		.min(10, "Message must be at least 10 characters")
		.max(500, "Message must be shorter than 500 characters."),
	privacy: z.boolean().refine((val) => val === true, "You must agree to the privacy policy"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string[]>>;
export type ContactFormState = {
	success: boolean;
	data: ContactFormData;
	errors?: ContactFormErrors;
	message: string;
};

export async function submitContactForm(
	_prevState: ContactFormState,
	formData: FormData
): Promise<ContactFormState> {
	// if (!process.env.RESEND_API_KEY) {
	// 	return;
	// }

	// const resend = new Resend(process.env.RESEND_API_KEY);

	const data = {
		name: formData.get("name")?.toString() || "",
		email: formData.get("email")?.toString() || "",
		message: formData.get("message")?.toString() || "",
		privacy: formData.get("privacy") === "on" || formData.get("privacy") === "true",
	};
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
		// const { name, email, message } = result.data;

		// const { data, error } = await resend.emails.send({
		// 	from: "you@example.com",
		// 	to: [`${process.env.EMAIL_TO}`],
		// 	subject: `Wiadomość od: ${name} <${email}>`,
		// 	html: `<p>Imię i nazwisko: ${name}</p><p>Email: ${email}</p><p>Wiadomość: ${message}</p>`,
		// });

		// if (error) {
		// 	return {
		// 		success: false,
		// 		data: initialData,
		// 		errors: undefined,
		// 		message: error.message,
		// 	};
		// }

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

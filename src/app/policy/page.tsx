export default function Policy() {
	return (
		<main className="mx-auto flex w-full min-h-screen flex-col px-4 py-8 sm:py-12 md:py-16 max-w-3xl">
			<h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
				Privacy Policy — CxF Converter
			</h1>
			<p className="text-sm text-muted-foreground mb-6">Last updated: 2025-11-13</p>

			<p className="text-foreground/90 leading-7 mb-6">
				This Privacy Policy explains what information CxF Converter collects, how that information
				is used, and the measures taken to ensure it is handled responsibly and securely.
			</p>

			<h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Summary</h2>
			<ul className="list-disc pl-6 space-y-2 text-foreground/90">
				<li>
					Uploads are processed locally in your browser; we do not upload your CxF files to our
					servers.
				</li>
				<li>
					If you choose to email results, we collect your email address and the conversion results
					solely to send that email via our email provider (Resend).
				</li>
				<li>We do not sell or share your data for advertising.</li>
			</ul>

			<h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Information we collect</h2>
			<ul className="list-disc pl-6 space-y-2 text-foreground/90">
				<li>
					Uploaded files: CxF files you drop into the app. Processing occurs client-side; the file
					content is not transmitted to our servers.
				</li>
				<li>Email address (optional): Provided only when you use "Send Results".</li>
				<li>
					Conversion results (optional): Included temporarily when generating an email. We do not
					store this data after sending.
				</li>
				<li>
					Technical data: Minimal, ephemeral logs required to operate the service; no analytics or
					tracking cookies by default.
				</li>
			</ul>

			<h2 className="text-xl font-semibold text-foreground mt-8 mb-3">How we use information</h2>
			<ul className="list-disc pl-6 space-y-2 text-foreground/90">
				<li>To perform the requested color conversion locally in your browser.</li>
				<li>
					To send your requested email containing conversion results (if you opt in). We do not
					store your email after delivery.
				</li>
			</ul>

			<h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Security</h2>
			<ul className="list-disc pl-6 space-y-2 text-foreground/90">
				<li>All communication between your browser and our service uses HTTPS.</li>
				<li>
					We follow industry‑standard practices to protect the minimal data processed by the app.
				</li>
			</ul>

			<h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Third parties</h2>
			<ul className="list-disc pl-6 space-y-2 text-foreground/90">
				<li>
					We use Resend to deliver emails. Resend processes your email address and message contents
					only to send the message, according to their own terms and policies.
				</li>
			</ul>

			<h2 className="text-xl font-semibold text-foreground mt-8 mb-3">User responsibility</h2>
			<p className="text-foreground/90 leading-7 mt-2">
				You are responsible for ensuring that the content you convert or choose to send via email
				does not include sensitive or confidential information.
			</p>
		</main>
	);
}

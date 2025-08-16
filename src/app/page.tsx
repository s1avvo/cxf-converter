export default function Home() {
	return (
		<div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
			<main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">CxF Converter</h1>
			</main>
			<footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
				© 2025, CxF Converter
			</footer>
		</div>
	);
}

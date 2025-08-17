"use client";

import { useState } from "react";
import { Upload, Copy, BrushCleaning } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@ui/shadcn/button";
import { Separator } from "@/ui/shadcn/separator";

const mockColorResults = {
	name: "Pantone 186 C",
	hex: "#C8102E",
	result: [
		{
			space: "cmyk",
			value: "0,91,76,6",
		},
		{
			space: "rgb",
			value: "200,16,46",
		},
		{
			space: "lab",
			value: "42,68,48",
		},
		{
			space: "hsl",
			value: "151,77%,69%",
		},
		{
			space: "hex",
			value: "#C8102E",
		},
	],
};

export function HeroSection() {
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadedFile, setUploadedFile] = useState(true);

	return (
		<section className="bg-background py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<header className="mb-12 text-center">
					<h1 className="mb-6 text-4xl font-bold md:text-6xl">
						Professional <span className="gradient-text">CxF Converter</span>
					</h1>
					<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
						Convert CxF files to CMYK, RGB, and HEX formats with precision. Trusted by designers and
						print professionals worldwide for accurate color conversion.
					</p>
				</header>

				<div>
					{!uploadedFile ? (
						<div className="space-y-8">
							<div
								className={cn(
									"flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 text-center transition-all duration-300 md:p-20",
									isDragOver
										? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
										: "border-border hover:border-primary/50 hover:bg-muted/50"
								)}
								onDragOver={() => setIsDragOver(true)}
								onDragLeave={() => setIsDragOver(false)}
							>
								<div className={cn("transition-all duration-300", isDragOver ? "scale-110" : "")}>
									<Upload className="text-muted-foreground mx-auto mb-6 h-16 w-16 md:h-20 md:w-20" />
								</div>
								<h3 className="mb-3 text-2xl font-bold md:text-3xl">
									{isDragOver ? "Drop your file here!" : "Drag & Drop CXF File"}
								</h3>
								<p className="text-muted-foreground mb-8 max-w-md text-lg">
									{isDragOver
										? "Release to upload your CxF file"
										: "Drag your CxF file here or click below to browse"}
								</p>

								<div className="flex flex-col items-center gap-4 sm:flex-row">
									<input type="file" accept=".cxf" className="hidden" id="file-upload" />
									<label htmlFor="file-upload">
										<Button
											asChild
											size="lg"
											className="gradient-primary gradient-primary-hover cursor-pointer px-8 py-3 text-white"
										>
											<span>
												<Upload className="mr-2 h-5 w-5" />
												Upload CXF File
											</span>
										</Button>
									</label>
									<Button
										variant="outline"
										size="lg"
										className="border-primary hover:bg-primary/10 cursor-pointer border-2 bg-transparent px-8 py-3"
										onClick={() => setUploadedFile(false)}
									>
										<BrushCleaning className="mr-2 h-5 w-5" />
										Clear
									</Button>
								</div>
							</div>

							<p className="text-muted-foreground text-center text-sm">
								Supported format: <span className="font-medium">.cxf</span> • Converts to:{" "}
								<span className="font-medium">CMYK, RGB, HEX</span>
							</p>
						</div>
					) : (
						<div className="space-y-8 text-center">
							<div className="mx-auto grid max-w-xl">
								<div className="bg-muted relative mb-8 flex items-center rounded-lg p-2">
									<div
										className="absolute top-1/2 -left-6 h-16 w-16 -translate-y-1/2 rounded-xl"
										style={{ backgroundColor: mockColorResults.hex }}
									/>
									<h4 className="ml-12 text-2xl font-medium">{mockColorResults.name}</h4>
								</div>

								<ul>
									{mockColorResults.result.map((color, index) => (
										<li key={index} className="flex items-start">
											<div className="flex-1 space-y-2">
												<div className="flex items-end justify-between">
													<div>
														<p className="text-muted-foreground text-xs font-normal">
															{color.space.toUpperCase()}
														</p>
														<p className="mt-1 font-mono text-xl font-bold">{color.value}</p>
													</div>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => navigator.clipboard.writeText(color.value)}
														className="h-8 w-8 p-2"
														aria-label={`Copy ${color.space} value`}
													>
														<Copy className="h-4 w-4" />
													</Button>
												</div>
												<Separator className="my-4" />
											</div>
										</li>
									))}
								</ul>
							</div>

							<Button variant="outline" onClick={() => setUploadedFile(false)}>
								Convert Another File
							</Button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

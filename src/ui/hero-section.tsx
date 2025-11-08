"use client";

import { Copy } from "lucide-react";
import { Button } from "@ui/shadcn/button";
import { Separator } from "@/ui/shadcn/separator";
import { FileUpload } from "@/ui/file-upload";

import { useConverter } from "@/context/convert-provider";

export function HeroSection() {
	const { colorResult, setColorResult } = useConverter();

	return (
		<section className="bg-background py-8 sm:py-12 md:py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<header className="mb-12 text-center md:mb-16">
					<h1 className="gradient-text mb-6 text-5xl font-bold md:text-6xl">CxF Converter</h1>
					<p className="text-muted-foreground mx-auto max-w-3xl text-xl">
						Convert CxF to CMYK, sRGB, OKLab, OKLch and HEX formats for different measurement
						conditions included in the file
					</p>
				</header>

				<div>
					{!colorResult ? (
						<FileUpload />
					) : (
						<div className="space-y-8 px-4 text-center sm:px-0">
							{colorResult.map((color) => (
								<div className="mx-auto grid max-w-xl" key={color.name}>
									<div className="bg-muted relative mb-8 flex items-center rounded-lg p-2">
										<div
											className="absolute top-1/2 -left-6 h-16 w-16 -translate-y-1/2 rounded-xl"
											style={{
												backgroundColor: color.result.find((c) => c.space === "HEX")?.value,
											}}
										/>
										<h4 className="ml-12 text-xl font-medium">{color.name}</h4>
									</div>

									<ul>
										{color.result.map((color, index) => (
											<li key={index} className="flex items-start">
												<div className="flex-1 space-y-2">
													<div className="flex items-end justify-between">
														<div>
															<p className="text-muted-foreground text-left text-xs font-normal">
																{color.space}
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
							))}

							<Button
								size="lg"
								variant="outline"
								onClick={() => {
									setColorResult(null);
									window.scrollTo({ top: 0 });
								}}
							>
								Convert Another File
							</Button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

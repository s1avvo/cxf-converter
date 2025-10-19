"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@ui/shadcn/button";
import { Separator } from "@/ui/shadcn/separator";
import FileUpload from "@/ui/file-upload";
import { useConverter } from "@/context/convert-provider";
import { rgbToHex } from "@/lib/utils";

export function HeroSection() {
	const { colorResult, setColorResult } = useConverter();

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
					{!colorResult ? (
						<FileUpload />
					) : (
						<div className="space-y-8 text-center">
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
								variant="outline"
								onClick={() => {
									setColorResult(null);
									window.scrollTo({ top: 0, behavior: "smooth" });
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

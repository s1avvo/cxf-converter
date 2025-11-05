"use client";

import { File, Upload, Trash, Play } from "lucide-react";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

import { Button } from "@ui/shadcn/button";
import { Card, CardContent } from "@ui/shadcn/card";
import { cn } from "@/lib/utils";
import { cxfConverter } from "@/actions/colorConverter";
import { useConverter } from "@/context/convert-provider";

export function FileUpload() {
	const { setColorResult } = useConverter();
	const [file, setFile] = useState<File>();

	const handleFile = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!file) {
			alert("No files selected!");
			return;
		}

		const data = new FormData();
		data.append("file", file);

		const converterResult = cxfConverter(await file.text());
		setColorResult(converterResult);
	};

	return (
		<div className="space-y-8">
			<div className="mx-auto max-w-7xl border-none bg-transparent shadow-none sm:px-6 lg:px-8">
				<div>
					<form onSubmit={handleFile}>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
							<div className="col-span-full">
								<Dropzone
									onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
									accept={{ "application/xml": [".cxf"] }}
									multiple={false}
								>
									{({ getRootProps, getInputProps, isDragActive }) => (
										<div
											{...getRootProps()}
											className={cn(
												isDragActive
													? "border-primary bg-primary/10 shadow-lg"
													: "border-border hover:border-primary/50 hover:bg-muted/50",
												"flex flex-col justify-center rounded-xl border-2 border-dashed p-16 text-center transition-all duration-300"
											)}
										>
											<input {...getInputProps()} />
											<Upload
												className="text-muted-foreground/80 mx-auto h-12 w-12"
												aria-hidden={true}
											/>
											<p className="text-muted-foreground mt-4">
												Drag and drop or{" "}
												<span className="text-primary cursor-pointer hover:underline">
													choose CxF file
												</span>
											</p>
										</div>
									)}
								</Dropzone>

								{file && (
									<>
										<h4 className="text-foreground mt-6 font-medium">File(s) to upload</h4>
										<ul role="list" className="mt-4 space-y-4">
											<li key={file.name} className="relative">
												<Card className="relative p-4">
													<div className="absolute top-1/2 right-4 -translate-y-1/2">
														<Button
															type="button"
															variant="ghost"
															size="icon"
															aria-label="Remove file"
															onClick={() => setFile(undefined)}
														>
															<Trash className="h-5 w-5" aria-hidden={true} />
														</Button>
													</div>
													<CardContent className="flex items-center space-x-3 p-0">
														<span className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
															<File className="text-foreground h-5 w-5" aria-hidden={true} />
														</span>
														<div>
															<p className="text-foreground font-medium">{file.name}</p>
															<p className="text-muted-foreground mt-0.5 text-sm">
																{file.size} bytes
															</p>
														</div>
													</CardContent>
												</Card>
											</li>
										</ul>
									</>
								)}
							</div>
						</div>

						<div className="mt-8 flex items-center justify-center">
							<Button
								size="lg"
								className="gradient-primary gradient-primary-hover cursor-pointer px-8 py-3 text-white"
								type="submit"
							>
								Start Converting
								<Play className="ml-2 h-5 w-5" />
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

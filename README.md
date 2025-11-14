# CxF Converter

Convert spectral color data from CxF (Color Exchange Format) files into multiple color spaces including sRGB, CMYK, CIELab, OKLab, OKLCH, and HEX. Upload a .cxf file, visualize swatches, copy values with one click, and optionally email the results.

## Features
- CxF (.cxf XML) parsing with spectral normalization
- Accurate color conversions: sRGB, CMYK, CIELab, OKLab, OKLCH, HEX
- Illuminants and observers: D50/D65 and 2°/10° supported
- Bradford chromatic adaptation for illuminant changes
- Result sharing via URL encoding and convenient copy-to-clipboard
- Optional email delivery of results via Resend

## Tech stack
- Next.js 16 and React 19
- Tailwind CSS 4, Radix UI, shadcn/ui components
- fast-xml-parser, mathjs, zod
- lucide-react icons, next-themes

## Getting started
Prerequisites: Node.js 18+ and npm.

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage
1) Upload a .cxf file (drag-and-drop or choose file)
2) Review converted values and color swatches
3) Copy values or click Send Results to email them

## Environment variables
To enable emailing via Resend, add a .env.local file:

```ini
RESEND_API_KEY=your_resend_api_key
```

If not set, the app runs normally but email sending will fail gracefully.

## Scripts
- npm run dev: Start development server
- npm run build: Build for production
- npm run start: Run production server
- npm run lint: Biome checks
- npm run format: Format with Biome

## How it works (high level)
- Parses CxF objects of type Target/Standard and reads ReflectanceSpectrum data
- Normalizes spectra to a standard range and step, then computes XYZ using reference illuminants and observers
- Applies chromatic adaptation (Bradford) when needed and derives sRGB, CIELab, OKLab/OKLCH; computes CMYK and HEX from sRGB

## Notes
- Data conversion is performed client-side; files are not uploaded to a server for processing
- Emailing results sends the converted JSON payload to Resend only when you submit the form

## Acknowledgements
- CIE standard observer functions and reference illuminants data tables

## License
No license specified yet.

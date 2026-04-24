import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProjectImageCard from '@/components/ProjectImageCard';
import PDFViewer from '@/components/PDFViewer';
import Reveal from '@/components/Reveal';
import { imagePreviewSrc } from '@/lib/image-optimization';

const sampleReportHref = '/zoningpal/ZoningPal-Sample-Report.pdf';

const metrics = [
  { value: '17', label: 'Pages in sample report' },
  { value: '35+', label: 'Spatial tables queried' },
  { value: '81', label: 'Local by-law text files' },
  { value: '90s', label: 'Typical report generation target' },
] as const;

const reportProof = [
  {
    label: 'Parcel Context',
    body: 'Address, PIN, legal description, zone label, overlays, policy area, PMTSA/IZ status, heritage status, lot area, frontage, depth, and mapped site dimensions.',
  },
  {
    label: 'Applied Controls',
    body: 'Base zone rules, overlays, site-specific exceptions, height, density, setbacks, streetwall rules, lot coverage, amenity space, and official plan context.',
  },
  {
    label: 'Standards',
    body: 'Parking, visitor parking, accessible parking, bicycle parking, loading spaces, permitted uses, conditional uses, and explicit removals or prohibitions.',
  },
  {
    label: 'Traceability',
    body: 'Specific references, glossary, City of Toronto contact information, report ID, run date, and disclaimers that make the output usable as an informational brief.',
  },
] as const;

const pipeline = [
  {
    step: '01',
    title: 'Spatial Extraction',
    body: 'PostGIS resolves the property boundary, zone, overlays, exception, official plan designation, heritage layers, parking zone, bicycle zone, policy area, and parcel dimensions.',
  },
  {
    step: '02',
    title: 'Exact By-law Loading',
    body: 'The backend loads the relevant by-law sections from local text files: base provisions, definitions, overlays, suffixes, and Chapter 900 site-specific exceptions.',
  },
  {
    step: '03',
    title: 'Rights Analysis',
    body: 'Claude analyzes development rights over structured context assembled by the system. It is not searching a generic document pile.',
  },
  {
    step: '04',
    title: 'Deterministic Checks',
    body: 'Parking, loading, bicycle, accessibility, heritage, policy-area, and form-control calculations run through explicit rules and structured tables.',
  },
  {
    step: '05',
    title: 'Report + API Output',
    body: 'The system returns structured data, generates a professional PDF, stores report artifacts, and exposes analysis endpoints for platform integration.',
  },
] as const;

const diagramInputs = [
  'Toronto address',
  'City spatial data',
  'Local by-law text',
] as const;

const diagramOutputs = [
  'Structured analysis',
  'PDF zoning brief',
  'API response',
] as const;

const diagramPhases = [
  {
    label: 'PostGIS',
    body: 'Resolve parcel, zone, overlays, exceptions, dimensions, and policy layers.',
  },
  {
    label: 'By-law Loader',
    body: 'Load only the applicable provisions, definitions, overlays, and exceptions.',
  },
  {
    label: 'Rights Model',
    body: 'Assemble development rights from exact context before explanation.',
  },
  {
    label: 'Rule Engine',
    body: 'Calculate parking, loading, bicycle, accessibility, and form controls.',
  },
  {
    label: 'Report Layer',
    body: 'Generate cited PDF output and reusable API artifacts.',
  },
] as const;

const architectureLayers = [
  {
    label: 'Frontend',
    items: ['React / TypeScript', 'Address search', 'Interactive zoning map', 'Account and credits flow', 'Saved reports'],
  },
  {
    label: 'Backend',
    items: ['Node / Express', 'Pipeline conductor', 'Retry and artifact tracking', 'Zod contracts', 'Shared data dictionary'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL / PostGIS', 'Supabase Auth + Storage', 'City spatial data', 'Local by-law text files', 'Structured JSON rule tables'],
  },
  {
    label: 'Outputs',
    items: ['Claude / OpenAI reasoning', 'Stripe report purchases', 'Puppeteer / Handlebars PDF', 'Signed report URLs', 'API integration path'],
  },
] as const;

const presentationImages = [
  {
    src: '/zoningpal/ai-tinkerers-zoningpal-title-audience-wide.png',
    alt: 'Audience at the ZoningPal presentation during AI Tinkerers Toronto in Shopify Toronto',
    caption:
      'ZoningPal presented publicly at AI Tinkerers Toronto in Shopify’s Toronto office.',
    frame: 'wide',
    featured: true,
  },
  {
    src: '/zoningpal/ai-tinkerers-zoningpal-map-analysis-demo.png',
    alt: 'ZoningPal live demo on screen during the AI Tinkerers Toronto presentation',
    caption:
      'Live product demo showing the zoning map and analysis interface during the presentation.',
    frame: 'photo',
    featured: false,
  },
  {
    src: '/zoningpal/ai-tinkerers-zoningpal-report-demo-closeup.png',
    alt: 'Close-up of ZoningPal report output during the AI Tinkerers Toronto presentation',
    caption:
      'Report output walkthrough: parcel context, zoning status, and development metrics in the generated brief.',
    frame: 'wide',
    featured: false,
  },
  {
    src: '/zoningpal/ai-tinkerers-zoningpal-title-presenter.png',
    alt: 'Sam presenting the ZoningPal title slide at AI Tinkerers Toronto',
    caption:
      'Title slide and presenter shot from the public ZoningPal presentation.',
    frame: 'photo',
    featured: false,
  },
  {
    src: '/zoningpal/ai-tinkerers-zoningpal-thank-you-qr.png',
    alt: 'ZoningPal thank-you slide with QR code at AI Tinkerers Toronto',
    caption:
      'Closing slide with a direct product call-to-action and QR code for attendees.',
    frame: 'wide',
    featured: false,
  },
  {
    src: '/zoningpal/ai-tinkerers-zoningpal-title-audience-3x2.png',
    alt: 'Alternate audience view of the ZoningPal title slide at AI Tinkerers Toronto',
    caption:
      'Alternate room view showing the size and setting of the presentation.',
    frame: 'photo',
    featured: false,
  },
] as const;

function BackLink() {
  return (
    <div className="fixed top-20 left-6 z-40">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-black dark:hover:text-white transition-colors duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-full border border-black/[0.06] dark:border-white/[0.06] group"
      >
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="label block mb-4">{eyebrow}</span>
      <h2 className="mb-5">{title}</h2>
      {body && (
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {body}
        </p>
      )}
    </div>
  );
}

function ZoningPalSystemDiagram() {
  return (
    <div className="mt-12 border border-black/[0.08] dark:border-white/[0.08] bg-[var(--background)] p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2.2fr_0.8fr] gap-5">
        <div className="border border-black/[0.06] dark:border-white/[0.06] p-5 bg-black/[0.015] dark:bg-white/[0.015]">
          <span className="label block mb-5">Inputs</span>
          <div className="space-y-3">
            {diagramInputs.map((item) => (
              <div key={item} className="border border-black/[0.06] dark:border-white/[0.06] bg-[var(--background)] px-4 py-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border border-black/[0.08] dark:border-white/[0.08] p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <span className="label block mb-2">Pipeline Conductor</span>
              <h3 className="text-xl font-light tracking-tight">Exact context before AI reasoning</h3>
            </div>
            <div className="hidden md:block text-xs font-mono uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
              Zod Contracts
            </div>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-[10%] right-[10%] top-7 border-t border-black/[0.16] dark:border-white/[0.16]" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {diagramPhases.map((phase, index) => (
                <div key={phase.label} className="relative bg-[var(--background)]">
                  <div className="hidden md:flex absolute left-1/2 top-7 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 dark:border-white/30 bg-[var(--background)]" />
                  <div className="border border-black/[0.08] dark:border-white/[0.08] p-4 md:min-h-[190px]">
                    <span className="label block mb-6">{String(index + 1).padStart(2, '0')}</span>
                    <h4 className="text-sm font-medium tracking-tight mb-3">{phase.label}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{phase.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06]">
            {['Deterministic context', 'AI-assisted synthesis', 'Traceable citations'].map((item) => (
              <div key={item} className="bg-black/[0.015] dark:bg-white/[0.015] px-4 py-3">
                <p className="label leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-black/[0.06] dark:border-white/[0.06] p-5 bg-black/[0.015] dark:bg-white/[0.015]">
          <span className="label block mb-5">Outputs</span>
          <div className="space-y-3">
            {diagramOutputs.map((item) => (
              <div key={item} className="border border-black/[0.06] dark:border-white/[0.06] bg-[var(--background)] px-4 py-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-black/[0.06] dark:border-white/[0.06] pt-5">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          The key design decision is sequence. ZoningPal narrows the property context first, then lets AI explain and synthesize the already-assembled facts. That keeps the product closer to a regulatory workflow than a generic chat interface.
        </p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'ZoningPal | Sam Shahsavani',
  description:
    'A Toronto zoning compliance product that combines spatial data, exact by-law loading, deterministic calculations, AI-assisted reasoning, API integration, and PDF report generation.',
  keywords: [
    'ZoningPal',
    'Zoning Compliance',
    'PostGIS',
    'AEC Tech',
    'Toronto Zoning',
    'Claude API',
    'Puppeteer PDF',
  ],
};

export default function ZoningPalPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" as="script" />
      <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" as="script" />
      <link rel="preload" href={sampleReportHref} as="fetch" crossOrigin="anonymous" />

      <BackLink />

      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-12 w-12">
              <Image
                src={imagePreviewSrc('/logos/ZoningPal.png')}
                alt="ZoningPal logo"
                fill
                priority
                sizes="48px"
                className="object-contain"
              />
            </div>
            <span className="label">ZoningPal</span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="max-w-4xl mb-8">A zoning report engine for Toronto properties</h1>
        </Reveal>

        <Reveal delay={180}>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-[1.7] max-w-3xl mb-10">
            ZoningPal turns a manual zoning research workflow into a live report product. It combines spatial data, exact by-law loading, deterministic rule checks, AI-assisted reasoning, and PDF generation into one pipeline.
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="flex flex-wrap gap-3 mb-14">
            <a
              href="https://www.zoningpal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-opacity duration-300"
            >
              Visit ZoningPal
            </a>
            <a
              href={sampleReportHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm border border-black/15 dark:border-white/15 rounded-full hover:border-black/40 dark:hover:border-white/40 transition-colors duration-300"
            >
              Open Sample Report
            </a>
          </div>
        </Reveal>

        <Reveal delay={340}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06]">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-[var(--background)] p-6">
                <div className="text-3xl md:text-4xl font-light tracking-tight mb-2">{metric.value}</div>
                <p className="label leading-relaxed">{metric.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-20 px-6 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="What It Solves"
              title="The hard part is not the PDF. It is assembling the right context."
              body="A zoning report is only useful if the system knows which parcel, zone, overlay, exception, policy area, and by-law sections actually apply. That is where the product earns trust."
            />
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06]">
            {reportProof.map((item, index) => (
              <Reveal key={item.label} delay={index * 80}>
                <div className="h-full bg-[var(--background)] p-7 md:p-8">
                  <span className="label block mb-4">{item.label}</span>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-black/[0.015] dark:bg-white/[0.015] border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Pipeline"
              title="Structured reasoning over deterministic context"
              body="The system does not ask an AI model to guess from a pile of municipal PDFs. It first builds the exact property context, then uses AI where explanation and synthesis are useful."
            />
          </Reveal>

          <Reveal delay={100}>
            <ZoningPalSystemDiagram />
          </Reveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {pipeline.map((phase, index) => (
              <Reveal key={phase.step} delay={120 + index * 70}>
                <div className="h-full bg-[var(--background)] p-6 flex flex-col">
                  <span className="label block mb-8">{phase.step}</span>
                  <h3 className="text-lg font-light tracking-tight mb-4">{phase.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {phase.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Architecture"
              title="A product stack built around zoning accuracy"
              body="The architecture is intentionally boring in the right places: typed contracts, explicit phase outputs, spatial database queries, deterministic calculations, and traceable report generation."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {architectureLayers.map((layer, index) => (
              <Reveal key={layer.label} delay={index * 80}>
                <div className="h-full border border-black/[0.08] dark:border-white/[0.08] p-6 bg-white/40 dark:bg-white/[0.02]">
                  <span className="label block mb-5">{layer.label}</span>
                  <div className="space-y-3">
                    {layer.items.map((item) => (
                      <div key={item} className="border-t border-black/[0.06] dark:border-white/[0.06] pt-3 first:border-t-0 first:pt-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
          <Reveal>
            <div className="h-full bg-[var(--background)] p-8 md:p-10">
              <span className="label block mb-4">Product Boundary</span>
              <h2 className="mb-6">Not an AI chatbot for zoning</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A generic chatbot can sound confident while missing the exact overlay, exception, parking zone, or policy-area modification that changes the answer. That is not enough for zoning.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full bg-[var(--background)] p-8 md:p-10">
              <span className="label block mb-4">The Actual System</span>
              <h2 className="mb-6">AI after the facts are assembled</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                ZoningPal first resolves the parcel and loads the exact applicable rules. AI helps synthesize development rights and explanations after deterministic context has been assembled.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Adoption"
                title="Live product, modest proof, public presentation"
                body="The proof is specific: the report flow shipped, paid uses happened, the API was integrated into Bloom Hub, and the product was presented publicly. This page is not framed as scaled adoption."
              />
            </div>
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {[
              ['Live report flow', 'Users can purchase credits, run a property analysis, and receive a generated PDF report.'],
              ['Platform integration', 'Bloom Hub uses ZoningPal as its zoning-analysis layer through the same API model.'],
              ['Public validation', 'Presented at AI Tinkerers Toronto in Shopify’s Toronto office, and later at Innovate Toronto.'],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 80}>
                <div className="h-full min-h-[220px] bg-[var(--background)] p-7 md:p-8">
                  <span className="label block mb-4">{title}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-12 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {presentationImages.map((image, index) => (
              <Reveal
                key={image.src}
                delay={120 + index * 80}
                className={image.featured ? 'md:col-span-2' : undefined}
              >
                <ProjectImageCard
                  src={image.src}
                  alt={image.alt}
                  caption={image.caption}
                  frame={image.frame}
                  priority={index === 0}
                  sizes={
                    image.featured
                      ? '(min-width: 1024px) 66vw, 100vw'
                      : '(min-width: 1024px) 33vw, 100vw'
                  }
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-6 pb-24 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <span className="label block mb-4">Sample Output</span>
            <h2 className="mb-5">A generated informational zoning brief</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              This sample report is the clearest portfolio artifact because it shows the end-to-end product: parcel context, governing controls, standards, permitted uses, form controls, references, glossary, and disclaimer.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <PDFViewer file={sampleReportHref} title="ZoningPal Sample Report" />
        </Reveal>
      </section>
    </main>
  );
}

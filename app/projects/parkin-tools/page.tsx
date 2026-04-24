import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ExpandableImage from '@/components/ExpandableImage';
import Reveal from '@/components/Reveal';
import { imagePreviewSrc } from '@/lib/image-optimization';

type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  zoom?: number;
  origin?: 'top' | 'top-left';
};

type ToolFlow = {
  eyebrow: string;
  title: string;
  body: string;
  proof: string[];
  screenshots: Screenshot[];
};

const toolCards = [
  {
    label: '01',
    title: 'Finish QAQC Auditor',
    body: 'Uploads room finish data, maps the relevant columns, applies custom rules, and exports a highlighted audit workbook.',
  },
  {
    label: '02',
    title: 'Finish Template Analyzer',
    body: 'Finds repeated finish combinations across rooms so the team can see where templates might be consolidated.',
  },
  {
    label: '03',
    title: 'Template Finder',
    body: 'Turns material selections into a fast lookup tool for matching room finish templates during coordination conversations.',
  },
  {
    label: '04',
    title: 'Room Type Analyzer',
    body: 'Parses reference strings, groups room types, generates abbreviations, and lets the team review codes before export.',
  },
  {
    label: '05',
    title: 'Column Comparisor',
    body: 'Compares phase-to-phase finish values against rule mappings so data transitions can be checked consistently.',
  },
] as const;

const principles = [
  {
    label: 'Local First',
    body: 'The tools run in the browser. No project data needs to leave the user machine.',
  },
  {
    label: 'Excel In, Excel Out',
    body: 'The interface respects how coordination work already happens instead of forcing a new platform.',
  },
  {
    label: 'Rule Based',
    body: 'The value is not a pretty UI alone. It is repeatable checks, mappings, and exported evidence.',
  },
  {
    label: 'Shareable Evidence',
    body: 'Screenshots here use fictional sample workbooks that preserve the workflow without exposing project records.',
  },
] as const;

const toolFlows: ToolFlow[] = [
  {
    eyebrow: 'Tool 01',
    title: 'Finish QAQC Auditor',
    body:
      'The QAQC tool turns a room finish sheet into a repeatable audit. The important move is that rules are visible: required fields, allowed values, duplicate values, and cross-column conditions can be checked before the data moves downstream.',
    proof: [
      'Two-file upload: room report plus finish item reference.',
      'Column mapping keeps the tool tolerant of real spreadsheet naming.',
      'Rules are editable before the audit runs.',
      'The export becomes the evidence layer: not just a dashboard state.',
    ],
    screenshots: [
      {
        src: '/parkin-tools/qaqc-01-upload-empty.webp',
        alt: 'Finish QAQC Auditor upload screen before files are selected',
        caption: 'The tool starts from a simple local upload: room sheet plus BIM ID reference.',
      },
      {
        src: '/parkin-tools/qaqc-02-upload-files-selected.webp',
        alt: 'Finish QAQC Auditor with public sample files selected',
        caption: 'Fictional sample files stand in for the real project sheets.',
      },
      {
        src: '/parkin-tools/qaqc-03-map-columns-and-rules.webp',
        alt: 'Finish QAQC Auditor column mapping interface',
        caption: 'Column mapping makes the workflow resilient to spreadsheet variation.',
      },
      {
        src: '/parkin-tools/qaqc-04-rules-review.webp',
        alt: 'Finish QAQC Auditor rule definition interface',
        caption: 'Rules are explicit: missing values, required relationships, and finish logic are visible before the audit runs.',
      },
      {
        src: '/parkin-tools/qaqc-05-exported-audit-report.webp',
        alt: 'Exported Finish QAQC audit report in Excel',
        caption: 'The exported audit workbook highlights issues so the output can go back into the existing coordination loop.',
        zoom: 1.2,
        origin: 'top-left',
      },
    ],
  },
  {
    eyebrow: 'Tool 02',
    title: 'Finish Template Analyzer',
    body:
      'The template analyzer looks for repeated finish combinations. That matters because a large room schedule can hide duplication, drift, and unnecessary template sprawl.',
    proof: [
      'Upload a room finish report.',
      'Choose the anchor columns and finish columns.',
      'Group repeated combinations into a reviewable set.',
      'Export summary, group, room, and raw-data views.',
    ],
    screenshots: [
      {
        src: '/parkin-tools/template-analyzer-01-upload-empty.webp',
        alt: 'Finish Template Analyzer upload screen',
        caption: 'The workflow begins with a room finish workbook.',
      },
      {
        src: '/parkin-tools/template-analyzer-02-column-mapping.webp',
        alt: 'Finish Template Analyzer column mapping screen',
        caption: 'Mapping separates identity fields from finish fields before analysis.',
      },
      {
        src: '/parkin-tools/template-analyzer-03-grouping-setup.webp',
        alt: 'Finish Template Analyzer grouping setup screen',
        caption: 'The user confirms how the sheet should be grouped and compared.',
      },
      {
        src: '/parkin-tools/template-analyzer-04-results-summary.webp',
        alt: 'Finish Template Analyzer results summary',
        caption: 'The summary shows how many room rows collapse into how many unique finish sets.',
      },
      {
        src: '/parkin-tools/template-analyzer-05-export-summary.webp',
        alt: 'Exported Finish Template Analyzer summary sheet',
        caption: 'The export starts with a compact summary of total rows, unique templates, and repeat candidates.',
        zoom: 1.2,
        origin: 'top-left',
      },
      {
        src: '/parkin-tools/template-analyzer-06-export-template-groups.webp',
        alt: 'Exported Finish Template Analyzer template groups sheet',
        caption: 'Template groups make repeated finish combinations easier to inspect.',
        zoom: 1.2,
        origin: 'top-left',
      },
      {
        src: '/parkin-tools/template-analyzer-07-export-room-groups.webp',
        alt: 'Exported Finish Template Analyzer room groups sheet',
        caption: 'Room-level grouping keeps the analysis tied back to actual rooms.',
        zoom: 1.2,
        origin: 'top-left',
      },
      {
        src: '/parkin-tools/template-analyzer-08-export-room-data.webp',
        alt: 'Exported Finish Template Analyzer raw room data sheet',
        caption: 'The original room data remains available so the summary does not become a black box.',
        zoom: 1.16,
        origin: 'top-left',
      },
    ],
  },
  {
    eyebrow: 'Tool 03',
    title: 'Template Finder',
    body:
      'The template finder is a meeting tool. Instead of digging through a long template workbook, the user selects known materials and the tool narrows the matching room template in real time.',
    proof: [
      'Upload the public template item list.',
      'Map template code, category, and BIM ID columns.',
      'Select finish values across floor, base, wall, and ceiling categories.',
      'Narrow from many possible templates to the matching code.',
    ],
    screenshots: [
      {
        src: '/parkin-tools/template-finder-01-upload-empty.webp',
        alt: 'Template Finder upload screen',
        caption: 'A local upload keeps the lookup tied to the current template source.',
      },
      {
        src: '/parkin-tools/template-finder-02-column-selection.webp',
        alt: 'Template Finder column selection screen',
        caption: 'The tool asks for the columns that define code, category, and BIM ID.',
      },
      {
        src: '/parkin-tools/template-finder-03-all-options.webp',
        alt: 'Template Finder showing all available material options',
        caption: 'Available finish values become interactive filters instead of spreadsheet searching.',
      },
      {
        src: '/parkin-tools/template-finder-04-filtered-match.webp',
        alt: 'Template Finder filtered to one matching template',
        caption: 'As selections accumulate, the matching template set narrows.',
      },
      {
        src: '/parkin-tools/template-finder-05-single-match.webp',
        alt: 'Template Finder with a single matching result',
        caption: 'The result panel keeps the likely template visible beside the selections.',
      },
      {
        src: '/parkin-tools/template-finder-06-selected-template.webp',
        alt: 'Template Finder selected template detail',
        caption: 'The selected template can be inspected without leaving the browser workflow.',
      },
    ],
  },
  {
    eyebrow: 'Tool 04',
    title: 'Room Type Analyzer',
    body:
      'The room type analyzer turns messy reference strings into a reviewable code system. It parses the source text, groups variants, proposes abbreviations, and then lets a human review before export.',
    proof: [
      'Upload the SDP reference workbook.',
      'Select the columns that carry reference and room identity.',
      'Generate room-type abbreviations from repeated references.',
      'Export the codes back into a spreadsheet the team can use.',
    ],
    screenshots: [
      {
        src: '/parkin-tools/room-type-01-upload-empty.webp',
        alt: 'Room Type Analyzer upload screen',
        caption: 'The workflow starts with the reference workbook, not a custom database.',
      },
      {
        src: '/parkin-tools/room-type-02-reference-selection.webp',
        alt: 'Room Type Analyzer reference selection screen',
        caption: 'Column selection tells the tool where room identity and reference strings live.',
      },
      {
        src: '/parkin-tools/room-type-03-review-codes.webp',
        alt: 'Room Type Analyzer generated room code review screen',
        caption: 'Generated codes are reviewable before export so the automation remains supervised.',
      },
      {
        src: '/parkin-tools/room-type-04-results-summary.webp',
        alt: 'Room Type Analyzer results summary screen',
        caption: 'The result summarizes processed rooms, unique references, and skipped rows.',
      },
      {
        src: '/parkin-tools/room-type-05-exported-reference.webp',
        alt: 'Exported Room Type Analyzer workbook',
        caption: 'The export adds a room-type code column back into a familiar spreadsheet format.',
        zoom: 1.2,
        origin: 'top-left',
      },
    ],
  },
  {
    eyebrow: 'Tool 05',
    title: 'Column Comparisor',
    body:
      'The column comparisor checks phase-to-phase finish values against a rule file. It is useful when two columns should not match literally, but should map correctly through an approved relationship.',
    proof: [
      'Upload a main comparison workbook plus a two-column rules file.',
      'Configure which source and target columns should be checked together.',
      'Review match, mismatch, and no-rule counts before export.',
      'Export a marked-up workbook so the comparison can be reviewed in Excel.',
    ],
    screenshots: [
      {
        src: '/parkin-tools/column-comparisor-01-upload-empty.webp',
        alt: 'Column Comparisor upload screen before files are selected',
        caption: 'The tool starts with two local files: the main data workbook and the rules workbook.',
      },
      {
        src: '/parkin-tools/column-comparisor-02-upload-files-selected.webp',
        alt: 'Column Comparisor with public sample files selected',
        caption: 'Fictional sample files preserve the two-file workflow without exposing project records.',
      },
      {
        src: '/parkin-tools/column-comparisor-03-configure-pairs.webp',
        alt: 'Column Comparisor configure column pairs screen',
        caption: 'Column pairs define the handoff being checked, such as source finish values against target finish values.',
      },
      {
        src: '/parkin-tools/column-comparisor-04-results-summary.webp',
        alt: 'Column Comparisor results summary screen',
        caption: 'The review step separates valid mappings, mismatches, and values with no matching rule.',
      },
      {
        src: '/parkin-tools/column-comparisor-05-exported-comparison-report.webp',
        alt: 'Exported Column Comparisor workbook in Excel',
        caption: 'The exported workbook carries comparison columns back into Excel, where the team can inspect the flagged rows.',
        zoom: 1.18,
        origin: 'top-left',
      },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Finish Coordination Tools | Sam Shahsavani',
  description:
    'A public-safe case study of local browser tools for finish QA, template lookup, room-type coding, and healthcare BIM coordination workflows.',
  keywords: [
    'AEC tools',
    'BIM coordination',
    'dRofus',
    'Excel automation',
    'healthcare architecture',
    'internal tooling',
  ],
};

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
    <div className="max-w-3xl">
      <span className="label block mb-4">{eyebrow}</span>
      <h2 className="mb-5 text-3xl md:text-4xl font-light leading-tight tracking-[-0.02em]">{title}</h2>
      {body && (
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {body}
        </p>
      )}
    </div>
  );
}

function ScreenshotFigure({
  screenshot,
  priority = false,
}: {
  screenshot: Screenshot;
  priority?: boolean;
}) {
  return (
    <figure className="flex h-full flex-col border border-black/[0.08] bg-white/55 dark:border-white/[0.08] dark:bg-white/[0.025]">
      <div className="relative aspect-[2400/1235] overflow-hidden bg-black/[0.015] dark:bg-white/[0.025]">
        <ExpandableImage
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          priority={priority}
          quality={90}
          sizes="(min-width: 1280px) 820px, (min-width: 768px) 50vw, 100vw"
          imageClassName="object-contain"
          imageStyle={{
            transform: `scale(${screenshot.zoom ?? 1.42})`,
            transformOrigin: screenshot.origin === 'top-left' ? 'top left' : 'top center',
          }}
        />
      </div>
      <figcaption className="flex min-h-[82px] items-start border-t border-black/[0.06] p-4 text-xs leading-relaxed text-gray-500 dark:border-white/[0.06] dark:text-gray-400">
        {screenshot.caption}
      </figcaption>
    </figure>
  );
}

function ToolFlowSection({ flow, index }: { flow: ToolFlow; index: number }) {
  return (
    <section className={index % 2 === 0 ? 'py-24 px-6' : 'py-24 px-6 border-y border-black/[0.06] bg-black/[0.015] dark:border-white/[0.06] dark:bg-white/[0.015]'}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <Reveal className="lg:col-span-4">
            <SectionHeading eyebrow={flow.eyebrow} title={flow.title} body={flow.body} />
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {flow.proof.map((item, proofIndex) => (
              <Reveal key={item} delay={proofIndex * 70}>
                <div className="h-full min-h-[160px] bg-[var(--background)] p-6 md:p-7">
                  <span className="label block mb-5">{String(proofIndex + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {flow.screenshots.map((screenshot, screenshotIndex) => (
            <Reveal key={screenshot.src} delay={screenshotIndex * 60}>
              <ScreenshotFigure screenshot={screenshot} priority={index === 0 && screenshotIndex < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ParkinToolsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <BackLink />

      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-12 w-12">
              <Image
                src={imagePreviewSrc('/logos/Parkin.jpeg')}
                alt="Parkin Architects logo"
                fill
                priority
                sizes="48px"
                className="object-contain"
              />
            </div>
            <span className="label">Parkin / Healthcare BIM Tooling</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <Reveal className="lg:col-span-7" delay={80}>
            <h1 className="max-w-4xl mb-8">Browser tools for finish coordination at hospital scale</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-[1.7] max-w-3xl">
              I built a set of local, browser-based tools for the repetitive parts of finish coordination: QA checks, template consolidation, material lookup, room-type coding, and phase-to-phase data validation.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={160}>
            <div className="border border-black/[0.08] dark:border-white/[0.08] p-7 md:p-8 bg-black/[0.015] dark:bg-white/[0.02]">
              <span className="label block mb-5">Scope</span>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                These are local coordination tools, not a public SaaS product. Their value is practical: they fit an existing workflow, keep data on the user machine, and return reviewable Excel evidence.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mt-16 border border-black/[0.08] dark:border-white/[0.08] bg-white/45 dark:bg-white/[0.025]">
            <div className="relative aspect-[2400/1235] overflow-hidden">
              <ExpandableImage
                src="/parkin-tools/qaqc-04-rules-review.webp"
                alt="Finish QAQC Auditor rule-definition interface"
                fill
                priority
                quality={90}
                sizes="(min-width: 1280px) 1152px, 100vw"
                imageClassName="object-contain"
                imageStyle={{
                  transform: 'scale(1.32)',
                  transformOrigin: 'top center',
                }}
              />
            </div>
            <div className="border-t border-black/[0.06] dark:border-white/[0.06] p-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              The screenshots use fictional sample inputs that preserve the workflow without exposing project records.
            </div>
          </div>
        </Reveal>
      </section>

      <section className="py-20 px-6 border-y border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="The Pattern"
              title="The work was not one tool. It was a small operating system for finish data."
              body="Each utility handles one narrow bottleneck, but together they create a cleaner path from messy room data to reviewable output."
            />
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {toolCards.map((tool, index) => (
              <Reveal key={tool.title} delay={index * 70}>
                <div className="h-full min-h-[230px] bg-[var(--background)] p-7 md:p-8">
                  <span className="label block mb-6">{tool.label}</span>
                  <h3 className="mb-5">{tool.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tool.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Design Logic"
              title="The tools meet the workflow where it already lives."
              body="The strongest decision was not overbuilding a platform. It was keeping the tools small, local, and legible enough for a project team to use inside the spreadsheet-heavy coordination reality."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {principles.map((principle, index) => (
              <Reveal key={principle.label} delay={index * 70}>
                <div className="h-full min-h-[210px] bg-[var(--background)] p-7 md:p-8">
                  <span className="label block mb-6">{principle.label}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {toolFlows.map((flow, index) => (
        <ToolFlowSection key={flow.title} flow={flow} index={index} />
      ))}

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto border border-black/[0.08] dark:border-white/[0.08] p-8 md:p-12">
          <Reveal>
            <div className="max-w-4xl">
              <span className="label block mb-5">Signal</span>
              <h2 className="mb-6 text-3xl md:text-5xl font-light leading-tight tracking-[-0.02em]">
                Project-specific coordination pain can become tools a team actually uses.
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                The durable signal is product judgment: understand the messy source files, avoid overengineering, keep data local, build the narrow workflow, and return evidence in the format the team already trusts.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

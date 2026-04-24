import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProjectImageCard, { type ProjectImageFrame } from '@/components/ProjectImageCard';
import Reveal from '@/components/Reveal';
import { imagePreviewSrc } from '@/lib/image-optimization';

type ImageSpec = {
  src: string;
  alt: string;
  caption: string;
  fit?: 'cover' | 'contain';
  frame?: ProjectImageFrame;
};

type RDRFact = {
  label: string;
  value: string;
};

type RDRSection = {
  title: string;
  columns: string[];
  rows: string[][];
};

type RDRPage = {
  page: string;
  facts: RDRFact[];
  sections: RDRSection[];
};

const proofCards = [
  {
    label: 'Output',
    body: 'Room Data Reports turned room-by-room model and planning data into submission-ready information.',
  },
  {
    label: 'Content Layer',
    body: 'Families needed the right geometry, shared parameters, item IDs, and dRofus links before reports could work.',
  },
  {
    label: 'Data QA',
    body: 'The work included finding ghost data, duplicate geometry, door/window drift, and unlinked content before submission.',
  },
  {
    label: 'Team Alignment',
    body: 'I translated the workflow into an internal explainer so the team could see why small data errors mattered.',
  },
] as const;

const pipeline = [
  {
    step: '01',
    title: 'Need Identified',
    body: 'A room, equipment item, accessory, door, or finish requirement enters the workflow through project coordination, requests, cutsheets, or planning data.',
  },
  {
    step: '02',
    title: 'Content Created',
    body: 'Revit families are built or refined with the shared parameters required by the project database schema.',
  },
  {
    step: '03',
    title: 'Content Managed',
    body: 'UNIFI and dRofus help keep the content request, library, item identity, and planning data connected.',
  },
  {
    step: '04',
    title: 'Placed In Revit',
    body: 'Families are placed in the architectural model so geometry, room context, and schedules reflect the current design.',
  },
  {
    step: '05',
    title: "Linked + QA'd",
    body: 'The model is checked against dRofus for missing links, duplicate items, stale quantities, and mismatched identifiers.',
  },
  {
    step: '06',
    title: 'Reported',
    body: 'Room Data Reports aggregate the current room state into a deliverable that the builder and project team can use.',
  },
] as const;

const contentImages: ImageSpec[] = [
  {
    src: '/bim-data/unifi-content-request-form.png',
    alt: 'UNIFI content request form for a Revit family',
    caption: 'Public-safe content request evidence: a project need translated into a family creation task.',
    fit: 'contain',
    frame: 'screen',
  },
  {
    src: '/bim-data/equipment-cutsheet-reference.png',
    alt: 'Equipment cutsheet used as a reference for BIM content',
    caption: 'Cutsheets and manufacturer information became modeling and parameter inputs.',
    fit: 'contain',
    frame: 'screen',
  },
  {
    src: '/bim-data/revit-equipment-family-linework.png',
    alt: 'Revit equipment family linework',
    caption: 'Digital content had to work as geometry and as structured data.',
    fit: 'contain',
    frame: 'screen',
  },
  {
    src: '/bim-data/revit-room-equipment-model.png',
    alt: 'Revit room model with equipment and wall protection',
    caption: 'Placed content carried spatial context and room-specific implications.',
    fit: 'contain',
    frame: 'screen',
  },
];

const qaImages: ImageSpec[] = [
  {
    src: '/bim-data/drofus-equipment-items-table.png',
    alt: 'dRofus equipment item table',
    caption: 'Public-safe dRofus view showing how item numbers, BIM IDs, and planning data were connected.',
    fit: 'contain',
    frame: 'screen',
  },
  {
    src: '/bim-data/door-schedule-discrepancy-log.png',
    alt: 'Door schedule discrepancy log',
    caption: 'Public-safe schedule discrepancy evidence from the same data-integrity problem.',
    fit: 'contain',
    frame: 'screen',
  },
  {
    src: '/bim-data/revit-plan-accessory-placement.png',
    alt: 'Revit plan showing accessory placement',
    caption: 'Plan/model context helped verify that report data matched the current design.',
    fit: 'contain',
    frame: 'screen',
  },
  {
    src: '/bim-data/accessory-utility-data-report.png',
    alt: 'Accessory Utility Data Report spreadsheet screenshot',
    caption: 'Actual public-safe AUDR spreadsheet screenshot showing aggregated accessory quantities and report structure.',
    fit: 'contain',
    frame: 'screen',
  },
];

const reportPages: RDRPage[] = [
  {
    page: '01',
    facts: [
      { label: 'Room Number', value: '08-02.01' },
      { label: 'Room Name', value: 'Consult / Exam Room' },
      { label: 'Department', value: 'Public Sample Clinical Unit' },
      { label: 'Room Classification', value: 'RC-270 · Modified sample' },
      { label: 'Model Name', value: 'HIEP-PUBLIC-SAMPLE' },
    ],
    sections: [
      {
        title: 'Areas',
        columns: ['Name', 'Value', 'RFI Number'],
        rows: [
          ['Programmed Area', '130.00', 'PUB-RFI-001'],
          ['Designed Area', '130.87', 'PUB-RFI-002'],
          ['Area Variance %', '.67', 'PUB-RFI-003'],
        ],
      },
      {
        title: 'RDS',
        columns: ['Group', 'Value', 'RFI Number'],
        rows: [
          ['Ceiling Height', '2700 mm', 'PUB-RFI-011'],
          ['RFI Shielding', 'Radiation shielding: no', 'PUB-RFI-012'],
        ],
      },
      {
        title: 'Acoustics',
        columns: ['Name', 'Value', 'RFI Number'],
        rows: [
          ['Room STC', '50', 'PUB-RFI-021'],
          ['NC Rating and Reverberation Time', 'Refer to acoustic performance section', 'PUB-RFI-022'],
        ],
      },
      {
        title: 'Wall Protection',
        columns: ['Group', 'Name', 'RFI Number'],
        rows: [
          ['Sheet Protection', 'SR-215 mm', 'PUB-RFI-026'],
          ['Sheet Behind Sink', 'PVCu-215 mm', 'PUB-RFI-027'],
        ],
      },
      {
        title: 'Room Finishes',
        columns: ['BIM ID', 'Name', 'RFI Number'],
        rows: [
          ['EF-1', 'Epoxy flooring, multicolour', 'PUB-FIN-031'],
          ['INC-1', 'Integral cove base, 150 mm height', 'PUB-FIN-032'],
          ['PT', 'Paint, washable latex', 'PUB-FIN-033'],
          ['GWB-2', 'Moisture-resistant gypsum board', 'PUB-FIN-034'],
          ['EP-5', 'Paint, epoxy', 'PUB-FIN-035'],
          ['GB-2', 'Moisture-resistant ceiling board', 'PUB-FIN-036'],
        ],
      },
    ],
  },
  {
    page: '02',
    facts: [
      { label: 'Room Number', value: '08-02.01' },
      { label: 'Room Name', value: 'Consult / Exam Room' },
      { label: 'Department', value: 'Public Sample Clinical Unit' },
      { label: 'Room Classification', value: 'RC-270 · Modified sample' },
      { label: 'Model Name', value: 'HIEP-PUBLIC-SAMPLE' },
    ],
    sections: [
      {
        title: 'Doors',
        columns: ['Name', 'Number', 'Frame', 'Panel', 'QTY'],
        rows: [
          ['Single 1220x2135', 'D-08-021-A', '45 STO-105.7501', 'P01 / P5', '1'],
        ],
      },
      {
        title: 'Interior Windows',
        columns: ['Name', 'Number', 'Frame', 'Glazing', 'Treatment'],
        rows: [
          ['No interior window', '-', '-', '-', '-'],
        ],
      },
      {
        title: 'Millwork',
        columns: ['Name', 'Yes', 'No'],
        rows: [
          ['Millwork in room', '', 'x'],
        ],
      },
      {
        title: 'Stainless Steel Casework / Modular Casework',
        columns: ['Item Group', 'BIM ID', 'Name', 'QTY'],
        rows: [
          ['Lower', 'SBS-1', 'Base cabinet, sample', '1'],
          ['Upper', 'SOF', 'Wall cabinet, sample', '1'],
        ],
      },
      {
        title: 'MEP-01',
        columns: ['BIM ID', 'Name'],
        rows: [
          ['A-HBR-00', 'Refer to abbreviations and definitions'],
          ['A-PLU-00', 'Plumbing fixtures: assignment schedule'],
          ['CHM-2', 'Chemical room: no'],
          ['CSH-1', 'Sprinkler head type: concealed'],
          ['LTG3', 'Lighting target type: solid rooms'],
        ],
      },
    ],
  },
  {
    page: '03',
    facts: [
      { label: 'Room Number', value: '08-02.01' },
      { label: 'Room Name', value: 'Consult / Exam Room' },
      { label: 'Department', value: 'Public Sample Clinical Unit' },
      { label: 'Room Classification', value: 'RC-270 · Modified sample' },
      { label: 'Model Name', value: 'HIEP-PUBLIC-SAMPLE' },
    ],
    sections: [
      {
        title: 'Lighting',
        columns: ['BIM ID', 'Name'],
        rows: [
          ['LT06', 'Lighting type 06 · Direct lighting'],
          ['FAT00', 'Fire alarm type 00 · No FA'],
        ],
      },
      {
        title: 'HVAC',
        columns: ['BIM ID', 'Name'],
        rows: [
          ['HVAC-1', 'Clinical support space · solid utility'],
          ['TEMP', 'Temperature monitor: yes'],
          ['EXH', 'Exhaust requirement: standard'],
          ['ALM', 'Alarm action: N/A'],
        ],
      },
      {
        title: 'Hand Hygiene Sink',
        columns: ['BIM ID', 'Name'],
        rows: [
          ['HHS-1', 'Hand hygiene sink'],
          ['EW-1', 'Emergency eyewash · wall'],
          ['S-5', 'Sink · hopper'],
        ],
      },
      {
        title: 'ICAT-01',
        columns: ['BIM ID', 'Name'],
        rows: [
          ['NC-0', 'Nurse call: no nurse call'],
          ['VS0', 'Video surveillance: none'],
          ['PB00', 'Panic button: none'],
          ['A-DATA-00', 'Data drop quantities by room type'],
        ],
      },
    ],
  },
  {
    page: '04',
    facts: [
      { label: 'Room Number', value: '08-02.01' },
      { label: 'Room Name', value: 'Consult / Exam Room' },
      { label: 'Department', value: 'Public Sample Clinical Unit' },
      { label: 'Room Classification', value: 'RC-270 · Modified sample' },
      { label: 'Model Name', value: 'HIEP-PUBLIC-SAMPLE' },
    ],
    sections: [
      {
        title: 'Accessories',
        columns: ['BIM ID', 'Name', 'Quantity'],
        rows: [
          ['A-1', 'Paper towel dispenser', '2'],
          ['A-2', 'Hand sanitizer dispenser', '1'],
          ['A-3', 'Soap dispenser with drip tray', '2'],
          ['A-4', 'Waste receptacle', '1'],
        ],
      },
      {
        title: 'Report QA',
        columns: ['Check', 'Result'],
        rows: [
          ['dRofus link', 'Matched to current public sample room record'],
          ['Quantity check', 'No duplicate accessories in sample room'],
        ],
      },
    ],
  },
];

const claims = [
  {
    label: 'Scope Boundary',
    title: 'Not ownership of every project database across all firms',
    body: 'The scope is B+H-side workflow ownership under Arcadis as prime consultant. That distinction keeps the page precise and credible.',
  },
  {
    label: 'What It Shows',
    title: 'A source-of-truth workflow between content, data, QA, and reports',
    body: 'The work connected Revit families, shared parameters, dRofus records, placement checks, discrepancy cleanup, and Room Data Report outputs.',
  },
] as const;

export const metadata: Metadata = {
  title: 'BIM Data Orchestration | Sam Shahsavani',
  description:
    'A healthcare BIM data workflow case study connecting Revit, dRofus, UNIFI, QA, and Room Data Reports on the Halifax Infirmary Expansion.',
  keywords: [
    'BIM Data',
    'dRofus',
    'Revit',
    'Healthcare BIM',
    'Room Data Reports',
    'Data Integrity',
    'Halifax Infirmary Expansion',
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

function SampleQrBlock() {
  const size = 21;
  const finderStarts = [
    [0, 0],
    [0, 14],
    [14, 0],
  ] as const;

  const isInFinderArea = (row: number, col: number, startRow: number, startCol: number) => {
    const localRow = row - startRow;
    const localCol = col - startCol;

    return localRow >= 0 && localRow <= 6 && localCol >= 0 && localCol <= 6;
  };

  const isFinderModule = (row: number, col: number, startRow: number, startCol: number) => {
    const localRow = row - startRow;
    const localCol = col - startCol;

    if (localRow < 0 || localRow > 6 || localCol < 0 || localCol > 6) {
      return false;
    }

    return (
      localRow === 0 ||
      localRow === 6 ||
      localCol === 0 ||
      localCol === 6 ||
      (localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4)
    );
  };

  return (
    <div
      className="grid h-14 w-14 bg-white p-[2px]"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: size * size }).map((_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const isFinder = finderStarts.some(([startRow, startCol]) =>
          isFinderModule(row, col, startRow, startCol)
        );
        const isReservedFinderSpace = finderStarts.some(([startRow, startCol]) =>
          isInFinderArea(row, col, startRow, startCol)
        );
        const isDataModule =
          !isReservedFinderSpace &&
          ((row * 7 + col * 11 + row * col) % 6 === 0 ||
            (row + col * 2) % 9 === 0 ||
            (row * col) % 17 === 0);
        const isDark = isFinder || isDataModule;

        return <span key={index} className={isDark ? 'bg-black' : 'bg-white'} />;
      })}
    </div>
  );
}

function RoomDataReportReplica({ report }: { report: RDRPage }) {
  return (
    <figure className="flex h-full flex-col border border-black/[0.08] bg-white/45 dark:border-white/[0.08] dark:bg-white/[0.025]">
      <div className="aspect-[8.5/11] overflow-hidden bg-black/[0.025] p-4 dark:bg-white/[0.025] md:p-5">
        <div className="flex h-full flex-col bg-white p-5 text-black shadow-sm">
          <div className="grid grid-cols-[1fr_1.2fr_1fr] items-start gap-4">
            <div className="flex items-start gap-3 text-[8px] font-semibold uppercase leading-tight text-gray-600">
              <span>Nova Scotia</span>
              <span>Nova Scotia Health</span>
            </div>
            <div className="text-center">
              <h3 className="text-[15px] font-semibold leading-tight text-black">Room Data Report - RDR</h3>
              <p className="text-[10px] font-semibold text-black">PCL Submission - Ver 3.2</p>
            </div>
            <div className="text-right text-[9px] font-semibold leading-tight text-black">
              <div>HIEP</div>
              <div className="font-normal">Public Sample Project</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-3 bg-[#efefef] p-2">
            <dl className="grid grid-cols-[90px_1fr] gap-x-3 gap-y-1 text-[8px] leading-tight">
              {report.facts.map((fact) => (
                <div key={fact.label} className="contents">
                  <dt className="font-semibold text-gray-700">{fact.label}</dt>
                  <dd className="font-semibold text-black">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="bg-white p-1">
              <SampleQrBlock />
            </div>
          </div>

          <div className="mt-3 flex-1 space-y-3 overflow-hidden">
            {report.sections.map((section) => (
              <section key={section.title}>
                <h4 className="mb-1 text-[12px] font-semibold leading-tight text-black">
                  {section.title}
                </h4>
                <table className="w-full border-collapse text-[8px] leading-[1.2]">
                  <thead>
                    <tr className="bg-[#eeeeee] text-left text-gray-700">
                      {section.columns.map((column) => (
                        <th key={column} className="px-1.5 py-1 font-semibold">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={`${section.title}-${row.join('-')}`} className="border-b border-black/[0.04] last:border-b-0">
                        {row.map((cell, cellIndex) => (
                          <td key={`${cell}-${cellIndex}`} className="px-1.5 py-1 align-top text-gray-800">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 border-t border-black pt-1 text-[7px] leading-tight text-black">
            <div>4/17/2026 12:00 PM<br />public.sample@portfolio.local</div>
            <div className="text-center">Generated by dRofus © 2023-2024 Arcadis Inc.</div>
            <div className="text-right">Page {report.page}</div>
          </div>
        </div>
      </div>
      <figcaption className="flex min-h-[76px] items-start border-t border-black/[0.06] p-4 text-xs leading-relaxed text-gray-500 dark:border-white/[0.06] dark:text-gray-400">
        Public-safe HTML reconstruction. Room names, IDs, references, and values are modified to show the report structure without exposing project records.
      </figcaption>
    </figure>
  );
}

export default function BIMDataOrchestrationPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <BackLink />

      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-12 w-12">
              <Image
                src={imagePreviewSrc('/logos/b_h_architects_logo.jpeg')}
                alt="B+H Architects logo"
                fill
                priority
                sizes="48px"
                className="object-contain"
              />
            </div>
            <span className="label">B+H / Healthcare BIM Data</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <Reveal className="lg:col-span-7" delay={80}>
            <h1 className="max-w-4xl mb-8">BIM data orchestration for hospital rooms</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-[1.7] max-w-3xl">
              On the Halifax Infirmary Expansion, I managed the B+H-side Revit-to-dRofus workflow that connected room content, equipment data, QA, and Room Data Reports.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={160}>
            <div className="border border-black/[0.08] dark:border-white/[0.08] p-7 md:p-8 bg-black/[0.015] dark:bg-white/[0.02]">
              <span className="label block mb-5">Core Idea</span>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                A hospital room is not just geometry. It is also linked equipment, finishes, doors, windows, accessories, quantities, and database records.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {proofCards.map((card) => (
              <div key={card.label} className="bg-[var(--background)] p-6">
                <span className="label block mb-5">{card.label}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-20 px-6 border-y border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Why It Mattered"
              title="The report is only as trustworthy as the hidden data behind it."
              body="Room Data Reports look like a finished output, but they depend on every upstream handoff: families, shared parameters, dRofus IDs, room placement, schedules, and QA."
            />
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {pipeline.map((item, index) => (
              <Reveal key={item.step} delay={index * 70}>
                <div className="h-full min-h-[250px] bg-[var(--background)] p-7 md:p-8">
                  <span className="label block mb-6">{item.step}</span>
                  <h3 className="mb-5">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.body}</p>
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
              eyebrow="Content Management"
              title="From request to usable model content"
              body="The content side was the foundation: understand the requirement, build the family, carry the right parameters, and make sure it could be placed and recognized downstream."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {contentImages.map((image, index) => (
              <Reveal key={image.src} delay={index * 70}>
                <ProjectImageCard {...image} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Data Management"
              title="More than syncing"
              body="The data work was in the mismatches: missing links, old quantities, duplicate geometry, door/window changes, and records that no longer reflected the current model."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {qaImages.map((image, index) => (
              <Reveal key={image.src} delay={index * 70}>
                <ProjectImageCard {...image} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Output"
              title="Room Data Reports made the invisible workflow visible."
              body="The RDR is the strongest artifact because it shows how many different data categories had to resolve into one room-level output. The report pages below are public-safe reconstructions with modified values, paired with the public-safe AUDR screenshot shown above."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportPages.map((report, index) => (
              <Reveal key={report.page} delay={index * 70}>
                <RoomDataReportReplica report={report} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Full Cycle"
              title="The journey of an accessory"
              body="This diagram is simple, but it is the best explanation of the system: need, family creation, Revit placement, dRofus QA, aggregation, and report output."
            />
          </Reveal>

          <Reveal className="lg:col-span-7" delay={100}>
            <ProjectImageCard
              src="/bim-data/accessory-data-cycle-diagram.png"
              alt="Diagram showing the accessory journey from need to Room Data Report"
              caption="The original internal diagram that made the accessory workflow understandable to the team."
              fit="contain"
              frame="wide"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Scope"
              title="Precise ownership makes the work stronger."
              body="The case study focuses on B+H-side data workflow leadership: content, links, QA, reports, and team communication within a larger multi-firm delivery structure."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {claims.map((claim, index) => (
              <Reveal key={claim.label} delay={index * 100}>
                <div className="h-full bg-[var(--background)] p-8 md:p-10">
                  <span className="label block mb-5">{claim.label}</span>
                  <h3 className="mb-5 text-2xl md:text-3xl font-light leading-tight tracking-[-0.02em]">{claim.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{claim.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto border border-black/[0.08] dark:border-white/[0.08] p-8 md:p-12">
          <Reveal>
            <div className="max-w-3xl">
              <span className="label block mb-5">Signal</span>
              <h2 className="mb-6 text-3xl md:text-5xl font-light leading-tight tracking-[-0.02em]">Messy AEC data systems become useful when the hidden dependencies are made visible.</h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                The durable signal is the operating pattern: understand the source-of-truth problem, keep content and data aligned, QA the handoffs, and explain the system clearly enough for a team to use it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

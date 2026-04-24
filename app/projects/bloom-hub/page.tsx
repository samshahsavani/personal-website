import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProjectImageCard, { type ProjectImageFrame } from '@/components/ProjectImageCard';
import Reveal from '@/components/Reveal';

type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  frame?: ProjectImageFrame;
};

const proofCards = [
  {
    label: 'Private Hub',
    body: 'Built as a Bloom Architects workspace with project context at the center.',
  },
  {
    label: 'Design Sandbox',
    body: 'AI ideation, program massing, and sketch-to-3D layout generation lived inside one project context.',
  },
  {
    label: 'Information Layer',
    body: 'Zoning, ZoningPal reports, site finding, documents, and project chat sat beside the design tools.',
  },
  {
    label: 'Full Stack',
    body: 'React, Three.js, FastAPI, Supabase, PostGIS, CadQuery, Gemini Vision, GLB and IFC-oriented output.',
  },
] as const;

const modules: {
  label: string;
  title: string;
  body: string;
  image: Screenshot;
}[] = [
  {
    label: 'Project Hub',
    title: 'Start from the project, not the tool',
    body: 'The dashboard made Bloom Hub feel like a workspace: create a project, reopen it, and keep design intelligence attached to that project instead of scattered across one-off tools.',
    image: {
      src: '/bloom-hub/bloom-hub-project-dashboard.webp',
      alt: 'Bloom Hub project dashboard',
      caption: 'Private project dashboard for creating and reopening Bloom Hub workspaces.',
      frame: 'wide',
    },
  },
  {
    label: 'Design Studio',
    title: 'A sandbox for early design moves',
    body: 'The design studio grouped ideation, concept massing, and layout generation. That matters because early design is not one linear feature. It is a loop between mood, mass, geometry, and constraints.',
    image: {
      src: '/bloom-hub/design-studio-ideate.webp',
      alt: 'Bloom Hub design studio ideation interface',
      caption: 'Ideation, concept massing, and layout workflows in the same design studio.',
      frame: 'wide',
    },
  },
  {
    label: 'Zoning',
    title: 'ZoningPal inside the project context',
    body: 'The zoning module let the workspace query property information and generate ZoningPal reports without leaving the Bloom Hub project environment.',
    image: {
      src: '/bloom-hub/zoning-map-citywide.webp',
      alt: 'Bloom Hub zoning map and report generation interface',
      caption: 'Toronto zoning map with report history and ZoningPal-powered report generation.',
      frame: 'wide',
    },
  },
  {
    label: 'Site Finder',
    title: 'Search the city as design input',
    body: 'The site finder turned parcel dimensions and zoning filters into a design-research tool. It let Bloom look across Toronto before committing to a specific site.',
    image: {
      src: '/bloom-hub/site-finder-citywide-heatmap.webp',
      alt: 'Bloom Hub site finder heatmap over Toronto parcels',
      caption: 'City-wide parcel heatmap with lot dimension filters, zoning distribution, and saved reports.',
      frame: 'wide',
    },
  },
];

const workflowImages: Screenshot[] = [
  {
    src: '/bloom-hub/concept-massing-workspace.webp',
    alt: 'Bloom Hub concept massing workspace',
    caption: '3D concept massing workspace with view controls, layers, analysis, and a massing gallery.',
    frame: 'wide',
  },
  {
    src: '/bloom-hub/concept-massing-site-analysis.webp',
    alt: 'Bloom Hub massing workspace with site analysis overlays',
    caption: 'Site-analysis overlays gave the massing tool environmental and spatial context.',
    frame: 'wide',
  },
  {
    src: '/bloom-hub/layout-sketch-upload.webp',
    alt: 'Bloom Hub sketch upload workflow',
    caption: 'Sketch upload flow for turning hand-drawn floor plans into structured layout data.',
    frame: 'wide',
  },
  {
    src: '/bloom-hub/layout-generated-3d-model.webp',
    alt: 'Bloom Hub generated 3D model output',
    caption: 'Generated 3D model with walls, openings, spaces, and project-side element counts.',
    frame: 'wide',
  },
];

const pipelineSteps = [
  {
    label: '01 / Ingest',
    title: 'Make the sketch part of the project',
    body: 'The upload flow creates a layout record, stores the source sketch, and starts a background processing job instead of treating the image as a loose file.',
  },
  {
    label: '02 / Extract',
    title: 'Separate signal from noise',
    body: 'The pipeline traces walls, segments spaces, vectorizes geometry, detects rooms, reads dimensions, and aligns space polygons back to wall structure.',
  },
  {
    label: '03 / Interpret',
    title: 'Add architectural meaning',
    body: 'AI room labeling and wall classification turn raw geometry into semantic layout data: spaces, wall types, openings, scale, and usable project metadata.',
  },
  {
    label: '04 / Generate',
    title: 'Build model output',
    body: 'Parametric walls, floors, ceilings, spaces, doors, and windows are assembled into a GLB preview with a BIM/IFC-oriented path behind it.',
  },
  {
    label: '05 / Persist',
    title: 'Return it to the workspace',
    body: 'The model URL, floor-plan JSON, walls, spaces, thumbnail, status, and stats are saved back into the project context so the output can be reused.',
  },
] as const;

const technicalLayers = [
  {
    label: 'Frontend',
    title: 'A real workspace shell',
    body: 'React, Vite, and React Three Fiber powered a project dashboard, authenticated routes, feature modules, layer controls, selectable volumes, imported models, camera state, and 3D interaction.',
  },
  {
    label: 'Engines',
    title: 'Design tools behind the interface',
    body: 'The workspace combined concept generation, layout processing, zoning, site finding, assets, and concierge features with solar/shadow and wind-rose overlays for design context.',
  },
  {
    label: 'Geometry',
    title: 'Sketch-to-model pipeline',
    body: 'The layout pipeline moved from wall tracing and space segmentation into scale detection, room labeling, parametric geometry, GLB preview, and BIM/IFC-oriented output.',
  },
  {
    label: 'Data',
    title: 'Project and city intelligence',
    body: 'Supabase handled auth, project state, saved iterations, camera state, uploaded assets, reports, and conversation records. PostGIS supported zoning and parcel-scale site-finding queries.',
  },
] as const;

const scopeSignals = [
  {
    label: 'Private Workspace',
    title: 'A focused workspace for one architecture practice',
    body: 'Bloom Hub was built around the needs of Bloom Architects: early design exploration, site intelligence, zoning context, project documents, and AI assistance in one place.',
  },
  {
    label: 'System Architecture',
    title: 'A private AEC product that connected design tools and information tools',
    body: 'The value is the product architecture: project context, AI design workflows, geometry generation, zoning intelligence, site search, storage, and chat in one workspace.',
  },
] as const;

export const metadata: Metadata = {
  title: 'Bloom Hub | Sam Shahsavani',
  description:
    'A private architecture workspace and AI design sandbox built for Bloom Architects, combining design tools, zoning intelligence, site finding, documents, and sketch-to-3D workflows.',
  keywords: [
    'Bloom Hub',
    'AEC Technology',
    'Architecture Software',
    'Three.js',
    'FastAPI',
    'PostGIS',
    'ZoningPal',
    'Sketch to BIM',
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

export default function BloomHubPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <BackLink />

      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-12 w-28">
              <Image
                src="/logos/bloom-hub-logo.png"
                alt="Bloom Hub logo"
                fill
                priority
                sizes="112px"
                className="object-contain"
              />
            </div>
            <span className="label">Bloom Architects / Private Workspace</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <Reveal className="lg:col-span-7" delay={80}>
            <h1 className="max-w-4xl mb-8">A private architecture workspace for design and project intelligence</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-[1.7] max-w-3xl">
              I built Bloom Hub as a private design-and-information hub for Bloom Architects: a place to start projects, test AI design tools, run zoning and site analysis, manage documents, and keep project intelligence in one workspace.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={160}>
            <ProjectImageCard
              src="/bloom-hub/bloom-hub-login.webp"
              alt="Bloom Hub private login screen"
              caption="Private portal entry for a Bloom Architects workspace built around project continuity."
              frame="wide"
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
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
              eyebrow="Product Idea"
              title="The hub mattered because architecture work is fragmented."
              body="One tool can generate an image. Another can show a map. Another can store a PDF. Bloom Hub tried to make those separate actions feel like one project workspace."
            />
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {technicalLayers.map((layer, index) => (
              <Reveal key={layer.label} delay={index * 70}>
                <div className="h-full min-h-[260px] bg-[var(--background)] p-7 md:p-8">
                  <span className="label block mb-5">{layer.label}</span>
                  <h3 className="mb-5">{layer.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{layer.body}</p>
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
              eyebrow="Workspace Modules"
              title="Design tools and information tools in the same place"
              body="Sketch-to-3D was one strong module inside a larger architecture workspace for design exploration, feasibility, project context, and AI assistance."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <article className="h-full border border-black/[0.08] dark:border-white/[0.08] bg-[var(--background)]">
                  <div className="p-7 md:p-8">
                    <span className="label block mb-5">{item.label}</span>
                    <h3 className="mb-4">{item.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                  <ProjectImageCard
                    {...item.image}
                    variant="embedded"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Design Workflow"
              title="From early design exploration to structured model output"
              body="The design side had to feel visual and fast, but the technical stack underneath was about structure: project state, editable 3D objects, semantic layout data, and exportable geometry."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflowImages.map((image, index) => (
              <Reveal key={image.src} delay={index * 70}>
                <ProjectImageCard
                  {...image}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Sketch-To-3D Architecture"
              title="The hard part was turning ambiguity into structure."
              body="A floor-plan sketch is messy: lines are uncertain, dimensions can be partial, and meaning is not explicit. Bloom Hub treated that as a pipeline problem, not a magic button."
            />
          </Reveal>

          <div className="lg:col-span-8">
            <Reveal delay={80}>
              <div className="mb-6 border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.015] p-7 md:p-8">
                <span className="label block mb-5">Why It Matters</span>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  This sits in the same problem category as mature design-automation tools, but the claim here is narrower: a functional solo-built core architecture for sketch input, geometry extraction, semantic interpretation, model generation, and project persistence.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
              {pipelineSteps.map((step, index) => (
                <Reveal key={step.label} delay={index * 70}>
                  <div className="h-full min-h-[230px] bg-[var(--background)] p-7 md:p-8">
                    <span className="label block mb-5">{step.label}</span>
                    <h3 className="mb-5">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Zoning + Site Intelligence"
              title="The information side was as important as the design side."
              body="Bloom Hub connected the ZoningPal report flow and a Toronto parcel finder into the same workspace. That makes the product story stronger: design decisions and feasibility information lived beside each other."
            />
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 gap-6">
            <Reveal delay={100}>
              <ProjectImageCard
                src="/bloom-hub/zoning-map-parcel-view.webp"
                alt="Bloom Hub parcel-level zoning analysis"
                caption="Parcel-level zoning analysis with map selection, property panel, and report generation flow."
                frame="wide"
                sizes="(min-width: 1024px) 66vw, 100vw"
              />
            </Reveal>
            <Reveal delay={180}>
              <ProjectImageCard
                src="/bloom-hub/site-finder-selected-area.webp"
                alt="Bloom Hub selected-area site finder analysis"
                caption="Selected-area site finder analysis for filtering and saving parcel research around a project."
                frame="wide"
                sizes="(min-width: 1024px) 66vw, 100vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Scope"
              title="Built for one practice, but broad in scope."
              body="Bloom Hub was built for a specific architecture practice, but the system itself was broad: design tools, site intelligence, zoning context, documents, and project-aware assistance."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {scopeSignals.map((claim, index) => (
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
              <h2 className="mb-6 text-3xl md:text-5xl font-light leading-tight tracking-[-0.02em]">Project context can hold design tools and information tools together.</h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Bloom Hub shows both halves of the work: understanding what architects actually need, then building the interface, data model, geometry pipeline, and services that let those workflows live together in one place.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

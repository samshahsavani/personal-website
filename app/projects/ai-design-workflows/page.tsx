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

const proofCards = [
  {
    label: 'Local First',
    body: 'Confidential project material stayed out of public cloud image tools.',
  },
  {
    label: 'Controlled Inputs',
    body: 'Sketches, Rhino massing, line drawings, depth maps, masks, and site context anchored the output.',
  },
  {
    label: '2024 Toolchain',
    body: 'Automatic1111, ComfyUI, Stable Diffusion, ControlNet, local models, LoRAs, and Photoshop.',
  },
  {
    label: 'Design Review',
    body: 'The goal was early visual exploration, not final rendering or replacing architectural judgment.',
  },
] as const;

const timingCards = [
  {
    title: 'The tools were not turnkey',
    body: 'This was before polished architecture AI workflows were common. Getting useful images meant wiring together local models, control images, prompts, masks, and manual cleanup.',
  },
  {
    title: 'Privacy changed the method',
    body: 'Because the work lived inside a company context, public cloud tools were not the right default. The workflow had to run locally and respect project confidentiality.',
  },
  {
    title: 'Architecture needed control',
    body: 'Pure prompting was too loose for design work. The useful move was to make AI follow architectural evidence: massing, perspective, linework, depth, and site context.',
  },
] as const;

const workflowSteps: {
  step: string;
  label: string;
  title: string;
  body: string;
  image: ImageSpec;
}[] = [
  {
    step: '01',
    label: 'Intent',
    title: 'Start from a sketch or design direction',
    body: 'The process began with a human design idea: a sketch, a program direction, a facade ambition, or a massing concept that needed fast visual exploration.',
    image: {
      src: '/ai-workflows/hotel-annotated-hand-sketch.jpg',
      alt: 'Annotated hand sketch used as an architectural input',
      caption: 'An annotated sketch captured the architectural intent before model setup or prompting.',
      fit: 'contain',
      frame: 'evidence',
    },
  },
  {
    step: '02',
    label: 'Geometry',
    title: 'Translate the idea into massing',
    body: 'Rhino gave the workflow a simple but crucial architectural base: proportion, viewpoint, site relationship, and the broad geometry the image should respect.',
    image: {
      src: '/ai-workflows/hotel-rhino-massing.jpg',
      alt: 'Rhino massing model used as an AI control input',
      caption: 'The massing model established the spatial logic before image generation began.',
      fit: 'contain',
      frame: 'evidence',
    },
  },
  {
    step: '03',
    label: 'Controls',
    title: 'Manufacture the constraints the model needs',
    body: 'Line drawings and depth maps were exported as ControlNet inputs. This was the technical hinge: the AI could explore atmosphere without losing the architecture.',
    image: {
      src: '/ai-workflows/hotel-line-control.png',
      alt: 'Line drawing exported from a massing model',
      caption: 'Linework helped preserve edges, silhouette, and the intended geometry.',
      fit: 'contain',
      frame: 'evidence',
    },
  },
  {
    step: '04',
    label: 'Depth',
    title: 'Add spatial hierarchy',
    body: 'Depth maps gave the model another reading of foreground, background, height, and mass. The more the image was constrained, the less it behaved like a random generator.',
    image: {
      src: '/ai-workflows/hotel-depth-control.jpg',
      alt: 'Depth map used as a ControlNet input',
      caption: 'Depth mapping helped keep the image aligned with architectural space.',
      fit: 'contain',
      frame: 'evidence',
    },
  },
  {
    step: '05',
    label: 'Local AI',
    title: 'Iterate locally with model and prompt tests',
    body: 'Automatic1111 and ComfyUI made it possible to test models, LoRAs, ControlNet settings, prompts, and inpainting without sending project material to external services.',
    image: {
      src: '/ai-workflows/tool-comfyui-node-workflow.jpg',
      alt: 'ComfyUI node graph for a local architectural image workflow',
      caption: 'ComfyUI made the workflow explicit: models, conditioning, image inputs, prompts, and outputs wired together locally.',
      fit: 'contain',
      frame: 'evidence',
    },
  },
  {
    step: '06',
    label: 'Judgment',
    title: 'Composite and clean the result',
    body: 'The final step was not automatic. Outputs were selected, repaired, layered, and placed into context through Photoshop so the image could support a design conversation.',
    image: {
      src: '/ai-workflows/tool-photoshop-hotel-composite.png',
      alt: 'Photoshop compositing workflow',
      caption: 'Human judgment turned model outputs into usable design-review imagery.',
      fit: 'contain',
      frame: 'evidence',
    },
  },
];

const toolEvidence: {
  label: string;
  title: string;
  body: string;
  image: ImageSpec;
}[] = [
  {
    label: 'ComfyUI',
    title: 'Node-based local workflow',
    body: 'This was not a single prompt box. It was a local graph of models, conditioning, image inputs, and output handling.',
    image: {
      src: '/ai-workflows/tool-comfyui-node-workflow.jpg',
      alt: 'ComfyUI node graph for local architectural visualization',
      caption: 'ComfyUI workflow graph used to structure local image generation experiments.',
      fit: 'contain',
      frame: 'screen',
    },
  },
  {
    label: 'Automatic1111',
    title: 'Prompt, ControlNet, and generation tuning',
    body: 'Automatic1111 was useful for fast tests, img2img, ControlNet settings, inpainting, model selection, and keeping the workflow on a local machine.',
    image: {
      src: '/ai-workflows/tool-automatic1111-img2img-generation.jpg',
      alt: 'Automatic1111 interface showing local image generation settings',
      caption: 'Local interface with prompt, negative prompt, generation settings, image inputs, and outputs visible together.',
      fit: 'contain',
      frame: 'screen',
    },
  },
  {
    label: 'Photoshop',
    title: 'Selection, repair, and compositing',
    body: 'The final artifact still needed design judgment: selecting useful outputs, repairing artifacts, balancing context, and composing the image for review.',
    image: {
      src: '/ai-workflows/tool-photoshop-entertainment-composite.png',
      alt: 'Photoshop interface for compositing an AI-assisted architecture visualization',
      caption: 'Post-production kept the output legible as architecture, not just as generated imagery.',
      fit: 'contain',
      frame: 'screen',
    },
  },
];

const iterationImages: ImageSpec[] = [
  {
    src: '/ai-workflows/hotel-ai-iteration-01.png',
    alt: 'AI-generated tower iteration 1',
    caption: 'Iteration 01',
    fit: 'contain',
    frame: 'portrait',
  },
  {
    src: '/ai-workflows/hotel-ai-iteration-02.png',
    alt: 'AI-generated tower iteration 2',
    caption: 'Iteration 02',
    fit: 'contain',
    frame: 'portrait',
  },
  {
    src: '/ai-workflows/hotel-ai-iteration-03.png',
    alt: 'AI-generated tower iteration 3',
    caption: 'Iteration 03',
    fit: 'contain',
    frame: 'portrait',
  },
  {
    src: '/ai-workflows/hotel-ai-iteration-04.png',
    alt: 'AI-generated tower iteration 4',
    caption: 'Iteration 04',
    fit: 'contain',
    frame: 'portrait',
  },
  {
    src: '/ai-workflows/hotel-ai-iteration-05.png',
    alt: 'AI-generated tower iteration 5',
    caption: 'Iteration 05',
    fit: 'contain',
    frame: 'portrait',
  },
  {
    src: '/ai-workflows/hotel-ai-iteration-06.png',
    alt: 'AI-generated tower iteration 6',
    caption: 'Iteration 06',
    fit: 'contain',
    frame: 'portrait',
  },
];

const caseStudies: {
  label: string;
  title: string;
  body: string;
  image: ImageSpec;
}[] = [
  {
    label: 'Project 01',
    title: 'Entertainment and retail concept exploration',
    body: 'A concept image used to test mood, scale, lighting, and public-facing atmosphere during early design iteration.',
    image: {
      src: '/ai-workflows/entertainment-concept-final.jpg',
      alt: 'AI-assisted visualization for an entertainment and retail concept',
      caption: 'Early visual exploration, not final documentation.',
      frame: 'wide',
    },
  },
  {
    label: 'Project 02',
    title: 'High-rise hotel context composite',
    body: 'A tower concept moved from sketch and massing through controlled generation and Photoshop placement into an urban context.',
    image: {
      src: '/ai-workflows/hotel-context-composite.jpg',
      alt: 'High-rise hotel concept composited into site context',
      caption: 'Contextual composite after sketch, massing, ControlNet iteration, and cleanup.',
      fit: 'contain',
      frame: 'wide',
    },
  },
];

const claims = [
  {
    label: 'Scope',
    title: 'Not AI designing architecture by itself',
    body: 'The work is not autonomous design or final client rendering. It is a controlled visualization workflow for early design review.',
  },
  {
    label: 'Workflow',
    title: 'A controlled visualization layer for early design',
    body: 'The useful work was translating immature AI tools into a local workflow for architects: private, constrained, iterative, and tied to design intent.',
  },
] as const;

export const metadata: Metadata = {
  title: 'AI Design Workflows | Sam Shahsavani',
  description:
    'A local, controlled AI visualization workflow for architecture concept and competition work, built with Stable Diffusion, ControlNet, Automatic1111, ComfyUI, Rhino, and Photoshop.',
  keywords: [
    'AI Design Workflows',
    'Architecture AI',
    'Stable Diffusion',
    'ControlNet',
    'ComfyUI',
    'Automatic1111',
    'Rhino',
    'AEC Technology',
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

export default function AIDesignWorkflowsPage() {
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
            <span className="label">B+H / AI Design Workflows</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <Reveal className="lg:col-span-7" delay={80}>
            <h1 className="max-w-4xl mb-8">Local AI visualization for architectural concept work</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-[1.7] max-w-3xl">
              At B+H, I supported concept and competition workflows where teams needed fast AI-assisted visual iteration, but confidential project material could not be casually pushed through public cloud tools.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={160}>
            <div className="border border-black/[0.08] dark:border-white/[0.08] p-7 md:p-8 bg-black/[0.015] dark:bg-white/[0.02]">
              <span className="label block mb-5">Core Move</span>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                The useful move was connecting image generation to architectural inputs: sketch, massing, linework, depth, context, and post-production judgment.
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
              eyebrow="Why It Mattered Then"
              title="The difficulty was not the image. It was making the image useful."
              body="In 2024, the workflow still had to be assembled by hand: local setup, model testing, control images, inpainting, and compositing all had to be made usable inside real design constraints."
            />
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08]">
            {timingCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 80}>
                <div className="h-full min-h-[250px] bg-[var(--background)] p-7 md:p-8">
                  <span className="label block mb-5">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mb-5">{card.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{card.body}</p>
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
              eyebrow="Workflow"
              title="A design-controlled image pipeline"
              body="The sequence matters. Each step adds constraint before the AI gets to improvise, then human judgment brings the output back into architectural communication."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, index) => (
              <Reveal key={step.step} delay={index * 70}>
                <article className="h-full flex flex-col border border-black/[0.08] dark:border-white/[0.08] bg-white/35 dark:bg-white/[0.02]">
                  <div className="p-6 md:p-7 flex-1">
                    <div className="flex items-center justify-between gap-4 mb-8">
                      <span className="label">{step.label}</span>
                      <span className="text-xs font-mono text-gray-400 dark:text-gray-600">{step.step}</span>
                    </div>
                    <h3 className="mb-4">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.body}</p>
                  </div>
                  <ProjectImageCard {...step.image} priority={index < 2} variant="embedded" />
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
              eyebrow="Tooling"
              title="The complexity makes the workflow visible."
              body="The screenshots show the historical limitation: the workflow was not packaged yet. It had to be constructed from local interfaces, node graphs, settings, prompts, control inputs, and manual finishing."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {toolEvidence.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <article className="h-full border border-black/[0.08] dark:border-white/[0.08] bg-[var(--background)]">
                  <div className="p-7 md:p-8">
                    <span className="label block mb-5">{item.label}</span>
                    <h3 className="mb-4">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.body}</p>
                  </div>
                  <ProjectImageCard {...item.image} variant="embedded" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Iteration Range"
              title="The value was comparison, not one perfect image."
              body="The workflow let the team hold massing logic relatively steady while testing material, atmosphere, facade expression, lighting, and proportion across multiple outputs."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {iterationImages.map((image, index) => (
              <Reveal key={image.src} delay={index * 45}>
                <ProjectImageCard {...image} sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Project Range"
              title="Two design situations, one repeatable method"
              body="The value was not a single lucky image. The same pattern could move across different project types because the workflow was based on controls, not only prompts."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {caseStudies.map((item, index) => (
              <Reveal key={item.title} delay={index * 100}>
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
                    priority={index === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    variant="embedded"
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Scope"
              title="Real constraints made the workflow useful."
              body="The workflow mattered because the constraints were real: local execution, confidentiality, controlled inputs, and design judgment."
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
              <span className="label block mb-5">Operating Pattern</span>
              <h2 className="mb-6 text-3xl md:text-5xl font-light leading-tight tracking-[-0.02em]">Emerging tools become valuable when the workflow respects the work.</h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                The specific 2024 methods will keep aging, but the pattern still matters: understand the design problem, respect confidentiality, build the missing workflow, test it against real project constraints, and communicate the result clearly enough for a team to use.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

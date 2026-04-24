import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { projectsData } from '@/lib/projects-data';
import ExpandableImage from '@/components/ExpandableImage';
import PDFViewer from '@/components/PDFViewer';
import Reveal from '@/components/Reveal';

export async function generateStaticParams() {
  return projectsData
    .filter((project) => !['better-food-toronto', 'zoningpal', 'ai-design-workflows', 'bim-data-orchestration', 'bloom-hub', 'parkin-tools'].includes(project.id))
    .map((project) => ({
      slug: project.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.id === resolvedParams.slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.name} — Sam Shahsavani`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.id === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Preload PDF resources */}
      <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" as="script" />
      <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" as="script" />
      {project.presentation && (
        <link rel="preload" href={project.presentation} as="fetch" crossOrigin="anonymous" />
      )}

      {/* Back navigation */}
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

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            {project.logo && (
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src={project.logo}
                  alt={`${project.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mb-4">{project.name}</h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-xl text-muted leading-relaxed mb-8 max-w-2xl">
            {project.description}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span key={tag} className="label text-[10px] border border-black/[0.06] dark:border-white/[0.06] px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Presentation Viewer */}
      {project.presentation && (
        <section className="pb-16 px-6 max-w-5xl mx-auto">
          <Reveal>
            <span className="label block mb-6">Presentation</span>
            <PDFViewer file={project.presentation} title={`${project.name} Presentation`} />
          </Reveal>
        </section>
      )}

      {/* Content sections */}
      {project.fullContent && (
        <section className="pb-24 px-6 max-w-4xl mx-auto">
          <div className="space-y-16">
            <Reveal>
              <div>
                <span className="label block mb-4">Overview</span>
                <p className="text-[17px] text-gray-700 dark:text-gray-300 leading-[1.8] max-w-2xl">
                  {project.fullContent.overview}
                </p>
              </div>
            </Reveal>

            {project.fullContent.images && (
              <Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.fullContent.images.map((image) => (
                    <figure
                      key={image.src}
                      className="border border-black/[0.06] dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.02]"
                    >
                      <div className="relative aspect-[3/2]">
                        <ExpandableImage
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          imageClassName={image.fit === 'contain' ? 'object-contain p-4' : 'object-cover'}
                        />
                      </div>
                      <figcaption className="p-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {image.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal>
              <div>
                <span className="label block mb-4">Why It Mattered</span>
                <p className="text-[17px] text-gray-700 dark:text-gray-300 leading-[1.8] max-w-2xl">
                  {project.fullContent.challenge}
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <span className="label block mb-4">How It Worked</span>
                <p className="text-[17px] text-gray-700 dark:text-gray-300 leading-[1.8] max-w-2xl">
                  {project.fullContent.solution}
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <span className="label block mb-4">What It Shows</span>
                <p className="text-[17px] text-gray-700 dark:text-gray-300 leading-[1.8] max-w-2xl">
                  {project.fullContent.impact}
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <span className="label block mb-4">Technologies</span>
                <div className="flex flex-wrap gap-2">
                  {project.fullContent.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-sm border border-black/[0.06] dark:border-white/[0.06] text-gray-600 dark:text-gray-400 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </main>
  );
}

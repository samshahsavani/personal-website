import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { projectsData } from '@/lib/projects-data';

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.name} | Sam Shahsavani`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-8 link-underline group"
        >
          <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Project header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            {project.logo && (
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={project.logo}
                  alt={`${project.name} logo`}
                  fill
                  className="object-contain rounded"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">{project.name}</h1>
              <p className="text-xl" style={{ color: 'var(--accent)' }}>{project.description}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Visit Website
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {project.presentation && (
              <a
                href={project.presentation}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Download Presentation
              </a>
            )}
          </div>
        </div>

        {/* Presentation Viewer */}
        {project.presentation && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Presentation</h2>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
              <iframe
                src={project.presentation}
                className="w-full h-[600px] md:h-[700px]"
                title={`${project.name} Presentation`}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              Having trouble viewing? <a href={project.presentation} target="_blank" rel="noopener noreferrer" className="underline hover:text-black dark:hover:text-white">Download the PDF</a>
            </p>
          </div>
        )}

        {/* Full content sections */}
        {project.fullContent && (
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Overview</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.fullContent.overview}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">The Challenge</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.fullContent.challenge}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">The Solution</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.fullContent.solution}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Impact</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.fullContent.impact}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Technologies</h2>
              <div className="flex flex-wrap gap-3">
                {project.fullContent.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

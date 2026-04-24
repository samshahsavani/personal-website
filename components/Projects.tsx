'use client';

import Image from 'next/image';
import Link from 'next/link';
import { projectsData } from '@/lib/projects-data';
import { featuredProjectIds } from '@/lib/site-content';
import { imagePreviewSrc } from '@/lib/image-optimization';
import Reveal from '@/components/Reveal';

export default function Projects() {
  const moreProjects = projectsData.filter(
    (project) => !featuredProjectIds.includes(project.id as (typeof featuredProjectIds)[number])
  );

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="mb-16">More Work</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06]">
          {moreProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 80}>
              <div className="bg-[var(--background)] p-8 md:p-10 flex flex-col justify-between min-h-[280px] group">
                {/* Header row */}
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    {project.logo && (
                      <div className={`flex-shrink-0 h-10 relative opacity-70 group-hover:opacity-100 transition-opacity duration-500 ${project.logo.includes('bloom-hub-logo') ? 'w-24' : 'w-10'}`}>
                        <Image
                          src={imagePreviewSrc(project.logo)}
                          alt={`${project.name} logo`}
                          fill
                          sizes={project.logo.includes('bloom-hub-logo') ? '96px' : '40px'}
                          className={project.logo.includes('bloom-hub-logo') ? 'object-contain object-left' : 'object-contain'}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-light tracking-tight mb-1">{project.name}</h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-black dark:hover:text-white transition-colors duration-300"
                          aria-label={`Visit ${project.name}`}
                        >
                          <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Footer row */}
                <div className="flex items-end justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="label text-[10px]"
                      >
                        {tag}{project.tags.indexOf(tag) < 2 && project.tags.length > 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                  {project.fullContent && (
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm text-muted hover:text-black dark:hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group/link"
                    >
                      Read
                      <svg className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { aboutContent } from '@/lib/site-content';
import { imagePreviewSrc } from '@/lib/image-optimization';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 border-t border-black/[0.04] dark:border-white/[0.04]">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-6 mb-16">
            <div className="w-20 h-20 relative flex-shrink-0 rounded-full overflow-hidden border border-black/[0.06] dark:border-white/[0.06]">
              <Image
                src={imagePreviewSrc('/portrait.png')}
                alt="Sam Shahsavani"
                fill
                sizes="80px"
                className="object-cover scale-125"
                priority
              />
            </div>
            <div>
              <h2 className="mb-1">{aboutContent.title}</h2>
              <span className="label">{aboutContent.locationLabel}</span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Main narrative — sourced via lib/site-content.ts from public source modules */}
          <Reveal className="md:col-span-7">
            <div className="space-y-6 text-[17px] text-gray-700 dark:text-gray-300 leading-[1.8]">
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/* Structured metadata — sourced via lib/site-content.ts from public source modules */}
          <Reveal delay={150} className="md:col-span-5">
            <div className="space-y-8">
              {aboutContent.sections.map((section) => (
                <div key={section.label}>
                  <span className="label block mb-3">{section.label}</span>
                  {'items' in section ? (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                      {section.items.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {section.body.split('\n').map((line, index) => (
                        <span key={line}>
                          {index > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

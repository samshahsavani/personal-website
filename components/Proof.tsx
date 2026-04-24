import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { proofContent } from '@/lib/site-content';

export default function Proof() {
  const featuredLogoIsWide = proofContent.featured.logo.includes('bloom-hub-logo');

  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Reveal className="lg:col-span-4">
            <div className="sticky top-28">
              <span className="label block mb-4">{proofContent.eyebrow}</span>
              <h2 className="mb-5">{proofContent.title}</h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                {proofContent.intro}
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-8 space-y-6">
            <Reveal delay={100}>
              <div className="group border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-[1.35fr_0.9fr]">
                  <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-black/[0.08] dark:border-white/[0.08]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`relative h-9 flex-shrink-0 opacity-75 transition-opacity duration-500 group-hover:opacity-100 ${featuredLogoIsWide ? 'w-24' : 'w-9'}`}>
                        <Image
                          src={proofContent.featured.logo}
                          alt={`${proofContent.featured.label} logo`}
                          fill
                          sizes={featuredLogoIsWide ? '96px' : '36px'}
                          className={featuredLogoIsWide ? 'object-contain object-left' : 'object-contain'}
                        />
                      </div>
                      <span className="label block">{proofContent.featured.label}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-5 max-w-xl">
                      {proofContent.featured.title}
                    </h3>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mb-8">
                      {proofContent.featured.body}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={proofContent.featured.primaryLink.href}
                        className="px-5 py-2.5 text-sm bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-opacity duration-300"
                      >
                        {proofContent.featured.primaryLink.label}
                      </Link>
                      <a
                        href={proofContent.featured.secondaryLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-sm border border-black/15 dark:border-white/15 rounded-full hover:border-black/40 dark:hover:border-white/40 transition-colors duration-300"
                      >
                        {proofContent.featured.secondaryLink.label}
                      </a>
                    </div>
                  </div>

                  <div className="p-8 md:p-10 bg-black/[0.015] dark:bg-white/[0.015]">
                    <span className="label block mb-4">What It Shows</span>
                    <div className="space-y-4">
                      {proofContent.featured.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="border-t border-black/[0.08] dark:border-white/[0.08] pt-4 first:border-t-0 first:pt-0"
                        >
                          <p className="text-sm md:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {proofContent.highlights.map((item, index) => {
                const logoIsWide = item.logo.includes('bloom-hub-logo');

                return (
                  <Reveal key={item.title} delay={180 + index * 80}>
                    <div className="group h-full border border-black/[0.08] dark:border-white/[0.08] p-6 md:p-7 bg-[var(--background)] flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`relative h-8 flex-shrink-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100 ${logoIsWide ? 'w-20' : 'w-8'}`}>
                          <Image
                            src={item.logo}
                            alt={`${item.label} logo`}
                            fill
                            sizes={logoIsWide ? '80px' : '32px'}
                            className={logoIsWide ? 'object-contain object-left' : 'object-contain'}
                          />
                        </div>
                        <span className="label block">{item.label}</span>
                      </div>
                      <h3 className="text-lg font-light tracking-tight mb-4">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                        {item.body}
                      </p>
                      {item.href.startsWith('/') && item.href.endsWith('.pdf') ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted hover:text-black dark:hover:text-white transition-colors duration-300 inline-flex items-center gap-1"
                        >
                          {item.ctaLabel}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm text-muted hover:text-black dark:hover:text-white transition-colors duration-300 inline-flex items-center gap-1"
                        >
                          {item.ctaLabel}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

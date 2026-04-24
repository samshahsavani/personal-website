'use client';

import Reveal from '@/components/Reveal';
import { heroContent } from '@/lib/site-content';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full">
        <Reveal>
          <span className="label mb-6 block">{heroContent.eyebrow}</span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mb-8 text-balance">{heroContent.title}</h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-xl md:text-2xl mb-6 text-balance leading-relaxed max-w-3xl" style={{ color: 'var(--muted)' }}>
            {heroContent.lead}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl leading-relaxed">
            {heroContent.body}
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection(heroContent.primaryCtaTarget)}
              className="px-6 py-2.5 text-sm bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-opacity duration-300"
            >
              {heroContent.primaryCtaLabel}
            </button>
            <button
              onClick={() => scrollToSection(heroContent.secondaryCtaTarget)}
              className="px-6 py-2.5 text-sm border border-black/15 dark:border-white/15 rounded-full hover:border-black/40 dark:hover:border-white/40 transition-colors duration-300"
            >
              {heroContent.secondaryCtaLabel}
            </button>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <div className="mt-14 border border-black/[0.08] dark:border-white/[0.08]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.08] dark:bg-white/[0.08]">
              {heroContent.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-[var(--background)] px-5 py-6 md:px-6 md:py-7"
                >
                  <div className="text-2xl md:text-3xl font-light tracking-tight mb-2">
                    {metric.value}
                  </div>
                  <div className="label leading-relaxed">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

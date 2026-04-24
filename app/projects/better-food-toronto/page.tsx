import type { Metadata } from 'next';
import Link from 'next/link';
import ThesisNarrative from './ThesisNarrative';

export const metadata: Metadata = {
  title: 'Better Food Toronto | Sam Shahsavani — M.Arch Thesis',
  description:
    'Five Stories About and Around the Ontario Food Terminal. A Master of Architecture thesis investigating Toronto\'s food supply chain through investigative journalism, direct-action interventions, and human-centered design.',
  keywords: [
    'Architecture Thesis',
    'Food Systems',
    'Ontario Food Terminal',
    'Urban Design',
    'Supply Chain',
    'Toronto',
    'University of Toronto',
    'Daniels Faculty',
  ],
};

export default function BetterFoodTorontoPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
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
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </div>
      {/* Executive TL;DR Hook */}
      <section className="pt-40 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">Better Food Toronto</h1>
        <p className="text-[19px] text-gray-600 dark:text-gray-400 max-w-3xl leading-[1.8] mb-16">
          An unconventional architectural thesis mapping Toronto&apos;s hidden food supply chain through field journalism, covert data collection, and physical interventions. Awarded the Faculty Design Prize.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left border-t border-black/10 dark:border-white/10 pt-12">
          <div>
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-4">Problem</h3>
            <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
              Complex, undocumented supply network lacking transparency and favoring mega-industrial hubs over local resilience.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-4">Methodology</h3>
            <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
              Covert physical site access via alias firm registration, 3D digital reconstruction, and stakeholder interviews.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-4">Output</h3>
            <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
              Three-scale panoramic system mapping and directly deployable hardware prototypes designed collaboratively.
            </p>
          </div>
        </div>

        <div className="mt-32 mb-8 text-gray-400 flex flex-col items-center">
          <span className="text-xs font-mono uppercase tracking-[0.2em] mb-4">Experience the presentation</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <div className="border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-gray-950/50 py-12">
        <ThesisNarrative />
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import SurveyBasisWorkspace from '@/components/SurveyBasisWorkspace';

const description = 'Prepare a survey DXF for Revit. Calibrate scale, align linework, and export a flat 2D underlay. All processing stays in your browser.';

export const metadata: Metadata = {
  title: 'Survey Basis | Sam Shahsavani',
  description,
  alternates: { canonical: '/tools/survey-basis/' },
  openGraph: { title: 'Survey Basis | Sam Shahsavani', description, url: '/tools/survey-basis/' },
  twitter: { card: 'summary', title: 'Survey Basis | Sam Shahsavani', description },
};

export default function SurveyBasisPage() {
  return (
    <main className="pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 md:flex md:items-end md:justify-between gap-8">
          <div>
            <Link href="/tools/" className="label hover:text-[var(--foreground)] transition-colors">← Tools</Link>
            <h1 className="!text-4xl md:!text-5xl mt-5 mb-3">Survey Basis</h1>
            <p className="text-sm text-muted leading-relaxed max-w-xl">A better starting point for your Revit model. Open a DXF, check its scale, and align the linework to your project.</p>
          </div>
          <div className="mt-5 md:mt-0 shrink-0">
            <p className="text-xs text-muted mb-3 flex items-center gap-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />Files stay on your computer</p>
            <a href="/tools/survey-basis/Survey-Basis.html" download="Survey-Basis.html" className="text-xs link-underline">Download the offline version ↗</a>
          </div>
        </div>
        <div className="border border-black/10 dark:border-white/10">
          <SurveyBasisWorkspace />
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-7 md:gap-12 text-sm leading-relaxed">
          <div><h2 className="!text-sm !font-normal mb-2">Start with a text DXF</h2><p className="text-muted text-xs">For DWG, save a text (ASCII) DXF copy in CAD first. Choose your property boundary and confirm a known distance.</p></div>
          <div><h2 className="!text-sm !font-normal mb-2">Link the result in Revit</h2><p className="text-muted text-xs">The export uses feet, a front-left property origin, and Z=0. Review omitted objects, then verify scale and orientation after linking.</p></div>
          <div><h2 className="!text-sm !font-normal mb-2">Your drawing stays yours</h2><p className="text-muted text-xs">No uploads or saved surveys. Refreshing or closing this page clears your work. Keep the original for annotations, elevations, and survey coordinates.</p></div>
        </div>
      </div>
    </main>
  );
}

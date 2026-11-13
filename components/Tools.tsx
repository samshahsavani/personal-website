import Link from 'next/link';

export default function Tools({ standalone = false }: { standalone?: boolean }) {
  return (
    <section id="tools" className={`${standalone ? 'pt-36 pb-24' : 'py-24'} px-6 scroll-mt-20`}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="label mb-5">Made to be used</p>
          {standalone ? <h1 className="mb-6">Tools</h1> : <h2 className="mb-6">Tools</h2>}
          <p className="text-muted leading-relaxed">
            Small tools for the work between drawing, data, and delivery. Open one and get to work.
          </p>
        </div>
        <Link href="/tools/survey-basis/" className="group block border border-black/10 dark:border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
          <div className="grid md:grid-cols-[1fr_1fr]">
            <div className="relative min-h-[260px] bg-black/[0.025] dark:bg-white/[0.025] border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 500 280" className="w-full max-w-lg text-current transition-transform duration-700 group-hover:scale-[1.03]" fill="none" aria-hidden="true">
                <defs><pattern id="tool-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" stroke="currentColor" strokeOpacity=".07" strokeWidth=".5" /></pattern></defs>
                <rect width="500" height="280" fill="url(#tool-grid)" />
                <path d="M155 218V65L322 43L346 218Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M184 218V99L300 83L317 218M184 150L308 139" stroke="currentColor" strokeOpacity=".2" />
                <path d="M140 65H120V218H140M155 235V249H346V235" stroke="currentColor" strokeOpacity=".35" strokeWidth=".7" />
                <path d="M155 202V218H171" stroke="currentColor" strokeWidth="3" />
                <circle cx="155" cy="218" r="4" fill="currentColor" />
                <path d="M390 89V45M382 55L390 44L398 55" stroke="currentColor" strokeOpacity=".5" />
                <text x="390" y="32" textAnchor="middle" fill="currentColor" fillOpacity=".5" fontFamily="monospace" fontSize="10">N</text>
                <text x="250" y="270" textAnchor="middle" fill="currentColor" fillOpacity=".5" fontFamily="monospace" fontSize="9" letterSpacing="2">LOCAL ORIGIN / PROJECT NORTH</text>
              </svg>
              <span className="absolute top-5 left-6 label">01 / CAD to Revit</span>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="label mb-5">Free browser tool</p>
              <h3 className="text-3xl font-light tracking-tight mb-4">Survey Basis</h3>
              <p className="text-muted text-sm leading-relaxed max-w-md mb-8">
                Turn a survey DXF into an aligned Revit 2D underlay. Check scale, set the property origin, and choose the linework you need.
              </p>
              <p className="text-xs text-muted mb-8">Runs on your computer. No uploads, accounts, or saved surveys.</p>
              <span className="inline-flex items-center gap-3 text-sm">Open Survey Basis <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span></span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

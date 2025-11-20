import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-24 h-24 relative flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-800">
            <Image
              src="/portrait.png"
              alt="Sam Shahsavani"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover scale-125"
              priority
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">About</h2>
        </div>
        <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            I work at the intersection of architecture and software development. I coordinate BIM data on large healthcare projects and build technical tools on the side. This combination lets me understand both the workflows architects struggle with and how to build software that actually solves those problems.
          </p>
          <p>
            At B+H Architects, I coordinate BIM data for the Halifax Infirmary Expansion Project, managing dRofus synchronization and Revit families across a multi disciplinary international team. On the side, I co-founded ZoningPal with Alireza. We built a platform that uses AI to parse municipal zoning bylaws and generate compliance briefs in minutes instead of days. The product is live with paying customers.
          </p>
          <p>
            I believe the construction industry's biggest problems are data problems. When teams spend days manually checking room data sheets or parsing zoning codes, that's time stolen from actual design work. I build tools and workflows that give architects their time back.
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-semibold mb-6">Technical Background</h3>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              I work across the full stack. For ZoningPal, I built the React and TypeScript frontend, Node.js backend, and integrated Claude API for document parsing. I use PostGIS for spatial queries. At B+H, I use Revit and dRofus daily for BIM coordination, and I write Python and Dynamo scripts to automate repetitive workflows. I've also integrated AI image generation tools like Stable Diffusion and ComfyUI into design processes for rapid visualization.
            </p>
            <p>
              I'm comfortable whether that's writing scripts to automate data exports, integrating AI APIs to parse regulatory documents, or troubleshooting why a Revit family won't sync to dRofus. If it involves data, automation, or making architects' lives easier, I'm interested.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

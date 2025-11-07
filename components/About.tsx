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
              className="object-cover scale-125"
              priority
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">About</h2>
        </div>
        <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            I'm an architect who transitioned into building software after seeing a major opportunity: to help smart, creative teams stop wasting days on manual tasks and get back to the work that matters.
          </p>
          <p>
            Right now I coordinate BIM and data systems for the $2B Halifax Infirmary Expansion Project at B+H, managing Revit-dRofus synchronization and project data across international teams. At the same time, I'm co-building ZoningPal with my co-founder Alireza, an AI platform that automates zoning research for architects and developers.
          </p>
          <p>
            My background in architecture and computation led me to a core belief: by solving the industry's complex data problems, we can unlock our full design potential and make the entire process faster and less frustrating for everyone.
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-semibold mb-6">Technical Background</h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              I work across the stack, including React and TypeScript for frontend, Node.js for backend, and Claude API for AI analysis. I use Revit and dRofus daily for BIM coordination. I've built computational workflows in Grasshopper and Dynamo, integrated AI tools like Stable Diffusion into design processes, and taught computational design at U of T.
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

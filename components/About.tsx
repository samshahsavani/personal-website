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
            I'm an architect who ended up building software because I got tired of watching smart people waste days on tasks that should take minutes.
          </p>
          <p>
            Right now I manage BIM and data systems for multibillion dollar healthcare projects at B+H, where I coordinate Revit models, dRofus databases, and project data for teams across continents. At the same time, I'm building ZoningPal, an AI platform that automates zoning research for architects and developers.
          </p>
          <p>
            My background is computational design and data systems. I've taught at U of T, worked on AI-powered design workflows, and spent years parsing zoning bylaws and coordinating massive BIM datasets. The shift from architecture to product development wasn't sudden. It was just the logical next step after realizing the industry's biggest problems aren't design problems. They're data problems.
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-semibold mb-6">Technical Background</h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              I work in Python for data parsing and backend logic. I use Revit and dRofus daily for BIM coordination. I've built computational workflows in Grasshopper and Dynamo, integrated AI tools like Stable Diffusion into design processes, and taught computational design at U of T.
            </p>
            <p>
              I'm comfortable working across the stack, whether that's writing scripts to automate data exports, building NLP pipelines to parse regulatory documents, or troubleshooting why a Revit family won't sync to dRofus. If it involves data, automation, or making architects' lives easier, I'm interested.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

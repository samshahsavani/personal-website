'use client';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-balance tracking-tight leading-none">
          Sam Shahsavani
        </h1>
        <p className="text-3xl md:text-4xl mb-8 tracking-tight animate-glow font-light" style={{ color: 'var(--accent)' }}>
          I build tools that solve data problems in architecture and construction.
        </p>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl text-balance leading-relaxed font-light">
          I'm a BIM Coordinator at B+H Architects on the Halifax Infirmary Expansion Project, where I manage dRofus coordination and Revit workflows for a $2B healthcare build. I also co-founded <span className="font-medium text-black dark:text-white">ZoningPal</span>, an AI powered platform that automates municipal zoning analysis. I write code, build automation workflows, and solve data problems that slow down design and construction teams.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => scrollToSection('projects')}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            View Projects
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-900 dark:hover:border-gray-300 transition-all duration-200 font-medium hover:-translate-y-0.5"
          >
            Contact
          </button>
        </div>
      </div>
    </section>
  );
}

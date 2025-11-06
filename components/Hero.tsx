'use client';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance tracking-tight">
          Sam Shahsavani
        </h1>
        <p className="text-2xl md:text-3xl mb-6 tracking-tight animate-glow" style={{ color: 'var(--accent)' }}>
          I build products that solve real problems in the built environment.
        </p>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl text-balance leading-relaxed">
          Currently co-building ZoningPal, an AI platform that automates zoning research, and coordinating enterprise BIM data for a $2B healthcare project. I care about making the architecture and development industry faster and less frustrating.
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

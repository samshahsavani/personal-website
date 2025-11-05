import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <Projects />
      <About />
      <Contact />
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Sam Shahsavani. Built with Next.js and Tailwind CSS.
        </div>
      </footer>
    </main>
  );
}

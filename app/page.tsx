import Hero from '@/components/Hero';
import Proof from '@/components/Proof';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <Proof />
      <Projects />
      <About />
      <Contact />
      <footer className="py-8 px-6 border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="max-w-6xl mx-auto text-center text-xs text-muted">
          © {new Date().getFullYear()} Sam Shahsavani
        </div>
      </footer>
    </main>
  );
}

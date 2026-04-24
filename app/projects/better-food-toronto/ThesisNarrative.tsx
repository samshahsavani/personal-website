'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { imagePreviewSrc } from '@/lib/image-optimization';

/* ─── helpers ─── */
const slidePath = (n: number) =>
  `/thesis/slides/THESIS_20230330_Final_v18_Page_${String(n).padStart(2, '0')}.jpg`;

const photoPath = (n: number) =>
  `/thesis/photos/presentation-${String(n).padStart(2, '0')}.jpg`;

/* ─── Expandable Image Wrapper (Lightbox) ─── */
function LightboxImage({ src, alt, width, height, className, quality, priority, sizes }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const previewSrc = imagePreviewSrc(src);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsZoomed(false); // Reset zoom on open
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div 
        className={`group relative cursor-zoom-in ${className ?? ''}`} 
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={previewSrc}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.01]"
          quality={quality}
          priority={priority}
          sizes={sizes ?? '100vw'}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </div>

      {isOpen && createPortal(
        <div 
          className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-md ${
            isZoomed ? 'overflow-auto cursor-zoom-out p-4 md:p-12' : 'flex items-center justify-center cursor-zoom-in p-4 md:p-8'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <img 
            src={src} 
            alt={alt} 
            className={`transition-all duration-300 ease-in-out shadow-2xl bg-white ${
              isZoomed 
                ? 'w-auto h-auto min-w-[200vw] lg:min-w-[150vw] max-w-none block m-auto cursor-zoom-out' 
                : 'w-auto h-auto max-w-full max-h-full object-contain cursor-zoom-in'
            }`}
            style={isZoomed ? { minHeight: '100%' } : {}}
            onClick={(e) => {
              e.stopPropagation();
              if (isZoomed) {
                setIsOpen(false);
              } else {
                setIsZoomed(true);
              }
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}

/* ─── Slide grid ─── */
function SlideGrid({ slides, columns = 1 }: { slides: number[]; columns?: number }) {
  const gridCols = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1';
  return (
    <div className={`grid ${gridCols} gap-4`}>
      {slides.map((n) => (
        <Reveal key={n}>
          <div className="relative w-full overflow-hidden rounded-sm border border-black/5 dark:border-white/5 transition-opacity duration-300">
            <LightboxImage
              src={slidePath(n)}
              alt={`Slide ${n}`}
              width={1920}
              height={1080}
              quality={85}
              sizes={columns === 1 ? '100vw' : columns === 2 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ─── Video embed ─── */
function VideoEmbed({ src, caption }: { src: string; caption: string }) {
  return (
    <Reveal>
      <div className="my-8 md:my-12">
        <div className="relative w-full overflow-hidden rounded-sm border border-black/5 dark:border-white/5">
          <video
            controls
            preload="metadata"
            className="w-full h-auto"
            playsInline
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic text-center">
          {caption}
        </p>
      </div>
    </Reveal>
  );
}

/* ─── Chapter divider ─── */
function ChapterDivider({ number, title, subtitle }: { number: number; title: string; subtitle?: string }) {
  return (
    <Reveal>
      <div className="py-16 md:py-24 text-center">
        <div className="inline-block mb-4">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500">
            Chapter {number}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="mt-8 mx-auto w-6 h-px bg-black/10 dark:bg-white/10" />
      </div>
    </Reveal>
  );
}

/* ─── Narrative text block ─── */
function Narration({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="max-w-2xl mx-auto my-8 md:my-12 px-4 md:px-0">
        <div className="text-[17px] md:text-[19px] leading-[1.8] text-gray-800 dark:text-gray-200 space-y-6 font-light">
          {children}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Photo carousel/grid for final presentation ─── */
function PhotoGallery() {
  const [active, setActive] = useState(0);
  const photos = Array.from({ length: 11 }, (_, i) => i + 1);
  const captions = [
    'Rolling the green cart in from the side',
    'Wider angle — audience seated, cart arriving',
    'Close-up of tilting the cart upright',
    'Deploying the legs and wooden framework',
    'Angled lid lifted, revealing display area',
    'Lid fully opened — storage-to-display transformation',
    'Side view — wooden support legs deployed',
    'Full deployment — cart standing tall, presenting to audience',
    'Post-presentation Q&A — audience gathered around',
    'Wide shot — full audience at Café 059, hero drawing on wall',
    'Hero drawing physically mounted above Café 059',
  ];

  return (
    <Reveal>
      <div className="my-12 md:my-16">
        {/* Main image */}
        <div className="relative w-full overflow-hidden rounded-sm border border-black/5 dark:border-white/5 mb-4">
          <LightboxImage
            src={photoPath(active + 1)}
            alt={captions[active]}
            width={1920}
            height={1280}
            quality={85}
            sizes="100vw"
          />
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic mb-4">
          {captions[active]}
        </p>

        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {photos.map((n, i) => (
              <button
              key={n}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-sm overflow-hidden border transition-all duration-300 ${
                i === active
                  ? 'border-gray-800 dark:border-gray-200 opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-100 filter grayscale hover:grayscale-0'
              }`}
            >
              <Image
                src={imagePreviewSrc(photoPath(n))}
                alt={`Thumbnail ${n}`}
                width={96}
                height={64}
                sizes="96px"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Quote callout ─── */
function Quote({ children, attribution }: { children: React.ReactNode; attribution?: string }) {
  return (
    <Reveal>
      <blockquote className="my-8 md:my-12 border-l-4 border-gray-300 dark:border-gray-600 pl-6 py-4 max-w-2xl mx-auto">
        <p className="text-lg md:text-xl italic text-gray-600 dark:text-gray-400 leading-relaxed">
          {children}
        </p>
        {attribution && (
          <cite className="block mt-3 text-sm text-gray-400 dark:text-gray-500 not-italic">
            — {attribution}
          </cite>
        )}
      </blockquote>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN NARRATIVE COMPONENT
   ═══════════════════════════════════════════════════ */

export default function ThesisNarrative() {
  /* progress bar */
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px]">
        <div
          className="h-full bg-black/80 dark:bg-white/80 transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-16">
        {/* Thesis Cover Image */}
        <Reveal>
          <div className="max-w-md mx-auto mb-10">
            <div className="relative overflow-hidden rounded-sm border border-black/5 dark:border-white/5 transition-opacity duration-500">
              <LightboxImage
                src="/thesis/cover.jpg"
                alt="Certificate of Incorporation — Better Food Toronto Inc. with Ontario Food Terminal Board receipt"
                width={1080}
                height={1080}
                quality={90}
                priority
                sizes="(min-width: 768px) 384px, 80vw"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="inline-block text-xs font-mono tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 mb-4">
              Master of Architecture Thesis
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-800 dark:text-gray-200 leading-snug">
              Five Stories About and Around the Ontario Food Terminal
            </h2>
          </div>
        </Reveal>

        {/* Tags */}
        <Reveal delay={300}>
          <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-xl mx-auto">
            {['Supply Chain Research', 'Investigative Journalism', 'Food Systems', 'Built Prototype', 'Human-Centered Design'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 text-sm border border-gray-200 dark:border-gray-800 rounded-full text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Slide 1 — title slide */}
        <Reveal delay={400}>
          <div className="max-w-4xl mx-auto w-full">
            <SlideGrid slides={[1]} columns={1} />
          </div>
        </Reveal>

        <Narration>
          <p>
            Hi Everyone, my name is Sam. And my project is called Better Food Toronto, five
            stories about and around the Ontario Food Terminal.
          </p>
        </Narration>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══════ CHAPTER 1: THE TOMATO STORY ═══════ */}
      <section className="px-6 max-w-5xl mx-auto">
        <ChapterDivider
          number={1}
          title="The Tomato Story"
          subtitle="Cataloging the food supply chain from production to consumption"
        />

        {/* Slide 2: Chapter title slide */}
        <SlideGrid slides={[2]} columns={1} />

        <Narration>
          <p>
            Chapter One marked the beginning of the semester.
          </p>
        </Narration>

        {/* Slide 3: External challenges */}
        <SlideGrid slides={[3]} columns={1} />

        <Narration>
          <p>
            The project began by questioning the resilience of our regional food system in the face of external
            supply chain challenges—specifically the COVID-19 pandemic, geopolitical conflict, and climate change.
          </p>
        </Narration>

        {/* Slide 4: Internal challenges */}
        <SlideGrid slides={[4]} columns={1} />

        <Narration>
          <p>
            And internal challenges such as bad consumption habits, corporate greed, lack of
            transparency, waste production, and unsustainable farming practices.
          </p>
        </Narration>

        {/* Slide 5: The hero drawing / catalog — THE BIG NARRATION */}
        <SlideGrid slides={[5]} columns={1} />

        <Narration>
          <p>
            To begin the investigation, I narrowed my focus to a single food item:{' '}
            <strong>Tomatoes</strong>. I began cataloging the common architectural infrastructures 
            that tomatoes experience from production all the way to consumption—resulting in the 
            comprehensive cartographic drawing below.
          </p>
          <p>
            The catalog is divided into 5 chronological stages and maps three distinct operational scales: 
            the large-scale multi-national infrastructure at the bottom, the medium-scale regional infrastructure 
            in the middle, and the small-scale local infrastructure at the top.
          </p>
          <p>
            What became immediately evident while mapping this catalog was that our local food 
            system is overwhelmingly dominated by large-scale, consolidated industrial infrastructures 
            and big-box architectural entities.
          </p>
          <p>
            These global infrastructures are highly efficient at moving volume, but they are entirely 
            ineffective at addressing systemic issues related to:
          </p>
        </Narration>


        {/* Slides 6–10: Large-scale stages — each stage with its issue highlighted */}

        {/* Slide 6: Production */}
        <SlideGrid slides={[6]} columns={1} />

        <Narration>
          <p>Mono-crop agriculture, and seasonal immigrant workers.</p>
        </Narration>

        {/* Slide 7: Processing */}
        <SlideGrid slides={[7]} columns={1} />

        <Narration>
          <p>Monopoly and dominance of global food factories.</p>
        </Narration>

        {/* Slide 8: Distribution */}
        <SlideGrid slides={[8]} columns={1} />

        <Narration>
          <p>Fragile and unsustainable global distribution networks.</p>
        </Narration>

        {/* Slide 9: Retail */}
        <SlideGrid slides={[9]} columns={1} />

        <Narration>
          <p>Vertical consolidation of retail stores such as Walmart, Costco, and Loblaws.</p>
        </Narration>

        {/* Slide 10: Consumption */}
        <SlideGrid slides={[10]} columns={1} />

        <Narration>
          <p>And global fast-food chains that are redefining our relationship with food.</p>
        </Narration>

        {/* Slide 11: Bridge to medium and small scale — Production */}
        <SlideGrid slides={[11]} columns={1} />

        <Narration>
          <p>
            After mapping this industrial monopoly, I turned my attention to the medium and
            small-scale infrastructures. These localized networks function as a critical antidote to 
            industrial fragility, offering localized advantages such as:
          </p>
          <p>Diverse, family-owned farming practices.</p>
        </Narration>

        {/* Slide 12: Processing — medium/small scale */}
        <SlideGrid slides={[12]} columns={1} />

        <Narration>
          <p>Decentralized and culturally rich food processing plants.</p>
        </Narration>

        {/* Slide 13: Distribution — medium/small scale */}
        <SlideGrid slides={[13]} columns={1} />

        <Narration>
          <p>Local and short distribution networks.</p>
        </Narration>

        {/* Slide 14: Retail — medium/small scale */}
        <SlideGrid slides={[14]} columns={1} />

        <Narration>
          <p>And decentralized independent and family-owned stores.</p>
        </Narration>

        {/* Slide 15: Consumption — medium/small scale */}
        <SlideGrid slides={[15]} columns={1} />

        <Narration>
          <p>And restaurants.</p>
        </Narration>

        {/* Slide 16: The complete panorama — bridge narration to the Terminal */}
        <Reveal>
          <div className="my-8">
            <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="overflow-x-auto">
                <LightboxImage
                  src={slidePath(16)}
                  alt="Complete panorama — all 5 stages with all three scales, Ontario Food Terminal highlighted in the center"
                  width={1920}
                  height={1080}
                  className="min-w-[1000px] w-full h-auto"
                  quality={90}
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Narration>
          <p>
            Treating the small and medium-scale entities as the necessary allies for a resilient food network, 
            I shifted my focus to the physical core of this domestic system: The <strong>Ontario Food Terminal</strong>. 
            Situated functionally in the center of the drawing, the Terminal was continually identified 
            as the single most critical bottleneck for independent food distribution in Toronto.
          </p>
        </Narration>
      </section>

      {/* ═══════ CHAPTER 2: THE TERMINAL STORY ═══════ */}
      <section className="px-6 max-w-5xl mx-auto">
        <ChapterDivider
          number={2}
          title="The Terminal Story"
          subtitle="Investigating the Ontario Food Terminal from the inside"
        />

        {/* Slide 17: Chapter title slide */}
        <SlideGrid slides={[17]} columns={1} />

        {/* Slide 18: St. Lawrence Market history */}
        <SlideGrid slides={[18]} columns={1} />

        <Narration>
          <p>
            I began researching the Food Terminal. Constructed in the 1940s, it served as a brutalist, 
            industrialized replacement for the historic St. Lawrence Market, which used to function as 
            the primary wholesale hub for the city.
          </p>
        </Narration>

        {/* Slide 19: Historical photos / book */}
        <SlideGrid slides={[19]} columns={1} />

        {/* Slide 20: Aerial / operational view */}
        <SlideGrid slides={[20]} columns={1} />

        <Narration>
          <p>
            It is 40 acres in size and was designed as a highly efficient and fast-paced network
          </p>
        </Narration>

        {/* Slide 21: Geo-economics map — local growers */}
        <SlideGrid slides={[21]} columns={1} />

        <Narration>
          <p>that connected local</p>
        </Narration>

        {/* Slide 22: North America map — global growers */}
        <SlideGrid slides={[22]} columns={1} />

        <Narration>
          <p>and global growers to more than 3,000 small and independent stores.</p>
        </Narration>

        {/* Slide 23: Labor practices — Toronto Star strike article */}
        <SlideGrid slides={[23]} columns={1} />

        <Narration>
          <p>
            After learning about the terminal&apos;s unavoidable existence for small-scale food
            entities, my attention was grabbed by a few question marks and aspects that I was, and
            still am, cynical about. Such as, issues around labor practices.
          </p>
        </Narration>

        {/* Slide 24: OFTB Annual Report — questionable accounting */}
        <SlideGrid slides={[24]} columns={1} />

        <Narration>
          <p>Questionable accounting and expenses.</p>
        </Narration>

        {/* Slides 25–26: Financial documents */}
        <SlideGrid slides={[25, 26]} columns={2} />

        {/* Slide 27: OFTB website — 20 vendors, monopolistic structure */}
        <SlideGrid slides={[27]} columns={1} />

        <Narration>
          <p>
            Issues around the monopolistic structure of the terminal, which is run by only 20
            vendors, and has barely been replaced or changed ever since their move from the St
            Lawrence market because of the Terminal&apos;s inelastic rent structure.
          </p>
        </Narration>

        {/* Slide 28: TWPA Board of Directors */}
        <SlideGrid slides={[28]} columns={1} />

        <Narration>
          <p>
            And the vendors are supervised by 6 members of a board of directors who happen to be
            the most powerful vendors in the terminal.
          </p>
        </Narration>

        {/* Slide 29: Lieutenant Governor biography */}
        <SlideGrid slides={[29]} columns={1} />

        <Narration>
          <p>
            Who happen to be appointed by the Lieutenant Governor of Ontario. I needed to learn more
            about the terminal, not just its questionable history and finances, but also aspects such
            as its architecture, but it was really difficult as I couldn&apos;t find any architectural
            drawings or visit the terminal as a student since it can only be accessed by a registered
            food business.
          </p>
        </Narration>

        {/* Slide 30: Business registration + hidden camera — VIDEO 1 */}
        <SlideGrid slides={[30]} columns={1} />

        <Narration>
          <p>
            So I registered a food business called <strong>Better Food Toronto</strong> and went to
            the terminal with a hidden camera, and here is what I captured.
          </p>
        </Narration>

        {/* Video 1: Terminal scan */}
        <VideoEmbed
          src="/thesis/videos/terminal-scan.mp4"
          caption="Video 1 — Hidden camera footage from Sam's first visit to the Ontario Food Terminal"
        />

        <Narration>
          <p>
            The video shows me in the buyer court and shows my movement to an enclosed warehouse
            space where the 20 vendors quote on quote rent the space. This floor is like a busy stock
            market where the prices are set daily based on supply and demand, but you can still
            negotiate with the vendors depending on the volume, freshness of products, as well as
            your relationship with them.
          </p>
          <p>
            Here is the second floor, where the offices are located; that&apos;s where I got the
            floor plans. And an open-air wholesale farmer&apos;s market, which is mostly inhabited
            by local farmers that pay a daily fee to take over the parking spot to wholesale their
            produce; the prices here are much lower, but the products are much more inconsistent as
            the farms are smaller and constrained by Ontario&apos;s climate.
          </p>
        </Narration>

        {/* Slide 31: Digital reconstruction — site plan */}
        <SlideGrid slides={[31]} columns={1} />

        <Narration>
          <p>
            So this video that I took last semester allowed me to digitally construct the terminal
          </p>
        </Narration>

        {/* Slide 32: Diagrammatic reconstruction */}
        <SlideGrid slides={[32]} columns={1} />

        <Narration>
          <p>and diagram it.</p>
        </Narration>

        {/* ─── THE REJECTED PROPOSAL ─── */}

        {/* Slide 33: The proposal isometric */}
        <SlideGrid slides={[33]} columns={1} />

        <Narration>
          <p>
            And right after this stage, last semester, I thought I could come up with a large-scale
            architectural proposal that could make it better.
          </p>
        </Narration>

        {/* Slide 34: The rejection */}
        <Reveal>
          <div className="my-8 pt-4 pb-8 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">
                The Rejected Proposal
              </span>
            </div>
            <SlideGrid slides={[34]} columns={1} />
          </div>
        </Reveal>

        <Narration>
          <p>
            But I hated the proposal as it was too ambitious and immature, and there was still so
            much I thought I didn&apos;t know about the terminal. Such as how people and businesses
            interact with the terminal and other parts of the food system in general.
          </p>
        </Narration>
      </section>

      {/* ═══════ CHAPTER 3: THE TOMATO SOUP STORY ═══════ */}
      <section className="px-6 max-w-5xl mx-auto">
        <ChapterDivider
          number={3}
          title="The Tomato Soup Story"
          subtitle="Using myself as a test subject within the food system"
        />

        {/* Slide 35: Chapter title + narration introducing the intervention */}
        <SlideGrid slides={[35]} columns={1} />

        <Narration>
          <p>
            So I used my business and myself as an example and start the next chapter,{' '}
            <strong>The Tomato Soup Story</strong>.
          </p>
          <p>
            I went to the terminal with my friend Shayan and bought tomatoes to make tomato soup,
            and decided to improvise my way through the system. The background conversation is me
            chatting with someone in the city to get permission for this intervention.
          </p>
        </Narration>

        {/* Video 3: Tomato soup intervention */}
        <VideoEmbed
          src="/thesis/videos/tomato-soup.mp4"
          caption="Video 3 — The full tomato soup intervention: buying tomatoes at the Food Terminal, making soup, setting up a public table, donating food. Background audio: Sam calling the City of Toronto for permission."
        />

        {/* Slide 36: Receipts from intervention */}
        <SlideGrid slides={[36]} columns={1} />

        <Narration>
          <p>And here are some receipts from the intervention.</p>
        </Narration>

        {/* Slide 37: Direct interaction diagram */}
        <SlideGrid slides={[37]} columns={1} />

        <Narration>
          <p>
            The intervention was very helpful because it allowed me to diagram my{' '}
            <strong>direct interaction</strong> in the food system, shown with the black line.
          </p>
        </Narration>

        {/* Slide 38: Indirect interaction diagram */}
        <SlideGrid slides={[38]} columns={1} />

        <Narration>
          <p>
            And my <strong>indirect interaction</strong> with the system, all the way from the person
            selling the seeds to the farmer, the farmer to the distributor, the distributor to retail,
            retail to me as the consumer, and my waste to the landfill. The colors red and blue
            represent the colder and warmer seasons.
          </p>
          <p>
            I needed more, one intervention wasn&apos;t enough to understand this complex system.
          </p>
        </Narration>
      </section>

      {/* ═══════ CHAPTER 4: PEOPLE'S STORY ═══════ */}
      <section className="px-6 max-w-5xl mx-auto">
        <ChapterDivider
          number={4}
          title="People&apos;s Story"
          subtitle="Nine interviews that rebuilt the network from real experience"
        />

        {/* Slide 39: Chapter title slide */}
        <SlideGrid slides={[39]} columns={1} />

        {/* Slide 40: Business cards collage — VIDEO 2 + PHYSICAL DRAWING UNFOLD */}
        <Narration>
          <p>
            So I went ahead and interviewed 9 restaurant owners and sometimes even volunteered
            for them.
          </p>
        </Narration>

        {/* Video 2: Interviews teaser */}
        <VideoEmbed
          src="/thesis/videos/interviews-teaser.mp4"
          caption="Video 2 — Teaser of Sam interviewing and volunteering for food entrepreneurs across Toronto"
        />

        <SlideGrid slides={[40]} columns={1} />

        <Narration>
          <p>
            Their story allowed me to reconstruct the first network diagram that I had built using
            the online resources and articles that I had read and replace it with a new one that is
            mostly based on the <strong>buildings I visited</strong> during my interviews and{' '}
            <strong>infrastructures that were mentioned in people&apos;s stories</strong>.
          </p>
        </Narration>

        {/* THE COLORED HERO DRAWING — Physical unfold moment */}
        <Reveal>
          <div className="my-12 md:my-16 -mx-6 md:mx-0 relative">
            <div className="relative">
              <div className="flex items-center justify-center mb-8">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">
                  Physical Moment — Drawing Unfold
                </span>
              </div>
              <div className="relative w-full overflow-hidden border-y md:border border-black/5 dark:border-white/5">
                <div className="overflow-x-auto">
                  <LightboxImage
                    src="/thesis/colored-hero-drawing.jpg"
                    alt="The Colored Network Drawing — the original line-drawing catalog from Chapter 1, now brought to life with color through real buildings visited, interviews conducted, and infrastructures verified during the thesis research"
                    width={6000}
                    height={3000}
                    className="min-w-[1200px] w-full h-auto"
                    quality={90}
                    sizes="100vw"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic text-center px-6">
                The Colored Network Drawing — the original line-drawing catalog from Chapter 1, now alive with color
                and reality after conducting interviews and directly engaging with the food system.
                Physically unfolded behind the audience during the live presentation.
              </p>
            </div>
          </div>
        </Reveal>

        <Narration>
          <p>
            At this point, my story started to depart from the terminal itself and was more focused
            on the people, their stories, and challenges in the food system, but regardless, I
            started diagramming their stories and arranging them based on their level of interaction
            and dependence on the terminal.
          </p>
        </Narration>

        {/* Individual interview diagrams */}
        {[
          {
            slide: 41,
            name: 'Chris - Wellesley Fruit Market',
            story: 'So let\'s start with Chris, who has a small fruit and vegetable store and has to visit the terminal every morning before his store opens.',
          },
          {
            slide: 42,
            name: 'Resat - Nevizade Restaurant',
            story: 'Next, we have Resat, who is a co-owner of a Turkish restaurant that gets their fruits and vegetables from middlemen and suppliers who work with the Food terminal.',
          },
          {
            slide: 43,
            name: 'Leila - Miraas Cafe',
            story: 'Next, we have Leila, who owns a cafe called Miraas. She has less of an engagement with the terminal and instead relies on large industrial entities such as Costco and Cash and Carry as they provide a convenient one-stop shop.',
          },
          {
            slide: 44,
            name: 'Branko - Bunhaus',
            story: 'We have Branko, who used to own a restaurant called Bunhaus at the flip kitchen space in North York that was designed as an incubation space for food entrepreneurs. He became a dear friend of mine, and he introduced me to another dear friend of mine, her neighbor Naza, who is here today. He, unfortunately, had to close his store. In his words during our chats and interviews, as a small independent restaurant competing with large franchise stores that are driving the rent up in the city and who are at a position of advantage due to various reasons such as affording the cost of rent, access to cheap materials and storage, is extremely challenging. His food network mostly relied on Costco, and he only used St Lawrence market for artisanal products.',
          },
          {
            slide: 45,
            name: 'Hooman - Sanotti',
            story: 'Next, we have Hooman, who works at a chocolate factory that uses a lot of sesame seeds that they import from Humera in Ethiopia. Every three months, they purchase a shipping container packed with sesame seeds that they pick up from the Montreal Port. They turn it into a wide range of products which they then drop off at the Loblaws and Walmart distribution centers.',
          },
          {
            slide: 46,
            name: 'Naza - Chic Peas Veg',
            story: 'We have Naza, who kindly attended the presentation. She has created this highly complex and beautiful network that works with small independent farmers at the production stage and an incubation space and farmers markets at the processing and consumption stage. Despite her amazing network, she is still forced to rely on large industrial entities such as Cash and Carry and Costco for sourcing products that aren\'t accessible from small local businesses. She told me a lot of beautiful stories that explained her background in food as well as sad stories that explained how challenging running a small independent food business in Toronto is, for reasons such as the high cost of rent, staffing, and lack of access to information and physical storage.',
          },
          {
            slide: 47,
            name: 'Aric - Earth Haven Farm',
            story: 'We have Aric, that has a small farm and sells his products at the Evergreen farmers market on Saturdays.',
          },
          {
            slide: 48,
            name: 'Kwabena - Tea Operation',
            story: 'We have Kwabena, who works for Naza but also runs his tea business; he relies on foraging and working on small plots of farms that he rents from Kijiji to run his business.',
          },
          {
            slide: 49,
            name: 'Roza',
            story: 'And last but not least, we have Roza, my dear friend who is an Ayurvedic practitioner. She has created this extremely minimal and sustainable food network for herself and her family that allows them to bypass all the large industrial infrastructures. She relies on her backyard garden and the small-scale farms she visits every weekend to source her food. She also sometimes gets her food by bartering with her neighbor, which I find beautiful. By the way, she has moved to an apartment recently, so she now uses her balcony as a backyard garden.',
          },
        ].map(({ slide, name, story }) => (
          <Reveal key={slide}>
            <div className="my-8">
              <div className="mb-3">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{story}</p>
              </div>
              <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                <LightboxImage
                  src={slidePath(slide)}
                  alt={`${name}'s supply chain diagram`}
                  width={1920}
                  height={1080}
                  quality={85}
                  sizes="100vw"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ═══════ CHAPTER 5: TIME TO INTERVENE ═══════ */}
      <section className="px-6 max-w-5xl mx-auto">
        <ChapterDivider
          number={5}
          title="Time to Intervene"
          subtitle="From research to design — four interventions for four people"
        />

        {/* Slide 50: Chapter title slide */}
        <SlideGrid slides={[50]} columns={1} />

        <Narration>
          <p>
            So at this stage in my thesis, I felt confident enough to intervene. But despite my
            confidence, I called the city again for advice on how I should intervene; which confused
            them, but they eventually directed me to
          </p>
        </Narration>

        {/* Slide 51: Wolfson email */}
        <SlideGrid slides={[51]} columns={1} />

        <Narration>
          <p>
            <strong>Michael Wolfson</strong>, a food and beverage specialist. Lucky for me, and
            completely by coincidence, he turned out to be the person in charge of the Flip Kitchen
            program that my friend Branko used to be a part of and Naza is still a part of.
          </p>
          <p>
            He was very helpful and kind, but during our conversation, I was disappointed by how his
            view of supporting small food business owners and a helpful intervention was thought
            about and implemented at a macro administrative level, and he had little empathy for the
            nuances and stories that the people I interviewed talked about.
          </p>
          <p>
            As an alternative, I started coming up with a few interventions inspired by the people I
            interviewed, some polemical and some more practical.
          </p>
        </Narration>

        {/* Intervention 1: Kwabena */}
        <Reveal>
          <div className="my-8 pt-4 pb-8 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-[0.2em] mr-4">
                Conceptual
              </span>
              <h3 className="text-lg font-light">Intervention 1 — For Kwabena</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              So, for example, Kwabena, who forages tea, talked about how foraging tea is considered
              illegal, and he is scared of people calling the police on him when he is spending time
              in nature foraging. So this intervention could both act as a moveable storage unit for
              the tea he forages and a hiding space in case he&apos;s about to get caught.
            </p>
            <SlideGrid slides={[52]} columns={1} />
          </div>
        </Reveal>

        {/* Intervention 2: Naza (cultural) */}
        <Reveal>
          <div className="my-8 pt-4 pb-8 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-[0.2em] mr-4">
                Conceptual
              </span>
              <h3 className="text-lg font-light">Intervention 2 — For Naza (Cultural)</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              I was inspired by Naza&apos;s story of her childhood and the large circular Eritrean
              plates that brought the whole family together as they sat around it and ate from it
              together. So I decided to merge it with a portable table so it could be easily moved
              around and assembled anywhere they want.
            </p>
            <SlideGrid slides={[53]} columns={1} />
          </div>
        </Reveal>

        {/* Intervention 3: Branko */}
        <Reveal>
          <div className="my-8 pt-4 pb-8 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-[0.2em] mr-4">
                Conceptual
              </span>
              <h3 className="text-lg font-light">Intervention 3 — For Branko</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              I was inspired by Branko&apos;s complaints about the lack of available storage space at
              their store. And I was also inspired by the fact that near the time he was closing his
              store, his shelves were empty, which turned out to be a sign that his business was
              struggling. So I wanted both a portable food cart slash storage unit that is transparent
              to show the ins and outs of the food that goes through the cart and, therefore, displays
              how the vendor is performing.
            </p>
            <SlideGrid slides={[54]} columns={1} />
          </div>
        </Reveal>

        {/* Intervention 4: Naza (built) — THE CLIMAX */}
        <Reveal>
          <div className="my-12 md:my-16 pt-8 pb-12 border-t-2 border-black dark:border-white relative">
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs font-mono text-black dark:text-white uppercase tracking-[0.2em] border border-black dark:border-white px-2 py-1">
                  Built
                </span>
                <h3 className="text-2xl font-light">Intervention 4 — For Naza (The Food Cart)</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                This is my last intervention which emerged from my experience of volunteering for
                Naza at the Evergreen Farmer&apos;s Market. During that experience, I learned that all
                the farmer&apos;s stands and displays look alike as they have to use the homogeneous
                flat-pack tables given to them at the farmer&apos;s market. I also found moving the
                food and objects in and out of the terminal tedious and challenging as you have to
                move plenty of heavy small boxes all the way to your car that is parked at the
                adjacent parking lot. So I visited Naza, showed her some sketch models, and we put
                our thoughts together and came up with this prototype that I got a chance to build.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                It functions both as a storage area that can be used at the restaurants and the
                farmers market, as well as a display area for the products.
              </p>
              <SlideGrid slides={[55]} columns={1} />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic text-center">
                Full technical drawing of the Naza food cart — 26-item parts list, designed collaboratively with Naza
              </p>
              <p className="mt-8 text-sm italic text-gray-500 dark:text-gray-400 text-center font-light">
                (At this point in the live presentation, Sam left the podium and physically brought in the cart
                he built. Naza was present in the audience to see it for the first time.)
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════ THE LIVE DEMONSTRATION ═══════ */}
      <section className="px-6 max-w-5xl mx-auto pb-24">
        <Reveal>
          <div className="py-16 md:py-24 text-center">
            <span className="inline-block text-xs font-mono tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 mb-6">
              The Presentation
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Live Demonstration
            </h2>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              At the thesis presentation, the food cart was physically built and demonstrated live
              in front of the audience at Café 059, Daniels Faculty.
            </p>
            <div className="mt-8 mx-auto w-12 h-px bg-gray-300 dark:bg-gray-700" />
          </div>
        </Reveal>

        <PhotoGallery />

        {/* Credits */}
        <Reveal>
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800 text-center">
            <div className="max-w-xl mx-auto space-y-4 text-sm text-gray-500 dark:text-gray-400">
              {/* U of T Logo */}
              <div className="flex justify-center mb-6">
                <Image
                  src={imagePreviewSrc('/thesis/uoft-crest.png')}
                  alt="University of Toronto"
                  width={60}
                  height={60}
                  sizes="60px"
                  className="h-12 w-auto opacity-60 dark:opacity-40 dark:invert"
                />
              </div>
              <p>
                <strong className="text-gray-700 dark:text-gray-300">Sam Shahsavani</strong> · Master of Architecture, 2023
              </p>
              <p>John H. Daniels Faculty of Architecture, Landscape, and Design · University of Toronto</p>
              <p>Thesis Supervisor: Jeannie Kim</p>
              <p className="text-xs mt-6 text-gray-400 dark:text-gray-600">
                Presentation photos by classmates · Food Terminal footage recorded with hidden camera ·
                Better Food Toronto Inc. is a registered food business
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

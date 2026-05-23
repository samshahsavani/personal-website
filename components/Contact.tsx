import Reveal from '@/components/Reveal';
import { contactContent } from '@/lib/site-content';

export default function Contact() {
  return (
    <section
      id="contact"
      data-nosnippet
      className="py-24 px-6 border-t border-black/[0.04] dark:border-white/[0.04]"
    >
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <h2 className="mb-4">{contactContent.title}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-lg text-muted mb-12 leading-relaxed max-w-xl">
            {contactContent.intro}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="space-y-4">
            {contactContent.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.name !== 'Email' ? '_blank' : undefined}
                rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                className="flex items-baseline gap-6 group transition-all"
              >
                <span className="label w-20 flex-shrink-0">
                  {link.name}
                </span>
                <span className="text-lg text-gray-900 dark:text-gray-100 link-underline group-hover:opacity-60 transition-opacity duration-300">
                  {link.value}
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

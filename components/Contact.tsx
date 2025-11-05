export default function Contact() {
  const contactLinks = [
    {
      name: 'Email',
      value: 'sam.shahsavani@gmail.com',
      href: 'mailto:sam.shahsavani@gmail.com',
    },
    {
      name: 'GitHub',
      value: 'github.com/samshahsavani',
      href: 'https://github.com/samshahsavani',
    },
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/sam-shahsavani',
      href: 'https://www.linkedin.com/in/sam-shahsavani/',
    },
  ];

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Get in Touch</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 leading-relaxed">
          Open to opportunities and collaborations. Let's build something great together.
        </p>

        <div className="space-y-6">
          {contactLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.name !== 'Email' ? '_blank' : undefined}
              rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
              className="flex items-baseline gap-4 group transition-all"
            >
              <span className="font-medium w-24" style={{ color: 'var(--accent)' }}>
                {link.name}
              </span>
              <span className="text-lg text-gray-900 dark:text-gray-100 link-underline group-hover:opacity-60 transition-opacity">
                {link.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

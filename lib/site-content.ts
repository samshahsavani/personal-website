// Website adapter for 00-Source/public/narrative.md and public source modules.
// Update narrative.md for positioning changes, source modules for factual changes, then sync this file.

export const siteMetadata = {
  title: 'Sam Shahsavani',
  description: 'Healthcare BIM, architecture data workflows, and product-minded AEC tool building.',
  keywords: [
    'Healthcare BIM',
    'AEC-Tech',
    'AEC Tool Building',
    'ZoningPal',
    'Architecture',
    'Digital Delivery',
    'Toronto',
    'dRofus',
  ],
} as const;

export const heroContent = {
  eyebrow: 'Architecture · Data · Tools',
  title: 'Sam Shahsavani',
  lead: "I work on complex architecture data workflows. When the tools don't exist, I build them.",
  body: "Most of that work has happened on large healthcare projects. On the side I've built products like ZoningPal and Bloom Hub to push the same instinct further: take a manual process, make it legible, and turn it into a usable tool.",
  metrics: [
    {
      value: '$4B+',
      label: 'Healthcare project context',
    },
    {
      value: 'Live',
      label: 'ZoningPal report + API flow',
    },
    {
      value: 'Daily',
      label: 'Browser-based coordination tools in use',
    },
    {
      value: '458K+',
      label: 'Toronto parcels tested',
    },
  ],
  primaryCtaLabel: 'View Projects',
  primaryCtaTarget: 'projects',
  secondaryCtaLabel: 'Contact',
  secondaryCtaTarget: 'contact',
} as const;

export const proofContent = {
  eyebrow: 'Featured Work',
  title: 'Architecture, data, and the tools between them',
  intro:
    'These projects all come from the same pattern. Find the hidden system, understand how it actually works, and build the workflow or tool that makes it usable.',
  featured: {
    label: 'ZoningPal',
    logo: '/logos/ZoningPal.png',
    title: 'Automating zoning compliance reports for Toronto properties',
    body:
      'ZoningPal turns a painful manual zoning workflow into a live report product. It combines spatial data, exact by-law loading, deterministic parking and loading calculations, AI-assisted reasoning, and PDF generation into a tool firms can use directly or integrate into their own platforms.',
    primaryLink: {
      label: 'View the Project',
      href: '/projects/zoningpal',
    },
    secondaryLink: {
      label: 'Visit ZoningPal',
      href: 'https://www.zoningpal.com/',
    },
    bullets: [
      'Early paid report flow and Bloom Hub API integration',
      'PostGIS spatial queries, exact by-law loading, Zod contracts, and PDF report generation',
      'Presented publicly through AI Tinkerers Toronto and Innovate Toronto',
    ],
  },
  highlights: [
    {
      label: 'B+H',
      logo: '/logos/b_h_architects_logo.jpeg',
      title: 'BIM data workflows on the Halifax Infirmary Expansion',
      body: 'B+H-side dRofus/Revit workflow connecting model content, QA, and Room Data Report outputs.',
      href: '/projects/bim-data-orchestration',
      ctaLabel: 'View Project',
    },
    {
      label: 'Bloom Hub',
      logo: '/logos/bloom-hub-logo.png',
      title: 'Architecture hub and AI design sandbox',
      body: 'Project dashboard, AI design studio, massing, sketch-to-3D, ZoningPal integration, and Toronto site finding.',
      href: '/projects/bloom-hub',
      ctaLabel: 'View Project',
    },
    {
      label: 'Better Food Toronto',
      logo: '/thesis/uoft-crest.png',
      title: 'Architecture thesis as field research and investigative work',
      body: 'A thesis project that used drawing, journalism, and prototyping to investigate Toronto’s food infrastructure.',
      href: '/projects/better-food-toronto',
      ctaLabel: 'View Project',
    },
  ],
} as const;

export const featuredProjectIds = [
  'zoningpal',
  'bim-data-orchestration',
  'bloom-hub',
  'better-food-toronto',
] as const;

export const aboutContent = {
  title: 'About',
  locationLabel: 'Toronto · US Citizen',
  paragraphs: [
    "For the last few years I've been running BIM data on two of Canada's largest hospital projects: The Ottawa Hospital ($2B+) and the Halifax Infirmary Expansion ($2B). On both I managed the dRofus and Revit workflow, built the QA process before builder submissions, and created tools when the team needed something that didn't exist yet.",
    "That same pattern carries into the product work. ZoningPal came from seeing how much time architecture teams lose to zoning research. Bloom Hub came from pushing the workflow further, from early input to 3D output, zoning intelligence, site finding, and project context.",
    "Earlier on I worked in design and fabrication contexts as well, but most of the work I care about now sits in the overlap between design, data, and implementation. That's where I tend to be most useful.",
  ],
  sections: [
    {
      label: 'Currently',
      body: "BIM Technology Coordinator at Parkin Architects on the Ottawa Hospital New Campus Development ($2B+). Running BIM data and finish coordination workflows, and building browser-based tools where the process needs them.",
    },
    {
      label: 'Previously',
      body: 'BIM data workflows at B+H Architects on the Halifax Infirmary Expansion ($2B). Built local AI visualization workflows for concept and competition work.',
    },
    {
      label: 'Technical',
      items: ['React/TypeScript', 'Node.js', 'PostGIS', 'Python', 'Revit', 'dRofus', 'Three.js', 'Claude API'],
    },
    {
      label: 'Education',
      body: 'M.Arch, University of Toronto, Daniels Faculty\nFaculty Design Prize · Daniels Scholars Award',
    },
  ],
} as const;

export const contactContent = {
  title: 'Contact',
  intro: 'US citizen based in Toronto. Best for thoughtful conversations around AEC-tech, healthcare delivery workflows, and product-minded tools.',
  links: [
    {
      name: 'Email',
      value: 'sam.shahsavani@gmail.com',
      href: 'mailto:sam.shahsavani@gmail.com',
    },
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/sam-shahsavani',
      href: 'https://www.linkedin.com/in/sam-shahsavani/',
    },
    {
      name: 'GitHub',
      value: 'github.com/samshahsavani',
      href: 'https://github.com/samshahsavani',
    },
  ],
} as const;

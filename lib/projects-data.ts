export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  details?: string;
  logo?: string;
  link?: string;
  presentation?: string;
  fullContent?: {
    overview: string;
    challenge: string;
    solution: string;
    impact: string;
    technologies: string[];
  };
}

export const projectsData: Project[] = [
  {
    id: "zoningpal",
    name: "ZoningPal",
    description: "AI powered zoning intelligence for Toronto providing instant, detailed zoning briefs",
    tags: ["Node.js", "React", "AI/ML", "Full-Stack", "Regulatory Tech"],
    logo: "/logos/ZoningPal.png",
    link: "https://www.zoningpal.com/",
    fullContent: {
      overview: "Zoning research is a nightmare. Municipal bylaws are inconsistent, full of legal jargon, and spread across dozens of PDFs. Architects and developers spend days digging through regulations for every project, which delays timelines and increases the risk of costly compliance mistakes. ZoningPal automates this. It parses Toronto's zoning bylaws, extracts the relevant regulations for any property, and generates clause cited briefs in minutes. The goal isn't to replace expertise. It's to give professionals their time back.",
      challenge: "The technical challenge is that zoning regulations weren't designed to be machine-readable. Each municipality structures their bylaws differently. Toronto's zoning data exists across PDFs, HTML tables, and nested conditional logic. Overlays can modify base zoning rules. Some regulations reference other regulations. Building a system that accurately extracts and interprets this requires both NLP capabilities and deep domain knowledge of how zoning actually works in practice.",
      solution: "We built this using Node.js and Claude API to parse Toronto's zoning bylaws, extracting setbacks, density limits, use permissions, and all the relevant clauses. The system handles inconsistent document formats (PDFs, HTML, nested tables) and outputs structured, citation-backed briefs that architects can hand directly to clients. Despite the technical complexity on the backend, the user experience is dead simple: enter an address, get a comprehensive zoning brief in minutes. I co-led the technical development, building the full-stack application with React/TypeScript frontend, Node.js/Express backend, and PostgreSQL with PostGIS for spatial queries. Integrated Claude API for regulatory text analysis and Puppeteer for PDF generation. The hardest part wasn't the AI. It was handling edge cases like overlays, conditional clauses, and zone-specific exemptions while keeping the interface intuitive. Most competitors scrape planning data or offer manual research services. ZoningPal actually reads the regulations and tells you what applies to your property.",
      impact: "Co-founded with my co-founder, Alireza, and launched to paying customers. Demoed at AI Tinkerers Toronto and Innovate Toronto (2025). Showcased at Collision 2024 as part of the ALPHA startup exhibition. Platform is live with paying customers, demonstrating product-market fit in regulatory automation for real estate.",
      technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "PostGIS", "Claude API", "Puppeteer", "Cheerio"],
    },
  },
  {
    id: "stoop",
    name: "Stoop",
    description: "Free furniture app connecting neighbors across the GTA to reduce waste",
    tags: ["PropTech", "iOS", "Sustainability", "Community"],
    logo: "/logos/Stoop.jpg",
    link: "https://www.stoopinc.com/",
    fullContent: {
      overview: "Before ZoningPal, I co-founded Stoop with my co-founder, Alireza, a furniture sharing app for Toronto. The idea was simple: connect people getting rid of furniture with neighbors who need it. Thousands of people used it to keep furniture out of landfills.",
      challenge: "Urban waste is a massive problem, and quality furniture often ends up in landfills simply because there's no easy way to connect people who want to get rid of items with those who need them. Existing solutions (Craigslist, Facebook Marketplace) are clunky, unsafe, and don't focus on the community-building aspect of local exchange.",
      solution: "Built a mobile-first platform (iOS) that makes furniture exchange simple: browse listings, claim items, arrange pickup. The focus is on building neighborhood connections while solving an environmental problem. Thousands of Stoopers across the GTA use the app to keep furniture out of landfills.",
      impact: "Stoop taught me how to validate product-market fit, ship fast, and build something people actually wanted. It also made me realize I'm more interested in solving industry-specific problems than consumer apps. That's what led to ZoningPal.",
      technologies: ["iOS", "Mobile Development", "Community Platform", "PropTech", "Sustainability"],
    },
  },
  {
    id: "bim-data-orchestration",
    name: "BIM Data Orchestration",
    description: "Enterprise data management for $2B+ healthcare infrastructure projects",
    tags: ["dRofus", "Revit", "BIM", "Data Integrity", "Enterprise"],
    logo: "/logos/b_h_architects_logo.jpeg",
    presentation: "/PRS_20251004_DataWorkflows_v1.pdf",
    fullContent: {
      overview: "At B+H, I coordinate BIM data for the $2B Halifax Infirmary Expansion Project. My job is ensuring Revit models, dRofus databases, and project documentation stay synchronized across international teams and consultants. One data mismatch can derail a multimillion dollar submission.",
      challenge: "Large-scale construction projects generate massive amounts of data across multiple platforms (Revit, dRofus, Navisworks). Keeping this data synchronized, accurate, and compliant is critical. Room Data Reports (RDR) are contractual deliverables and the source of truth for facility maintenance. Any data drift, duplicate geometry, or unlinked families can derail submissions and impact downstream stakeholders.",
      solution: "I build workflows to catch errors before they become problems: auditing geometry, validating families, troubleshooting data drift between platforms. It's not glamorous, but it's the difference between a project that delivers on time and one that doesn't. Every correctly placed family and every piece of linked data contributes to the final Room Data Reports, the culmination of our work.",
      impact: "Successfully coordinated data for HIEP ($2B+ project) and large-scale international developments, ensuring contractual compliance and data accuracy for critical client deliverables. Developed internal presentation Demystifying Data to educate team on workflows. Combined technical BIM expertise with architectural design thinking to solve complex data challenges at enterprise scale.",
      technologies: ["dRofus", "Revit", "Navisworks", "BIM Coordination", "Data Integrity", "Enterprise Systems", "UNIFI"],
    },
  },
  {
    id: "ai-design-workflows",
    name: "AI Design Workflows",
    description: "ComfyUI and Stable Diffusion integration for rapid architectural visualization",
    tags: ["ComfyUI", "Automatic1111", "Stable Diffusion", "ControlNet", "Architecture"],
    logo: "/logos/b_h_architects_logo.jpeg",
    presentation: "/PRS_20251004_AIWorkflows_v1.pdf",
    fullContent: {
      overview: "I integrated AI image generation (Stable Diffusion, ComfyUI) into B+H's design process to speed up early-stage visualization. Instead of spending days on renderings, designers can test facade options, lighting conditions, and material treatments in minutes.",
      challenge: "Architectural visualization is time-consuming and expensive. Traditional rendering workflows slow down design iteration, and communicating complex design intent to clients requires photorealistic renderings that take days to produce. The challenge: rapidly visualize large-scale projects (entertainment venues, 50-storey hotels) from simple sketches while maintaining design control and exploring multiple facade treatments, lighting conditions, and material options.",
      solution: "The workflow translates hand sketches and 3D massing models into photorealistic options that clients can react to immediately. It's not about replacing design work. It's about letting designers iterate faster and have better conversations earlier in the process. Built custom AI pipelines using ComfyUI for conceptual ideation and Automatic1111 for iterative refinement. ComfyUI provides unmatched flexibility through node-based custom pipelines; A1111 enables rapid iteration through inpainting and extensions.",
      impact: "Delivered client-ready visualizations for complex projects (5,000-seat entertainment venues, 800-suite hotels) in a fraction of traditional timeline. Enabled high-level design conversations with multiple photorealistic options generated in minutes instead of days. Successfully demonstrated at B+H how AI augments architectural expertise when applied thoughtfully, maintaining design intent while accelerating iteration.",
      technologies: ["ComfyUI", "Automatic1111", "Stable Diffusion", "ControlNet", "Photoshop", "3D Massing", "Architectural Visualization"],
    },
  },
];

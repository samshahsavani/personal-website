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
    tags: ["Node.js", "React", "AI/ML", "Full Stack", "Regulatory Tech"],
    logo: "/logos/ZoningPal.png",
    link: "https://www.zoningpal.com/",
    fullContent: {
      overview: "Zoning research takes days of manual work. Municipal bylaws are inconsistent, buried in PDFs, and full of legal language that references other bylaws. Architects spend hours trying to figure out setbacks, height limits, and parking requirements for each project. ZoningPal automates this. It parses Toronto's zoning bylaws, extracts the relevant regulations for any property, and generates clause cited briefs in minutes. We're not replacing expertise. We're giving professionals their time back so they can focus on design instead of document hunting.",
      challenge: "The technical challenge is that zoning regulations weren't designed to be machine readable. Each municipality structures their bylaws differently. Toronto's zoning data exists across PDFs, HTML tables, and nested conditional logic. Overlays can modify base zoning rules. Some regulations reference other regulations. Building a system that accurately extracts and interprets this requires both NLP capabilities and deep domain knowledge of how zoning actually works in practice.",
      solution: "We built this using Node.js and Claude API to parse Toronto's zoning bylaws, extracting setbacks, density limits, use permissions, and all the relevant clauses. The system handles inconsistent document formats (PDFs, HTML, nested tables) and outputs structured, citation-backed briefs that architects can hand directly to clients. Despite the technical complexity on the backend, the user experience is dead simple: enter an address, get a comprehensive zoning brief in minutes. I co-led the technical development, building the full stack application with React/TypeScript frontend, Node.js/Express backend, and PostgreSQL with PostGIS for spatial queries. Integrated Claude API for regulatory text analysis and Puppeteer for PDF generation. The hardest part wasn't the AI. It was handling edge cases like overlays, conditional clauses, and zone specific exemptions while keeping the interface intuitive. Most competitors scrape planning data or offer manual research services. ZoningPal actually reads the regulations and tells you what applies to your property.",
      impact: "Co-founded with Alireza and launched to paying customers. Presented technical demos at AI Tinkerers Toronto and Innovate Toronto in 2025. Showcased at Collision 2024 as part of the ALPHA startup exhibition. The platform is live and processing payments, proving there's real demand for tools that automate regulatory research in real estate and architecture.",
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
      challenge: "Urban waste is a massive problem, and quality furniture often ends up in landfills simply because there's no easy way to connect people who want to get rid of items with those who need them. Existing solutions (Craigslist, Facebook Marketplace) are clunky, unsafe, and don't focus on the community building aspect of local exchange.",
      solution: "Built a mobile first platform (iOS) that makes furniture exchange simple: browse listings, claim items, arrange pickup. The focus is on building neighborhood connections while solving an environmental problem. Thousands of Stoopers across the GTA use the app to keep furniture out of landfills.",
      impact: "Stoop taught me how to validate product market fit, ship fast, and build something people actually use. It also helped me realize I'm more interested in solving problems for professionals in specific industries than building consumer apps. That realization led directly to ZoningPal, where I could apply the same product development skills to a domain I actually understand from years of working in architecture.",
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
      overview: "At B+H Architects, I coordinate BIM data for the Halifax Infirmary Expansion Project, a $2B healthcare development with international design teams. My job is keeping Revit models, dRofus room databases, and project documentation synchronized across architects, engineers, and consultants. One data mismatch between platforms can derail a multimillion dollar submission or cause errors that propagate through thousands of rooms.",
      challenge: "Large scale construction projects generate massive amounts of data across multiple platforms (Revit, dRofus, Navisworks). Keeping this data synchronized, accurate, and compliant is critical. Room Data Reports (RDR) are contractual deliverables and the source of truth for facility maintenance. Any data drift, duplicate geometry, or unlinked families can derail submissions and impact downstream stakeholders.",
      solution: "I build quality control workflows that catch errors before they become expensive problems. This means auditing Revit geometry, validating family parameters against dRofus requirements, and troubleshooting data drift between platforms. I write scripts to automate repetitive checks and flag inconsistencies. It's not glamorous work, but it's the difference between a project that delivers on time and one that gets derailed by avoidable data errors. Every correctly placed family and every piece of linked data contributes to the Room Data Reports that facility managers will use for decades.",
      impact: "Successfully coordinated data for the Halifax Infirmary Expansion and other large scale international projects, ensuring contractual compliance and data accuracy for critical deliverables. Created an internal presentation called Demystifying Data to help the team understand BIM workflows and data dependencies. This work combines technical BIM coordination with problem solving skills from architecture, handling data challenges at enterprise scale on projects where mistakes are extremely costly.",
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
      overview: "I integrated AI image generation tools like Stable Diffusion and ComfyUI into B+H's design process to speed up early stage visualization. Instead of spending days setting up traditional rendering workflows, designers can now test facade options, lighting conditions, and material treatments in minutes. This lets teams iterate faster and have better design conversations earlier in the project.",
      challenge: "Architectural visualization is time consuming and expensive. Traditional rendering workflows slow down design iteration, and communicating complex design intent to clients requires photorealistic renderings that take days to produce. The challenge: rapidly visualize large scale projects (entertainment venues, 50 storey hotels) from simple sketches while maintaining design control and exploring multiple facade treatments, lighting conditions, and material options.",
      solution: "The workflow takes hand sketches or simple 3D massing models and generates photorealistic visualization options that clients can react to immediately. I built custom AI pipelines using ComfyUI for conceptual exploration and Automatic1111 for iterative refinement. ComfyUI gives more control through node based workflows for complex generation tasks. Automatic1111 is faster for quick iterations and inpainting to refine specific areas. The goal isn't to replace architectural expertise or traditional rendering. It's to compress the time between sketch and photorealistic image so design teams can explore more options and make better decisions faster.",
      impact: "Delivered client ready visualizations for complex projects including large entertainment venues and high rise hotels in a fraction of the traditional timeline. Enabled design conversations with multiple photorealistic options in minutes instead of days. This proved that AI can augment architectural expertise when used thoughtfully, compressing iteration time without sacrificing design intent or quality.",
      technologies: ["ComfyUI", "Automatic1111", "Stable Diffusion", "ControlNet", "Photoshop", "3D Massing", "Architectural Visualization"],
    },
  },
];

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  logo?: string;
  link?: string;
  presentation?: string;
  fullContent?: {
    overview: string;
    challenge: string;
    solution: string;
    impact: string;
    technologies: string[];
    images?: {
      src: string;
      alt: string;
      caption: string;
      fit?: "cover" | "contain";
    }[];
  };
}

export const projectsData: Project[] = [
  // ─── Source: 00-Source/personal/education/education.md + thesis materials ───
  {
    id: "better-food-toronto",
    name: "Better Food Toronto",
    description: "M.Arch Thesis — Five Stories About and Around the Ontario Food Terminal",
    tags: ["Architecture Thesis", "Food Systems", "Supply Chain Research", "Built Prototype", "Investigative Journalism"],
    logo: "/thesis/uoft-crest.png",
    link: undefined,
    fullContent: {
      overview: "Instead of designing a building, this thesis used architectural methods to investigate how Toronto's food system works and where it fails. Architecture as a tool for research and storytelling, not just construction.",
      challenge: "Toronto's food infrastructure operates at three scales that rarely talk to each other: industrial (Walmart, Costco, Loblaws), medium-scale (decentralized distributors), and small-scale (family farms, independent stores). The Ontario Food Terminal is the critical node connecting all three, and it's almost invisible to the public and to architects.",
      solution: "I registered a food business to gain access to the Ontario Food Terminal. I used hidden cameras to capture footage, obtained official floor plans, and digitally reconstructed the entire facility. I conducted nine in-depth interviews with food entrepreneurs, volunteered at their businesses, and mapped individual supply chains. Then I designed four interventions inspired by real people and built one: a modular flat-pack food cart for Naza, demonstrated live at the thesis presentation.",
      impact: "Faculty Design Prize (June 2023), the highest design honour at the Daniels Faculty. My thesis supervisor, Jeannie Kim, offered me a teaching position at the Daniels Design Discovery Program directly after graduation based on this work.",
      technologies: ["Architectural Drawing", "Field Research", "Digital Reconstruction", "Prototyping", "Supply Chain Analysis"],
    },
  },

  // ─── Source: 00-Source/personal/stoop/stoop.md → ZoningPal ───
  {
    id: "zoningpal",
    name: "ZoningPal",
    description: "Automates zoning compliance reports for Toronto properties. Buy a report directly, or integrate via API.",
    tags: ["React/TypeScript", "Node.js", "PostGIS", "Claude API", "Supabase", "Stripe"],
    logo: "/logos/ZoningPal.png",
    link: "https://www.zoningpal.com/",
    fullContent: {
      overview: "ZoningPal automates zoning compliance reports for Toronto properties. Anyone can buy a report directly on the platform, or architecture firms can connect our API into their own products to deliver instant analysis to their clients.",
      challenge: "Creating zoning reports required hours or days of manual research. City by-laws, zoning maps, overlay PDFs, parking rules, loading standards, and site-specific exceptions all had to be checked for a single lot.",
      solution: "Enter a property address. The platform queries spatial data tables, loads the exact relevant by-law text, calculates development rights, resolves parking and loading standards deterministically, and generates a professional PDF report in roughly 90 seconds. The backend runs a multi-phase pipeline with Zod contracts and a shared data dictionary so phase outputs stay consistent.",
      impact: "Co-founded with Alireza. Early paid usage, a live direct-purchase flow, and API integration inside Bloom Hub. Presented at AI Tinkerers Toronto and Innovate Toronto. The system is Toronto-focused today, with the architecture built city by city.",
      technologies: ["React", "TypeScript", "Node.js", "Express", "PostGIS", "Supabase", "Claude API", "OpenAI API", "Zod", "Stripe", "Puppeteer", "Handlebars", "Render.com"],
    },
  },

  // ─── Source: 00-Source/personal/stoop/stoop.md → Bloom Hub ───
  {
    id: "bloom-hub",
    name: "Bloom Hub",
    description: "Private architecture hub and AI design sandbox for Bloom Architects.",
    tags: ["React/Vite", "Three.js", "FastAPI", "PostGIS", "Gemini Vision"],
    logo: "/logos/bloom-hub-logo.png",
    link: undefined,
    fullContent: {
      overview: "A private design-and-information hub I built for Bloom Architects. It combined a project dashboard, AI design studio, concept massing, sketch-to-3D layout generation, zoning analysis powered by the ZoningPal API, parcel-scale site finding, document/project context, and an AI concierge interface.",
      challenge: "Architecture teams do not only need one isolated AI feature. They need a project context where design experiments, zoning facts, site search, documents, and project information can live together without jumping between disconnected tools.",
      solution: "I built Bloom Hub as a project-centered workspace. The design studio handled ideation, 3D massing, environmental context overlays, and sketch-to-3D layout generation. The sketch-to-3D layer moved from wall tracing and space segmentation into scale detection, room labeling, parametric geometry, and GLB preview. The information side connected zoning maps, ZoningPal report generation, Toronto parcel search, saved reports, documents, and project-aware chat around the same project.",
      impact: "Deployed as a private Bloom Architects workspace and functional enough to demonstrate the workflow. The project also produced a computational analysis of 458,000+ Toronto residential parcels for a City of Toronto RFP, identifying over 193,000 properties suitable for as-of-right multiplex development.",
      technologies: ["React", "Vite", "Three.js", "React Three Fiber", "FastAPI", "Python", "Supabase", "PostGIS", "CadQuery", "build123d", "GLB", "Gemini Vision", "Zustand"],
      images: [
        {
          src: "/bloom-hub/bloom-hub-project-dashboard.webp",
          alt: "Bloom Hub project dashboard",
          caption: "Private project dashboard for creating and reopening Bloom Hub workspaces.",
          fit: "contain",
        },
        {
          src: "/bloom-hub/design-studio-ideate.webp",
          alt: "Bloom Hub design studio ideation module",
          caption: "AI design studio with ideation, concept massing, and layout workflows.",
          fit: "contain",
        },
        {
          src: "/bloom-hub/zoning-map-citywide.webp",
          alt: "Bloom Hub zoning map with ZoningPal report flow",
          caption: "Zoning module connected to ZoningPal report generation inside the project context.",
          fit: "contain",
        },
        {
          src: "/bloom-hub/layout-generated-3d-model.webp",
          alt: "Bloom Hub generated 3D layout model",
          caption: "Generated 3D model from the sketch-to-layout pipeline.",
          fit: "contain",
        },
      ],
    },
  },

  // ─── Source: 00-Source/personal/parkin/parkin.md ───
  {
    id: "parkin-tools",
    name: "Finish Coordination Tools",
    description: "Browser-based coordination tools for finish-data auditing, template lookup, room-type coding, and phase-to-phase validation.",
    tags: ["HTML/JS", "Excel I/O", "Data Validation", "Local-First"],
    logo: "/logos/Parkin.jpeg",
    link: undefined,
    fullContent: {
      overview: "The coordination workflow on the Ottawa Hospital had a lot of manual steps. I built a set of browser-based tools to handle the repetitive parts: checking dRofus finish data for errors, finding room templates that could be consolidated, real-time material lookup during coordination meetings, auto-generating room type codes, and validating how data transitions between phases.",
      challenge: "I'm managing dRofus and Revit data for finish specifications across more than 600 hospital rooms, within a DevCo structure involving six firms. The scale created data workflows that needed tooling support.",
      solution: "Each tool solves a specific bottleneck I kept running into. One audits finish sheets with a custom rule engine and flags errors before they become problems. Another identifies which room templates can be consolidated across the project. There's an interactive lookup I built for coordination meetings so we can answer questions in real time instead of going back and checking later. One parses SDP reference data and auto-generates room type codes. The last one validates how data transitions between phases against a rules-based mapping.",
      impact: "The team adopted them. They turned repetitive QA that used to take hours into faster browser-based checks, while keeping the workflow local and easy to use.",
      technologies: ["HTML", "JavaScript", "CSS", "xlsx-js-style", "Browser-Based Architecture"],
    },
  },

  // ─── Source: 00-Source/personal/bnh/bnh.md + 00-Source/personal/parkin/parkin.md ───
  {
    id: "bim-data-orchestration",
    name: "BIM Data Orchestration",
    description: "Managing dRofus and Revit data workflows on two of Canada's largest hospital projects.",
    tags: ["dRofus", "Revit", "BIM", "Data Integrity", "Healthcare"],
    logo: "/logos/b_h_architects_logo.jpeg",
    fullContent: {
      overview: "At B+H, I ran the Revit-to-dRofus workflow on the Halifax Infirmary Expansion for medical equipment content, Room Data Report QA, and coordination across room data, doors, windows, and hardware.",
      challenge: "On a large healthcare project, the hard part was not only modeling content. It was keeping database records, Revit families, schedules, and report outputs aligned before each submission.",
      solution: "I built and linked the medical equipment family library, checked Room Data Reports against the current model state, and traced discrepancies across doors, windows, equipment, and shared parameters before submission.",
      impact: "The work established a repeatable QA pattern I later carried into the Ottawa Hospital context: keep source records aligned, catch drift before submission, and make the workflow legible for the wider team.",
      technologies: ["dRofus", "Revit", "Navisworks", "BIM Coordination", "Data Integrity", "UNIFI"],
    },
  },

  // ─── Source: 00-Source/personal/stoop/stoop.md → Stoop ───
  {
    id: "stoop",
    name: "Stoop",
    description: "Native iOS app for photographing, geo-tagging, browsing, and claiming free curbside furniture across the GTA.",
    tags: ["iOS", "SwiftUI", "MapKit", "Firebase", "Sustainability"],
    logo: "/logos/Stoop.jpg",
    link: "https://www.stoopinc.com/products",
    fullContent: {
      overview: "Stoop was my first public shipped product: a native iOS app that lets people capture, browse, and collect usable furniture left on the street. It turned an Instagram-based community behavior into a map-based product.",
      challenge: "Curbside reuse already had demand, but discovery was fragmented. People photographed street-found furniture, waited for social accounts to repost it, and often missed the narrow window before items disappeared or went to landfill.",
      solution: "The app lets users photograph an item, add a description, auto-geotag the location, browse nearby finds on a map, search by text, open clustered map results, and call dibs on an item. The beta was built as a native iOS app with SwiftUI, MapKit, CoreLocation, Firebase Auth, Firestore, and Firebase Storage.",
      impact: "Co-founded with Alireza, published on the App Store, and presented at Collision 2024 as an Alpha team. Stoop is not the technical centerpiece of the portfolio, but it remains a useful proof point: a shipped public app, an App Store release, and an early experience learning from real users.",
      technologies: ["SwiftUI", "MapKit", "CoreLocation", "Firebase Auth", "Firestore", "Firebase Storage", "iOS"],
      images: [
        {
          src: "/stoop/stoop-collision-alpha-team-01.jpg",
          alt: "Stoop Inc. Alpha team booth at Collision 2024",
          caption: "Stoop Inc. presenting the iOS app at Collision 2024 as an Alpha team.",
        },
        {
          src: "/stoop/stoop-collision-alpha-team-02.jpg",
          alt: "Stoop Inc. team at Collision 2024",
          caption: "The public signal is modest but real: a shipped app, an App Store presence, and a Collision Alpha booth.",
        },
      ],
    },
  },

  // ─── Source: 00-Source/personal/sheeep/sheeep.md → Staging Grounds ───
  {
    id: "staging-grounds",
    name: "Staging Grounds",
    description: "RAIC National Urban Design Award 2024. Environmental installation at the Bentway, Toronto.",
    tags: ["Public Space", "Urban Ecology", "RAIC Award", "Sheeep"],
    logo: "/logos/sheeep-logo-2024.png",
    link: "https://sheeep.studio/Staging-Grounds",
    fullContent: {
      overview: "A living laboratory for urban ecology at the Bentway, under the Gardiner Expressway. The installation uses rainwater runoff from the highway above to irrigate oversized planters and support flowering native plant species.",
      challenge: "The underside of the Gardiner Expressway is one of Toronto's most underutilized urban spaces. The challenge was creating an installation that turns infrastructure waste into a productive ecological system while engaging the public.",
      solution: "Designed by Agency-Agency and Sheeep Studio, with engineering by Buro Happold, graphic design by Neil Donnelly Studio, and horticultural consulting by Brother Nature. I was part of the credited Sheeep Studio project team, contributing to the visual communication, presentation drawings, project documentation, and production support around the installation.",
      impact: "RAIC National Urban Design Award 2024. Covered by Fast Company, the Globe and Mail, Dezeen, and Archdaily within weeks of opening.",
      technologies: ["Rhino/Grasshopper", "Fabrication", "V-Ray", "CNC", "Laser Cutting"],
      images: [
        {
          src: "/staging-grounds/0L2A9017.jpg",
          alt: "Staging Grounds under the Gardiner Expressway at the Bentway",
          caption: "Staging Grounds under the Gardiner Expressway. Photography: Samuel Engelking.",
        },
        {
          src: "/staging-grounds/0L2A8673.jpg",
          alt: "Staging Grounds interpretive signage and planting infrastructure",
          caption: "Interpretive signage frames the project as an urban ecology learning site. Photography: Samuel Engelking.",
        },
        {
          src: "/staging-grounds/20230717_axo_full-01-1.png",
          alt: "Axonometric drawing of Staging Grounds at the Bentway",
          caption: "Project axonometric showing the installation layout below the Gardiner.",
          fit: "contain",
        },
        {
          src: "/staging-grounds/230718_Planter-Diagram.jpg",
          alt: "Diagram of Staging Grounds planter and rainwater ecology system",
          caption: "Planter diagram showing the relationship between runoff, planting, and public education.",
          fit: "contain",
        },
        {
          src: "/staging-grounds/230918_THE-BENTWAY_STAGING-GROUNDS-12.jpg",
          alt: "People gathered at Staging Grounds beneath the Gardiner Expressway",
          caption: "Public occupation of the completed installation. Photography: Samuel Engelking.",
        },
        {
          src: "/staging-grounds/230918_THE-BENTWAY_STAGING-GROUNDS-44.jpg",
          alt: "Atmospheric view of Staging Grounds planting beneath the Gardiner Expressway",
          caption: "The project turns leftover infrastructure space into a planted public environment. Photography: Samuel Engelking.",
        },
      ],
    },
  },

  // ─── Source: 00-Source/personal/bnh/bnh.md → AI Design Workflows ───
  {
    id: "ai-design-workflows",
    name: "AI Design Workflows",
    description: "Local AI visualization workflows for architecture concept and competition work, built around controlled inputs.",
    tags: ["ComfyUI", "Stable Diffusion", "ControlNet", "Rhino", "Photoshop"],
    logo: "/logos/b_h_architects_logo.jpeg",
    fullContent: {
      overview: "At B+H, I built local AI visualization workflows for concept and competition design teams. The point was not to replace design. It was to keep AI image generation tied to architectural inputs: sketches, Rhino massing, line drawings, depth maps, site context, and Photoshop compositing.",
      challenge: "The team needed fast visual iteration, but public cloud AI tools were not appropriate for confidential company/project material. Pure text prompts were also too loose for architecture because the images had to preserve massing, perspective, and design intent.",
      solution: "I used Automatic1111 and ComfyUI with local Stable Diffusion models and ControlNet. The workflow moved from sketch or Rhino massing to outline and depth-map controls, then into image iteration, inpainting, and Photoshop composition. This made the AI a controlled visualization layer instead of a random image generator.",
      impact: "The workflow gave design teams a faster way to explore facade, lighting, material, and atmosphere options during early design. The specific 2024 tools are partly outdated now, but the lesson still matters: local, privacy-aware AI workflows can support professional AEC teams when they are constrained by real design inputs.",
      technologies: ["ComfyUI", "Automatic1111", "Stable Diffusion", "ControlNet", "Rhino", "Photoshop", "Depth Maps", "Inpainting"],
      images: [
        {
          src: "/ai-workflows/hotel-annotated-hand-sketch.jpg",
          alt: "Hand sketch used as an early high-rise concept input",
          caption: "The high-rise workflow started from a rough hand sketch, not a text prompt alone.",
          fit: "contain",
        },
        {
          src: "/ai-workflows/hotel-rhino-massing.jpg",
          alt: "Rhino massing model used as an AI control input",
          caption: "A simple Rhino massing model established perspective, site relationship, and tower proportion.",
          fit: "contain",
        },
        {
          src: "/ai-workflows/hotel-line-control.png",
          alt: "Line drawing control image exported from the Rhino massing model",
          caption: "Linework became a ControlNet input so the generated image stayed tied to the actual massing.",
          fit: "contain",
        },
        {
          src: "/ai-workflows/hotel-depth-control.jpg",
          alt: "Depth map control image exported from the massing model",
          caption: "A depth map gave the model another geometric constraint beyond the written prompt.",
          fit: "contain",
        },
        {
          src: "/ai-workflows/tool-comfyui-node-workflow.jpg",
          alt: "ComfyUI node graph for local architectural image generation",
          caption: "ComfyUI made the workflow explicit: models, conditioning, image inputs, prompts, and outputs wired together locally.",
          fit: "contain",
        },
        {
          src: "/ai-workflows/tool-automatic1111-img2img-generation.jpg",
          alt: "Automatic1111 image generation interface",
          caption: "Automatic1111 was used for local iteration, ControlNet, model testing, and inpainting.",
          fit: "contain",
        },
        {
          src: "/ai-workflows/tool-photoshop-hotel-composite.png",
          alt: "Photoshop compositing workflow for AI-assisted visualization",
          caption: "The final stage was human judgment: selecting, compositing, cleaning, and placing outputs into context.",
          fit: "contain",
        },
        {
          src: "/ai-workflows/entertainment-concept-final.jpg",
          alt: "AI-assisted concept visualization for an entertainment facility",
          caption: "Concept visualization for a large entertainment/retail project. Used as early visual exploration, not final documentation.",
        },
        {
          src: "/ai-workflows/hotel-context-composite.jpg",
          alt: "High-rise hotel concept composited into site context",
          caption: "High-rise concept composited into context after sketch, massing, ControlNet iteration, and Photoshop cleanup.",
        },
      ],
    },
  },
];

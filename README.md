# Sam Shahsavani - Personal Portfolio

A minimal editorial portfolio for Sam's architecture, data workflow, and tool-building work.

This repository is the source for the website. Project evidence stays with each project in Drive. Career-wide positioning and portfolio records live in Vision.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Geist Font** - Clean, modern typography

## Features

- Dark mode support with system preference detection
- Smooth scroll navigation
- Responsive design (mobile-first)
- Subtle fade-in animations
- Expandable project cards
- Fast, lightweight build

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production
```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/
│   ├── ThemeProvider.tsx  # Dark mode context
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   ├── Proof.tsx          # Metrics strip + featured proof section
│   ├── Projects.tsx       # Featured projects
│   ├── About.tsx          # About section
│   └── Contact.tsx        # Contact section
├── lib/
│   ├── site-content.ts    # Homepage, metadata, and contact copy adapted from the positioning note
│   └── projects-data.ts   # Project cards and project detail content adapted from source modules
└── public/             # Static assets
```

## Customization

### Update Projects
Update the project narrative in Work or Education first. Then adapt the relevant content in `lib/projects-data.ts`.

### Update Assets
Keep source images and videos with their projects in Drive. Store the files used by the site in `public/`.

When adding or replacing website imagery:

1. Put the original or edited source asset in the relevant project folder in Drive.
2. Copy only the selected website-ready asset into `public/`.
3. Run `npm run optimize:images`.
4. Treat `public/optimized/` as generated output.

### Update Contact Links
Edit `lib/site-content.ts` to update contact information.

### Update Content
For positioning or tone changes, update the positioning note in Vision first. Then update `lib/site-content.ts` for homepage, metadata, and contact copy. Components should stay mostly presentational.

## Deployment

This site is configured as a static Next.js export. `npm run build` generates the deployable site in `out/`.

```bash
npm run build
```

For Render Static Site:

- **Build command:** `npm run build`
- **Publish directory:** `out`

Do not deploy this portfolio as a long-running Node web service unless the site later adds server-only features such as API routes, authentication, cookies, or request-time database work.

## License

MIT

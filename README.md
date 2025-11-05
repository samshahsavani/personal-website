# Sam Shahsavani - Personal Portfolio

A minimal, beautiful personal website showcasing AI Product Development and PropTech projects.

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
│   ├── Projects.tsx       # Featured projects
│   ├── About.tsx          # About section
│   └── Contact.tsx        # Contact section
└── public/             # Static assets
```

## Customization

### Update Projects
Edit the `projects` array in `components/Projects.tsx` to add/modify projects.

### Update Contact Links
Edit the `contactLinks` array in `components/Contact.tsx` to update contact information.

### Update Content
Modify the copy in each component file to update section content.

## Deployment

Deploy easily to Vercel:

```bash
npx vercel
```

Or use any other hosting platform that supports Next.js.

## License

MIT

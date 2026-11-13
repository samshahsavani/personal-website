# Survey Basis

Independent browser-only DXF preparation tool, maintained with the website.

- Source: `app/`. Geometry and export behavior retained from the original standalone tool.
- Build: `npm run build:survey-basis` from the website root. Included in `npm run build`.
- Regression check: `npm run test:survey-basis`.
- Generated outputs: `public/tools/survey-basis/workspace.html` and `Survey-Basis.html`.
- Website: `/tools/survey-basis/`. The second HTML file is the offline download.

Both outputs contain their scripts, styling, and fonts. No external dependencies load at runtime. A hashed script CSP blocks connections and form submissions. The website frame permits scripts and downloads only, without same-origin privileges, so it cannot use browser storage. Drawing data stays in JavaScript memory and is cleared on refresh. The parent exchanges theme and readiness messages only. Do not add survey contents, filenames, or geometry to those messages, analytics, storage, or network calls.

Input is ASCII DXF. Exports contain supported visible model-space geometry, in feet at Z=0 with a local property origin. Preserve preflight warnings and geometry checks when editing the interface.

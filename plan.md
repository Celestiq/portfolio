# Personal Portfolio Site — Build Plan

This is a plan for a new personal portfolio website. It has no code in it. It describes what to build, how the pieces fit together, and in what order to build them. Treat this as the spec to work from.

## 1. Goal and scope

A static personal site with three sections:

- **About Me** — a short intro, a photo, and a vertical timeline of the owner's journey (year, description, a few photos per entry), designed to feel like the reader is walking through the journey alongside the author.
- **Writings** — a listing of essays/posts pulled automatically from markdown and HTML files dropped into a `writings/` content folder in the repo. No CMS, no database. Adding a new file to the folder and pushing is the entire publishing workflow.
- **Projects** — a listing of projects with title and short description. Clicking a project opens a detail page with a longer write-up.

The site is a new repository, not an extension of any existing site. There is no custom domain yet, so it will initially be served from the default GitHub Pages URL for whatever repo name is chosen later. The build should not hardcode a repo name; keep the base path as a single, easily changeable setting so the site can be retargeted later without rework.

## 2. Design direction: editorial minimal

The visual language is deliberately restrained:

- Generous whitespace, no shadows, no gradients, no decorative icons or graphics.
- Serif typeface for headings and for the year numerals in the timeline. Sans-serif for body text. Optional monospace for metadata like dates and tags.
- Structure is communicated through thin hairline rules, not boxes, cards with borders, or colored badges.
- One muted accent color used sparingly, for links and small emphasis only. Everything else is neutral (near-black text, off-white or white background, gray secondary text).
- The timeline has no circular nodes or icons. Each entry is: a serif year on the left, a thin vertical rule as the spine, and on the right a title, a short description, and a small row of square or slightly rounded photo thumbnails. Entries are separated by a single thin horizontal rule.
- Writings and Projects listings follow the same restraint: stacked entries separated by hairline dividers rather than bordered cards, serif headline, sans-serif snippet, image to the side if present.

The intent is for the timeline and the writing to be the focal points. The design should stay out of the way of both.

## 3. Tech stack

- Astro, static output mode.
- Plain CSS using custom properties for theming. No UI framework, no component library.
- Markdown rendering through Astro's built-in content pipeline; raw HTML files supported as a second content format (see section 6).
- Hosted on GitHub Pages, deployed through a GitHub Actions workflow that builds the Astro site and publishes it via the Pages deployment action (not a manual `gh-pages` branch push).

## 4. Repository structure

At the root:

- `theme.yaml` — the single file that controls all design tokens (colors, fonts, spacing, radius values, site title and description). This is the one file meant to be edited by hand to change the look of the site.
- A small build-time script that reads `theme.yaml` and generates a CSS file of custom properties from it. This script should run automatically before both the local dev server and the production build, so editing `theme.yaml` and restarting either command is the entire retheming workflow. Nothing else in the codebase should hardcode a color or font name; everything reads from the generated variables.
- Standard Astro project files (config, package manifest).
- A `public/` folder for static assets that do not need processing (favicon, social preview image).

Inside the source folder:

- A content area holding two content collections: `writings` and `projects`, each a flat folder of one file per entry.
- A data file holding the timeline as an ordered list of entries (year, title, description, list of image paths). This is plain structured data, not a content collection, since timeline entries do not need their own pages.
- Layouts: a base layout shared by all pages (handles the nav, footer, and page shell), plus a layout for an individual writing's detail page and a layout for an individual project's detail page.
- Small reusable components: navigation bar, footer, a single timeline-entry component, a writing-card component for the listing, a project-card component for the listing.
- Pages: the home/About page, a writings listing page and a writings detail page (dynamic route by slug), a projects listing page and a projects detail page (dynamic route by slug).
- A styles folder with the hand-written global stylesheet and the auto-generated theme variables file (the generated file should never be hand-edited, since it gets overwritten on every build).

A GitHub Actions workflow file handles building and deploying on every push to the main branch.

## 5. The theme file

`theme.yaml` should cover, at minimum:

- Site-level info: site title, site description (used in page metadata).
- Fonts: serif family name, sans family name, optional monospace family name.
- Colors: background, primary text, secondary (muted) text, the one accent color, and the hairline/border color.
- Layout values: a max content width for readable line length, and a standard spacing value used between major sections.
- Corner radius values, used only on the small photo thumbnails, kept subtle.

Everything in the templates and components should reference these values indirectly through the generated CSS variables, never by repeating a literal color or font name. This is what makes the file the single point of control for the look of the site.

Dark mode is out of scope for the first version, but the structure should not actively prevent adding a second palette to this file later if a toggle is wanted down the line.

## 6. Writings: content pipeline

- Source folder accepts both markdown files and raw HTML files side by side. Both file types start with the same kind of frontmatter block (title, optional subtitle, date, optional image path, optional excerpt).
- For markdown files, the body renders through the normal markdown pipeline.
- For HTML files, the body after the frontmatter block is treated as already-formed HTML and inserted as-is, with no conversion step.
- If the `excerpt` field is left out of an entry's frontmatter, generate one automatically at build time: strip markdown/HTML formatting from the body and take roughly the first 200 characters as the snippet. This was confirmed as the preferred approach, no manual excerpt writing required.
- The listing page sorts entries by date (newest first) and renders each as a stacked block: headline, subtitle if present, the snippet, and the image if present. Entries are separated by a hairline rule, not a bordered card.
- The detail page renders the full body of a single entry, reached by clicking its entry on the listing page.

## 7. Projects: content pipeline

- One file per project, markdown format, living in its own content folder.
- Frontmatter holds the fields needed for the listing: title, a short one-line description, an optional image, and an optional external link (live site or source repo).
- The body of the same file is the longer write-up, rendered only on that project's own detail page, not shown on the listing.
- The listing page renders title and short description per project, in the same hairline-divider style as Writings, and links through to the detail page.
- The detail page renders the project's title and full body content.

## 8. About page and timeline

- A short intro section near the top: a few sentences plus a photo.
- Below that, the vertical timeline, populated from the timeline data file described in section 4. Each entry in that data file should support a year, a title or short label for that period, a description, and a list of zero or more image paths.
- As the reader scrolls, each timeline entry should animate gently into view (a small fade and slight upward shift is enough) rather than appearing all at once, to support the "walking through the journey" feeling. This should be a small, unobtrusive script, not a heavy animation library.
- Adding a new chapter to the journey later should only require adding one new entry to the timeline data file. No template or component changes should be needed for that.

## 9. Navigation, footer, and shared shell

- A simple top navigation with links to About (home), Writings, and Projects.
- A minimal footer (could hold a copyright line and any social/contact links, kept plain and unobtrusive).
- Consistent page shell across all pages: consistent max content width, consistent vertical rhythm, consistent header treatment.

## 10. Cross-cutting requirements

- Responsive layout: the timeline, writings listing, and projects listing should all degrade gracefully on narrow/mobile widths (for example, the timeline's left-aligned year and right-aligned content can stack vertically on small screens).
- Basic accessibility: visible focus states on links, meaningful alt text fields for all images (photo, timeline images, writing/project images), sensible heading hierarchy.
- Basic SEO/metadata: page title and meta description per page, a favicon, and a social preview image.
- Performance: images should be served at reasonable sizes rather than full original resolution; Astro's built-in image handling should be used for this rather than raw `<img>` tags pointing at unprocessed files.

## 11. Deployment

- GitHub Actions workflow triggers on push to the main branch.
- Workflow installs dependencies, runs the theme-generation step, builds the static site, and deploys the build output through the GitHub Pages deployment action.
- The repository name and base path are not yet finalized (no domain is in place yet). Until a final repo name is chosen, assume the site will be served from the root of its eventual `username.github.io`-style address, but keep the base path as a single configurable value rather than something repeated across multiple files, so it can be changed in one place once the final repo name or a custom domain is decided.

## 12. Build order

1. Project scaffolding: initialize the Astro project, set up the GitHub Actions workflow, and confirm it can deploy an empty placeholder page successfully. Confirms the pipeline end to end before any design work begins.
2. Theme system: create `theme.yaml`, the generation script, the base layout, the nav, and the footer, all wired to the generated CSS variables.
3. About page: intro section, photo, and the timeline component reading from the timeline data file.
4. Writings: content collection setup supporting both markdown and HTML, the listing page, the detail page, and the automatic excerpt logic.
5. Projects: content collection setup, the listing page, and the detail page.
6. Polish pass: responsive check across breakpoints, accessibility check, metadata/favicon/social preview, image optimization pass.
7. Final review and go-live once a repo name and (optionally) a domain are settled.

## 13. Open items to resolve later, not blocking the build

- Final repo name and whether a custom domain will be attached eventually.
- Whether dark mode support gets added down the line.
- Exact accent color and font choices in `theme.yaml` can start with reasonable defaults and be adjusted once the site is running, since changing them later is a one-file edit.
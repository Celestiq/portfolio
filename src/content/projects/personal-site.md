---
title: This site
description: A personal portfolio built with Astro. Editorial minimal design, markdown + HTML writing pipeline, theme controlled from a single YAML file.
link: https://github.com/celestiq
---

Built from scratch using Astro in static output mode. The design goal was an editorial minimal aesthetic — generous whitespace, serif headings, hairline rules, no decorative chrome.

## How it works

The writing pipeline supports both markdown and raw HTML files. Drop a `.md` or `.html` file into the `writings/` folder and it appears in the listing automatically. Excerpts are generated from the first 200 characters if you do not write one by hand.

The entire visual theme — colors, fonts, spacing, border radius — is controlled from a single `theme.yaml` file at the project root. A small Node.js script reads the YAML at build time and generates a CSS custom properties file. Nothing in the templates hardcodes a color or font name.

## Deployed via GitHub Actions

On every push to `main`, GitHub Actions runs the theme generation step and the Astro build, then deploys the output to GitHub Pages.

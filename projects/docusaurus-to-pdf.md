---
title: "docusaurus-to-pdf"
description: "A CLI tool for scraping Docusaurus sites into PDFs."
slug: "docusaurus-to-pdf"
created_at: "2023-06-01"
image: "/images/spreadsheet.png"
tech_stack: ["TypeScript", "HTML", "JavaScript", "Node.js"]
url: "https://github.com/robertjdominguez/docusaurus-to-pdf"
github: "https://github.com/robertjdominguez/docusaurus-to-pdf"
featured: true
---

`docusaurus-to-pdf` is a CLI tool that generates a PDF from a Docusaurus-based documentation website. The tool allows customization of the scraping process via a configuration file or CLI options.

## Why does this exist?

Documentation sites built with Docusaurus are great for web browsing, but sometimes you need offline access or want to distribute documentation in a portable format. This tool solves that problem by intelligently scraping Docusaurus sites and converting them into well-formatted PDFs.

## What it does

- **Flexible Configuration**: Use config files or CLI options
- **Selective Scraping**: Choose specific directories or scrape entire sites
- **Custom Styling**: Override default styles for better PDF formatting
- **Image Handling**: Control lazy loading and image optimization
- **TypeScript Support**: Fully typed for better developer experience

## Usage Examples

### Basic Usage
```bash
npx docusaurus-to-pdf --baseUrl https://hasura.io --entryPoint https://hasura.io/docs/3.0
```

### Advanced Configuration
```bash
npx docusaurus-to-pdf \
  --baseUrl https://hasura.io \
  --entryPoint https://hasura.io/docs/3.0 \
  --directories auth support \
  --customStyles 'table { max-width: 3500px !important }' \
  --output ./output/custom-docs.pdf
```

## Tech Stack

- **TypeScript** - Core functionality with type safety
- **HTML** - DOM manipulation and content extraction
- **JavaScript** - CLI interface and build tools
- **Node.js** - Runtime environment

It works...usually. Which is more than you can say for most side projects that start with "Wouldn't it be cool if..."
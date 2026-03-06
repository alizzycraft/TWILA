# TWILA Documentation Site

This directory contains the VitePress-based static documentation site for TWILA (That's What I'm Looking At).

## Purpose

The docs-site provides comprehensive documentation for TWILA in a single-page format, including:

- Overview and features
- Architecture and Tapestry integration
- Installation instructions
- Development guide and project structure
- API usage examples
- Configuration options
- Troubleshooting guide
- Contributing guidelines

The site is built using VitePress and maintains visual consistency with the Tapestry documentation site while presenting TWILA-specific content.

## Development Workflow

### Prerequisites

- Node.js 18+ (for VitePress)
- npm or pnpm package manager

### Initial Setup

Install dependencies:

```bash
npm install
```

### Development Server

Start the local development server with hot module replacement:

```bash
npm run docs:dev
```

The site will be available at `http://localhost:5173/twila/` (or another port if 5173 is in use).

Changes to markdown files and configuration will automatically reload in the browser.

### Preview Changes

1. Edit content in `docs/index.md` for the landing page
2. Modify configuration in `docs/.vitepress/config.mts` for site settings
3. Update assets in `docs/public/` for images and branding
4. The dev server will automatically reflect your changes

## Production Build

### Build Static Site

Generate the production-ready static site:

```bash
npm run docs:build
```

This command:
- Compiles all markdown to HTML
- Optimizes assets (images, CSS, JavaScript)
- Generates search index
- Outputs files to `docs/.vitepress/dist/`

### Preview Production Build

Test the production build locally:

```bash
npm run docs:preview
```

The production site will be served at `http://localhost:4173/twila/` for verification before deployment.

## Deployment

### Build Output

The production build generates static files in `docs/.vitepress/dist/`:

```
docs/.vitepress/dist/
├── index.html           # Landing page
├── assets/              # Optimized CSS, JS, images
├── logo.jpg             # TWILA logo
├── banner.jpg           # Hero banner
└── ...                  # Additional VitePress assets
```

### Deployment Options

**GitHub Pages:**
```bash
# Build the site
npm run docs:build

# Deploy to GitHub Pages (example)
# Configure base URL in config.mts to match your repository
```

**Static Hosting:**
- Upload the entire `docs/.vitepress/dist/` directory to your hosting provider
- Ensure the base URL in `config.mts` matches your deployment path
- Configure your server to serve `index.html` for the root path

**Netlify/Vercel:**
- Build command: `npm run docs:build`
- Publish directory: `docs/.vitepress/dist`
- Base URL: Configure in `config.mts`

## Project Structure

```
twila/docs-site/
├── package.json                    # Dependencies and scripts
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts             # Site configuration
│   │   ├── theme/                 # Custom theme files
│   │   │   ├── index.ts           # Theme entry point
│   │   │   ├── Layout.vue         # Custom layout
│   │   │   └── style.css          # Custom styles
│   │   ├── cache/                 # Build cache (generated)
│   │   └── dist/                  # Build output (generated)
│   ├── public/
│   │   ├── logo.jpg               # TWILA logo
│   │   ├── banner.jpg             # Hero banner
│   │   └── favicon*.png           # Favicons
│   └── index.md                   # Landing page content
└── README.md                      # This file
```

## Configuration

### Site Metadata

Edit `docs/.vitepress/config.mts` to modify:

- Site title and description
- Base URL for deployment
- Navigation links
- GitHub repository links
- Search configuration
- Theme settings

### Content

Edit `docs/index.md` to update:

- Hero section (title, tagline, banner)
- Feature cards
- Documentation sections
- Code examples
- Links and references

### Branding

Replace assets in `docs/public/`:

- `logo.jpg` - Site logo (displayed in header)
- `banner.jpg` - Hero banner (displayed on landing page)
- `favicon*.png` - Browser favicons

## Customization Notes

This documentation site is based on the Tapestry docs-site structure with the following modifications:

### Structural Changes

**Removed Directories:**
- `docs/api/` - API reference pages (not needed for single-page docs)
- `docs/guide/` - Multi-page guide sections (consolidated into landing page)
- `docs/mods/` - Mods listing pages (not applicable to TWILA)
- `scripts/` - TypeDoc generation and validation scripts
- `tests/` - Tapestry-specific test files
- `typedoc.json` - TypeDoc configuration file
- `validate-api-docs.js` - API documentation validation script

**Preserved Structure:**
- `docs/.vitepress/` - Complete VitePress configuration and theme
- `docs/public/` - Public assets directory
- `.gitignore` - Git ignore rules
- Core build system and VitePress setup

### Configuration Changes (`docs/.vitepress/config.mts`)

**Modified Settings:**
- `logo`: Changed from `/logo.png` to `/logo.jpg` (TWILA logo format)
- `nav`: Removed multi-page navigation items (Guides, API, Mods) and empty placeholder items
- `sidebar`: Set to `undefined` (no sidebar needed for single-page layout)
- `socialLinks`: Updated GitHub link to point to TWILA subdirectory (`/tree/main/twila`)
- `editLink.pattern`: Updated to TWILA docs-site path (`/edit/main/twila/docs-site/docs/:path`)

**Preserved Settings:**
- Site title and description (already TWILA-specific in Tapestry config)
- Base URL (`/twila/`)
- Build configuration (output directory, cache directory, dead link handling)
- Asset optimization (inline limit, chunk size warnings, asset includes)
- Favicon configuration
- Search configuration (local provider with detailed view)
- All Vite build settings

### Package Configuration (`package.json`)

**Modified:**
- `name`: Changed from "tapestry-docs" to "twila-docs"
- `description`: Changed to TWILA-specific description
- `scripts`: Removed TypeDoc-related scripts (`gen-api`, `validate-typedoc`, `fix-api-syntax`) and utility scripts (`test:search`, `test:responsive`, `validate:links`, `verify:contrast`, `verify:deployment`)
- `devDependencies`: Removed TypeDoc dependencies (`typedoc`, `typedoc-plugin-markdown`, `typescript`) and utility dependencies (`sharp`, `png-to-ico`)
- `keywords`: Changed from Tapestry to TWILA keywords

**Preserved:**
- Core build scripts (`docs:dev`, `docs:build`, `docs:preview`)
- VitePress dependency
- Package structure and configuration

### Content Changes

**New Content:**
- `docs/index.md` - Complete TWILA landing page with hero section, features, and comprehensive documentation adapted from TWILA README
- `docs/public/logo.jpg` - TWILA logo (copied from `twila/docs/twila-logo.jpg`)
- `docs/public/banner.jpg` - TWILA hero banner (copied from `twila/docs/banner.jpg`)

**Preserved Content:**
- Favicon files (favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon.svg)

### Theme Preservation

**Unchanged Files (byte-for-byte identical to Tapestry):**
- `docs/.vitepress/theme/Layout.vue` - Custom layout component
- `docs/.vitepress/theme/style.css` - Custom styles and CSS variables
- `docs/.vitepress/theme/index.ts` - Theme entry point
- `docs/.vitepress/theme/enhanceApp.ts` - Vue app enhancements (if present)

These theme files are intentionally preserved without modification to maintain visual consistency with the Tapestry documentation ecosystem.

### Asset Replacement Process

To replace TWILA branding assets:

1. **Logo**: Replace `docs/public/logo.jpg` with your logo image
   - Referenced in config as `logo: '/logo.jpg'`
   - Displayed in the site header
   - Recommended size: 40-50px height

2. **Banner**: Replace `docs/public/banner.jpg` with your hero banner
   - Referenced in `docs/index.md` frontmatter as `hero.image.src: '/banner.jpg'`
   - Displayed on the landing page hero section
   - Recommended size: 1200x600px or similar aspect ratio

3. **Favicons** (optional): Replace favicon files in `docs/public/`
   - `favicon.ico` - Legacy favicon
   - `favicon-16x16.png` - Small favicon
   - `favicon-32x32.png` - Medium favicon
   - `favicon.svg` - Modern vector favicon

All asset paths in configuration use absolute paths starting with `/` to reference the public directory.

## Troubleshooting

### Development Server Issues

**Port already in use:**
- VitePress will automatically try the next available port
- Or specify a custom port: `vitepress dev docs --port 3000`

**Changes not reflecting:**
- Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R)
- Clear VitePress cache: `rm -rf docs/.vitepress/cache`
- Restart the dev server

### Build Issues

**Build fails with TypeScript errors:**
- Check `config.mts` syntax
- Ensure all imports are valid
- Verify TypeScript is installed: `npm list typescript`

**Missing assets in build:**
- Verify assets exist in `docs/public/`
- Check asset references in `index.md` and `config.mts`
- Ensure paths start with `/` for public directory assets

**Search not working:**
- Rebuild the site to regenerate search index
- Check that search provider is set to "local" in config
- Verify content has searchable text

## Additional Resources

- [VitePress Documentation](https://vitepress.dev/)
- [TWILA Main README](../README.md)
- [Tapestry Documentation](../../tapestry/docs-site/)

## License

This documentation site follows the same license as TWILA: AGPL-3.0

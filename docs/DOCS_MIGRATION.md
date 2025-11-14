# Documentation Migration to VitePress

This document explains the new documentation structure and how to use it.

## What Changed?

### Before

Documentation was scattered across the repository:

```
mcp-tools/
├── BIOME_SETUP.md
├── BIOME_MIGRATION.md
├── CHANGESETS.md
├── CHANGESETS_DEMO.md
├── GETTING_STARTED.md
├── INSTALLATION.md
├── QUICK_START.md
├── T3_ENV_MIGRATION.md
├── VITEST_SETUP.md
├── VITEST_DEMO.md
├── PROJECT_SUMMARY.md
└── packages/whoop-mcp/
    ├── README.md
    ├── docs/T3_ENV_SETUP.md
    └── scripts/get-refresh-token.md
```

### After

All documentation is centralized in `/docs` with VitePress:

```
mcp-tools/
├── docs/
│   ├── .vitepress/config.ts    # Site configuration
│   ├── index.md                # Homepage
│   ├── guide/                  # User guides
│   │   ├── getting-started.md
│   │   ├── installation.md
│   │   ├── quick-start.md
│   │   ├── testing.md
│   │   ├── linting.md
│   │   └── versioning.md
│   ├── packages/               # Package docs
│   │   └── whoop-mcp/
│   │       ├── index.md
│   │       ├── getting-started.md
│   │       ├── oauth-setup.md
│   │       ├── configuration.md
│   │       └── tools.md
│   └── reference/              # Reference docs
│       ├── structure.md
│       └── contributing.md
└── README.md                   # Minimal root README
```

## Benefits

### 🎨 Beautiful UI

VitePress provides a modern, professional documentation site:
- Clean, responsive design
- Dark mode support
- Syntax highlighting
- Search functionality
- Mobile-friendly

### 🚀 Fast Performance

- Instant page loads
- Hot module replacement during development
- Static site generation for production
- Optimized for SEO

### 🔍 Better Navigation

- Sidebar navigation
- Breadcrumbs
- Table of contents
- Previous/next links
- Search

### 📝 Enhanced Markdown

- Vue components in markdown
- Code groups
- Custom containers
- Line highlighting
- Import code snippets

### 🎯 Centralized

- All docs in one place
- Consistent structure
- Easy to maintain
- Clear organization

## Using the Documentation

### Development

Start the docs dev server:

```bash
pnpm docs:dev
```

This opens `http://localhost:5173` with:
- Hot reload on changes
- Instant updates
- Error reporting

### Building

Build the static site:

```bash
pnpm docs:build
```

Output goes to `docs/.vitepress/dist/`.

### Preview

Preview the built site:

```bash
pnpm docs:preview
```

## Writing Documentation

### Creating a New Page

1. Create a markdown file in the appropriate directory:
   ```bash
   touch docs/guide/my-new-guide.md
   ```

2. Add frontmatter (optional):
   ```markdown
   ---
   title: My New Guide
   description: A guide about something
   ---
   
   # My New Guide
   
   Content here...
   ```

3. Update the sidebar in `docs/.vitepress/config.ts`:
   ```typescript
   sidebar: {
     "/guide/": [
       {
         text: "Getting Started",
         items: [
           { text: "My New Guide", link: "/guide/my-new-guide" }
         ]
       }
     ]
   }
   ```

### Markdown Features

#### Code Blocks

````markdown
```typescript
function hello() {
  console.log("Hello, world!");
}
```
````

#### Line Highlighting

````markdown
```typescript{2,4-6}
function hello() {
  console.log("Hello");  // highlighted
  const x = 1;
  const y = 2;           // highlighted
  const z = 3;           // highlighted
  return x + y + z;      // highlighted
}
```
````

#### Code Groups

````markdown
::: code-group

```bash [pnpm]
pnpm install
```

```bash [npm]
npm install
```

```bash [yarn]
yarn install
```

:::
````

#### Custom Containers

```markdown
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger message
:::

::: info
This is an info box
:::
```

#### Links

```markdown
[Internal Link](/guide/getting-started)
[External Link](https://example.com)
[Anchor Link](#section)
```

## Configuration

### Site Config

Edit `docs/.vitepress/config.ts`:

```typescript
export default defineConfig({
  title: "MCP Tools",
  description: "Model Context Protocol servers",
  
  themeConfig: {
    nav: [...],
    sidebar: {...},
    socialLinks: [...],
  }
});
```

### Sidebar

Organize pages in the sidebar:

```typescript
sidebar: {
  "/guide/": [
    {
      text: "Section Name",
      items: [
        { text: "Page Title", link: "/guide/page" }
      ]
    }
  ]
}
```

### Navigation

Top navigation bar:

```typescript
nav: [
  { text: "Home", link: "/" },
  { text: "Guide", link: "/guide/getting-started" },
  {
    text: "Dropdown",
    items: [
      { text: "Item 1", link: "/item1" },
      { text: "Item 2", link: "/item2" }
    ]
  }
]
```

## Deployment

### GitHub Pages

1. Build the docs:
   ```bash
   pnpm docs:build
   ```

2. Deploy the `docs/.vitepress/dist` directory

### Netlify

1. Set build command: `pnpm docs:build`
2. Set publish directory: `docs/.vitepress/dist`

### Vercel

1. Set build command: `pnpm docs:build`
2. Set output directory: `docs/.vitepress/dist`

## Migration Guide

### For Contributors

When adding new documentation:

1. ✅ **DO** add to `/docs` directory
2. ✅ **DO** update VitePress sidebar
3. ✅ **DO** use proper markdown formatting
4. ❌ **DON'T** add random markdown files to root
5. ❌ **DON'T** create package-level docs (except README)

### For Maintainers

Old documentation files can be:
- ✅ Moved to `/docs` (already done)
- ✅ Deleted if redundant
- ✅ Kept if needed for other purposes

## Best Practices

### File Organization

```
docs/
├── guide/          # User-facing guides
├── packages/       # Package-specific docs
├── reference/      # Technical reference
└── api/            # API documentation (future)
```

### Naming

- Use `kebab-case.md` for files
- Use descriptive names: `oauth-setup.md` not `oauth.md`
- Group related docs in directories

### Content

- Start with a clear title (H1)
- Use descriptive headings (H2, H3)
- Include code examples
- Add links to related pages
- Keep it concise and scannable

### Links

- Use relative links: `/guide/getting-started`
- Not absolute: `https://example.com/guide/getting-started`
- Check links work in dev mode

## Troubleshooting

### "Page not found"

Check:
1. File exists in `/docs`
2. Link path is correct
3. Sidebar config is updated

### "Sidebar not showing"

Check:
1. Sidebar config in `config.ts`
2. Path matches exactly
3. No typos in links

### "Styles not loading"

Try:
1. Restart dev server
2. Clear cache: `rm -rf docs/.vitepress/cache`
3. Rebuild: `pnpm docs:build`

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Vue Components in Markdown](https://vitepress.dev/guide/using-vue)

## Questions?

- Check [VitePress docs](https://vitepress.dev/)
- Open an issue
- Ask in discussions

---

**The documentation is now centralized, beautiful, and easy to maintain!** 🎉


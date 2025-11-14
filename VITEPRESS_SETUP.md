# VitePress Documentation Setup

This project now uses **VitePress** for centralized, beautiful documentation!

## What is VitePress?

VitePress is a static site generator powered by Vite and Vue. It's:

- ⚡ **Lightning fast** - Instant hot reload, optimized builds
- 🎨 **Beautiful** - Modern UI with dark mode
- 📝 **Markdown-based** - Write docs in markdown
- 🔍 **Searchable** - Built-in local search
- 📱 **Responsive** - Works great on mobile
- 🎯 **Vue-powered** - Use Vue components in markdown

## Quick Start

### Start Dev Server

```bash
pnpm docs:dev
```

Opens `http://localhost:5173` with hot reload.

### Build for Production

```bash
pnpm docs:build
```

Output: `docs/.vitepress/dist/`

### Preview Build

```bash
pnpm docs:preview
```

## Documentation Structure

```
docs/
├── .vitepress/
│   └── config.ts              # Site configuration
├── index.md                   # Homepage
├── guide/                     # User guides
│   ├── getting-started.md
│   ├── installation.md
│   ├── quick-start.md
│   ├── testing.md
│   ├── linting.md
│   └── versioning.md
├── packages/                  # Package-specific docs
│   └── whoop-mcp/
│       ├── index.md
│       ├── getting-started.md
│       ├── oauth-setup.md
│       ├── configuration.md
│       └── tools.md
└── reference/                 # Reference docs
    ├── structure.md
    └── contributing.md
```

## Features

### Homepage

Beautiful hero section with features:

```markdown
---
layout: home

hero:
  name: "MCP Tools"
  text: "Model Context Protocol Servers"
  tagline: Connect AI assistants to real-world services
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started

features:
  - icon: 🏃
    title: WHOOP Integration
    details: Access your WHOOP fitness data
---
```

### Navigation

Top nav bar and sidebar:

- **Nav**: Global navigation
- **Sidebar**: Section-specific navigation
- **Search**: Built-in local search
- **Mobile**: Responsive hamburger menu

### Markdown Features

- **Code highlighting**: Automatic syntax highlighting
- **Line numbers**: Show line numbers in code blocks
- **Code groups**: Tabbed code examples
- **Custom containers**: Tip, warning, danger, info boxes
- **Vue components**: Use Vue in markdown

### Search

Built-in local search:
- Searches all pages
- Instant results
- Keyboard shortcuts
- Mobile-friendly

## Configuration

### Site Config

`docs/.vitepress/config.ts`:

```typescript
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "MCP Tools",
  description: "Model Context Protocol servers",
  
  themeConfig: {
    nav: [...],
    sidebar: {...},
    socialLinks: [...],
    search: {
      provider: "local"
    }
  }
});
```

### Sidebar

Organized by section:

```typescript
sidebar: {
  "/guide/": [
    {
      text: "Getting Started",
      items: [
        { text: "Introduction", link: "/guide/getting-started" },
        { text: "Installation", link: "/guide/installation" }
      ]
    }
  ]
}
```

### Theme

Customizable theme:
- Colors
- Fonts
- Layout
- Components

## Writing Docs

### Create a Page

1. Create markdown file:
   ```bash
   touch docs/guide/my-page.md
   ```

2. Add content:
   ```markdown
   # My Page
   
   This is my page content.
   ```

3. Update sidebar in `config.ts`

### Markdown Syntax

#### Code Blocks

````markdown
```typescript
function hello() {
  console.log("Hello!");
}
```
````

#### Line Highlighting

````markdown
```typescript{2}
function hello() {
  console.log("Hello!");  // highlighted
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

:::
````

#### Custom Containers

```markdown
::: tip
This is a tip
:::

::: warning
Be careful!
:::

::: danger
Danger zone!
:::
```

#### Links

```markdown
[Internal](/guide/getting-started)
[External](https://example.com)
```

## Deployment

### GitHub Pages

1. Build: `pnpm docs:build`
2. Deploy `docs/.vitepress/dist`

### Netlify

- Build command: `pnpm docs:build`
- Publish directory: `docs/.vitepress/dist`

### Vercel

- Build command: `pnpm docs:build`
- Output directory: `docs/.vitepress/dist`

## Benefits

### Before (Scattered Markdown)

- ❌ Files all over the repo
- ❌ No navigation
- ❌ No search
- ❌ Inconsistent formatting
- ❌ Hard to find information

### After (VitePress)

- ✅ Centralized in `/docs`
- ✅ Beautiful navigation
- ✅ Built-in search
- ✅ Consistent styling
- ✅ Easy to browse

## Comparison

| Feature | Scattered MD | VitePress |
|---------|-------------|-----------|
| Navigation | ❌ None | ✅ Sidebar + Nav |
| Search | ❌ None | ✅ Built-in |
| Mobile | ❌ Basic | ✅ Responsive |
| Dark Mode | ❌ No | ✅ Yes |
| Performance | ❌ N/A | ✅ Instant |
| Maintenance | ❌ Hard | ✅ Easy |

## Why VitePress?

### vs. Docusaurus

- ✅ **Faster** - Vite vs Webpack
- ✅ **Simpler** - Less config
- ✅ **Modern** - Vue 3 vs React
- ✅ **Lighter** - Smaller bundle

### vs. MkDocs

- ✅ **JavaScript ecosystem** - Better for TS projects
- ✅ **Vue components** - Interactive docs
- ✅ **Vite** - Instant HMR
- ✅ **Modern UI** - Better default theme

### vs. Starlight (Astro)

- ✅ **Vue** - Familiar if using Vue
- ✅ **Vite** - Same as Vitest
- ✅ **Simpler** - Less to learn
- ❌ **Astro** - Starlight has more features

### vs. Mintlify

- ✅ **Open source** - No vendor lock-in
- ✅ **Self-hosted** - Full control
- ✅ **Free** - No costs
- ❌ **Features** - Mintlify has more integrations

## Best Practices

### Organization

- `/guide` - User guides and tutorials
- `/packages` - Package-specific docs
- `/reference` - API reference and technical docs

### Naming

- Use `kebab-case.md`
- Be descriptive: `oauth-setup.md` not `oauth.md`
- Group related docs in directories

### Content

- Start with clear H1 title
- Use descriptive headings
- Include code examples
- Link to related pages
- Keep it scannable

### Maintenance

- Update docs with code changes
- Keep sidebar organized
- Check links regularly
- Remove outdated content

## Tips

### Hot Reload

Changes to markdown files reload instantly. Changes to `config.ts` require restart.

### Search

Search indexes all pages automatically. No configuration needed.

### Dark Mode

Users can toggle dark mode. Syntax highlighting adapts automatically.

### Mobile

Sidebar becomes hamburger menu on mobile. All features work on mobile.

## Troubleshooting

### Port Already in Use

Change port in `config.ts`:

```typescript
export default defineConfig({
  vite: {
    server: {
      port: 3000
    }
  }
});
```

### Build Errors

Clear cache:

```bash
rm -rf docs/.vitepress/cache
pnpm docs:build
```

### Broken Links

Check:
1. File exists
2. Path is correct (case-sensitive)
3. No typos

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [VitePress GitHub](https://github.com/vuejs/vitepress)
- [Markdown Guide](https://www.markdownguide.org/)
- [Vue Documentation](https://vuejs.org/)

## Next Steps

1. ✅ VitePress is installed and configured
2. ✅ All docs are migrated to `/docs`
3. ✅ Beautiful homepage and navigation
4. 📝 Run `pnpm docs:dev` to see it in action
5. 📝 Add more docs as you build features

---

**Your documentation is now centralized, beautiful, and easy to maintain!** 🎉


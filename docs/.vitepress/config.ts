import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MCP Tools",
  description: "Model Context Protocol servers for AI assistants like Poke",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Packages", link: "/packages/whoop-mcp/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/guide/getting-started" },
            { text: "Installation", link: "/guide/installation" },
            { text: "Quick Start", link: "/guide/quick-start" },
          ],
        },
        {
          text: "Development",
          items: [
            { text: "Testing", link: "/guide/testing" },
            { text: "Linting & Formatting", link: "/guide/linting" },
            { text: "Versioning", link: "/guide/versioning" },
          ],
        },
      ],
      "/packages/": [
        {
          text: "Packages",
          items: [
            {
              text: "WHOOP MCP",
              link: "/packages/whoop-mcp/",
            },
          ],
        },
        {
          text: "WHOOP MCP",
          items: [
            {
              text: "Overview",
              link: "/packages/whoop-mcp/",
            },
            {
              text: "Getting Started",
              link: "/packages/whoop-mcp/getting-started",
            },
            {
              text: "OAuth Setup",
              link: "/packages/whoop-mcp/oauth-setup",
            },
            {
              text: "Configuration",
              link: "/packages/whoop-mcp/configuration",
            },
            {
              text: "Available Tools",
              link: "/packages/whoop-mcp/tools",
            },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "Project Structure", link: "/reference/structure" },
            { text: "Contributing", link: "/reference/contributing" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/yourusername/mcp-tools",
      },
    ],

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/yourusername/mcp-tools/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present",
    },
  },

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    lineNumbers: true,
  },
});

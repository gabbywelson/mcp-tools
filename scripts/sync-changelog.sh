#!/bin/bash

# Sync CHANGELOG to docs
# This script copies package CHANGELOGs to the docs site

set -e

echo "📝 Syncing changelogs to docs..."

# Create changelog header
cat > docs/changelog.md << 'EOF'
# Changelog

All notable changes to this project will be documented in this file.

EOF

# Add WHOOP MCP changelog if it exists
if [ -f "packages/whoop-mcp/CHANGELOG.md" ]; then
  echo "## @mcp-tools/whoop-mcp" >> docs/changelog.md
  echo "" >> docs/changelog.md
  tail -n +2 packages/whoop-mcp/CHANGELOG.md >> docs/changelog.md
  echo "" >> docs/changelog.md
fi

# Add footer
cat >> docs/changelog.md << 'EOF'

---

## How Versioning Works

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

### For Users

- **Patch** (0.0.X) - Bug fixes and minor improvements
- **Minor** (0.X.0) - New features, backwards compatible
- **Major** (X.0.0) - Breaking changes

### For Contributors

When you make changes:

1. Run `pnpm changeset` to document your changes
2. Select the affected package(s)
3. Choose the version bump type (patch/minor/major)
4. Write a summary of your changes

See the [Versioning Guide](/guide/versioning) for details.

### Release Process

When maintainers are ready to release:

1. `pnpm version` - Consumes changesets and updates versions
2. `pnpm release` - Publishes to npm and creates git tags

The changelog is automatically generated from changesets!

---

::: tip
This changelog is automatically updated when versions are released. Check back after each release to see what's new!
:::
EOF

echo "✅ Changelog synced to docs/changelog.md"


# Versioning

This project follows [Semantic Versioning](https://semver.org/) (SemVer) principles.

## Semantic Versioning

Version numbers follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR** (X.0.0) - Breaking changes that require user action
- **MINOR** (0.X.0) - New features, backwards compatible
- **PATCH** (0.0.X) - Bug fixes, minor improvements

## Version Workflow

### For Contributors

When making changes, document them clearly in your pull request description:

1. **Describe your changes** - What did you add, fix, or change?
2. **Indicate the type** - Is it a bug fix, new feature, or breaking change?
3. **Update documentation** - Keep READMEs and docs in sync

### For Maintainers

When ready to release a new version:

#### 1. Update Version Numbers

Update the version in the affected package's `package.json`:

```bash
cd packages/whoop-mcp
# Edit package.json version field
```

#### 2. Document Changes

Update the package README with notable changes:

```markdown
## Recent Changes

### v1.2.0 (2024-11-14)
- Added new healthspan analysis tool
- Fixed token refresh race condition
- Improved error messages
```

#### 3. Commit and Tag

```bash
git add .
git commit -m "chore: release @mcp-tools/whoop-mcp@1.2.0"
git tag @mcp-tools/whoop-mcp@1.2.0
git push origin main --tags
```

#### 4. Publish (Optional)

If publishing to npm:

```bash
cd packages/whoop-mcp
pnpm build
npm publish
```

## Version Types

### Patch Release (0.0.X)

**When to use:**
- Bug fixes
- Documentation updates
- Internal refactoring
- Performance improvements (no API changes)

**Example:**
```bash
# Before: 1.2.3
# After:  1.2.4
```

### Minor Release (0.X.0)

**When to use:**
- New features
- New tools or functionality
- Backwards-compatible API additions
- Deprecations (with backwards compatibility)

**Example:**
```bash
# Before: 1.2.3
# After:  1.3.0
```

### Major Release (X.0.0)

**When to use:**
- Breaking API changes
- Removed functionality
- Changed behavior that breaks existing code
- Major architectural changes

**Example:**
```bash
# Before: 1.2.3
# After:  2.0.0
```

## Best Practices

### Clear Communication

When releasing, clearly communicate:
- What changed
- Why it changed
- How users should update (if breaking)

### Git Tags

Use descriptive tags:
```bash
# Good
@mcp-tools/whoop-mcp@1.2.0

# Also acceptable for monorepo releases
v1.2.0
```

### Changelog Format

Keep a simple changelog in package READMEs:

```markdown
## Changelog

### v1.3.0 (2024-11-14)
**New Features:**
- Added healthspan analysis tool
- Support for workout heart rate zones

**Bug Fixes:**
- Fixed token refresh timing issue

**Documentation:**
- Updated OAuth setup guide

### v1.2.1 (2024-11-10)
**Bug Fixes:**
- Fixed error handling in recovery tool
```

## Release Checklist

Before releasing:

- [ ] All tests pass (`pnpm test:run`)
- [ ] Code is formatted and linted (`pnpm check`)
- [ ] Documentation is updated
- [ ] Version number is updated in `package.json`
- [ ] Changes are documented in README
- [ ] Git tag is created
- [ ] Changes are pushed to GitHub

## Multiple Packages

When releasing multiple packages:

1. Update each package version independently
2. Tag each package separately
3. Document changes in each package's README

```bash
# Release whoop-mcp
git tag @mcp-tools/whoop-mcp@1.2.0

# Release ynab-mcp
git tag @mcp-tools/ynab-mcp@1.0.0

# Push all tags
git push origin --tags
```

## Pre-releases

For testing before official release:

```bash
# Alpha release
1.3.0-alpha.1

# Beta release
1.3.0-beta.1

# Release candidate
1.3.0-rc.1
```

Example:
```bash
# Update package.json to 1.3.0-beta.1
git tag @mcp-tools/whoop-mcp@1.3.0-beta.1
npm publish --tag beta
```

## Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## Questions?

- Check existing releases for examples
- Ask in PR comments
- See [Contributing Guide](/reference/contributing)

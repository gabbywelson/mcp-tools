# Using Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs in our monorepo.

## What is Changesets?

Changesets is a tool that helps us:
- 📝 Document changes in a structured way
- 🔢 Automatically version packages based on changes
- 📋 Generate changelogs automatically
- 🚀 Coordinate releases across multiple packages

## Workflow

### 1. Make Your Changes

Work on your feature/fix as normal:

```bash
# Make code changes
git checkout -b feature/my-new-feature
# ... edit files ...
```

### 2. Add a Changeset

Before committing, create a changeset to document your changes:

```bash
pnpm changeset
```

This will prompt you with:

**Which packages would you like to include?**
- Select the packages your changes affect (e.g., `@mcp-tools/whoop-mcp`)
- Use space to select, enter to confirm

**What kind of change is this?**
- **patch** (0.0.X) - Bug fixes, minor tweaks
- **minor** (0.X.0) - New features, backwards compatible
- **major** (X.0.0) - Breaking changes

**Summary**
- Write a brief description of your change
- This will appear in the changelog

Example:
```
🦋  Which packages would you like to include? 
◉ @mcp-tools/whoop-mcp

🦋  What kind of change is this for @mcp-tools/whoop-mcp? 
❯ patch

🦋  Please enter a summary for this change:
Fix OAuth token refresh logic to handle expired tokens correctly
```

This creates a file in `.changeset/` like `.changeset/funny-pandas-jump.md`:

```md
---
"@mcp-tools/whoop-mcp": patch
---

Fix OAuth token refresh logic to handle expired tokens correctly
```

### 3. Commit Everything

Commit both your code changes AND the changeset file:

```bash
git add .
git commit -m "fix: handle expired OAuth tokens"
git push
```

### 4. Create Pull Request

Create a PR as normal. The changeset file will be reviewed along with your code.

## Releasing (Maintainers Only)

When ready to release:

### 1. Version Packages

```bash
pnpm version
```

This will:
- Consume all changesets in `.changeset/`
- Update package versions in `package.json`
- Update `CHANGELOG.md` files
- Delete the consumed changeset files

Review the changes:
```bash
git diff
```

Commit the version changes:
```bash
git add .
git commit -m "chore: version packages"
git push
```

### 2. Publish Packages

```bash
pnpm release
```

This will:
- Build all packages
- Publish to npm (if configured)
- Create git tags

### 3. Create GitHub Release

After publishing, create a GitHub release:
- Tag: `@mcp-tools/whoop-mcp@1.2.3`
- Title: `@mcp-tools/whoop-mcp v1.2.3`
- Description: Copy from CHANGELOG.md

## Examples

### Example 1: Bug Fix

```bash
# Make your fix
# ...

pnpm changeset
# Select: @mcp-tools/whoop-mcp
# Type: patch
# Summary: "Fix token expiration check"

git add .
git commit -m "fix: token expiration check"
```

### Example 2: New Feature

```bash
# Add new feature
# ...

pnpm changeset
# Select: @mcp-tools/whoop-mcp
# Type: minor
# Summary: "Add support for workout heart rate zones"

git add .
git commit -m "feat: add workout heart rate zones"
```

### Example 3: Breaking Change

```bash
# Make breaking change
# ...

pnpm changeset
# Select: @mcp-tools/whoop-mcp
# Type: major
# Summary: "BREAKING: Change config format to use T3 Env"

git add .
git commit -m "feat!: migrate to T3 Env config"
```

## Multiple Changesets

You can add multiple changesets in one PR if you have multiple logical changes:

```bash
# Add first changeset
pnpm changeset
# Summary: "Add new sleep analysis tool"

# Add second changeset
pnpm changeset
# Summary: "Fix recovery score calculation"

# Commit all changesets
git add .changeset/
git commit -m "feat: sleep analysis and recovery fix"
```

## Changeset Commands

```bash
# Add a new changeset
pnpm changeset

# Add a changeset (alias)
pnpm changeset add

# Check status of changesets
pnpm changeset status

# Version packages (consumes changesets)
pnpm version

# Publish packages
pnpm release
```

## Configuration

Changesets is configured in `.changeset/config.json`:

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

Key settings:
- `access: "public"` - Packages are public on npm
- `commit: false` - We manually commit version changes
- `baseBranch: "main"` - Compare against main branch
- `updateInternalDependencies: "patch"` - Bump internal deps as patches

## Benefits

### For Contributors
- ✅ Clear documentation of what changed
- ✅ Automatic changelog generation
- ✅ No need to manually update versions
- ✅ Semantic versioning enforced

### For Maintainers
- ✅ One command to version all packages
- ✅ Coordinated releases across packages
- ✅ Professional changelogs
- ✅ Git tags automatically created

### For Users
- ✅ Clear release notes
- ✅ Semantic versioning
- ✅ Easy to see what changed
- ✅ Breaking changes clearly marked

## Tips

### Good Changeset Summaries

**Good** ✅
```
Add support for WHOOP 4.0 healthspan data
Fix token refresh race condition
BREAKING: Rename config.loadConfig() to config.load()
```

**Bad** ❌
```
Update code
Fix bug
Changes
```

### When to Skip Changesets

You don't need a changeset for:
- Documentation updates
- Test changes
- Internal refactoring (no API changes)
- CI/CD configuration
- Development tooling

For these, just commit normally without a changeset.

### Changeset File Names

Changesets auto-generates fun names like:
- `funny-pandas-jump.md`
- `brave-lions-sing.md`
- `tiny-cats-dance.md`

These are just identifiers - the content is what matters!

## Troubleshooting

### "No changesets present"

You forgot to add a changeset. Run:
```bash
pnpm changeset
```

### "Changeset already exists"

You've already added a changeset. Either:
- Edit the existing changeset file
- Add another changeset for a different change

### "Version conflict"

Someone else released while you were working. Rebase:
```bash
git pull --rebase origin main
```

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Questions?

- Check `.changeset/README.md` for quick reference
- Ask in PR comments
- See examples in past PRs


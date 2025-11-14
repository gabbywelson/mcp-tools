# Changesets Demo & Quick Start

## What You Just Got

Changesets is now fully integrated into your monorepo! Here's what was set up:

### 📦 Installed
- `@changesets/cli` - The core changesets tool
- Configuration in `.changeset/config.json`
- Scripts in root `package.json`

### 🛠️ Available Commands

```bash
# Add a changeset (do this before committing code changes)
pnpm changeset

# Check changeset status
pnpm changeset status

# Version packages (consumes changesets, updates versions)
pnpm version

# Build and publish (for releases)
pnpm release
```

## Quick Example

Let's walk through a typical workflow:

### 1. You Make a Change

```bash
# Create a branch
git checkout -b fix/oauth-token-expiry

# Make your changes to code
# ... edit packages/whoop-mcp/src/whoop-client.ts ...
```

### 2. Add a Changeset

```bash
pnpm changeset
```

**Interactive prompts:**

```
🦋  Which packages would you like to include?
◉ @mcp-tools/whoop-mcp

🦋  What kind of change is this for @mcp-tools/whoop-mcp?
❯ patch

🦋  Please enter a summary for this change:
Fix OAuth token refresh to properly handle expiration edge cases
```

**Result:** Creates `.changeset/funny-pandas-jump.md`:

```markdown
---
"@mcp-tools/whoop-mcp": patch
---

Fix OAuth token refresh to properly handle expiration edge cases
```

### 3. Commit Everything

```bash
git add .
git commit -m "fix: oauth token expiration handling"
git push origin fix/oauth-token-expiry
```

### 4. Create PR

Your PR now includes:
- Your code changes
- The changeset file (`.changeset/funny-pandas-jump.md`)

### 5. When Ready to Release (Maintainer)

```bash
# Consume changesets and update versions
pnpm version

# This updates:
# - packages/whoop-mcp/package.json (version bump)
# - packages/whoop-mcp/CHANGELOG.md (new entry)
# - Deletes .changeset/funny-pandas-jump.md

# Commit version changes
git add .
git commit -m "chore: version packages"
git push

# Publish to npm (if configured)
pnpm release
```

## Real-World Scenarios

### Scenario 1: Bug Fix

```bash
# Fix a bug
# ... edit code ...

pnpm changeset
# Select: @mcp-tools/whoop-mcp
# Type: patch (0.0.X)
# Summary: "Fix race condition in token refresh"

git add .
git commit -m "fix: token refresh race condition"
```

**Result:** Version bumps from `1.0.0` → `1.0.1`

### Scenario 2: New Feature

```bash
# Add new feature
# ... add new tool ...

pnpm changeset
# Select: @mcp-tools/whoop-mcp
# Type: minor (0.X.0)
# Summary: "Add support for WHOOP 4.0 healthspan metrics"

git add .
git commit -m "feat: add healthspan metrics support"
```

**Result:** Version bumps from `1.0.1` → `1.1.0`

### Scenario 3: Breaking Change

```bash
# Make breaking change
# ... change API ...

pnpm changeset
# Select: @mcp-tools/whoop-mcp
# Type: major (X.0.0)
# Summary: "BREAKING: Rename config.loadConfig() to config.load()"

git add .
git commit -m "feat!: simplify config API"
```

**Result:** Version bumps from `1.1.0` → `2.0.0`

### Scenario 4: Multiple Changes in One PR

```bash
# Make multiple distinct changes
# ... add feature A ...
pnpm changeset
# Summary: "Add sleep stage analysis"

# ... fix bug B ...
pnpm changeset
# Summary: "Fix recovery score calculation"

git add .
git commit -m "feat: sleep analysis and recovery fix"
```

**Result:** Two separate changelog entries

## What Gets Generated

### Before Release

Your `.changeset/` folder contains pending changes:

```
.changeset/
├── config.json
├── README.md
├── funny-pandas-jump.md      # Your changeset
└── brave-lions-sing.md       # Another changeset
```

### After `pnpm version`

1. **package.json updated:**
```json
{
  "name": "@mcp-tools/whoop-mcp",
  "version": "1.1.0"  // Was 1.0.1
}
```

2. **CHANGELOG.md created/updated:**
```markdown
# @mcp-tools/whoop-mcp

## 1.1.0

### Minor Changes

- abc1234: Add support for WHOOP 4.0 healthspan metrics

### Patch Changes

- def5678: Fix OAuth token refresh to properly handle expiration edge cases
```

3. **Changeset files deleted:**
```
.changeset/
├── config.json
└── README.md
```

## Semantic Versioning

Changesets enforces [Semantic Versioning (SemVer)](https://semver.org/):

| Type | When to Use | Version Change | Example |
|------|-------------|----------------|---------|
| **patch** | Bug fixes, typos, minor tweaks | 1.0.0 → 1.0.1 | Fix token refresh bug |
| **minor** | New features, backwards compatible | 1.0.0 → 1.1.0 | Add new API endpoint |
| **major** | Breaking changes | 1.0.0 → 2.0.0 | Change config format |

### Examples of Each Type

**Patch (0.0.X):**
- Fix typo in error message
- Correct calculation bug
- Update documentation
- Fix memory leak

**Minor (0.X.0):**
- Add new optional parameter
- Add new tool/endpoint
- Add new feature flag
- Improve performance (no API change)

**Major (X.0.0):**
- Remove deprecated function
- Rename public API
- Change required config format
- Change function signature

## Configuration

Your `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**Key settings:**
- `access: "public"` - Packages are public on npm
- `commit: false` - Manual commits (not auto-commit)
- `baseBranch: "main"` - Compare against main
- `updateInternalDependencies: "patch"` - Bump internal deps as patches

## When NOT to Use Changesets

You don't need a changeset for:

❌ Documentation updates (README, comments)  
❌ Test changes  
❌ CI/CD configuration  
❌ Development tooling (Biome config, etc.)  
❌ Internal refactoring (no public API change)  
❌ Dependency updates (unless they affect users)  

For these, just commit normally without a changeset.

## Tips & Best Practices

### ✅ Good Changeset Summaries

```
Add support for WHOOP 4.0 healthspan data
Fix token refresh race condition when multiple requests are pending
BREAKING: Rename config.loadConfig() to config.load()
Improve error messages for OAuth failures
```

### ❌ Bad Changeset Summaries

```
Update code
Fix bug
Changes
Stuff
```

### Multiple Packages

If your change affects multiple packages:

```bash
pnpm changeset
# Select BOTH packages with space bar:
◉ @mcp-tools/whoop-mcp
◉ @mcp-tools/strava-mcp

# Choose version bump for EACH package
```

### Changeset File Names

Changesets auto-generates fun names:
- `funny-pandas-jump.md`
- `brave-lions-sing.md`
- `tiny-cats-dance.md`

These are just unique identifiers - the content matters, not the name!

## Monorepo Benefits

Changesets shines in monorepos:

1. **Coordinated Releases**
   - Update multiple packages together
   - Automatic dependency version updates

2. **Granular Control**
   - Different version bumps per package
   - Independent changelogs

3. **Dependency Management**
   - If package A depends on package B
   - Updating B automatically bumps A

## Advanced: CI/CD Integration

You can automate releases with GitHub Actions:

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      
      - run: pnpm install
      - run: pnpm build
      
      - name: Create Release PR
        uses: changesets/action@v1
        with:
          version: pnpm version
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This will:
- Create a "Version Packages" PR automatically
- When merged, publish to npm
- Create GitHub releases

## Troubleshooting

### "No changesets present"

**Problem:** You ran `pnpm version` but no changesets exist.

**Solution:** Add a changeset first:
```bash
pnpm changeset
```

### "Changeset already exists for this branch"

**Problem:** You added a changeset, then want to add another.

**Solution:** This is fine! You can have multiple changesets. Just run:
```bash
pnpm changeset
```
Again to add another one.

### "Version conflict"

**Problem:** Someone else released while you were working.

**Solution:** Rebase your branch:
```bash
git pull --rebase origin main
```

### "Changeset not detected in PR"

**Problem:** You forgot to commit the changeset file.

**Solution:** 
```bash
git add .changeset/
git commit -m "chore: add changeset"
git push
```

## Comparison with Other Tools

| Feature | Changesets | Lerna | Semantic Release |
|---------|-----------|-------|------------------|
| Monorepo | ✅ Excellent | ✅ Good | ⚠️ Limited |
| Manual Control | ✅ Yes | ✅ Yes | ❌ Fully automated |
| Changelog | ✅ Auto-generated | ⚠️ Basic | ✅ Auto-generated |
| Learning Curve | ✅ Easy | ⚠️ Medium | ⚠️ Medium |
| Flexibility | ✅ High | ✅ High | ⚠️ Low |

**Why Changesets?**
- ✅ Best for monorepos
- ✅ Manual control over versions
- ✅ Clear, reviewable changes
- ✅ Great developer experience
- ✅ Active development

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Changesets Tutorial](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Try It Now!

Want to test it out? Try adding a changeset:

```bash
pnpm changeset
```

Follow the prompts, then check:

```bash
ls .changeset/
cat .changeset/*.md  # View your changeset
```

You can always delete the changeset file if you were just testing:

```bash
rm .changeset/funny-pandas-jump.md
```

## Questions?

- Check [CHANGESETS.md](./CHANGESETS.md) for detailed workflow
- See `.changeset/README.md` for quick reference
- Ask in PR comments
- Check past PRs for examples

---

**Next Steps:**
1. Read through this demo
2. Try `pnpm changeset` to see the prompts
3. Check out [CHANGESETS.md](./CHANGESETS.md) for the full workflow
4. Start using changesets in your next PR!


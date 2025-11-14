# GitHub Actions Workflows

This directory contains CI/CD workflows for the MCP Tools monorepo.

## Workflows

### 🧪 CI (`ci.yml`)

**Triggers**: Push to `main`, Pull Requests

Runs comprehensive checks on every push and PR:

#### Jobs

1. **Test** (Matrix: Node 18.x, 20.x)
   - Install dependencies
   - Build all packages
   - Run tests
   - Generate coverage report
   - Upload to Codecov

2. **Lint & Format**
   - Run Biome checks (`pnpm ci`)
   - Verify no uncommitted changes
   - Fail if formatting/linting issues found

3. **Type Check**
   - Run TypeScript compiler in all packages
   - Verify type safety

4. **Build**
   - Build all packages
   - Verify build artifacts exist

5. **Build Docs**
   - Build VitePress documentation
   - Upload docs artifact

**Status Badge**:
```markdown
![CI](https://github.com/gabbywelson/mcp-tools/workflows/CI/badge.svg)
```

### 📦 Release (`release.yml`)

**Triggers**: Push to `main` (with changesets)

Automated release workflow using Changesets:

#### What It Does

1. Checks for pending changesets
2. Creates a "Version Packages" PR if changesets exist
3. When PR is merged:
   - Updates package versions
   - Generates CHANGELOGs
   - Syncs changelog to docs
   - Publishes to npm
   - Creates git tags

#### Setup Required

**1. Enable GitHub Actions to Create PRs**:
- Go to Settings → Actions → General
- Scroll to "Workflow permissions"
- Select "Read and write permissions"
- ✅ Check "Allow GitHub Actions to create and approve pull requests"
- Click Save

**2. Add npm Token**:
- `NPM_TOKEN`: npm authentication token for publishing
  - Get from: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
  - Type: "Automation" token
  - Add to: Settings → Secrets → Actions

See [RELEASE_SETUP.md](./RELEASE_SETUP.md) for detailed instructions.

**Status Badge**:
```markdown
![Release](https://github.com/gabbywelson/mcp-tools/workflows/Release/badge.svg)
```

### 📚 Deploy Docs (`docs.yml`)

**Triggers**: Push to `main` (docs changes), Manual dispatch

Deploys VitePress documentation to GitHub Pages:

#### What It Does

1. Builds VitePress documentation
2. Deploys to GitHub Pages
3. Available at: `https://gabbywelson.github.io/mcp-tools/`

#### Setup Required

Enable GitHub Pages in repository settings:

1. Go to Settings → Pages
2. Source: "GitHub Actions"
3. Save

**Status Badge**:
```markdown
![Deploy Docs](https://github.com/gabbywelson/mcp-tools/workflows/Deploy%20Docs/badge.svg)
```

## Workflow Features

### ✅ Fast & Efficient

- **Caching**: pnpm cache for faster installs
- **Parallel Jobs**: Test, lint, typecheck run in parallel
- **Matrix Testing**: Test on multiple Node versions
- **Frozen Lockfile**: Ensures reproducible builds

### 🔒 Secure

- **Minimal Permissions**: Each job has only required permissions
- **Secret Management**: Tokens stored as GitHub secrets
- **Provenance**: npm packages published with provenance

### 📊 Reporting

- **Coverage**: Uploaded to Codecov
- **Artifacts**: Docs uploaded for review
- **Status Checks**: Required checks for PRs

## Local Testing

Test workflows locally before pushing:

### Using Act

```bash
# Install act
brew install act

# Run CI workflow
act pull_request

# Run specific job
act -j test

# Run with secrets
act -s NPM_TOKEN=your_token
```

### Manual Testing

```bash
# Run the same commands as CI
pnpm install --frozen-lockfile
pnpm build
pnpm test:run
pnpm test:coverage
pnpm ci
pnpm -r exec tsc --noEmit
pnpm docs:build
```

## Workflow Triggers

### CI Workflow

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

- Runs on every push to `main`
- Runs on every PR targeting `main`

### Release Workflow

```yaml
on:
  push:
    branches: [main]
```

- Runs on every push to `main`
- Only creates releases if changesets exist

### Docs Workflow

```yaml
on:
  push:
    branches: [main]
    paths: ['docs/**']
  workflow_dispatch:
```

- Runs when docs change on `main`
- Can be manually triggered

## Required Status Checks

Recommended branch protection rules for `main`:

- ✅ `test` (Node 18.x)
- ✅ `test` (Node 20.x)
- ✅ `lint`
- ✅ `typecheck`
- ✅ `build`

Configure in: Settings → Branches → Branch protection rules

## Troubleshooting

### CI Failing

**Problem**: Tests fail in CI but pass locally

**Solutions**:
```bash
# Use same Node version as CI
nvm use 20

# Use frozen lockfile like CI
pnpm install --frozen-lockfile

# Run in CI mode
pnpm ci
pnpm test:run
```

**Problem**: Biome check fails

**Solutions**:
```bash
# Run Biome in CI mode
pnpm ci

# Fix issues
pnpm check

# Commit changes
git add .
git commit -m "chore: fix linting"
```

### Release Failing

**Problem**: npm publish fails

**Solutions**:
- Verify `NPM_TOKEN` secret is set
- Check token has publish permissions
- Verify package names are available on npm
- Check package.json `publishConfig`

**Problem**: Version PR not created

**Solutions**:
- Verify changesets exist in `.changeset/`
- Check changeset format is correct
- Ensure `GITHUB_TOKEN` has write permissions

### Docs Deployment Failing

**Problem**: GitHub Pages not deploying

**Solutions**:
- Enable GitHub Pages in Settings → Pages
- Set source to "GitHub Actions"
- Check workflow permissions
- Verify build succeeds locally: `pnpm docs:build`

## Customization

### Add More Node Versions

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 21.x]  # Add more versions
```

### Add OS Matrix

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [18.x, 20.x]
runs-on: ${{ matrix.os }}
```

### Add Slack Notifications

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Dependency Review

```yaml
- name: Dependency Review
  uses: actions/dependency-review-action@v3
```

## Best Practices

1. **Keep workflows fast**: Use caching, parallel jobs
2. **Test locally first**: Use `act` or manual commands
3. **Minimal permissions**: Only grant what's needed
4. **Clear job names**: Make it obvious what failed
5. **Fail fast**: Don't waste CI time on known failures
6. **Cache dependencies**: Speeds up subsequent runs
7. **Matrix testing**: Test on multiple Node versions
8. **Status badges**: Show build status in README

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [pnpm Action](https://github.com/pnpm/action-setup)
- [Changesets Action](https://github.com/changesets/action)
- [Codecov Action](https://github.com/codecov/codecov-action)
- [Act - Local Testing](https://github.com/nektos/act)

---

**Your CI/CD is now automated!** 🚀


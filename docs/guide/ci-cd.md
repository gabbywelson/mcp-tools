# CI/CD with GitHub Actions

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### 🧪 CI Workflow

Runs on every push and pull request to ensure code quality.

**Jobs:**
- **Test**: Run tests on Node 18.x and 20.x
- **Lint & Format**: Check code style with Biome
- **Type Check**: Verify TypeScript types
- **Build**: Ensure packages build successfully
- **Build Docs**: Verify documentation builds

**Status**: ![CI](https://github.com/gabbywelson/mcp-tools/workflows/CI/badge.svg)

### 📦 Release Workflow

Automates versioning and publishing using Changesets.

**What it does:**
1. Detects pending changesets
2. Creates a "Version Packages" PR
3. When merged, publishes to npm
4. Creates git tags
5. Updates changelog

**Status**: ![Release](https://github.com/gabbywelson/mcp-tools/workflows/Release/badge.svg)

### 📚 Docs Deployment

Automatically deploys documentation to GitHub Pages.

**Triggers:**
- Push to `main` with docs changes
- Manual workflow dispatch

**URL**: https://gabbywelson.github.io/mcp-tools/

## Local Testing

Run the same checks locally before pushing:

```bash
# Install dependencies (frozen lockfile like CI)
pnpm install --frozen-lockfile

# Build packages
pnpm build

# Run tests
pnpm test:run

# Generate coverage
pnpm test:coverage

# Lint and format check (CI mode)
pnpm ci

# Type check
pnpm -r exec tsc --noEmit

# Build docs
pnpm docs:build
```

## Setup Requirements

### For Releases (npm Publishing)

1. **Enable GitHub Actions to create PRs**:
   - Go to Settings → Actions → General
   - Scroll to "Workflow permissions"
   - Select "Read and write permissions"
   - ✅ Check "Allow GitHub Actions to create and approve pull requests"
   - Click Save

2. **Create npm account and organization**

3. **Generate npm token**:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create "Automation" token

4. **Add to GitHub secrets**:
   - Go to Settings → Secrets → Actions
   - Add `NPM_TOKEN` secret

::: tip
See [.github/RELEASE_SETUP.md](https://github.com/gabbywelson/mcp-tools/blob/main/.github/RELEASE_SETUP.md) for detailed setup instructions.
:::

### For Docs Deployment

1. Enable GitHub Pages:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - Save

### For Coverage Reports (Optional)

1. Sign up for [Codecov](https://codecov.io)
2. Add repository
3. Add `CODECOV_TOKEN` to GitHub secrets

## Branch Protection

Recommended rules for `main` branch:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. Required status checks:
   - `test (18.x)`
   - `test (20.x)`
   - `lint`
   - `typecheck`
   - `build`

## Workflow Details

### CI Workflow (`ci.yml`)

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**Features:**
- Matrix testing (Node 18.x, 20.x)
- Parallel jobs for speed
- pnpm caching
- Coverage upload to Codecov
- Docs artifact upload

### Release Workflow (`release.yml`)

```yaml
on:
  push:
    branches: [main]
```

**Features:**
- Automated with Changesets
- Creates version PR
- Publishes to npm
- Creates git tags
- Updates changelog

**Process:**
1. Developer creates changeset: `pnpm changeset`
2. Developer commits and pushes
3. Workflow creates "Version Packages" PR
4. Maintainer reviews and merges PR
5. Workflow publishes to npm automatically

### Docs Workflow (`docs.yml`)

```yaml
on:
  push:
    branches: [main]
    paths: ['docs/**']
  workflow_dispatch:
```

**Features:**
- Builds VitePress site
- Deploys to GitHub Pages
- Manual trigger available
- Automatic on docs changes

## Troubleshooting

### CI Failing

::: tip Check Locally First
Run `pnpm ci` and `pnpm test:run` locally to catch issues before pushing.
:::

**Common Issues:**

1. **Biome check fails**
   ```bash
   # Fix locally
   pnpm check
   git add .
   git commit -m "chore: fix linting"
   ```

2. **Tests fail**
   ```bash
   # Run tests locally
   pnpm test:run
   
   # Check specific test
   pnpm test src/__tests__/failing-test.test.ts
   ```

3. **Type errors**
   ```bash
   # Check types locally
   pnpm -r exec tsc --noEmit
   ```

4. **Build fails**
   ```bash
   # Clean and rebuild
   pnpm clean
   pnpm build
   ```

### Release Failing

**Issue**: npm publish fails

**Solutions:**
- Verify `NPM_TOKEN` is set in GitHub secrets
- Check token has publish permissions
- Verify package name is available on npm
- Check `package.json` has correct `publishConfig`

**Issue**: Version PR not created

**Solutions:**
- Verify changesets exist: `ls .changeset/*.md`
- Check changeset format is correct
- Ensure workflow has write permissions

### Docs Not Deploying

**Issue**: GitHub Pages not working

**Solutions:**
- Enable Pages in Settings → Pages
- Set source to "GitHub Actions"
- Check workflow permissions
- Verify build succeeds: `pnpm docs:build`

## Best Practices

### 1. Test Locally First

Always run checks locally before pushing:

```bash
pnpm check && pnpm test:run && pnpm build
```

### 2. Use Changesets

Document all changes with changesets:

```bash
pnpm changeset
```

### 3. Keep CI Fast

- Use caching (already configured)
- Run jobs in parallel (already configured)
- Don't commit large files

### 4. Monitor Workflows

- Check workflow status in GitHub Actions tab
- Fix failures promptly
- Review coverage reports

### 5. Protect Main Branch

- Require PR reviews
- Require status checks
- Keep main stable

## Advanced Usage

### Run Specific Workflow

```bash
# Using GitHub CLI
gh workflow run ci.yml

# Trigger docs deployment
gh workflow run docs.yml
```

### View Workflow Logs

```bash
# List recent runs
gh run list

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

### Test Workflows Locally

Using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run CI workflow
act pull_request

# Run specific job
act -j test
```

## Monitoring

### GitHub Actions Dashboard

View all workflows: https://github.com/gabbywelson/mcp-tools/actions

### Status Badges

Add to README:

```markdown
[![CI](https://github.com/gabbywelson/mcp-tools/workflows/CI/badge.svg)](https://github.com/gabbywelson/mcp-tools/actions/workflows/ci.yml)
```

### Codecov Dashboard

View coverage: https://codecov.io/gh/gabbywelson/mcp-tools

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Changesets Action](https://github.com/changesets/action)
- [pnpm Action](https://github.com/pnpm/action-setup)
- [Act - Local Testing](https://github.com/nektos/act)

---

::: tip
Your CI/CD pipeline is fully automated! Just push code and let GitHub Actions handle the rest.
:::


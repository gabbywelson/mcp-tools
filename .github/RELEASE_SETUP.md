# Release Workflow Setup

The release workflow is failing because GitHub Actions needs permission to create pull requests. Here's how to fix it:

## Quick Fix: Enable GitHub Actions PR Creation

### Option 1: Repository Settings (Recommended)

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Scroll down to **Workflow permissions**
4. Select **"Read and write permissions"**
5. ✅ Check **"Allow GitHub Actions to create and approve pull requests"**
6. Click **Save**

That's it! The release workflow will now work.

### Option 2: Use Personal Access Token (Alternative)

If you prefer more control, you can use a Personal Access Token:

1. **Create a PAT**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Name: `CHANGESETS_TOKEN`
   - Scopes: Check `repo` (full control)
   - Click "Generate token"
   - Copy the token

2. **Add to Repository Secrets**:
   - Go to your repository → Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `CHANGESETS_TOKEN`
   - Value: Paste your PAT
   - Click "Add secret"

3. **Update Workflow**:
   ```yaml
   # .github/workflows/release.yml
   env:
     GITHUB_TOKEN: ${{ secrets.CHANGESETS_TOKEN }}  # Use PAT instead
     NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
     NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

## How the Release Workflow Works

### When You Push Changes

1. **Detect Changesets**: Workflow checks for pending changesets in `.changeset/`
2. **Create PR**: If changesets exist, creates a "Version Packages" PR
3. **Update Versions**: PR includes version bumps and CHANGELOG updates
4. **Review**: You review the PR
5. **Merge**: When you merge, workflow publishes to npm

### Example Flow

```bash
# 1. Developer creates changeset
pnpm changeset
# Select: @mcp-tools/whoop-mcp
# Type: minor
# Summary: "Add new feature"

# 2. Commit and push
git add .
git commit -m "feat: add new feature"
git push

# 3. GitHub Actions creates PR
# Title: "chore: version packages"
# Changes:
#   - packages/whoop-mcp/package.json (1.0.0 → 1.1.0)
#   - packages/whoop-mcp/CHANGELOG.md (new entry)
#   - docs/changelog.md (synced)

# 4. Maintainer reviews and merges PR

# 5. GitHub Actions publishes to npm
# - Builds packages
# - Publishes to npm
# - Creates git tags
# - Creates GitHub release
```

## Troubleshooting

### Error: "GitHub Actions is not permitted to create or approve pull requests"

**Solution**: Enable in Settings → Actions → General → Workflow permissions

### Error: "Resource not accessible by integration"

**Cause**: Insufficient permissions

**Solution**: 
- Check workflow has `pull-requests: write` permission
- Verify repository settings allow Actions to create PRs

### Error: "npm publish failed"

**Cause**: Missing or invalid `NPM_TOKEN`

**Solution**:
1. Create npm token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Type: "Automation"
3. Add to GitHub Secrets as `NPM_TOKEN`

### Error: "No changesets found"

**Cause**: No pending changesets in `.changeset/`

**Solution**: This is expected! The workflow only creates PRs when changesets exist.

```bash
# Create a changeset
pnpm changeset
```

### PR Not Created

**Check**:
1. Are there changesets? `ls .changeset/*.md`
2. Is workflow enabled? Check Actions tab
3. Are permissions correct? Check Settings → Actions
4. Check workflow logs for errors

## Testing the Workflow

### Test Without Publishing

You can test the version bump without publishing:

```bash
# Locally run what the workflow does
pnpm version

# Review changes
git diff

# Don't commit yet - just testing!
git reset --hard HEAD
```

### Dry Run Publishing

```bash
# See what would be published
cd packages/whoop-mcp
pnpm publish --dry-run
```

## Manual Release (If Needed)

If you need to release manually:

```bash
# 1. Version packages
pnpm version

# 2. Review changes
git diff

# 3. Commit
git add .
git commit -m "chore: version packages"
git push

# 4. Publish (requires npm login)
pnpm release
```

## Workflow Configuration

Current configuration:

```yaml
name: Release
on:
  push:
    branches: [main]

permissions:
  contents: write        # Create tags
  pull-requests: write   # Create PRs
  issues: write         # Comment on issues
  id-token: write       # npm provenance

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: changesets/action@v1
        with:
          version: pnpm version
          publish: pnpm release
```

## Security Notes

### Why These Permissions?

- **contents: write** - Create git tags for releases
- **pull-requests: write** - Create version bump PRs
- **issues: write** - Link releases to issues
- **id-token: write** - npm package provenance

### Is This Safe?

Yes! The workflow:
- ✅ Only runs on `main` branch
- ✅ Uses official `changesets/action`
- ✅ Requires PR review before publish
- ✅ Uses minimal required permissions
- ✅ Tokens are scoped to repository

### Best Practices

1. **Review Version PRs**: Always review before merging
2. **Protect Main**: Enable branch protection
3. **Require Reviews**: Require PR approvals
4. **Monitor Releases**: Watch for unexpected publishes
5. **Rotate Tokens**: Refresh npm tokens periodically

## FAQ

### Q: Can I skip the PR and publish directly?

A: Not recommended. The PR provides a review checkpoint before publishing to npm.

### Q: Can I publish manually instead?

A: Yes! Just run `pnpm version && pnpm release` locally. But automation is better.

### Q: What if I want to publish a specific version?

A: Create a changeset with the desired bump type (patch/minor/major).

### Q: Can I test the workflow without publishing?

A: Yes! The workflow only publishes when you merge the version PR.

### Q: How do I publish a pre-release?

A: Use changeset pre-release mode:
```bash
pnpm changeset pre enter alpha
pnpm changeset
pnpm version
```

## Next Steps

1. ✅ Enable GitHub Actions PR creation (Settings → Actions)
2. ✅ Add `NPM_TOKEN` to repository secrets
3. ✅ Create a changeset: `pnpm changeset`
4. ✅ Push to main
5. ✅ Review and merge version PR
6. ✅ Watch it publish! 🚀

---

**Need help?** Check the [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)


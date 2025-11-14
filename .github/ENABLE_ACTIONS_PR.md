# Enable GitHub Actions to Create Pull Requests

## Quick Fix (2 minutes)

Your release workflow is failing with this error:
```
Error: GitHub Actions is not permitted to create or approve pull requests.
```

Here's how to fix it:

### Step-by-Step Instructions

1. **Go to your repository on GitHub**
   ```
   https://github.com/gabbywelson/mcp-tools
   ```

2. **Click on "Settings"** (top menu bar)

3. **In the left sidebar, click "Actions"**

4. **Click "General"**

5. **Scroll down to "Workflow permissions"** section

6. **Select "Read and write permissions"** (radio button)

7. **✅ Check the box**: "Allow GitHub Actions to create and approve pull requests"

8. **Click "Save"** button at the bottom

### Visual Guide

```
Repository → Settings → Actions → General
                                    ↓
                        Workflow permissions
                                    ↓
                    ○ Read repository contents and packages permissions
                    ● Read and write permissions  ← SELECT THIS
                                    ↓
                    ✅ Allow GitHub Actions to create and approve pull requests  ← CHECK THIS
                                    ↓
                            [Save] ← CLICK THIS
```

### What This Does

This setting allows the Changesets workflow to:
- ✅ Create "Version Packages" pull requests
- ✅ Update version numbers automatically
- ✅ Generate CHANGELOGs
- ✅ Publish to npm when PR is merged

### Security

This is safe because:
- ✅ Only affects this repository
- ✅ Actions still require your approval to run
- ✅ PRs require review before merge
- ✅ Standard practice for automated releases

### After Enabling

1. Push a new commit (or re-run the failed workflow)
2. Workflow will create a "Version Packages" PR
3. Review the PR
4. Merge when ready
5. Workflow automatically publishes to npm! 🚀

### Verify It Worked

After enabling, you should see:
- ✅ No more "not permitted" errors
- ✅ A new PR appears (if you have changesets)
- ✅ PR title: "chore: version packages"

### Still Having Issues?

Check:
- [ ] Setting is saved (refresh the Settings page)
- [ ] You have admin access to the repository
- [ ] Workflow has correct permissions in `.github/workflows/release.yml`
- [ ] You have changesets in `.changeset/` directory

### Alternative: Use Personal Access Token

If you prefer not to enable this setting, you can use a Personal Access Token instead.

See [RELEASE_SETUP.md](./RELEASE_SETUP.md) for instructions.

---

**That's it!** Your release workflow should now work. 🎉


# Cursor Context Files

This directory contains context files to help Cursor AI understand this project better.

## Files

### `.cursorrules`
Main rules file that Cursor automatically loads. Contains:
- Project overview and tech stack
- File structure and organization
- Coding standards and conventions
- Common commands and workflows
- Best practices and patterns

### `commands.md`
Quick reference for all common commands:
- Package management
- Development workflows
- Testing commands
- Code quality tools
- Documentation commands
- Versioning and release
- Debugging tips

### `architecture.md`
Deep dive into system architecture:
- Component breakdown
- Data flow diagrams
- OAuth flow
- Type system
- Error handling strategy
- Security considerations
- Performance patterns

### `snippets.md`
Copy-paste code snippets:
- MCP tool templates
- WhoopClient method patterns
- Type definitions
- Test templates
- Documentation templates
- Common patterns

### `troubleshooting.md`
Solutions to common issues:
- Build problems
- Testing issues
- OAuth errors
- MCP server problems
- Documentation issues
- Dependency problems
- Debugging tips

## How Cursor Uses These Files

### Automatic Loading
Cursor automatically loads `.cursorrules` when you open this project. This gives it context about:
- What this project is
- How it's structured
- What conventions to follow
- What commands are available

### Manual Reference
You can explicitly reference other files by:
1. Using `@` mentions: `@.cursor/commands.md`
2. Opening files in the editor
3. Asking Cursor to "check the architecture docs"

## Benefits

### For You
- ✅ Cursor gives better suggestions
- ✅ Follows project conventions automatically
- ✅ Knows about custom commands
- ✅ Understands architecture patterns
- ✅ Quick access to snippets

### For Cursor
- ✅ Understands project structure
- ✅ Knows tech stack and tools
- ✅ Follows coding standards
- ✅ Suggests appropriate patterns
- ✅ Provides relevant examples

## Tips

### When to Reference

**Ask Cursor to check these files when:**
- Starting a new feature
- Debugging an issue
- Writing tests
- Adding documentation
- Releasing a version
- Setting up development environment

**Examples:**
```
"Check the architecture docs and help me add a new MCP tool"
"Look at the troubleshooting guide for OAuth issues"
"Use the snippets to create a new test file"
"Follow the commands guide to release a new version"
```

### Keeping Updated

These files should be updated when:
- Adding new features or patterns
- Changing architecture
- Adding new commands or scripts
- Discovering new issues/solutions
- Updating conventions

### Best Practices

1. **Be Specific**: Reference specific files for specific tasks
2. **Keep Current**: Update docs when making changes
3. **Add Examples**: Include real examples from the codebase
4. **Link Related**: Cross-reference related documentation
5. **Test Snippets**: Ensure code snippets actually work

## Structure

```
.cursor/
├── README.md              # This file
├── commands.md            # Command reference
├── architecture.md        # System architecture
├── snippets.md           # Code snippets
└── troubleshooting.md    # Common issues

../.cursorrules           # Main rules (auto-loaded)
```

## Examples

### Adding a New Tool

1. Reference: `@.cursor/snippets.md` for templates
2. Follow: `.cursorrules` for conventions
3. Check: `@.cursor/architecture.md` for patterns
4. Test: Use test template from snippets
5. Document: Follow docs structure

### Debugging OAuth

1. Check: `@.cursor/troubleshooting.md` OAuth section
2. Reference: `@.cursor/architecture.md` OAuth flow
3. Use: Commands from `@.cursor/commands.md`
4. Follow: Error handling patterns

### Releasing a Version

1. Check: `@.cursor/commands.md` versioning section
2. Follow: `.cursorrules` release process
3. Reference: Changeset templates in snippets
4. Verify: All checks pass per troubleshooting

## Maintenance

### Monthly Review
- [ ] Update commands if scripts changed
- [ ] Add new patterns to snippets
- [ ] Document new issues in troubleshooting
- [ ] Update architecture if structure changed
- [ ] Verify all examples still work

### After Major Changes
- [ ] Update affected documentation
- [ ] Add new patterns/conventions
- [ ] Update troubleshooting with new issues
- [ ] Refresh examples and snippets

## Contributing

When adding to these docs:
1. **Be Clear**: Write for someone new to the project
2. **Be Complete**: Include all necessary context
3. **Be Concise**: Don't repeat what's elsewhere
4. **Be Practical**: Include real examples
5. **Be Current**: Keep information up-to-date

## Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor Rules Guide](https://cursor.sh/docs/rules)
- [MCP Tools Main README](../README.md)
- [WHOOP MCP Package Docs](../packages/whoop-mcp/README.md)

---

**These files make Cursor smarter about your project!** 🧠✨


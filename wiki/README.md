# Multi-Agent Tester Wiki

This directory contains comprehensive documentation for the Multi-Agent Tester project in GitHub Wiki format.

## Wiki Structure

### Main Pages

1. **Home.md** - Wiki landing page with overview and navigation
2. **Getting-Started.md** - Quick start guide for new users
3. **Installation.md** - Detailed installation instructions
4. **Configuration.md** - Token and agent configuration guide
5. **Security.md** - Security architecture and best practices
6. **Features.md** - Comprehensive feature documentation
7. **API-Reference.md** - Protocol specifications and API details
8. **Architecture.md** - Technical architecture and implementation
9. **Contributing.md** - Contribution guidelines
10. **Troubleshooting.md** - Common issues and solutions

### Navigation Files

- **_Sidebar.md** - Wiki sidebar navigation menu
- **_Footer.md** - Wiki footer with links and license notice

## Using This Wiki

### For GitHub Wiki

To publish this wiki to GitHub:

1. **Clone the wiki repository:**
   ```bash
   git clone https://github.com/chovancova/conversation-agent-t.wiki.git
   ```

2. **Copy wiki files:**
   ```bash
   cp wiki/*.md conversation-agent-t.wiki/
   ```

3. **Commit and push:**
   ```bash
   cd conversation-agent-t.wiki
   git add .
   git commit -m "Add comprehensive wiki documentation"
   git push origin master
   ```

### For Local Documentation

These files can also be used as standalone documentation:

- View in any Markdown viewer
- Convert to HTML with tools like `pandoc`
- Generate documentation site with MkDocs or similar

## Wiki Features

### Navigation

- **Internal links** using `[[Page Title|Page-Name]]` format
- **Sidebar navigation** in _Sidebar.md
- **Footer links** in _Footer.md
- **Cross-references** between pages

### Content Organization

**Beginner → Advanced flow:**
```
Home → Getting Started → Installation → Configuration
  ↓
Security & Features
  ↓
API Reference & Architecture
  ↓
Contributing & Troubleshooting
```

### Comprehensive Coverage

- ✅ User guides (Getting Started, Installation)
- ✅ Configuration guides (Token, Agent, Theme)
- ✅ Security documentation (Encryption, Best Practices)
- ✅ Feature documentation (All features covered)
- ✅ API reference (All protocols documented)
- ✅ Technical documentation (Architecture details)
- ✅ Contributing guide (How to contribute)
- ✅ Troubleshooting (Common issues)

## Maintenance

### Updating the Wiki

When updating the wiki:

1. Edit the appropriate .md file in the wiki/ directory
2. Maintain consistent formatting and style
3. Update internal links if page names change
4. Keep _Sidebar.md navigation in sync
5. Test all wiki links work correctly

### Style Guide

**Formatting:**
- Use ATX-style headers (`#` not `===`)
- Use fenced code blocks with language specifiers
- Use tables for structured data
- Use checklists for steps and requirements

**Links:**
- Internal wiki links: `[[Page Title|Page-Name]]`
- External links: `[Link Text](URL)`
- Repository files: Full GitHub URLs

**Code Examples:**
- Include language identifier: ```bash, ```typescript, etc.
- Provide context and explanations
- Show both correct and incorrect examples when helpful

## Page Summaries

### Home.md (2.8K)
Wiki landing page with overview, key features, documentation structure, and quick links.

### Getting-Started.md (5.1K)
Quick start guide covering prerequisites, configuration steps, and first-time setup in 5 minutes.

### Installation.md (5.8K)
Comprehensive installation guide with multiple methods (hosted, local, deployment), troubleshooting, and verification steps.

### Configuration.md (9.4K)
Detailed configuration guide for tokens, agents, protocols, split view, themes, and advanced settings.

### Security.md (13K)
Complete security documentation covering encryption, zero server storage, authentication, best practices, and compliance.

### Features.md (11K)
Comprehensive feature documentation including multi-agent testing, OAuth2, split view, UI features, and upcoming features.

### API-Reference.md (13K)
Complete API reference for all three protocols (Custom HTTP, A2A, MCP) with examples, schemas, and implementation guides.

### Architecture.md (15K)
Technical architecture documentation covering technology stack, component structure, data flow, security, and deployment.

### Contributing.md (13K)
Contribution guidelines including workflow, coding standards, testing, documentation, and community guidelines.

### Troubleshooting.md (13K)
Comprehensive troubleshooting guide for installation, token, agent, encryption, storage, UI, and performance issues.

## Statistics

- **Total Pages:** 10 main pages + 2 navigation files
- **Total Size:** ~130KB
- **Word Count:** ~25,000 words
- **Code Examples:** 100+ code snippets
- **Tables:** 30+ reference tables
- **Checklists:** 20+ step-by-step guides

## License

This documentation is part of the Multi-Agent Tester project and is subject to the same proprietary license. See [LICENSE](https://github.com/chovancova/conversation-agent-t/blob/main/LICENSE) for details.

**Documentation License:** Same as code - publicly viewable for review purposes only. No usage rights granted without explicit written permission.

---

**Need help?** Start with [[Home|the wiki home page]]!

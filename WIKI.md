# Wiki Documentation

This repository includes comprehensive wiki documentation for Multi-Agent Tester.

## 📚 Accessing the Wiki

### Option 1: GitHub Wiki (Recommended)

Visit the GitHub Wiki:
**[conversation-agent-t Wiki](https://github.com/chovancova/conversation-agent-t/wiki)**

The wiki provides:
- Easy navigation with sidebar menu
- Searchable content
- Internal page linking
- Clean, readable formatting

### Option 2: Wiki Directory

All wiki pages are available in the [`wiki/`](wiki/) directory of this repository:

- Browse files directly on GitHub
- Clone repository for offline access
- Use with any Markdown viewer
- Convert to other formats as needed

## 📖 Wiki Contents

### Getting Started
- **[Home](wiki/Home.md)** - Wiki overview and navigation
- **[Getting Started](wiki/Getting-Started.md)** - Quick start guide (5 minutes)
- **[Installation](wiki/Installation.md)** - Detailed installation instructions
- **[Configuration](wiki/Configuration.md)** - Token and agent configuration

### Core Documentation
- **[Features](wiki/Features.md)** - Comprehensive feature documentation
- **[Security](wiki/Security.md)** - Security architecture and best practices
- **[API Reference](wiki/API-Reference.md)** - Protocol specifications and examples

### Advanced Topics
- **[Architecture](wiki/Architecture.md)** - Technical architecture details
- **[Contributing](wiki/Contributing.md)** - Contribution guidelines
- **[Troubleshooting](wiki/Troubleshooting.md)** - Common issues and solutions

## 🚀 Quick Navigation

### For New Users
1. Start with **[Getting Started](wiki/Getting-Started.md)**
2. Follow **[Installation](wiki/Installation.md)** guide
3. Configure using **[Configuration](wiki/Configuration.md)** guide
4. Review **[Security](wiki/Security.md)** best practices

### For Developers
1. Review **[Architecture](wiki/Architecture.md)**
2. Read **[Contributing](wiki/Contributing.md)** guidelines
3. Check **[API Reference](wiki/API-Reference.md)**
4. Use **[Troubleshooting](wiki/Troubleshooting.md)** as needed

### For Reviewers
1. Read **[Home](wiki/Home.md)** overview
2. Review **[Security](wiki/Security.md)** documentation
3. Check **[Features](wiki/Features.md)** list
4. Browse **[Architecture](wiki/Architecture.md)**

## 📊 Documentation Stats

- **Total Pages:** 10 main pages + 2 navigation files + 1 README
- **Total Lines:** 4,747 lines of documentation
- **Total Size:** ~130KB
- **Word Count:** ~25,000 words
- **Code Examples:** 100+ snippets
- **Tables:** 30+ reference tables
- **Checklists:** 20+ step-by-step guides

## 🔧 Using the Wiki Files

### View Locally

Clone the repository and view wiki files:

```bash
git clone https://github.com/chovancova/conversation-agent-t.git
cd conversation-agent-t/wiki

# View in your favorite Markdown viewer
# Or use command line tools:
cat Home.md
less Getting-Started.md
```

### Convert to Other Formats

Using pandoc to convert to HTML:

```bash
# Convert single page
pandoc wiki/Home.md -o Home.html

# Convert with styling
pandoc wiki/Home.md -s --css=style.css -o Home.html

# Convert to PDF
pandoc wiki/Home.md -o Home.pdf
```

### Generate Static Site

Using MkDocs or similar tools:

```bash
# Install MkDocs
pip install mkdocs

# Create mkdocs.yml configuration
# Add wiki pages to nav structure

# Serve locally
mkdocs serve

# Build static site
mkdocs build
```

## 📝 Contributing to Wiki

To contribute to the wiki documentation:

1. Edit files in the `wiki/` directory
2. Follow the style guide in [wiki/README.md](wiki/README.md)
3. Maintain consistent formatting
4. Test all internal links
5. Submit pull request

See **[Contributing](wiki/Contributing.md)** for detailed guidelines.

## 🔗 Additional Resources

- **[README.md](README.md)** - Project overview
- **[SECURITY.md](SECURITY.md)** - Security information
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[LICENSE](LICENSE)** - License terms
- **[docs/](docs/)** - Additional documentation

## ❓ Getting Help

- 📖 Browse the **[wiki](https://github.com/chovancova/conversation-agent-t/wiki)**
- 🐛 [Open an issue](https://github.com/chovancova/conversation-agent-t/issues)
- 💬 Check existing issues first
- 📧 Contact maintainers

## ⚠️ License Notice

This documentation is part of the Multi-Agent Tester project and is subject to the same proprietary license.

**Proprietary License** - All rights reserved. Source available for review purposes only. No usage, copying, modification, or distribution rights granted without explicit written permission.

See [LICENSE](LICENSE) for complete terms.

---

**Ready to get started?** → Visit the **[Wiki Home Page](wiki/Home.md)**

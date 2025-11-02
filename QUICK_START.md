# Quick Start Guide

> Get started with Multi-Agent Tester in 5 minutes

## 🚀 For Users

### Try It Now
1. Visit the deployed application (add your URL here)
2. Click **"Token"** → Create new configuration
3. Click **"Agents"** → Configure your agent endpoints
4. Start testing!

### Local Setup
```bash
git clone https://github.com/chovancova/conversation-agent-t.git
cd conversation-agent-t
npm install
npm run dev
```

Visit `http://localhost:5173`

## 📖 For Reviewers

### Quick Review Checklist
- ✅ **No sensitive data** - Fully reviewed, clean
- ✅ **Security** - Client-side encryption, zero server storage
- ✅ **Documentation** - Comprehensive in `docs/` folder
- ⚠️ **License** - MIT (allows copying) - See `docs/LICENSE_NOTE.md`

### Important Documents
1. **docs/PUBLIC_RELEASE_SUMMARY.md** - Executive summary (start here!)
2. **docs/LICENSE_NOTE.md** - Critical license information
3. **README.md** - Project overview
4. **docs/PRODUCTION_READINESS.md** - Deployment readiness

## 👨‍💻 For Contributors

### Setup Development Environment
```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/conversation-agent-t.git
cd conversation-agent-t

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Read This First
- **CONTRIBUTING.md** - Contribution guidelines
- **docs/ARCHITECTURE.md** - Technical architecture
- **docs/TODO.md** - What needs to be done

### Quick Contribution
1. Find an issue labeled `good first issue`
2. Comment that you're working on it
3. Create a feature branch
4. Submit a pull request

## 🔐 Security Note

All data is stored **client-side only**:
- ✅ Your browser, your data
- ✅ No server storage
- ✅ AES-256-GCM encryption
- ✅ Complete privacy

See **SECURITY.md** for details.

## ⚠️ License Note

**Current License**: MIT (permissive)

MIT License allows:
- ✅ Anyone can copy the code
- ✅ Anyone can use commercially
- ✅ Anyone can modify and distribute

If you want "check only" (no copying), the license needs to be changed.

See **docs/LICENSE_NOTE.md** for details.

## 🐛 Known Issues

- ESLint configuration missing (linting blocked)
- No automated tests yet
- Large bundle size (774KB)

See **docs/TODO.md** for complete list.

## 📞 Get Help

- 📖 Read the **docs/** folder
- 🐛 Open an issue on GitHub
- 💬 Check existing issues first

## 🎯 Current Status

**Version**: 1.0 Beta  
**Status**: Ready for private/beta release  
**Production**: ✅ Core features complete  
**Testing**: ⚠️ Manual only (no automated tests)

---

**Need more details?** → Read **README.md**  
**Ready to contribute?** → Read **CONTRIBUTING.md**  
**Planning deployment?** → Read **docs/PRODUCTION_READINESS.md**

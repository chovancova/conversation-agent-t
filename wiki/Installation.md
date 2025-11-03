# Installation

This guide covers different methods to install and run Multi-Agent Tester.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Browser**: Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Git**: For cloning the repository

### Check Your Installation
```bash
# Check Node.js version
node --version
# Should output v18.0.0 or higher

# Check npm version
npm --version
# Should output 9.0.0 or higher
```

## Installation Methods

### Method 1: Use Hosted Version (Recommended)

The easiest way to use Multi-Agent Tester is through a hosted instance:

1. Navigate to your deployment URL
2. No installation required!
3. Start using immediately

**Benefits:**
- ✅ No setup required
- ✅ Always up-to-date
- ✅ Access from any device
- ✅ No maintenance needed

### Method 2: Local Development

For contributors or those who need to modify the code:

#### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/chovancova/conversation-agent-t.git

# Or clone via SSH
git clone git@github.com:chovancova/conversation-agent-t.git

# Navigate to directory
cd conversation-agent-t
```

#### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install
```

This will install:
- React 19
- TypeScript 5.7
- Vite 6
- Tailwind CSS 4
- UI component libraries
- All other dependencies

#### Step 3: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173
- **Network**: http://YOUR_LOCAL_IP:5173

**Development Features:**
- 🔥 Hot Module Replacement (HMR)
- ⚡ Fast refresh
- 🐛 Source maps for debugging
- 📊 Build performance metrics

#### Step 4: Build for Production

```bash
# Create production build
npm run build
```

This generates optimized files in the `dist/` directory:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps (for debugging)

#### Step 5: Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

Visit http://localhost:4173 to test the production build.

### Method 3: Deploy to Hosting Platform

Multi-Agent Tester can be deployed to various platforms:

#### GitHub Pages

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (configure in repository settings)
```

#### Netlify

```bash
# Build command: npm run build
# Publish directory: dist
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

```bash
# Build command: npm run build
# Output directory: dist
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### Static Web Hosting

Any static web hosting service works:
1. Build the project: `npm run build`
2. Upload the `dist/` directory
3. Configure server to redirect all routes to `index.html`

## Post-Installation

### Verify Installation

1. Open the application in your browser
2. You should see the Multi-Agent Tester interface
3. Check for any console errors (F12 → Console)

### Initial Configuration

After installation, you need to:
1. [[Configuration|Configure token generation]]
2. [[Configuration|Configure agent endpoints]]
3. Start testing!

See [[Getting Started|Getting-Started]] for detailed setup steps.

## Development Commands

### Available npm Scripts

```bash
# Development
npm run dev              # Start development server
npm run preview          # Preview production build

# Building
npm run build            # Build for production
npm run optimize         # Optimize dependencies

# Linting (requires ESLint config)
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically

# Testing (requires test setup)
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage

# Utilities
npm run kill             # Kill process on port 5000
```

## Troubleshooting Installation

### Common Issues

#### Port Already in Use

If port 5173 is already in use:
```bash
# Kill the process
npm run kill

# Or use a different port
npm run dev -- --port 3000
```

#### Node Version Issues

```bash
# Use nvm to switch Node versions
nvm install 18
nvm use 18
```

#### Dependency Installation Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Build Fails

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

### Getting Help

Still having issues?
- 📖 Check [[Troubleshooting|Troubleshooting]] page
- 🐛 [Open an issue](https://github.com/chovancova/conversation-agent-t/issues)
- 💬 Review existing issues

## System Configuration

### Browser Configuration

For optimal experience:
1. **Enable JavaScript** (required)
2. **Allow localStorage** (required for data storage)
3. **Enable WebCrypto API** (required for encryption)
4. **Disable ad blockers** (may interfere with API calls)

### Security Settings

Multi-Agent Tester uses:
- **localStorage**: For encrypted data storage
- **sessionStorage**: For temporary session data
- **IndexedDB**: For conversation history (via Spark KV)
- **WebCrypto API**: For AES-256-GCM encryption

Ensure these are not blocked by browser settings or extensions.

## Next Steps

✅ Installation complete! Now:
1. Follow [[Getting Started|Getting-Started]] guide
2. Configure [[Configuration|tokens and agents]]
3. Review [[Security|Security]] best practices

---

**Previous**: [[Getting Started|Getting-Started]]  
**Next**: [[Configuration]]

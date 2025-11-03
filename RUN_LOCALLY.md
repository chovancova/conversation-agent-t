# Running Multi-Agent Tester Locally

> Complete guide for setting up and running the Multi-Agent Tester application on your local machine

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Building for Production](#-building-for-production)
- [Testing](#-testing)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Additional Resources](#-additional-resources)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (version 18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  
- **npm** (version 9.0.0 or higher)
  - Comes with Node.js
  - Verify installation: `npm --version`

### Optional but Recommended

- **Git** - For cloning the repository
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

- **VS Code** or your preferred code editor
  - Download from [code.visualstudio.com](https://code.visualstudio.com/)

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free for dependencies and build files
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## 📥 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/chovancova/conversation-agent-t.git

# Navigate to the project directory
cd conversation-agent-t
```

**Note**: If you don't have Git installed, you can download the repository as a ZIP file from GitHub.

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

This will install all required packages listed in `package.json`, including:
- React 19 and React DOM
- Vite 6 for build tooling
- TypeScript 5.7
- Tailwind CSS 4
- Radix UI components
- And other dependencies

**Installation Time**: Typically takes 2-5 minutes depending on your internet connection.

### Step 3: Verify Installation

```bash
# Check if all dependencies are installed correctly
npm list --depth=0
```

You should see a list of installed packages without errors.

## 🚀 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

**What happens:**
- Vite starts a local development server
- The application will be available at `http://localhost:5173`
- Changes to your code will automatically reload the browser
- TypeScript compilation errors will show in the console

**Output Example:**
```
  VITE v6.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Accessing the Application

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. The Multi-Agent Tester interface will load

**First Time Setup in Browser:**
1. Click the **"Token"** button in the sidebar to configure authentication
2. Click the **"Agents"** button to configure agent endpoints
3. Generate a token and start testing

### Development Commands

```bash
# Start dev server (default)
npm run dev

# Kill process on port 5000 (if needed for other purposes)
# Note: Dev server runs on 5173, this is for port 5000 specifically
npm run kill

# Run linter to check code style
npm run lint

# Run linter and auto-fix issues
npm run lint:fix

# Optimize dependencies
npm run optimize
```

### Stopping the Development Server

- Press `Ctrl+C` in the terminal where the server is running
- Or close the terminal window

## 🏗️ Building for Production

### Build the Application

Create an optimized production build:

```bash
npm run build
```

**What happens:**
- TypeScript code is compiled (with `--noCheck` flag for faster builds)
- Vite bundles the application
- Assets are optimized and minified
- Output is generated in the `dist/` directory

**Build Output:**
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── react-vendor-[hash].js
│   ├── ui-vendor-[hash].js
│   ├── icons-[hash].js
│   └── index-[hash].css   # Compiled styles
└── ...
```

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

This starts a local server serving the built files from `dist/`.

**Output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

### Build Size Information

The application is optimized with code-splitting:
- **react-vendor**: React and ReactDOM
- **ui-vendor**: Radix UI components
- **icons**: Phosphor Icons and Lucide React
- Main application code in separate chunks

**Typical bundle sizes:**
- Total: ~600-800KB (gzipped)
- Initial load: ~200-300KB

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

**Test Configuration:**
- Framework: Vitest
- Environment: jsdom (simulates browser)
- Setup file: `src/test/setup.ts`

**Note**: Test coverage is currently minimal. The project is focused on manual testing during this phase.

## ⚙️ Configuration

### Environment Variables

The application uses client-side storage and doesn't require environment variables. However, you can configure:

**Vite Configuration** (`vite.config.ts`):
- Port settings (default: 5173)
- Build optimizations
- Plugin configurations

**Runtime Configuration** (`runtime.config.json`):
```json
{
  "app": "ce566e5b10b05fdaf467"
}
```

### Application Settings

All application settings are stored in the browser:
- Token configurations (encrypted)
- Agent endpoints
- Theme preferences
- Conversation history
- User preferences

**Storage Location**: Browser's Spark KV storage (client-side only)

### Customizing the Development Server

Edit `vite.config.ts` to customize:

```typescript
export default defineConfig({
  server: {
    port: 3000,        // Change port
    open: true,        // Auto-open browser
    host: true,        // Expose to network
  },
  // ... other options
})
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Issue: Port Already in Use

**Error:**
```
Port 5173 is already in use
```

**Solutions:**
1. Kill the process using the port:
   ```bash
   # Find the process (Linux/Mac)
   lsof -i :5173
   kill -9 <PID>
   
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. Or change the port in `vite.config.ts`

#### Issue: npm install Fails

**Error:**
```
npm ERR! code ERESOLVE
```

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Use legacy peer dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

#### Issue: TypeScript Errors

**Error:**
```
TS2304: Cannot find name 'X'
```

**Solutions:**
1. Ensure TypeScript is installed:
   ```bash
   npm install -D typescript
   ```

2. Restart your IDE/editor

3. Check `tsconfig.json` configuration

#### Issue: Build Fails

**Error:**
```
vite build failed
```

**Solutions:**
1. Clear build cache:
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

2. Check for syntax errors in your code

3. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

#### Issue: White Screen After Build

**Possible Causes:**
- Browser console shows errors
- Missing base path in deployment

**Solutions:**
1. Check browser console for errors (F12)
2. Verify `dist/index.html` exists
3. Check if assets are loading correctly
4. For deployment, configure base path in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
   })
   ```

#### Issue: Slow Performance

**Solutions:**
1. Optimize dependencies:
   ```bash
   npm run optimize
   ```

2. Clear browser cache

3. Check browser extensions (disable ad blockers)

4. Use production build (`npm run build` + `npm run preview`)

### Getting Help

If you encounter issues not covered here:

1. **Check Existing Issues**: Visit the [GitHub Issues](https://github.com/chovancova/conversation-agent-t/issues) page
2. **Create New Issue**: If your problem is new, open an issue with:
   - Detailed description
   - Steps to reproduce
   - Error messages
   - System information (OS, Node version, npm version)
3. **Review Documentation**: Check other docs in the `docs/` folder

## 📚 Additional Resources

### Documentation

- **[README.md](README.md)** - Project overview and features
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide for users
- **[SECURITY.md](SECURITY.md)** - Security architecture and best practices
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture
- **[docs/TODO.md](docs/TODO.md)** - Roadmap and known issues
- **[docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md)** - Deployment guide

### Technology Documentation

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

### Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server (runs on port 5173)
npm run kill             # Kill process on port 5000 (legacy/other services)

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Optimization
npm run optimize         # Optimize dependencies
```

## 🔐 Security Notes

**Important:** This application stores all data client-side only:

- ✅ **No server-side storage** - All data stays in your browser
- ✅ **Client-side encryption** - AES-256-GCM encryption for sensitive data
- ✅ **Privacy first** - Zero data transmission to external servers

**Best Practices:**
- Use test credentials only (never production secrets)
- Clear data after testing sessions
- Lock your device when stepping away
- Review [SECURITY.md](SECURITY.md) for detailed security information

## ⚠️ License Note

**This repository is under a PROPRIETARY license.**

✅ **Allowed:**
- View and read the source code
- Run locally for review/evaluation purposes
- Study for educational purposes

❌ **Not Allowed:**
- Commercial use
- Distribution or deployment
- Modification or derivative works

See [LICENSE](LICENSE) for complete terms.

---

## 🎯 Quick Reference

### Minimal Setup (5 minutes)

```bash
# 1. Clone
git clone https://github.com/chovancova/conversation-agent-t.git
cd conversation-agent-t

# 2. Install
npm install

# 3. Run
npm run dev

# 4. Open browser to http://localhost:5173
```

### After Making Changes

```bash
# Check code style
npm run lint

# Build for production
npm run build

# Test production build
npm run preview
```

---

**Need help?** Open an issue on [GitHub](https://github.com/chovancova/conversation-agent-t/issues) or refer to the [documentation](docs/).

**Ready to deploy?** See [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md)

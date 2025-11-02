# Multi-Agent Tester

> A professional, secure testing environment for conversation agents with OAuth2 authentication and client-side encryption.

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## ⚠️ License Notice

**This repository is source-available for REVIEW PURPOSES ONLY.**

🔒 **Proprietary License** - All rights reserved. This code is publicly viewable for review, reference, and educational purposes. **No usage, copying, modification, or distribution rights are granted** without explicit written permission from the copyright holder. See [LICENSE](LICENSE) for complete terms.

---

## 🎯 Overview

Multi-Agent Tester is a developer-focused tool for testing and evaluating conversation agents across multiple business domains. Test different specialized agents (Account Opening, Payment, Moderator, Card, RAG) through an intuitive interface with enterprise-grade security.

## ✨ Key Features

### Core Capabilities
- 🤖 **Multi-Agent Testing** - Test multiple specialized agents in parallel conversations
- 🔐 **OAuth2 Authentication** - Bearer token generation with automatic expiry tracking
- 🔄 **Auto-Refresh** - Configurable automatic token refresh (up to 9,999 refreshes)
- 💬 **Split View** - Compare agent responses side-by-side in real-time
- 📊 **Response Metrics** - Track response times and performance for each agent

### Security & Privacy
- 🔒 **Client-Side Encryption** - AES-256-GCM encryption for all sensitive data
- 🛡️ **Zero Server Storage** - All data stays in your browser, never sent to servers
- 🔑 **Encrypted Credentials** - PBKDF2 key derivation with 100,000 iterations
- 👤 **User-Scoped Data** - Complete data isolation and user control

### Developer Features
- ⚙️ **Protocol Support** - Custom HTTP, A2A (Agent-to-Agent), MCP (Model Context Protocol)
- 🎨 **Theme Customization** - 9 preset themes plus custom color palettes
- 📝 **Conversation Export** - Extract conversations for analysis and documentation
- 🔊 **Sound Alerts** - Configurable audio notifications for token expiration
- ⌨️ **Keyboard Shortcuts** - Efficient workflow with keyboard navigation

## 🔒 Security Architecture

### Client-Side Only Storage
**Zero server-side data storage** - All data remains in your browser:

✅ **Your data never leaves your browser**  
✅ **No server sees or stores your credentials**  
✅ **Direct browser-to-agent communication only**  
✅ **Complete data privacy and control**

### Encryption at Rest
All sensitive data is encrypted using industry-standard cryptography:
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with SHA-256 (100,000 iterations)
- **Storage**: Spark KV encrypted storage in browser
- **Scope**: User-isolated data with automatic decryption

### What's Protected
- Token configurations (client IDs, secrets, passwords)
- Access tokens and refresh credentials
- Agent endpoint configurations
- Complete conversation history
- User preferences and settings

### Security Best Practices
⚠️ **Important Guidelines:**
- **Use test credentials only** - Never store production secrets
- **Export files** contain plaintext - handle securely and delete after use
- **Clear data** after testing sessions via Security & Privacy dialog
- **Lock your device** when stepping away
- **Use browser profiles** to isolate different projects

📖 See [SECURITY.md](SECURITY.md) for comprehensive security documentation.

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Access to OAuth2 token endpoint
- Agent API endpoints with Bearer token authentication

### Installation

**Option 1: Use Hosted Version** (Recommended)
```bash
# Deploy to your preferred platform
# GitHub Pages, Netlify, Vercel, etc.
```

**Option 2: Local Development**
```bash
# Clone the repository
git clone https://github.com/chovancova/conversation-agent-t.git
cd conversation-agent-t

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### First-Time Setup

**Step 1: Configure Token Generation**
1. Click **"Token"** button in sidebar
2. Create new token configuration:
   - Name: Your configuration name
   - Token Endpoint: Your OAuth2 endpoint URL
   - Client ID, Secret, Username, Password
3. Enable **"Encrypt Before Saving"** (recommended)
4. Click **"Save Configuration"**

**Step 2: Configure Agent Endpoints**
1. Click **"Agents"** button in sidebar
2. Select agent type (Account Opening, Payment, etc.)
3. Enter agent HTTP POST endpoint URL
4. Configure protocol (Custom HTTP, A2A, MCP)
5. Save configuration

**Step 3: Start Testing**
1. Click **"Generate Token"** to authenticate
2. Click **"New Conversation"** and select agent type
3. Type your message and press Enter
4. View agent responses with timing metrics
5. Use **Split View** to compare multiple agents

## 🔧 Technical Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript 5.7** - Type-safe development
- **Vite 6** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first styling

### Components & UI
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Reusable component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon system

### Security & Storage
- **Web Crypto API** - AES-256-GCM encryption
- **Spark KV** - Encrypted client-side storage
- **PBKDF2** - Key derivation function

### Supported Agent Types
- 💼 **Account Opening** - Customer onboarding workflows
- 💰 **Payment** - Transaction processing and management
- 🛡️ **Moderator** - Content moderation and policy enforcement
- 💳 **Card** - Card services and operations
- 📚 **RAG** - Retrieval-augmented generation queries

## 📡 Protocol Support

### Custom HTTP
Standard Bearer token authentication:
```http
POST /agent/endpoint
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "user message"
}
```

### A2A (Agent-to-Agent)
```http
POST /a2a/endpoint
Authorization: Bearer {token}
A2A-Version: 1.0
A2A-Client-ID: {client-id}
Content-Type: application/json

{
  "intent": "query",
  "context": { "session": "abc123" },
  "message": "user message"
}
```

### MCP (Model Context Protocol)
JSON-RPC 2.0 format:
```http
POST /mcp/endpoint
Authorization: Bearer {token}
Content-Type: application/json-rpc

{
  "jsonrpc": "2.0",
  "method": "agent.query",
  "params": { "message": "user message" },
  "id": "req-123"
}
```

## 🎨 Customization

### Themes
Choose from **9 preset themes** or create your own:
- Dark (default) - Modern with cyan-green accents
- Light - Clean and minimal
- Corporate Gold - Professional with golden highlights
- Ocean, Forest, Sunset, Midnight, Lavender Dream, Rose Garden

### Typography
Customize reading experience:
- **12 font families** across Sans Serif, Serif, and Monospace
- **3 size presets**: Small (14px), Medium (16px), Large (18px)
- **3 line height options**: Compact (1.4), Normal (1.6), Relaxed (1.8)

### Advanced Features
- **Sound Alerts** - Audio notifications at 10m, 5m, 2m, 1m, 30s, 10s intervals
- **Auto-Refresh** - Configurable limits from 1 to 9,999 refreshes
- **Split View** - Test two agents simultaneously with independent tokens
- **Keyboard Shortcuts** - Efficient navigation and actions

## 📖 Documentation

Comprehensive documentation available in the [`docs/`](docs/) folder:

- **[SECURITY.md](SECURITY.md)** - Complete security architecture and best practices
- **[TODO.md](docs/TODO.md)** - Roadmap, planned features, and known issues
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture and future approach
- **[PRD.md](docs/PRD.md)** - Product requirements and design decisions
- **Testing Guides** - Comprehensive testing documentation for all features

## 🤝 Contributing

Contributions are welcome! Please see our contributing guidelines (coming soon).

### Development Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter (after ESLint config is added)
npm run lint
```

### Current Priorities
- Add ESLint configuration
- Implement comprehensive test suite
- Add CI/CD pipeline
- Improve mobile responsiveness

See [TODO.md](docs/TODO.md) for complete list.

## 🐛 Known Issues

- ESLint configuration needs migration to v9 format
- Large bundle size (774KB) - optimization needed
- No automated test coverage yet

## 📊 Project Status

- ✅ **Core Features**: Complete and production-ready
- ✅ **Security**: Enterprise-grade client-side encryption
- ✅ **Documentation**: Comprehensive and up-to-date
- 🚧 **Testing**: Manual testing only (automated tests planned)
- 🚧 **CI/CD**: Not yet implemented

## ⚠️ Important Notes

- **Testing Tool Only**: Not intended for production credential management
- **Test Credentials**: Always use dedicated test/development credentials
- **Browser Storage**: Data persists only in your browser, no cloud sync
- **Security Compliance**: Ensure compliance with your organization's policies

## 📄 License

**PROPRIETARY LICENSE - Source Available for Review Only**

This software is made publicly available for **review, reference, and educational purposes only**.

⚠️ **No usage rights are granted.** You may:
- ✅ View and read the source code
- ✅ Study the code for educational purposes
- ✅ Review the code for security assessment

❌ **You may NOT**:
- Use, copy, modify, or distribute this software
- Deploy or run this software in any environment
- Create derivative works or commercial products

**All rights reserved.** Any use beyond review requires explicit written permission from the copyright holder.

See the [LICENSE](LICENSE) file for complete terms and conditions.

---

Built with ❤️ using React, TypeScript, and modern web technologies.

## 🙏 Acknowledgments

- Built using the GitHub Spark Template
- UI components from Radix UI and shadcn/ui
- Icons from Lucide React and Phosphor Icons
